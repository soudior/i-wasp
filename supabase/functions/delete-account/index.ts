/**
 * Edge Function: delete-account
 *
 * Suppression DÉFINITIVE du compte utilisateur (exigence App Store, Guideline 5.1.1(v)).
 * - Vérifie le JWT de l'appelant (l'utilisateur ne peut supprimer que SON compte).
 * - Supprime les données personnelles côté serveur (cartes, leads, scans, stories,
 *   profil, abonnement, push, etc.).
 * - ANONYMISE les commandes (conservées pour obligations comptables) au lieu de les
 *   supprimer, en détachant l'utilisateur et en effaçant TOUTE donnée directement
 *   identifiante (y compris order_items, notes internes et URLs de fichiers).
 * - Révoque les jetons Sign in with Apple pour les comptes Apple (exigé par Apple lorsqu'une
 *   app propose à la fois la création de compte ET Sign in with Apple).
 * - Supprime les fichiers de l'utilisateur dans le stockage, avec contrôle des erreurs.
 * - Supprime le compte Auth (auth.users) via l'API admin → supprime toutes les
 *   identités (email, google, apple) et révoque toutes les sessions : reconnexion
 *   impossible, un nouvel accès crée un compte neuf et vide.
 *
 * NB: nécessite SUPABASE_SERVICE_ROLE_KEY (jamais côté frontend).
 *
 * ⚠️ NE PAS DÉPLOYER AVANT REVUE COMPLÈTE. Déploiement uniquement après validation :
 *    `supabase functions deploy delete-account` (voir APP_STORE_LISTING.md §2 & §8).
 *    Tester d'abord sur un compte jetable et vérifier l'impossibilité de reconnexion.
 */

import { checkedDeletionStep } from "./checkedStep.ts";

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

/**
 * Construit le "client secret" Apple (JWT signé ES256 avec la clé .p8) nécessaire
 * pour appeler l'endpoint de révocation. Toutes les valeurs proviennent de secrets
 * d'environnement — aucune valeur en dur.
 */
async function buildAppleClientSecret(opts: {
  clientId: string; teamId: string; keyId: string; privateKeyPem: string;
}): Promise<string> {
  const enc = (obj: unknown) =>
    btoa(JSON.stringify(obj)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const nowSec = Math.floor(Number(new Date()) / 1000);
  const header = { alg: "ES256", kid: opts.keyId };
  const payload = {
    iss: opts.teamId,
    iat: nowSec,
    exp: nowSec + 300, // 5 min, largement suffisant pour l'appel de révocation
    aud: "https://appleid.apple.com",
    sub: opts.clientId,
  };
  const signingInput = `${enc(header)}.${enc(payload)}`;

  // Importer la clé privée PKCS8 (.p8) → CryptoKey ECDSA P-256.
  const pem = opts.privateKeyPem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    "pkcs8", der, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"],
  );
  const sig = new Uint8Array(
    await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, new TextEncoder().encode(signingInput)),
  );
  const sigB64 = btoa(String.fromCharCode(...sig))
    .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  return `${signingInput}.${sigB64}`;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const log = (step: string, details?: unknown) => {
  console.log(`[DELETE-ACCOUNT] ${step}${details ? ` - ${JSON.stringify(details)}` : ""}`);
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Méthode non autorisée" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json", Allow: "POST, OPTIONS" },
    });
  }

  const completedSteps: string[] = [];
  let currentStep = "configuration";
  const requestId = crypto.randomUUID();
  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SERVICE_ROLE) throw new Error("Configuration Supabase manquante");

    // 1) Identifier l'appelant à partir de son JWT (aucune suppression d'autrui possible)
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) {
      return new Response(JSON.stringify({ error: "Non authentifié" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) {
      log("ERREUR: JWT invalide", { message: userErr?.message });
      return new Response(JSON.stringify({ error: "Session invalide" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;
    log("Suppression demandée", { userId });

    // Every cleanup must succeed before Auth deletion. Earlier changes cannot
    // be rolled back across Storage/Auth/Apple; keep Auth available for retry.
    const attempt = async (label: string, fn: () => PromiseLike<unknown>) => {
      currentStep = label;
      const result = await checkedDeletionStep(label, fn);
      completedSteps.push(label);
      log(`OK: ${label}`, { requestId });
      return result;
    };

    const cardsResult = await attempt("lecture cartes", () =>
      admin.from("digital_cards").select("id").eq("user_id", userId));
    const cardIds = ((cardsResult as { data: { id: string }[] | null }).data ?? []).map(c => c.id);
    let storyIds: string[] = [];
    if (cardIds.length > 0) {
      const storiesResult = await attempt("lecture stories", () =>
        admin.from("card_stories").select("id").in("card_id", cardIds));
      storyIds = ((storiesResult as { data: { id: string }[] | null }).data ?? []).map(s => s.id);
    }

    // Revoke Apple BEFORE destructive cleanup. Missing configuration for an
    // Apple identity is a reportable failure, not a successful deletion.
    if (userData.user.identities?.some(identity => identity.provider === "apple")) {
      await attempt("apple: révocation des jetons", async () => {
        const clientId = Deno.env.get("APPLE_REVOKE_CLIENT_ID");
        const teamId = Deno.env.get("APPLE_TEAM_ID");
        const keyId = Deno.env.get("APPLE_KEY_ID");
        const privateKeyPem = Deno.env.get("APPLE_PRIVATE_KEY");
        if (!clientId || !teamId || !keyId || !privateKeyPem)
          throw new Error("Configuration de révocation Apple manquante");
        const { data, error } = await admin.from("apple_auth_tokens")
          .select("refresh_token").eq("user_id", userId);
        if (error) throw error;
        const tokens = (data ?? []).map((r: { refresh_token: string | null }) => r.refresh_token)
          .filter((token): token is string => !!token);
        if (tokens.length === 0) throw new Error("Jeton Apple de révocation manquant");
        const clientSecret = await buildAppleClientSecret({ clientId, teamId, keyId, privateKeyPem });
        for (const token of tokens) {
          const response = await fetch("https://appleid.apple.com/auth/revoke", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret,
              token, token_type_hint: "refresh_token" }),
          });
          if (!response.ok) throw new Error(`Apple revoke HTTP ${response.status}`);
        }
      });
      // Retain token records until other cleanup succeeds, so a retry can revoke
      // the same tokens again rather than lose its only revocation evidence.
    }

    // 3) Supprimer les données dépendantes des cartes (colonnes réelles vérifiées sur le schéma)
    if (storyIds.length > 0) {
      await attempt("story_analytics (par story)", () => admin.from("story_analytics").delete().in("story_id", storyIds));
    }
    if (cardIds.length > 0) {
      await attempt("leads (par carte)", () => admin.from("leads").delete().in("card_id", cardIds));
      await attempt("card_scans (par carte)", () => admin.from("card_scans").delete().in("card_id", cardIds));
      await attempt("push_subscriptions (par carte)", () => admin.from("push_subscriptions").delete().in("card_id", cardIds));
      await attempt("card_stories (par carte)", () => admin.from("card_stories").delete().in("card_id", cardIds));
    }

    // 4) Supprimer les données directement rattachées à l'utilisateur (par user_id)
    await attempt("template_assignments", () => admin.from("template_assignments").delete().eq("user_id", userId));
    await attempt("digital_cards", () => admin.from("digital_cards").delete().eq("user_id", userId));
    await attempt("profiles", () => admin.from("profiles").delete().eq("user_id", userId));
    await attempt("subscriptions", () => admin.from("subscriptions").delete().eq("user_id", userId));
    await attempt("webhook_configs", () => admin.from("webhook_configs").delete().eq("user_id", userId));
    await attempt("rental_properties", () => admin.from("rental_properties").delete().eq("user_id", userId));

    // 5) ANONYMISER les commandes (conservation légale/comptable). La colonne
    //    orders.user_id est NOT NULL et sans clé étrangère vers auth.users : on la
    //    remplace par un UUID sentinelle (compte supprimé) au lieu de la mettre à
    //    NULL. On efface TOUTES les données permettant d'identifier directement la
    //    personne. Ne subsistent que des colonnes comptables non identifiantes
    //    (numéro de commande, quantités, montants, dates, statut, type/template).
    //
    //    ⚠️ order_items (JSON) peut contenir le nom/titre imprimé sur la carte, les
    //    URLs de fichiers peuvent encoder un nom, admin_notes peut citer le client :
    //    tout est donc effacé.
    //    Contrat miroir (testé) : src/lib/accountDeletion.ts → anonymizedOrderPatch().
    const DELETED_SENTINEL = "00000000-0000-0000-0000-000000000000";
    await attempt("orders (anonymisation)", () =>
      admin.from("orders").update({
        user_id: DELETED_SENTINEL,
        customer_email: "deleted@anonymized.local",
        shipping_name: "Utilisateur supprimé",
        shipping_phone: null,
        shipping_address: null,
        shipping_city: null,
        shipping_postal_code: null,
        shipping_country: null,
        tracking_number: null,
        // Données de personnalisation potentiellement identifiantes → effacées.
        order_items: [],
        admin_notes: null,
        logo_url: null,
        background_image_url: null,
        print_file_url: null,
      }).eq("user_id", userId),
    );

    // Storage listings are paginated and recursive. Do not silently leave
    // nested folders or files beyond the first 1,000 entries.
    for (const bucket of ["card-assets", "stories"]) {
      await attempt(`storage:${bucket}`, async () => {
        const collect = async (prefix: string): Promise<string[]> => {
          const paths: string[] = [];
          for (let offset = 0; ; offset += 1000) {
            const { data: files, error } = await admin.storage.from(bucket)
              .list(prefix, { limit: 1000, offset, sortBy: { column: "name", order: "asc" } });
            if (error) throw error;
            for (const file of files ?? []) {
              const path = `${prefix}/${file.name}`;
              if (file.id === null) paths.push(...await collect(path));
              else paths.push(path);
            }
            if (!files || files.length < 1000) break;
          }
          return paths;
        };
        const paths = await collect(userId);
        for (let i = 0; i < paths.length; i += 1000) {
          const { error } = await admin.storage.from(bucket).remove(paths.slice(i, i + 1000));
          if (error) throw error;
        }
      });
    }
    if (userData.user.identities?.some(identity => identity.provider === "apple")) {
      await attempt("apple: suppression des jetons révoqués", () =>
        admin.from("apple_auth_tokens").delete().eq("user_id", userId));
    }

    // 7) Supprimer le compte Auth → supprime les identités (email/google/apple) et
    //    révoque toutes les sessions → reconnexion impossible. ÉTAPE CRITIQUE.
    await attempt("suppression du compte Auth", () => admin.auth.admin.deleteUser(userId));

    log("Compte supprimé avec succès", { userId });
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log("ERREUR", { message, requestId, currentStep, completedSteps });
    return new Response(JSON.stringify({ error: "La suppression est incomplète. Réessayez ou contactez le support avec cette référence.", requestId, failedStep: currentStep, completedSteps, partial: completedSteps.some(step => !step.startsWith("lecture")) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
