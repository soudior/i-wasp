# ROADMAP — i-wasp

> Feuille de route priorisée, dérivée de `AUDIT.md`. Mise à jour au fil des corrections.
> Statut : ☐ à faire · 🔄 en cours · ✅ fait · 🔒 bloqué (secret / décision commerciale requise).

## Principe de travail

Petites étapes vérifiables. Pour chaque changement : expliquer le problème → lister les fichiers → implémenter → vérifier (`tsc`/`build`/`lint`) → corriger → mettre à jour ce document.

**Ne jamais toucher** aux fichiers listés dans `PROTECTED_FILES.md` (cartes clients) sans autorisation explicite.

---

## Phase 0 — Détachement de Lovable & hygiène (sans secret)

| # | Tâche | Réf. AUDIT | Statut |
|---|-------|-----------|--------|
| 0.1 | Retirer `lovable-tagger` de `vite.config.ts` (i-wasp + studio) | P3-TAGGER | ✅ |
| 0.2 | Réécrire `README.md` (retirer boilerplate Lovable) | P3-README | ✅ (i-wasp) / ☐ (studio) |
| 0.3 | Remplacer `i-wasp.lovable.app` → `i-wasp.com` dans `SEOHead.tsx`, exports admin, `LifestyleGroupCard`, fallbacks `origin` des edge functions | P1-DOMAIN | ✅ |
| 0.4 | Nettoyer `index.html` de `i-wasp-studio` (boilerplate Lovable, `lang`, og) | P1-STU-SEO | ✅ |
| 0.5 | Retirer `.env` du suivi git + `.gitignore` + créer `.env.example` (noms seuls) | P3-ENV, P1-STU-ENV | ✅ (2 dépôts) |
| 0.6 | Supprimer la référence commentée `lovableproject.com` de `capacitor.config.ts` | P3-CAP-URL | ✅ |

## Phase 1 — Positionnement & clarté produit (P0/P1, sans secret)

| # | Tâche | Réf. AUDIT | Statut |
|---|-------|-----------|--------|
| 1.1 | **Hero de l'accueil `Index.tsx`** : promesse claire (« La carte de visite NFC qui transforme chaque rencontre en opportunité » + « aucune application requise »), CTA « Créer ma carte » / « Voir la démonstration » | P0-1 | ✅ |
| 1.2 | **Accueil complet — 13 sections** dans une identité unique luxe sombre (hero, démo NFC 3 étapes, inclus, modèles, personnalisation, profil, avantages, comparaison, tarifs, confiance, FAQ, CTA final). Nouveaux composants `src/components/home/*` + design system `theme.ts`. Clair utilisé en contraste éditorial (panneau ivoire de comparaison). Vérifié visuellement à 320/375/768/1280 (aucun débordement). | P0-1 | ✅ |
| 1.3 | Brancher l'accueil sur l'i18n (`home.*`) — actuellement FR en dur (langue primaire) ; extraction i18n = étape suivante | P1-I18N | 🔄 |
| 1.4 | Respecter `prefers-reduced-motion` dans l'accueil (via `useReducedMotion`) — cartes 3D + toutes les nouvelles sections (reveal léger/fondu selon la préférence) | P1-MOTION | ✅ (sections home) / 🔄 (boucles ambiantes héritées) |
| 1.5 | Jargon (« Aura », « Calibre », « Protocol ») rétrogradé : nav + CTA + libellés réseaux clarifiés ; titres de section décoratifs conservés en secondaire | Étape 2 énoncé | ✅ |

## Phase 2 — Nettoyage des routes & code mort (P1/P2, sans secret)

| # | Tâche | Réf. AUDIT | Statut |
|---|-------|-----------|--------|
| 2.1 | Supprimer la route `/admin/web-studio-ia` non protégée (ligne 360) | P1-ADMIN | ✅ |
| 2.2 | Corriger le doublon `/elite` (dashboard → `/elite-dashboard`) | P1-ELITE | ✅ |
| 2.3 | Choisir la home canonique et retirer les variantes concurrentes (fait pendant la refonte accueil) | P1-HOME | 🔄 (différé phase refonte) |
| 2.4 | Retirer les imports morts confirmés (`GuestCardCreator`, `OrderType`) | P2-DEADCODE | ✅ |
| 2.4b | `AriellaCard` : importé mais non routé ET protégé (`clientCardProtection`). Non modifié. À confirmer avec le client : restaurer la route `/card/ariella-khiat-cohen` ou retirer. | PROTECTED | 🔒 (décision client) |
| 2.5 | Retirer les pages de démo/vanité avant lancement (🔒 confirmer lesquelles garder) | P3-DEMO | 🔒 |

## Phase 3 — SEO & internationalisation (P1, sans secret)

| # | Tâche | Réf. AUDIT | Statut |
|---|-------|-----------|--------|
| 3.1 | Générer `public/sitemap.xml` (routes publiques) | P1-SITEMAP | ✅ |
| 3.2 | Corriger `SEOHead` : og:image → `i-wasp.com`, image existante, configs FR (langue primaire) | P1-SEO | ✅ (JSON-LD/hreflang restants) |
| 3.3 | Données structurées JSON-LD (Organization + WebSite + Product + FAQPage) sur l'accueil | P1-SITEMAP | ✅ (JSON-LD) · `hreflang` = 🔒 (nécessite des routes localisées `/en/…`) |
| 3.4 | Sélecteur de langue limité aux langues complètes (FR/EN) — plus de traduction partielle exposée ; les 5 stubs restent chargées pour un fallback propre, à finaliser avant réexposition | P1-I18N | ✅ |
| 3.5 | Cohérence meta/UI (lang) | P2 | ☐ |

## Phase 4 — PWA & mobile (P0/P1, sans secret pour l'essentiel)

| # | Tâche | Réf. AUDIT | Statut |
|---|-------|-----------|--------|
| 4.1 | Manifest PWA unique + icônes correctes (`public/icons/*`) | P0-3 | ✅ |
| 4.2 | Unifier le bundle id dans l'AASA sur `app.iwasp.digital` (+ copie `.well-known/`, chemins `/n/*`) ; Team ID = action manuelle (MANUAL_ACTIONS §3) | P0-4 | ✅ (code) / 🔑 Team ID |
| 4.3 | Scheme deep-link `iwasp://` conservé ; scheme interne Capacitor `IWASP` laissé tel quel (distinct — documenté) | P2-SCHEME | ✅ (clarifié) |
| 4.4 | Restreindre l'ATS (`NSAllowsArbitraryLoads`) | P2 | ☐ |
| 4.5 | Autoriser le zoom (retirer `user-scalable=no`) | P2-ZOOM | ☐ |
| 4.6 | Implémenter la suppression de compte in-app | APP_STORE §5 | ☐ |
| 4.7 | Remplacer les placeholders `YOUR_APP_ID` / `TEAM_ID` | 🔒 (compte Apple) | 🔒 |

## Phase 5 — Sécurité serveur (P0/P1)

| # | Tâche | Réf. AUDIT | Statut |
|---|-------|-----------|--------|
| 5.1 | **Vérifier la signature du webhook Stripe** (`constructEventAsync`, fail-closed) | P0-2 | ✅ (code) / 🔑 requiert `STRIPE_WEBHOOK_SECRET` (MANUAL_ACTIONS §1) |
| 5.2 | Corriger la RLS `website_blog_tokens`/`posts` (`TO service_role` / drop) | P1-RLS | ✅ migration écrite (`20260806000000`) — à appliquer |
| 5.3 | Générer un `serial_code` aléatoire indépendant de l'UUID (nouvelles cartes) | P1-ACT | ✅ migration écrite (`20260806000001`) — à appliquer. (Cesser d'exposer l'UUID via `get_public_card` = étape frontend, voir SECURITY_NOTES) |
| 5.4 | Activation liant réellement la carte au compte (`user_id`) | P2 (P1-ACT) | 📝 orientation dans `SECURITY_NOTES.md` |
| 5.5 | Valider les prix `extras` côté serveur (catalogue) | P2-PRICE | ☐ |
| 5.6 | Retirer/garder derrière auth `test-email` | P2-EMAIL-RELAY | 📝 orientation dans `SECURITY_NOTES.md` |
| 5.7 | Durcir le storage : scoping owner + limites MIME/taille buckets | P2-STORAGE | 📝 draft + mises en garde dans `SECURITY_NOTES.md` |
| 5.8 | Restreindre la lecture publique de `wifi_configs`/`rental_properties` | P2-WIFI | 📝 orientation dans `SECURITY_NOTES.md` |
| 5.9 | Auth/rate-limit sur les fonctions IA (anti-drain de crédits) | P1-AI (sécu) | 📝 orientation dans `SECURITY_NOTES.md` |

> Les migrations SQL sont **préparées** en dépôt sans secret. Leur **application** sur la base de production nécessite un accès Supabase (décision/credentials). Voir `SECURITY_NOTES.md` pour les drafts et les mises en garde (cartes déjà imprimées, dépendances frontend).

## Phase 6 — NFC & cycle de vie (P2)

| # | Tâche | Réf. AUDIT | Statut |
|---|-------|-----------|--------|
| 6.1 | URL courte stable `i-wasp.com/n/{id-public}` + identifiant opaque non devinable | ARCHITECTURE §8 | ☐ |
| 6.2 | Cycle de vie carte : suspendre / remplacer / transférer | P2-LIFECYCLE | ☐ |
| 6.3 | Brancher la carte publique sur `lib/vcard.ts` (4.0, échappement, photo, réseaux) | P2-VCARD | ☐ |
| 6.4 | Corriger les données de contact des templates (`x ? undefined : undefined`) | P2-TEMPLATE-DATA | ☐ |
| 6.5 | Bouton de partage natif (Web Share API) sur la carte publique | P3 | ☐ |

## Phase 7 — Qualité & robustesse (P1/P2)

| # | Tâche | Réf. AUDIT | Statut |
|---|-------|-----------|--------|
| 7.1 | Réactiver progressivement la sécurité de type TS | P1-TS | 🔄 (voir plan par étapes ci-dessous) |
| 7.2 | Réduire les erreurs ESLint (221→0) ; `no-unused-vars` à réactiver avec TS strict | P2-LINT | ✅ (erreurs 0 ; 272 warnings restants) |
| 7.3 | Ne plus avaler toutes les erreurs dans `main.tsx` | P2-ERRORS | ☐ |
| 7.4 | Page 404 sans auto-redirection (soft-404) ; ErrorBoundary tient le rôle de page 500 | P2-404 | ✅ |
| 7.5 | Tests des parcours critiques (auth, commande, carte publique, paiement) | AUDIT (tests) | 🔄 (baseline: vCard + pricing) |
| 7.6 | Retirer les `console.log` de debug en prod | P3-LOG | 🔄 (PublicCard fait) |
| 7.7 | Consolider les 4 palettes en un design system unique | P2-PALETTE | ☐ |

## i-wasp-studio (dépôt satellite)

| # | Tâche | Réf. AUDIT | Statut |
|---|-------|-----------|--------|
| S.1 | Nettoyer `index.html` (boilerplate Lovable → i-wasp-studio, `lang="fr"`, og:url) | P1-STU-SEO | ✅ |
| S.2 | **Retirer la collecte de clé secrète Stripe** du `DeploymentWizard` | P1-STU-STRIPE | ✅ (champ sk_ retiré, note de sécurité ; seule la clé pk_ publique reste) |
| S.3 | `.env` hors git + `.env.example` | P1-STU-ENV | ✅ |
| S.4 | Corriger le numéro WhatsApp `212600000000` → `33626424394` | P2-STU-WHATSAPP | ✅ |
| S.5 | Pages légales `/mentions-legales` `/confidentialite` (liens morts) | P2-STU-LEGAL | ☐ |
| S.6 | Unifier l'email de contact (`@i-wasp-studio.com`) | P2-STU-EMAIL | ☐ |
| S.7 | Auth/rate-limit sur `generate-website` (CORS `*`) | P2-STU-AI | ☐ |
| S.8 | Code-splitting (bundle 1,4 Mo) | P2-STU-BUNDLE | ☐ |

---

## Plan par étapes — réactivation TypeScript strict (7.1)

Impact mesuré de chaque flag sur le code actuel (via `tsc -p tsconfig.app.json --<flag>`) :

| Flag | Erreurs | Décision |
|------|---------|----------|
| `noFallthroughCasesInSwitch` | 0 | ✅ **Activé** |
| `noImplicitThis` | 0 | ✅ **Activé** |
| `strictBindCallApply` | 0 | ✅ **Activé** |
| `useUnknownInCatchVariables` | 0 | ⏳ à activer avec `strictNullChecks` (change la sémantique des `catch`) |
| `strictFunctionTypes` | 3 | ⏳ prochaine étape rapide (corriger 3 sites) |
| `strictFunctionTypes` | 3 | ⏳ prochaine étape rapide |
| `strictNullChecks` | 38 | ⏳ tractable — cœur de `strict`, à corriger par lot |
| `noImplicitReturns` | 39 | ⏳ étape suivante |
| `noImplicitAny` | 53 | ⏳ tractable — à corriger par lot |
| `noUnusedLocals` | 503 | 🔒 gros chantier (code mort Lovable) — après nettoyage progressif |

Stratégie : activer les flags à coût nul d'abord (fait), puis les petits lots (`strictFunctionTypes` 3, `strictNullChecks` 38, `noImplicitReturns` 39, `noImplicitAny` 53) en corrigeant les sites concernés, en gardant le typecheck vert à chaque étape. `noUnusedLocals` (503, code mort Lovable) en dernier, par répertoire.

## Journal des modifications

*(À compléter à chaque commit.)*

- **2026-08-06** — Audit initial réalisé. Création de `AUDIT.md`, `ARCHITECTURE.md`, `ROADMAP.md`, `APP_STORE_CHECKLIST.md`, `ENVIRONMENT.md`.
- **2026-08-06** — Premier lot de corrections P0/P1 sans secret :
  - Détachement Lovable : `lovable-tagger` retiré (2 dépôts), `README.md` réécrit, `i-wasp.lovable.app` → `i-wasp.com` (19 fichiers), `index.html` studio nettoyé.
  - Hygiène : `.env` retiré du suivi git + `.gitignore` + `.env.example` (2 dépôts).
  - Sécurité routing : route admin `/admin/web-studio-ia` non protégée supprimée ; `/elite` dashboard → `/elite-dashboard`.
  - SEO : `sitemap.xml` créé ; `SEOHead` configs passées en français + domaine `i-wasp.com`.
  - PWA : manifest unique (statique) + chemins d'icônes corrigés ; plugin PWA en `manifest:false`.
  - Studio : numéro WhatsApp corrigé (`33626424394`).
  - Vérifs : `tsc` ✅ et `build` ✅ sur les deux dépôts.
- **2026-08-06** — Phase « Nettoyage & qualité » : baseline tests (vitest, 21 tests),
  ESLint 221→0 erreur (+ 2 bugs `rules-of-hooks` corrigés), page 404 sans soft-redirect,
  imports morts retirés, TypeScript strict progressif (3 flags à coût nul).
- **2026-08-06** — Sécurité : migration RLS blog-tokens + migration serial_code
  aléatoire + `SECURITY_NOTES.md` (drafts avec mises en garde).
- **2026-08-06** — Accueil premium sombre complet (13 sections, design system
  `home/theme.ts`, 8 composants), vérifié visuellement 320→1280. Accessibilité
  `prefers-reduced-motion`.
- **2026-08-06** — Prep non-secret : webhook Stripe signé (fail-closed), AASA sur
  `app.iwasp.digital` (+ `.well-known/`), Capacitor nettoyé, `MANUAL_ACTIONS.md`.
- **2026-08-06** — SEO : JSON-LD (Organization/WebSite/Product/FAQPage) sur l'accueil.
  i18n : sélecteur limité aux langues complètes (FR/EN).
