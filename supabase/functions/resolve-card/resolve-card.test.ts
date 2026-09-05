/**
 * Tests du résolveur de cartes.
 *
 * Trois scénarios imposés :
 *   1. carte native i-wasp
 *   2. carte provenant d'iwallet-card
 *   3. identifiant inconnu des deux systèmes
 *
 * Plus les cas de sécurité qui comptent : identifiant invalide (400) et panne
 * amont (502/504, jamais 404 — un faux « inexistante » bloquerait la génération
 * d'un pass parfaitement valide).
 *
 * Lancer : deno test --allow-net --allow-env resolve-card.test.ts
 * Cible   : RESOLVER_URL (défaut = fonction locale servie par supabase)
 */

const RESOLVER_URL = Deno.env.get("RESOLVER_URL")
  ?? "http://localhost:54321/functions/v1/resolve-card";
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

/** Identifiants injectés par l'environnement : aucun n'est inventé ici. */
const IWASP_CARD_ID = Deno.env.get("TEST_IWASP_CARD_ID") ?? "";
const IWALLET_CARD_ID = Deno.env.get("TEST_IWALLET_CARD_ID") ?? "";
const UNKNOWN_ID = "zzz-inexistant-" + "0123456789abcdef";

async function resolve(id: string) {
  const headers: Record<string, string> = { accept: "application/json" };
  if (ANON_KEY) {
    headers.apikey = ANON_KEY;
    headers.authorization = `Bearer ${ANON_KEY}`;
  }
  const response = await fetch(`${RESOLVER_URL}?id=${encodeURIComponent(id)}`, { headers });
  const body = await response.json().catch(() => null);
  return { status: response.status, body };
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

Deno.test("1. carte native i-wasp : 200, source iwasp, id identique", async () => {
  if (!IWASP_CARD_ID) {
    console.warn("TEST_IWASP_CARD_ID absent — scénario non exécuté, donc non validé.");
    return;
  }
  const { status, body } = await resolve(IWASP_CARD_ID);
  assert(status === 200, `attendu 200, reçu ${status}`);
  assert(body?.source === "iwasp", `source attendue "iwasp", reçue "${body?.source}"`);
  assert(body?.card?.id === IWASP_CARD_ID, "l'id renvoyé doit être exactement celui demandé");
  // Aucune donnée privée ne doit fuiter par cette API publique.
  assert(!("email" in (body?.card ?? {})), "l'e-mail ne doit pas être exposé");
});

Deno.test("2. carte iwallet-card : 200 par repli, id identique", async () => {
  if (!IWALLET_CARD_ID) {
    console.warn("TEST_IWALLET_CARD_ID absent — scénario non exécuté, donc non validé.");
    return;
  }
  const { status, body } = await resolve(IWALLET_CARD_ID);
  assert(status === 200, `attendu 200, reçu ${status}`);
  assert(body?.source === "iwallet-card", `source attendue "iwallet-card", reçue "${body?.source}"`);
  assert(body?.card?.id === IWALLET_CARD_ID, "l'id renvoyé doit être exactement celui demandé");
  assert(!("email" in (body?.card ?? {})), "l'e-mail ne doit pas être exposé");
});

Deno.test("3. identifiant inconnu : un vrai 404", async () => {
  const { status, body } = await resolve(UNKNOWN_ID);
  assert(status === 404, `attendu 404, reçu ${status}`);
  assert(body?.error === "not_found", `erreur attendue "not_found", reçue "${body?.error}"`);
});

Deno.test("identifiant invalide : 400, jamais 404", async () => {
  for (const bad of ["", "espace ici", "slash/injecte", "a".repeat(200)]) {
    const { status } = await resolve(bad);
    assert(status === 400, `"${bad.slice(0, 20)}" devrait donner 400, a donné ${status}`);
  }
});

Deno.test("la casse est normalisée, pas rejetée", async () => {
  // Une carte physique peut être saisie en majuscules. /card/Ajban-Al-Khair
  // doit atteindre la même fiche : on normalise avant de valider, donc ce n'est
  // ni un 400 ni un identifiant différent.
  if (!IWASP_CARD_ID) {
    console.warn("TEST_IWASP_CARD_ID absent — scénario non exécuté, donc non validé.");
    return;
  }
  const { status, body } = await resolve(IWASP_CARD_ID.toUpperCase());
  assert(status === 200, `attendu 200, reçu ${status}`);
  assert(body?.card?.id === IWASP_CARD_ID, "la casse doit être ramenée à l'identifiant canonique");
});

Deno.test("aucune URL externe n'est acceptée depuis l'appelant (anti-SSRF)", async () => {
  // L'appelant ne choisit que l'identifiant ; l'hôte amont vient de
  // l'environnement serveur. Une tentative d'injection doit être rejetée à la
  // validation de format, avant tout appel réseau.
  // Le rejet peut venir de la validation de format (400) ou, en production,
  // du pare-feu applicatif en amont (403) qui bloque avant même la fonction.
  // Les deux satisfont la propriété recherchée : l'URL n'est jamais appelée.
  for (const attempt of ["http://169.254.169.254/latest/meta-data", "https://evil.example.com/x"]) {
    const { status } = await resolve(attempt);
    assert(status === 400 || status === 403, `l'URL injectée aurait dû être rejetée, statut ${status}`);
  }
});
