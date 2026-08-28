/**
 * Edge Function: resolve-card
 *
 * Source de vérité unique pour « une carte existe-t-elle ? ».
 *
 * i-wasp.com est une application monopage : le serveur renvoie 200 pour
 * n'importe quelle URL /card/*. Impossible donc de distinguer une carte réelle
 * d'un identifiant inventé en interrogeant le HTML. Cette fonction comble ce
 * manque : elle répond un vrai 404 quand personne ne connaît l'identifiant.
 *
 * Ordre de résolution :
 *   1. base i-wasp (RPC get_public_card)
 *   2. si absente, iwallet-card via son API publique
 *   3. sinon 404
 *
 * Une panne d'iwallet-card ne doit JAMAIS devenir un 404 : un faux « carte
 * inexistante » ferait croire à un lien mort et bloquerait la génération d'un
 * pass parfaitement valide. On répond 502/504 pour dire « je ne sais pas ».
 *
 * GET /functions/v1/resolve-card?id=<id>
 *   200 { source, card }   400 identifiant invalide
 *   404 inconnu partout    502/504 amont indisponible
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/** Slug ou UUID en minuscules. Bornes strictes : cet identifiant construit une URL amont. */
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ID_MAX_LENGTH = 80;

/** Délai court : cette fonction est appelée avant la signature d'un pass. */
const UPSTREAM_TIMEOUT_MS = 6000;

/**
 * Base d'iwallet-card, définie côté serveur uniquement.
 * Aucune URL fournie par l'appelant n'est jamais contactée — la protection
 * contre le SSRF tient à ça : l'appelant ne choisit que l'identifiant, dont la
 * forme est validée, jamais l'hôte.
 */
const IWALLET_CARD_BASE_URL = (Deno.env.get("IWALLET_CARD_BASE_URL") ?? "").replace(/\/$/, "");

/** Champs publics exposés. Rien de plus : cette API est ouverte, sans authentification. */
interface PublicCard {
  id: string;
  name: string;
  role: string;
  company: string;
  phone: string;
  website: string;
  instagram: string;
  city: string;
}

function toPublicCard(id: string, raw: Record<string, unknown>): PublicCard {
  const text = (value: unknown) => String(value ?? "").trim().slice(0, 200);
  return {
    id,
    name: text(raw.name ?? raw.full_name ?? raw.display_name),
    role: text(raw.role ?? raw.title ?? raw.job_title),
    company: text(raw.company ?? raw.company_name),
    phone: text(raw.phone),
    website: text(raw.website),
    instagram: text(raw.instagram),
    city: text(raw.city ?? raw.location),
    // Volontairement absents : e-mail, adresse postale, identifiants internes,
    // statut de commande, données de paiement. Cette API est publique.
  };
}

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

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "GET") return json({ error: "method_not_allowed" }, 405);

  const rawId = new URL(req.url).searchParams.get("id") ?? "";
  const id = rawId.trim().toLowerCase();

  if (!id || id.length > ID_MAX_LENGTH || !ID_PATTERN.test(id)) {
    // On ne réémet pas l'identifiant reçu : il vient de l'extérieur.
    return json({ error: "invalid_id", message: "Identifiant de carte invalide." }, 400);
  }

  // --- 1. Base i-wasp -------------------------------------------------------
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
    const { data, error } = await supabase.rpc("get_public_card", { p_slug: id });
    if (!error && data) {
      const record = Array.isArray(data) ? data[0] : data;
      if (record && typeof record === "object") {
        console.log(JSON.stringify({ event: "resolve-card", source: "iwasp", found: true }));
        return json({ source: "iwasp", card: toPublicCard(id, record as Record<string, unknown>) }, 200, 60);
      }
    }
  } catch (_error) {
    // Une base i-wasp indisponible ne doit pas empêcher le repli.
    console.log(JSON.stringify({ event: "resolve-card", source: "iwasp", error: "lookup_failed" }));
  }

  // --- 2. Repli iwallet-card ------------------------------------------------
  if (!IWALLET_CARD_BASE_URL) {
    console.log(JSON.stringify({ event: "resolve-card", source: "iwallet", error: "not_configured" }));
    return json({ error: "not_found", message: "Carte introuvable." }, 404);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const upstream = await fetch(
      `${IWALLET_CARD_BASE_URL}/api/card-requests/${encodeURIComponent(id)}`,
      { method: "GET", signal: controller.signal, headers: { accept: "application/json" } },
    );

    if (upstream.status === 404) {
      console.log(JSON.stringify({ event: "resolve-card", source: "iwallet", found: false }));
      return json({ error: "not_found", message: "Carte introuvable." }, 404);
    }
    if (!upstream.ok) {
      // Amont en panne : surtout pas un 404, sinon on déclare morte une carte vivante.
      console.log(JSON.stringify({ event: "resolve-card", source: "iwallet", upstream: upstream.status }));
      return json({ error: "upstream_error", message: "Service de cartes temporairement indisponible." }, 502);
    }

    const payload = await upstream.json();
    const record = payload?.card;
    if (!record || typeof record !== "object") {
      return json({ error: "upstream_error", message: "Réponse amont invalide." }, 502);
    }

    console.log(JSON.stringify({ event: "resolve-card", source: "iwallet", found: true }));
    return json({ source: "iwallet-card", card: toPublicCard(id, record) }, 200, 60);
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    console.log(JSON.stringify({ event: "resolve-card", source: "iwallet", error: timedOut ? "timeout" : "unreachable" }));
    return json(
      { error: timedOut ? "upstream_timeout" : "upstream_error", message: "Service de cartes temporairement indisponible." },
      timedOut ? 504 : 502,
    );
  } finally {
    clearTimeout(timer);
  }
});
