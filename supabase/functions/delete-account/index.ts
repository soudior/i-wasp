/**
 * Edge Function: delete-account
 *
 * Suppression DÉFINITIVE du compte utilisateur (exigence App Store, Guideline 5.1.1(v)).
 * - Vérifie le JWT de l'appelant (l'utilisateur ne peut supprimer que SON compte).
 * - Supprime les données personnelles côté serveur (cartes, leads, scans, stories,
 *   profil, abonnement, push, etc.).
 * - ANONYMISE les commandes (conservées pour obligations comptables) au lieu de les
 *   supprimer, en détachant l'utilisateur et en effaçant les données personnelles.
 * - Supprime les fichiers de l'utilisateur dans le stockage (best-effort).
 * - Supprime le compte Auth (auth.users) via l'API admin → révoque toutes les sessions.
 *
 * NB: nécessite SUPABASE_SERVICE_ROLE_KEY (jamais côté frontend).
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

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

    // Helper : tente une opération, journalise l'échec sans interrompre la suppression.
    const attempt = async (label: string, fn: () => Promise<unknown>) => {
      try {
        await fn();
        log(`OK: ${label}`);
      } catch (e) {
        log(`SKIP: ${label}`, { message: e instanceof Error ? e.message : String(e) });
      }
    };

    // 2) Récupérer les cartes de l'utilisateur (pour supprimer les dépendances par card_id)
    //    puis les stories de ces cartes (story_analytics est indexé par story_id).
    let cardIds: string[] = [];
    let storyIds: string[] = [];
    try {
      const { data: cards } = await admin.from("digital_cards").select("id").eq("user_id", userId);
      cardIds = (cards ?? []).map((c: { id: string }) => c.id);
      if (cardIds.length > 0) {
        const { data: stories } = await admin.from("card_stories").select("id").in("card_id", cardIds);
        storyIds = (stories ?? []).map((s: { id: string }) => s.id);
      }
    } catch (e) {
      log("SKIP: lecture des cartes/stories", { message: e instanceof Error ? e.message : String(e) });
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
    //    NULL, et on efface toutes les données personnelles réellement présentes.
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
      }).eq("user_id", userId),
    );

    // 6) Supprimer les fichiers de l'utilisateur (best-effort) dans les buckets publics
    for (const bucket of ["card-assets", "stories"]) {
      await attempt(`storage:${bucket}`, async () => {
        const { data: files } = await admin.storage.from(bucket).list(userId, { limit: 1000 });
        if (files && files.length > 0) {
          const paths = files.map((f: { name: string }) => `${userId}/${f.name}`);
          await admin.storage.from(bucket).remove(paths);
        }
      });
    }

    // 7) Supprimer le compte Auth → révoque toutes les sessions. ÉTAPE CRITIQUE.
    const { error: delErr } = await admin.auth.admin.deleteUser(userId);
    if (delErr) {
      log("ERREUR: suppression du compte Auth", { message: delErr.message });
      return new Response(
        JSON.stringify({ error: "La suppression du compte a échoué. Contactez le support." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    log("Compte supprimé avec succès", { userId });
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log("ERREUR", { message });
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
