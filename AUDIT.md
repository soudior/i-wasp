# AUDIT — i-wasp

> Audit technique complet réalisé avant toute transformation.
> Portée : dépôt `i-wasp` (plateforme NFC + identité digitale) et, en annexe, `i-wasp-studio` (générateur de sites).
> Méthode : lecture du code (routes, auth, base de données, edge functions, NFC, SEO, PWA, mobile), exécution de `tsc`, `build`, `lint`, `test`.

## Légende des priorités

| Niveau | Signification |
|--------|---------------|
| **P0** | Bloquant / critique — sécurité, fraude, ou fonction principale cassée. À traiter en premier. |
| **P1** | Nécessaire avant lancement. |
| **P2** | Amélioration importante (dette, cohérence, maintenabilité). |
| **P3** | Amélioration future / cosmétique. |

## État des vérifications automatiques (au moment de l'audit)

| Vérification | i-wasp | i-wasp-studio |
|--------------|--------|---------------|
| `tsc --noEmit` (typecheck) | ✅ 0 erreur | ✅ 0 erreur |
| `build` (production) | ✅ succès (~36 s) | ✅ succès (~7,5 s) |
| `lint` | ❌ **221 erreurs / 78 warnings** | non exécuté (pas d'erreurs bloquantes connues) |
| `test` | ⚠️ aucun test | ⚠️ 1 test trivial (`expect(true).toBe(true)`) |
| Bundle | ⚠️ chunks lourds (jspdf 385 kB, AdminDashboard 388 kB, IWASPElite 404 kB, index 590 kB) | ⚠️ **1 seul chunk de 1,4 Mo** (aucun code-splitting) |

> Le typecheck passe **parce que** `strict`, `strictNullChecks` et `noImplicitAny` sont désactivés (voir P1-TS). Le lint « passe » côté CI uniquement si le code de retour n'est pas vérifié : `eslint .` remonte 221 erreurs réelles.

---

## P0 — Bloquant / critique

### P0-1 — La page d'accueil n'explique pas le produit (jargon pur)
- **Fichier :** `src/pages/Index.tsx:333-356`, `:473`, `:574`, `:691-694`
- Le hero affiche « **Dominez / L'Invisible** », sous-titre « L'exclusivité d'une Hypercar. La précision d'un Calibre. Votre héritage i-wasp. », CTA « **Acquérir mon Aura** », nav « MANIFESTE / ACTIVATION / L'AURA / L'ATELIER », boutons « LinkedIn Protocol / Call Protocol ».
- **Nulle part dans le premier écran** on ne lit « carte de visite NFC », « identité digitale toujours à jour », « un contact suffit », « aucune application requise ». Un visiteur ne comprend pas ce qui est vendu → échec direct de la règle des 5 secondes et de la conversion.
- **Aggravant :** la bonne copie existe déjà et est **inutilisée** — `src/i18n/locales/fr.json` contient `home.title1 = "Votre carte de visite."`, `home.subtitle = "Une carte NFC premium pour partager vos informations professionnelles d'un simple geste."` + 6 cartes de fonctionnalités claires. `Index.tsx` n'importe jamais `useTranslation`.

### P0-2 — Webhook Stripe sans vérification de signature (fraude possible)
- **Fichier :** `supabase/functions/stripe-webhook/index.ts:52-67`
- Le code lit `stripe-signature` mais ne l'utilise pas ; il fait `event = JSON.parse(body)` avec le commentaire « In production, you should verify the webhook signature ». `STRIPE_WEBHOOK_SECRET` n'est référencé nulle part.
- Fonction `verify_jwt = false` → **n'importe qui peut POSTer un faux `checkout.session.completed`** et faire insérer une commande `webstudio_orders` avec `status:'paid'` (lignes 72-154) via le client service-role. → **création de commandes payées frauduleuses**.
- **Correctif :** `stripe.webhooks.constructEventAsync(body, sig, STRIPE_WEBHOOK_SECRET)`. (Nécessite le secret — voir ENVIRONMENT.md.)

### P0-3 — Manifest PWA dédoublé + icônes 404
- **Fichiers :** `index.html:28` (`/manifest.json`) vs `vite.config.ts:36-93` (manifest généré) ; `public/manifest.json`, `public/icons/`
- Deux manifests avec des noms et thèmes différents sont émis simultanément (« i-wasp — Haute Couture Digitale » vs « i-wasp - NFC Premium », `#0A0A0A` vs `#000000`).
- Les icônes référencées (`/icon-192.png`, `/icon-512.png`, `/icon-maskable-*`) **n'existent pas** : les vrais fichiers sont `public/icons/icon-192x192.png` etc. → icônes d'installation PWA et maskable en 404.

### P0-4 — Universal Links / bundle iOS incohérents (soumission App Store impossible en l'état)
- **Fichiers :** `public/apple-app-site-association`, `index.html:50,53`, `capacitor.config.ts`
- L'AASA utilise `appID: "TEAM_ID.app.lovable.17c6de152d8546a1a7d8e5c478c6f024"` — ancien bundle **Lovable**, qui ne correspond pas au `appId` Capacitor `app.iwasp.digital`, et contient encore le placeholder littéral `TEAM_ID`.
- `index.html:50` : `apple-itunes-app` = `app-id=YOUR_APP_ID` ; `:53` `ios-app://YOUR_APP_ID`.
- → Universal Links ne peuvent pas valider ; Smart App Banner non fonctionnel. (Le vrai App ID numérique et le Team ID nécessitent un compte Apple Developer — voir APP_STORE_CHECKLIST.md.)

---

## P1 — Nécessaire avant lancement

### P1-RLS — Tokens d'édition de blog world-readable (contournement d'accès)
- **Fichiers :** `supabase/migrations/20260114042211_*.sql:5-14` vs `20260114035854_*.sql:65-69`
- Une migration verrouille `website_blog_tokens` avec `FOR SELECT USING (false)` ; une migration ultérieure ajoute `FOR ALL USING (true) WITH CHECK (true)` **sans clause `TO`** → s'applique au rôle `anon`. Les policies permissives étant OR'd, le verrou est annulé : **tout client avec la clé anon peut lire tous les tokens d'édition** et lire/écrire tous les articles. Ces tokens sont la seule authentification de `blog-editor-api` → prise de contrôle des blogs générés.
- **Correctif :** `TO service_role` ou suppression des policies (le service-role ignore la RLS de toute façon).

### P1-ACT — Code d'activation dérivable de l'UUID public
- **Fichiers :** migration `20260117173502_*.sql` ; `src/hooks/usePublicCard.ts:53`
- `serial_code` = 12 premiers caractères hex de l'UUID de la carte. Or `get_public_card` renvoie l'UUID brut à tout visiteur anonyme. → **n'importe qui ouvrant une carte publique peut calculer son code d'activation**.
- De plus, l'activation (`src/pages/Activation.tsx:131-143`, RPC `verify_activation_code`) **ne lie pas la carte à l'utilisateur** : elle écrit seulement dans `sessionStorage` et redirige. L'activation ne prouve donc ni la possession ni la propriété — elle est décorative.
- **Correctif :** cesser d'exposer l'UUID via `get_public_card` ; générer un `serial_code` aléatoire indépendant ; faire de l'activation une vraie prise de propriété (`user_id`).

### P1-ADMIN — Route admin publique masquant la version protégée
- **Fichier :** `src/App.tsx:360` (sans `AdminGuard`) vs `:466` (avec `AdminGuard`)
- `/admin/web-studio-ia` est déclaré deux fois ; React Router prend la **première** → la version **non protégée** gagne, le panneau `AdminWebStudioIA` est publiquement accessible.
- **Correctif :** supprimer la ligne 360.

### P1-ELITE — Route `/elite` dupliquée → dashboard protégé inaccessible
- **Fichier :** `src/App.tsx:234` (`IWASPElite` public) vs `:391` (`DashboardGuard><EliteDashboard`)
- La première gagne → `EliteDashboard` (protégé) est du code mort inatteignable.

### P1-HOME — 8+ pages d'accueil concurrentes
- **Fichier :** `src/App.tsx:232-243`
- `Index`, `IWASPElite`, `IWASPLanding`, `IWASPProduit`, `IWASPProduitConversion`, `IWASPConversion`, `HomeLuxeMax`, `HomeSaaS` routées sur `/`, `/omnia`, `/elite`, `/iwasp`, `/classic`, `/legacy`, `/home-legacy`, `/home-premium`, `/produit*`, `/conversion`. Décision produit requise : choisir la home canonique et supprimer le reste.

### P1-SEO — Balises OG écrasées vers un domaine Lovable + image 404
- **Fichier :** `src/components/SEOHead.tsx:93-98, 138, 144, 169`
- `SEOHead` (au montage) remplace les bonnes balises statiques de `index.html` (qui pointent vers `i-wasp.com`) par `og:image = https://i-wasp.lovable.app/og-home.png` — domaine de staging Lovable + image inexistante (`public/` ne contient que `og-image.png`, `og-order.png`, `og-webstudio.png`).

### P1-SITEMAP — Pas de sitemap.xml, pas de données structurées, pas de hreflang
- `public/robots.txt` référence `Sitemap: https://i-wasp.com/sitemap.xml` mais **le fichier n'existe pas**.
- Aucun `application/ld+json` (Organization/Product/FAQ), aucun `hreflang` malgré le multilingue.

### P1-I18N — 5 langues sur 7 sont des ébauches ; l'UI n'est pas traduite
- **Fichiers :** `src/i18n/locales/*.json`
- `fr.json` / `en.json` = 15 sections complètes ; `de/es/it/nl/ar.json` = 7 sections seulement (manque `home`, `pricing`, `faq`, `order`…). Le `LanguageSelector` propose les 7 → sélectionner ES/DE/IT/NL/AR retombe silencieusement sur le français.
- De plus, `Index.tsx` (et pages bespoke) codent le français en dur → le sélecteur de langue ne change rien sur l'accueil.

### P1-TS — Sécurité de type désactivée
- **Fichiers :** `tsconfig.json`, `tsconfig.app.json`
- `strict:false`, `strictNullChecks:false`, `noImplicitAny:false`, `noUnusedLocals:false`, `noUnusedParameters:false`. Aucune null-safety, aucun code mort détecté → c'est pourquoi les imports morts passent le build.

### P1-MOTION — L'accueil ignore `prefers-reduced-motion`
- **Fichier :** `src/pages/Index.tsx` (~30 boucles Framer-Motion infinies) ; `src/hooks/useReducedMotion.ts` existe mais n'y est pas utilisé.
- Le garde CSS global neutralise les animations CSS mais **pas** les `animate` JS de Framer-Motion → échec d'accessibilité (WCAG 2.3.3).

### P1-AI — Fonctionnalités IA verrouillées sur la passerelle Lovable
- **Fichiers :** `supabase/functions/{generate-website,generate-website-code,generate-template,adaptive-template,regenerate-text,generate-image,generate-palette,smart-suggestions,webstudio-chat}/index.ts`
- Toutes appellent `https://ai.gateway.lovable.dev` avec `LOVABLE_API_KEY` → point de défaillance unique + dépendance Lovable en production. `webstudio-chat` contient même un prompt système interdisant au modèle de mentionner « Lovable ».

### P1-DOMAIN — Domaine `i-wasp.lovable.app` fuité côté client
- **Fichiers :** `src/components/SEOHead.tsx` ; `supabase/functions/{apple-wallet,google-wallet,create-checkout,create-payment,create-nfc-payment,customer-portal,...}` (fallback `origin`) ; `src/components/admin/ClientDataExportImport.tsx:554`, `ClientEditModal.tsx:418` ; `src/pages/LifestyleGroupCard.tsx:65`
- Le domaine de preview Lovable est baké dans des URLs client (emails, wallet, exports, OG). Incohérent avec `index.html` qui utilise `i-wasp.com`.

---

## P2 — Amélioration importante

| ID | Problème | Emplacement |
|----|----------|-------------|
| P2-EMAIL-RELAY | `test-email` public (`verify_jwt=false`) = relais d'envoi ouvert depuis `contact@i-wasp.com` | `supabase/functions/test-email/index.ts` |
| P2-PRICE | Prix des « extras » contrôlés par le client (injectés en `unit_amount`) | `supabase/functions/create-nfc-payment/index.ts:64-137` |
| P2-STORAGE | Policy write `card-assets` non scoping-owner (`WITH CHECK (bucket_id=...)` seul) → écrasement des fichiers d'autrui ; aucun `file_size_limit`/`allowed_mime_types` sur les buckets | migration `20260112050519`, buckets |
| P2-WIFI | `wifi_configs` / `rental_properties` en `SELECT USING(true/is_active)` exposent SSID + mots de passe wifi en lecture publique | migrations `20260421135935`, `20260102181848` |
| P2-LIFECYCLE | Aucun suspend / transfert / remplacement de carte (seulement `is_active` + suppression) | `src/hooks/useCards.ts:148-194` |
| P2-VCARD | La carte publique génère un vCard 3.0 inline non échappé (sans photo/réseaux) alors que `src/lib/vcard.ts` (4.0, complet) est inutilisé | `src/pages/PublicCard.tsx:127-179` |
| P2-TEMPLATE-DATA | Données de contact des templates écrites `x ? undefined : undefined` → boutons non fonctionnels | `src/pages/PublicCard.tsx:223-225, 283-286, 380` |
| P2-HARDCODE | ~14 pages `/card/<nom>` client codées en dur (voir `PROTECTED_FILES.md`) au lieu d'être data-driven via `/card/:slug` | `src/App.tsx:257-270` |
| P2-PALETTE | 4 modules de palette contradictoires (`omniaPalette`, `hauteCouturePalette`, `applePalette`, `stealthPalette`) ; incohérence polices/marque | `src/lib/*Palette.ts`, `index.html` vs `index.css` |
| P2-MANIFEST-SW | Manifests PWA divergents ; screenshots référencés absents | `index.html:28`, `vite.config.ts`, `public/manifest.json` |
| P2-ERRORS | Le handler global avale toutes les erreurs (`event.preventDefault()`) → masque de vrais bugs | `src/main.tsx:59-88` |
| P2-DEADCODE | Imports morts : `AriellaCard`, `GuestCardCreator`, `OrderType` | `src/App.tsx:130,47,107` |
| P2-LINT | 221 erreurs ESLint (`no-explicit-any` dans les edge functions Deno, `require()` dans `tailwind.config.ts:303`) ; `no-unused-vars` désactivé | global |
| P2-ZOOM | `viewport` avec `maximum-scale=1.0, user-scalable=no` bloque le pinch-zoom (WCAG 1.4.4) | `index.html:7` |
| P2-404 | `NotFound` redirige automatiquement vers `/` après 5 s → soft-404 (mauvais SEO) | `src/pages/NotFound.tsx:17-30` |
| P2-SCHEME | Schéma deep-link incohérent : `iwasp://` (Info.plist) vs `IWASP` (Capacitor) vs `web+iwasp` (manifest) | `capacitor.config.ts:19`, `Info.plist`, `manifest.json` |
| P2-DB-SHARE | Tables d'autres projets partageant la base (`amg_leads`, `leads_partenaires`, `rental_properties`, `alliance_chat`, `wifi_configs`…) élargissent la surface RLS | `types.ts`, migrations |

---

## P3 — Amélioration future

| ID | Problème | Emplacement |
|----|----------|-------------|
| P3-ENV | `.env` suivi dans git (uniquement clés publishable/anon — pas un secret, mais mauvaise hygiène) | `.env`, `.gitignore` |
| P3-WIFI-SEED | Mots de passe wifi réels commités en clair dans un seed de migration | `supabase/migrations/20260421135935_*.sql` |
| P3-README | README = boilerplate Lovable (`REPLACE_WITH_PROJECT_ID`) | `README.md` |
| P3-TAGGER | `lovable-tagger` (dev uniquement, `mode==='development'`) | `vite.config.ts:4,35` |
| P3-CAP-URL | URL de dev Lovable commentée dans la config Capacitor | `capacitor.config.ts:11` |
| P3-LOG | `console.log` de debug en prod (slug, char codes, serial) | `src/pages/PublicCard.tsx:50-52`, `Activation.tsx:104` |
| P3-SLUG | Entropie de slug faible (nom + 6 base36) ; pas de vérif de collision avant insert | `src/hooks/useCards.ts:60-72` |
| P3-STRIPE-CFG | `stripeConfig.ts` et `webStudioStripeConfig.ts` définissent des `product_id` divergents | `src/lib/` |
| P3-DEMO | Pages de démo/vanité à retirer avant lancement (`Maman`, `Anniversaire`, `AmgBuilding`, `AdventuresWheels`, `Nails`, `RentalDemo`, `UltraLuxeDemo`, `Demo*`) | `src/pages/` |

---

## Ce qui fonctionne bien (à conserver)

- **Modèle d'auth/rôles solide :** `user_roles` + enum `app_role` + fonction `SECURITY DEFINER has_role()`, aucune policy INSERT/UPDATE sur `user_roles` (pas d'auto-élévation), bootstrap admin vérifié par JWT + email fondateur. Aucun secret dans le frontend.
- **Modèle de données de carte publique respectueux de la vie privée :** la vue `public_cards` et `get_public_card` n'exposent que des booléens `has_*` ; les URLs d'action (`tel:`, `mailto:`, `wa.me`) sont résolues côté serveur via `get_card_action_url`. Le logging de scan ne capture que le `user_agent` (pas d'IP, pas de fingerprint).
- **Stripe réellement intégré** (SDK réel, Checkout Sessions, vérification `payment_status` côté serveur dans les fonctions `verify-*`). Seul le webhook est vulnérable (P0-2).
- **`src/lib/vcard.ts`** : générateur vCard 4.0 complet et correct (à brancher sur la carte publique).
- **Capacitor utilise de vrais plugins natifs** (Haptics, SplashScreen, StatusBar) — pas une simple WebView.
- **PWA / service worker** : stratégies Workbox de cache pertinentes.

---

## Annexe — i-wasp-studio (dépôt secondaire)

Site vitrine + « générateur de sites IA ». **C'est un funnel de génération de leads, pas un vrai builder** : aucune base de données (`types.ts` vide), aucune auth, tout aboutit à un lien WhatsApp ou une modale factice.

- **P1-STU-STRIPE :** `DeploymentWizard.tsx:143,457-479` demande à l'utilisateur de coller sa **clé secrète Stripe** (`sk_...`) dans un formulaire web, avec la mention mensongère « stockée de façon sécurisée et chiffrée » — la clé n'est jamais stockée ni transmise. Anti-pattern dangereux à supprimer.
- **P1-STU-ENV :** `.env` suivi dans git (clé anon uniquement).
- **P1-STU-SEO :** `index.html` = boilerplate Lovable (`<title>Lovable App</title>`, `author="Lovable"`, `og:image=lovable.dev/...`, pas d'`og:url`, `lang="en"` sur une app FR).
- **P2-STU-WHATSAPP :** `QuoteCalculator.tsx:343` pointe vers `wa.me/212600000000` (numéro factice) alors que le reste utilise `33626424394` → leads perdus.
- **P2-STU-AI :** `generate-website` en CORS `*` sans auth → drain des crédits IA.
- **P2-STU-LEGAL :** liens `/mentions-legales` et `/confidentialite` (Footer) → 404 ; pas de pages légales.
- **P2-STU-EMAIL :** `contact@i-wasp.com` (OrderConfirmation) vs `contact@i-wasp-studio.com` (reste).
- **P2-STU-TESTS :** 1 seul test trivial ; logique de prix non testée.
- **P2-STU-BUNDLE :** build en 1 seul chunk de 1,4 Mo (pas de code-splitting).

---

*Document généré lors de l'audit initial. Les corrections et leur statut sont suivis dans `ROADMAP.md`.*
