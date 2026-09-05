/**
 * Pages Function : GET /api/resolve-card?id=<slug>
 *
 * Resout une carte derriere l'URL canonique https://i-wasp.com/card/[id].
 *
 * Pourquoi ici et pas dans le projet Supabase de production : la resolution
 * n'a jamais eu besoin d'y vivre, et la servir depuis la meme origine que le
 * site evite un aller-retour CORS sur le chemin critique. Le RPC
 * `get_public_card` est SECURITY DEFINER et executable par le role `anon` : la
 * cle publique — deja livree au navigateur de chaque visiteur — suffit a lire
 * exactement les champs publics, et rien de plus.
 *
 * C'est aussi plus sur que la version precedente : elle utilisait la cle
 * service_role, qui contourne les regles RLS. Ici on ne peut lire que ce que le
 * RPC autorise deja publiquement. Moins de privileges, resultat identique.
 *
 * La logique de decision est partagee avec l'edge function et ses tests
 * (`supabase/functions/resolve-card/core.ts`) : une seule source de verite.
 */

import {
  isValidCardId,
  normalizeCardId,
  recordMatchesCardId,
  resolveCard,
  type LookupResult,
} from "../../supabase/functions/resolve-card/core";

interface Env {
  IWASP_SUPABASE_URL?: string;
  IWASP_SUPABASE_ANON_KEY?: string;
  /** Magasin de repli. Absent = deploiement a une seule source, pas une panne. */
  IWALLET_CARD_BASE_URL?: string;
}

const UPSTREAM_TIMEOUT_MS = 6000;

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

function json(body: unknown, status: number, cacheSeconds = 0) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Cache-Control": cacheSeconds > 0
        ? `public, max-age=${cacheSeconds}, stale-while-revalidate=60`
        : "no-store",
    },
  });
}

function timedOut(error: unknown) {
  return error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError");
}

/** Enveloppe un appel reseau d'un delai court : un amont lent ne doit pas retenir la page. */
async function withTimeout<T>(run: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    return await run(controller.signal);
  } finally {
    clearTimeout(timer);
  }
}

async function lookupIwasp(env: Env, id: string): Promise<LookupResult> {
  const url = (env.IWASP_SUPABASE_URL ?? "").trim().replace(/\/$/, "");
  const key = (env.IWASP_SUPABASE_ANON_KEY ?? "").trim();
  if (!url || !key) {
    return { kind: "failure", status: 502, reason: "i-wasp resolver is not configured" };
  }

  try {
    const response = await withTimeout((signal) =>
      fetch(`${url}/rest/v1/rpc/get_public_card`, {
        method: "POST",
        signal,
        headers: {
          apikey: key,
          authorization: `Bearer ${key}`,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ p_slug: id }),
      })
    );

    if (!response.ok) return { kind: "failure", status: 502, reason: "i-wasp lookup failed" };

    const data = (await response.json().catch(() => null)) as unknown;
    const record = Array.isArray(data) ? data[0] : data;
    if (!record) return { kind: "not_found" };
    if (typeof record !== "object") {
      return { kind: "failure", status: 502, reason: "i-wasp returned an invalid card" };
    }
    // L'enregistrement doit prouver qu'il porte bien l'identifiant demande,
    // sinon on afficherait la fiche d'un autre client sous cette URL.
    if (!recordMatchesCardId(id, record as Record<string, unknown>)) {
      return { kind: "failure", status: 502, reason: "i-wasp returned a mismatched card id" };
    }
    return { kind: "found", record: record as Record<string, unknown> };
  } catch (error) {
    return timedOut(error)
      ? { kind: "failure", status: 504, reason: "i-wasp lookup timed out" }
      : { kind: "failure", status: 502, reason: "i-wasp lookup failed" };
  }
}

async function lookupIwallet(env: Env, id: string): Promise<LookupResult> {
  const base = (env.IWALLET_CARD_BASE_URL ?? "").trim().replace(/\/$/, "");
  if (!base) return { kind: "not_configured" };

  try {
    const response = await withTimeout((signal) =>
      fetch(`${base}/api/card-requests/${encodeURIComponent(id)}`, {
        method: "GET",
        signal,
        headers: { accept: "application/json" },
      })
    );

    if (response.status === 404) return { kind: "not_found" };
    if (!response.ok) {
      return { kind: "failure", status: 502, reason: `iwallet-card returned HTTP ${response.status}` };
    }
    const payload = (await response.json().catch(() => null)) as { card?: unknown } | null;
    if (!payload?.card || typeof payload.card !== "object") {
      return { kind: "failure", status: 502, reason: "iwallet-card returned an invalid card" };
    }
    const record = payload.card as Record<string, unknown>;
    if (!recordMatchesCardId(id, record)) {
      return { kind: "failure", status: 502, reason: "iwallet-card returned a mismatched card id" };
    }
    return { kind: "found", record };
  } catch (error) {
    return timedOut(error)
      ? { kind: "failure", status: 504, reason: "iwallet-card lookup timed out" }
      : { kind: "failure", status: 502, reason: "iwallet-card lookup failed" };
  }
}

/**
 * Point d'entree unique.
 *
 * Pages accepte des exports par methode (onRequestGet, onRequestPost...), mais
 * en combiner un avec un `onRequest` generique rend la priorite ambigue. Un
 * seul point d'entree qui aiguille lui-meme ne laisse aucun doute.
 */
export async function onRequest(context: { request: Request; env: Env }) {
  const { method } = context.request;
  if (method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (method !== "GET") return json({ error: "method_not_allowed" }, 405);

  // Seul l'identifiant vient de l'appelant ; l'hote amont vient de
  // l'environnement du serveur. Aucune URL fournie par le client n'est appelee.
  const id = normalizeCardId(new URL(context.request.url).searchParams.get("id"));
  if (!isValidCardId(id)) {
    return json({ error: "invalid_id", message: "Identifiant de carte invalide." }, 400);
  }

  const result = await resolveCard(id, {
    iwasp: () => lookupIwasp(context.env, id),
    iwallet: () => lookupIwallet(context.env, id),
  });

  if (result.kind === "found") return json({ source: result.source, card: result.card }, 200, 60);
  if (result.kind === "not_found") return json({ error: "not_found", message: "Carte introuvable." }, 404);
  // Une panne amont ne devient jamais un 404 : un faux « inexistante »
  // bloquerait la generation d'un pass parfaitement valide.
  return json(
    {
      error: result.status === 504 ? "upstream_timeout" : "upstream_error",
      message: "Service de cartes temporairement indisponible.",
    },
    result.status
  );
}
