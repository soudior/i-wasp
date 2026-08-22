/**
 * Edge Function: delete-account
 *
 * Suppression définitive du compte utilisateur, avec exécution côté serveur et
 * arrêt immédiat dès qu'une étape critique échoue.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

import { deleteAccountForUser } from "../_shared/deleteAccountFlow.ts";

async function buildAppleClientSecret(opts: {
  clientId: string;
  teamId: string;
  keyId: string;
  privateKeyPem: string;
}): Promise<string> {
  const encode = (value: unknown) => btoa(JSON.stringify(value))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  const now = Math.floor(Date.now() / 1000);
  const signingInput = `${encode({ alg: "ES256", kid: opts.keyId })}.${encode({
    iss: opts.teamId,
    iat: now,
    exp: now + 300,
    aud: "https://appleid.apple.com",
    sub: opts.clientId,
  })}`;
  const pem = opts.privateKeyPem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    Uint8Array.from(atob(pem), (character) => character.charCodeAt(0)),
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );
  const signature = new Uint8Array(await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    privateKey,
    new TextEncoder().encode(signingInput),
  ));
  const encodedSignature = btoa(String.fromCharCode(...signature))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `${signingInput}.${encodedSignature}`;
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
      status: 405,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        Allow: "POST, OPTIONS",
      },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const bearer = authHeader.match(/^Bearer ([^\s]+)$/i);
    if (!bearer) {
      return new Response(JSON.stringify({ error: "Non authentifié" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      throw new Error("Configuration Supabase manquante");
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: userData, error: userErr } = await admin.auth.getUser(bearer[1]);
    if (userErr || !userData?.user) {
      log("ERREUR: JWT invalide", { message: userErr?.message });
      return new Response(JSON.stringify({ error: "Session invalide" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;

    // External identity cleanup runs before any local mutation so a failure
    // cannot leave an active Auth account whose application data was erased.
    await (async () => {
      const { data: tokenRows, error: tokenError } = await admin
        .from("apple_auth_tokens")
        .select("refresh_token")
        .eq("user_id", userId);
      if (tokenError) {
        if (["42P01", "PGRST205"].includes(tokenError.code)) {
          log("SKIP: révocation Apple (table apple_auth_tokens absente)");
          return;
        }
        throw new Error("Lecture des jetons Apple impossible");
      }

      const refreshTokens = (tokenRows ?? [])
        .map((row: { refresh_token: string | null }) => row.refresh_token)
        .filter((token): token is string => Boolean(token));
      if (refreshTokens.length === 0) {
        log("SKIP: révocation Apple (aucun jeton)");
        return;
      }

      const clientId = Deno.env.get("APPLE_REVOKE_CLIENT_ID");
      const teamId = Deno.env.get("APPLE_TEAM_ID");
      const keyId = Deno.env.get("APPLE_KEY_ID");
      const privateKeyPem = Deno.env.get("APPLE_PRIVATE_KEY");
      if (!clientId || !teamId || !keyId || !privateKeyPem) {
        throw new Error("Configuration de révocation Apple manquante");
      }

      const clientSecret = await buildAppleClientSecret({
        clientId,
        teamId,
        keyId,
        privateKeyPem,
      });
      for (const refreshToken of refreshTokens) {
        const response = await fetch("https://appleid.apple.com/auth/revoke", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            token: refreshToken,
            token_type_hint: "refresh_token",
          }),
        });
        if (!response.ok) {
          throw new Error(`Révocation Apple impossible (HTTP ${response.status})`);
        }
      }

      const { error: tokenDeleteError } = await admin
        .from("apple_auth_tokens")
        .delete()
        .eq("user_id", userId);
      if (tokenDeleteError) {
        throw new Error("Suppression des jetons Apple impossible");
      }
      log("OK: jetons Apple révoqués", { count: refreshTokens.length });
    })();

    await deleteAccountForUser({
      admin,
      userId,
      userEmail: userData.user.email,
      logger: log,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log("ERREUR", { message });
    return new Response(JSON.stringify({ error: "La suppression du compte a échoué" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
