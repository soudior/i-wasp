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
| 0.6 | Supprimer la référence commentée `lovableproject.com` de `capacitor.config.ts` | P3-CAP-URL | ☐ |

## Phase 1 — Positionnement & clarté produit (P0/P1, sans secret)

| # | Tâche | Réf. AUDIT | Statut |
|---|-------|-----------|--------|
| 1.1 | **Refonte de l'accueil `Index.tsx`** : hero clair (« La carte de visite NFC qui transforme chaque rencontre en opportunité » + sous-titre « aucune application requise »), CTA « Créer ma carte » / « Voir la démonstration » | P0-1 | ☐ |
| 1.2 | Assembler la home autour des sections existantes `src/components/landing/*` (HowItWorks, NFCDemo, Pricing, Comparison, SocialProof, FAQ) | P0-1, ARCHITECTURE §7 | ☐ |
| 1.3 | Brancher l'accueil sur l'i18n (`home.*` de `fr.json`/`en.json`) | P1-I18N | ☐ |
| 1.4 | Respecter `prefers-reduced-motion` dans l'accueil (via `useReducedMotion`) | P1-MOTION | ☐ |
| 1.5 | Conserver le jargon (« Aura », « Calibre », « Protocole ») uniquement comme éléments de marque secondaires, jamais en explication principale | Étape 2 énoncé | ☐ |

## Phase 2 — Nettoyage des routes & code mort (P1/P2, sans secret)

| # | Tâche | Réf. AUDIT | Statut |
|---|-------|-----------|--------|
| 2.1 | Supprimer la route `/admin/web-studio-ia` non protégée (ligne 360) | P1-ADMIN | ✅ |
| 2.2 | Corriger le doublon `/elite` (dashboard → `/elite-dashboard`) | P1-ELITE | ✅ |
| 2.3 | Choisir la home canonique et retirer les variantes concurrentes (🔒 décision produit) | P1-HOME | 🔒 |
| 2.4 | Retirer les imports morts (`AriellaCard`, `GuestCardCreator`, `OrderType`) | P2-DEADCODE | ☐ |
| 2.5 | Retirer les pages de démo/vanité avant lancement (🔒 confirmer lesquelles garder) | P3-DEMO | 🔒 |

## Phase 3 — SEO & internationalisation (P1, sans secret)

| # | Tâche | Réf. AUDIT | Statut |
|---|-------|-----------|--------|
| 3.1 | Générer `public/sitemap.xml` (routes publiques) | P1-SITEMAP | ✅ |
| 3.2 | Corriger `SEOHead` : og:image → `i-wasp.com`, image existante, configs FR (langue primaire) | P1-SEO | ✅ (JSON-LD/hreflang restants) |
| 3.3 | Ajouter données structurées JSON-LD (Organization, Product, FAQ) + `hreflang` | P1-SITEMAP | ☐ |
| 3.4 | Compléter les 5 locales stubs OU retirer les langues non finies du sélecteur | P1-I18N | ☐ |
| 3.5 | Cohérence meta/UI (lang) | P2 | ☐ |

## Phase 4 — PWA & mobile (P0/P1, sans secret pour l'essentiel)

| # | Tâche | Réf. AUDIT | Statut |
|---|-------|-----------|--------|
| 4.1 | Manifest PWA unique + icônes correctes (`public/icons/*`) | P0-3 | ✅ |
| 4.2 | Unifier le bundle id dans l'AASA sur `app.iwasp.digital` (Team ID à insérer plus tard) | P0-4 | ☐ |
| 4.3 | Unifier le scheme deep-link (`iwasp://`) | P2-SCHEME | ☐ |
| 4.4 | Restreindre l'ATS (`NSAllowsArbitraryLoads`) | P2 | ☐ |
| 4.5 | Autoriser le zoom (retirer `user-scalable=no`) | P2-ZOOM | ☐ |
| 4.6 | Implémenter la suppression de compte in-app | APP_STORE §5 | ☐ |
| 4.7 | Remplacer les placeholders `YOUR_APP_ID` / `TEAM_ID` | 🔒 (compte Apple) | 🔒 |

## Phase 5 — Sécurité serveur (P0/P1)

| # | Tâche | Réf. AUDIT | Statut |
|---|-------|-----------|--------|
| 5.1 | **Vérifier la signature du webhook Stripe** (`constructEventAsync`) | P0-2 | 🔒 (requiert `STRIPE_WEBHOOK_SECRET`) |
| 5.2 | Corriger la RLS `website_blog_tokens`/`posts` (`TO service_role` / drop) | P1-RLS | ☐ |
| 5.3 | Générer un `serial_code` aléatoire indépendant de l'UUID + cesser d'exposer l'UUID via `get_public_card` | P1-ACT | ☐ |
| 5.4 | Activation liant réellement la carte au compte (`user_id`) | P2 (P1-ACT) | ☐ |
| 5.5 | Valider les prix `extras` côté serveur (catalogue) | P2-PRICE | ☐ |
| 5.6 | Retirer/garder derrière auth `test-email` | P2-EMAIL-RELAY | ☐ |
| 5.7 | Durcir le storage : scoping owner + limites MIME/taille buckets | P2-STORAGE | ☐ |
| 5.8 | Restreindre la lecture publique de `wifi_configs`/`rental_properties` | P2-WIFI | ☐ |
| 5.9 | Auth/rate-limit sur les fonctions IA (anti-drain de crédits) | P1-AI (sécu) | ☐ |

> Les migrations SQL peuvent être **préparées** en dépôt sans secret ; leur **application** sur la base de production nécessite un accès Supabase (décision/credentials).

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
| 7.1 | Réactiver progressivement la sécurité de type TS (`strictNullChecks`…) | P1-TS | ☐ |
| 7.2 | Réduire les erreurs ESLint (221) ; réactiver `no-unused-vars` | P2-LINT | ☐ |
| 7.3 | Ne plus avaler toutes les erreurs dans `main.tsx` | P2-ERRORS | ☐ |
| 7.4 | Page 404 sans auto-redirection (soft-404) + page 500 dédiée | P2-404 | ☐ |
| 7.5 | Tests des parcours critiques (auth, commande, carte publique, paiement) | AUDIT (tests) | ☐ |
| 7.6 | Retirer les `console.log` de debug en prod | P3-LOG | ☐ |
| 7.7 | Consolider les 4 palettes en un design system unique | P2-PALETTE | ☐ |

## i-wasp-studio (dépôt satellite)

| # | Tâche | Réf. AUDIT | Statut |
|---|-------|-----------|--------|
| S.1 | Nettoyer `index.html` (boilerplate Lovable → i-wasp-studio, `lang="fr"`, og:url) | P1-STU-SEO | ✅ |
| S.2 | **Retirer la collecte de clé secrète Stripe** du `DeploymentWizard` | P1-STU-STRIPE | ☐ |
| S.3 | `.env` hors git + `.env.example` | P1-STU-ENV | ✅ |
| S.4 | Corriger le numéro WhatsApp `212600000000` → `33626424394` | P2-STU-WHATSAPP | ✅ |
| S.5 | Pages légales `/mentions-legales` `/confidentialite` (liens morts) | P2-STU-LEGAL | ☐ |
| S.6 | Unifier l'email de contact (`@i-wasp-studio.com`) | P2-STU-EMAIL | ☐ |
| S.7 | Auth/rate-limit sur `generate-website` (CORS `*`) | P2-STU-AI | ☐ |
| S.8 | Code-splitting (bundle 1,4 Mo) | P2-STU-BUNDLE | ☐ |

---

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
