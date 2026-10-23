import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const dist = path.resolve("dist");
const indexPath = path.join(dist, "index.html");
if (!fs.existsSync(indexPath)) throw new Error("dist/index.html introuvable : exécuter après vite build.");
const baseHtml = fs.readFileSync(indexPath, "utf8");
const baseUrl = "https://www.i-wasp.com";

// Les descriptions reprennent les offres et messages déjà présents dans le dépôt.
const routes = [
  { path: "/", title: "Carte de visite NFC personnalisée & digitale | i-wasp", description: "Découvrez les cartes de visite NFC personnalisées i-wasp : profil digital, QR code et Apple Wallet. Partagez vos coordonnées en un geste, sur iPhone et Android.", h1: "Carte de visite NFC personnalisée et digitale", summary: "Cartes de visite NFC, profil digital, QR code et Apple Wallet pour partager des coordonnées professionnelles." },
  { path: "/produits", title: "Cartes de visite NFC premium | i-wasp", description: "Découvrez la collection de cartes de visite NFC premium i-wasp : profil digital, QR code et partage des coordonnées en un geste.", h1: "Cartes de visite NFC", summary: "Découvrez les cartes NFC et les options de profil digital proposées par i-wasp." },
  { path: "/pricing", title: "Tarifs des cartes de visite NFC | i-wasp", description: "Consultez les tarifs i-wasp pour les cartes de visite NFC premium et les solutions professionnelles. Vérifiez l'offre et la devise correspondant à votre marché.", h1: "Tarifs i-wasp", summary: "Consultez les tarifs des cartes NFC et des solutions professionnelles i-wasp." },
  { path: "/features", title: "Fonctionnalités des cartes NFC | i-wasp", description: "Découvrez les fonctionnalités i-wasp : carte NFC, profil digital, QR code et partage des coordonnées professionnelles sur smartphone.", h1: "Fonctionnalités i-wasp", summary: "Carte NFC, profil digital et QR code réunis dans un parcours de partage professionnel." },
  { path: "/web-studio", title: "Web Studio — Créateur de site par IA | i-wasp", description: "Créez un site web professionnel avec Web Studio i-wasp : design, hébergement et domaine selon l'offre présentée sur le site.", h1: "Web Studio i-wasp", summary: "Découvrez l'offre Web Studio et ses possibilités de création de site professionnel." },
  { path: "/enterprise", title: "Solutions NFC pour entreprises | i-wasp", description: "Solutions i-wasp pour les entreprises : cartes de visite NFC, profils digitaux et projets professionnels sur mesure.", h1: "Solutions entreprises", summary: "Explorez les solutions i-wasp destinées aux entreprises et aux équipes." },
  { path: "/about", title: "À propos d'i-wasp | Identité digitale professionnelle", description: "Découvrez i-wasp et sa vision de l'identité professionnelle digitale, des cartes NFC et des profils partageables.", h1: "À propos d'i-wasp", summary: "Découvrez la marque i-wasp et son approche de l'identité professionnelle digitale." },
  { path: "/contact", title: "Contacter i-wasp | Cartes de visite NFC", description: "Contactez l'équipe i-wasp pour vos questions sur les cartes de visite NFC, les profils digitaux ou les projets professionnels.", h1: "Contacter i-wasp", summary: "Contactez i-wasp pour une question sur les produits ou un projet professionnel." },
  { path: "/faq", title: "FAQ — Cartes de visite NFC i-wasp", description: "Retrouvez les réponses aux questions fréquentes sur les cartes NFC i-wasp, leur utilisation et la compatibilité smartphone.", h1: "Questions fréquentes", summary: "Réponses aux questions fréquentes sur les cartes de visite NFC i-wasp." },
  { path: "/partenaires", title: "Partenaires i-wasp | Cartes de visite NFC", description: "Découvrez les possibilités de partenariat autour des cartes de visite NFC et des profils digitaux i-wasp.", h1: "Partenaires i-wasp", summary: "Informations sur les possibilités de partenariat avec i-wasp." },
  { path: "/mentions-legales", title: "Mentions légales | i-wasp", description: "Consultez les mentions légales du site i-wasp.", h1: "Mentions légales", summary: "Informations légales relatives au site i-wasp." },
  { path: "/cgv", title: "Conditions générales de vente | i-wasp", description: "Consultez les conditions générales de vente applicables aux offres i-wasp.", h1: "Conditions générales de vente", summary: "Consultez les conditions générales de vente i-wasp." },
  { path: "/privacy", title: "Politique de confidentialité | i-wasp", description: "Consultez la politique de confidentialité et les informations relatives au traitement des données sur i-wasp.", h1: "Politique de confidentialité", summary: "Informations sur la confidentialité et le traitement des données sur i-wasp." }
];

function escapeAttr(value) {
  return String(value).replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeText(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function replaceMeta(html, attr, key, value) {
  const pattern = new RegExp('<meta\s+' + attr + '="' + key + '"[^>]*>', "i");
  if (!pattern.test(html)) throw new Error("Balise meta manquante : " + attr + "=" + key);
  return html.replace(pattern, '<meta ' + attr + '="' + key + '" content="' + escapeAttr(value) + '" />');
}
function renderRoute(route) {
  const url = baseUrl + (route.path === "/" ? "/" : route.path);
  let html = baseHtml.replace(/<title>[\s\S]*?<\/title>/i, "<title>" + escapeText(route.title) + "</title>");
  html = replaceMeta(html, "name", "description", route.description);
  const canonicalPattern = /<link\s+rel="canonical"[^>]*>/i;
  if (!canonicalPattern.test(html)) throw new Error("Balise canonical manquante pour " + route.path);
  html = html.replace(canonicalPattern, '<link rel="canonical" href="' + escapeAttr(url) + '" />');
  html = replaceMeta(html, "property", "og:title", route.title);
  html = replaceMeta(html, "property", "og:description", route.description);
  html = replaceMeta(html, "property", "og:url", url);
  html = replaceMeta(html, "name", "twitter:title", route.title);
  html = replaceMeta(html, "name", "twitter:description", route.description);
  const fallback = '<noscript><main><h1>' + escapeText(route.h1) + '</h1><p>' + escapeText(route.summary) + '</p><p><a href="/contact">Contacter i-wasp</a></p></main></noscript>';
  if (!html.includes("</body>")) throw new Error("Fin de body introuvable pour " + route.path);
  html = html.replace("</body>", fallback + "\n</body>");
  return { html, url };
}

for (const route of routes) {
  const result = renderRoute(route);
  const outputPath = route.path === "/" ? indexPath : path.join(dist, route.path.slice(1), "index.html");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, result.html, "utf8");
  const saved = fs.readFileSync(outputPath, "utf8");
  assert.ok(saved.includes("<title>" + escapeText(route.title) + "</title>"), "title incorrect : " + route.path);
  assert.ok(saved.includes('<link rel="canonical" href="' + result.url + '" />'), "canonical incorrect : " + route.path);
  assert.ok(saved.includes('property="og:url" content="' + result.url + '"'), "og:url incorrect : " + route.path);
  assert.equal((saved.match(/<link\s+rel="canonical"/gi) || []).length, 1, "canonical dupliquée : " + route.path);
  assert.ok(saved.includes("<h1>" + route.h1 + "</h1>"), "fallback sans-JS absent : " + route.path);
}
console.log("SEO metadata shell generated and checked for " + routes.length + " routes. Note: React body is not server-rendered by this script.");
