/**
 * Passerelle IA i-wasp — fournisseur configurable, aucun fournisseur écrit en dur.
 *
 * Toutes les fonctions IA du projet (génération de site, de template, de
 * palette, d'image, suggestions, réécriture de texte, chat Web Studio) passent
 * par ici. L'URL et la clé viennent des secrets Supabase, jamais du code :
 * i-wasp peut donc changer de fournisseur sans toucher aux 9 fonctions.
 *
 * Secrets attendus (Supabase → Project Settings → Edge Functions → Secrets) :
 *   AI_GATEWAY_URL      URL complète du endpoint compatible OpenAI
 *                       (ex. https://<fournisseur>/v1/chat/completions)
 *   AI_GATEWAY_API_KEY  Clé d'API du fournisseur (jamais dans le dépôt)
 *
 * Aucune valeur par défaut n'est écrite dans le code : tant que ces deux
 * secrets ne sont pas configurés, les fonctions IA répondent une erreur
 * explicite plutôt que d'appeler silencieusement un tiers.
 */

export const AI_GATEWAY_URL = Deno.env.get("AI_GATEWAY_URL") ?? "";

export const AI_GATEWAY_API_KEY = Deno.env.get("AI_GATEWAY_API_KEY") ?? "";

/** Message d'erreur unique, pour ne pas décrire la configuration à 9 endroits. */
export const AI_GATEWAY_NOT_CONFIGURED =
  "Passerelle IA non configurée : renseignez AI_GATEWAY_URL et AI_GATEWAY_API_KEY dans les secrets Supabase.";

export function isAiGatewayConfigured(): boolean {
  return AI_GATEWAY_URL !== "" && AI_GATEWAY_API_KEY !== "";
}

/**
 * Appelle le endpoint `chat/completions` du fournisseur configuré.
 * Renvoie la `Response` brute : chaque fonction garde sa propre gestion des
 * statuts (429 quota, 402 crédit épuisé, etc.).
 */
export function aiChatCompletion(body: unknown): Promise<Response> {
  if (!isAiGatewayConfigured()) {
    throw new Error(AI_GATEWAY_NOT_CONFIGURED);
  }

  return fetch(AI_GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AI_GATEWAY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
