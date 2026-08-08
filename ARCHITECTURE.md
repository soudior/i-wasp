# ARCHITECTURE — i-wasp

> Vue d'ensemble technique de la plateforme i-wasp (carte NFC premium + identité digitale) et de son dépôt satellite `i-wasp-studio`.

## 1. Stack technique

| Couche | Technologie |
|--------|-------------|
| Build / dev | **Vite 5** + `@vitejs/plugin-react-swc` |
| Langage | **TypeScript** + **React 18** |
| UI | **shadcn/ui** (Radix UI) + **Tailwind CSS 3** + **Framer Motion** |
| Routage | **react-router-dom 6** (SPA, code-splitting par `React.lazy`) |
| État serveur | **@tanstack/react-query 5** |
| État global | React Context (Auth, Cart, Currency, Checkout, OrderFunnel, Brand, GuestCard…) |
| i18n | **i18next** + **react-i18next** (fr, en, es, it, nl, de, ar) |
| Backend | **Supabase** (PostgreSQL + Auth + Storage + Edge Functions Deno) |
| Paiements | **Stripe** (Checkout Sessions, abonnements) |
| Emails | **Resend** |
| Wallet | Apple PassKit + Google Wallet |
| IA | Passerelle **Lovable AI** (`ai.gateway.lovable.dev`) — *à internaliser (voir ROADMAP)* |
| Mobile | **Capacitor 8** (iOS + Android) — plugins Haptics, SplashScreen, StatusBar |
| PWA | `vite-plugin-pwa` (Workbox) + `public/sw-push.js` (Web Push VAPID) |

## 2. Structure du dépôt `i-wasp`

```
i-wasp/
├── index.html               # Shell SPA, meta SEO/PWA, fonts, deep-links
├── vite.config.ts           # Build, PWA (manifest + Workbox), plugin Lovable (dev)
├── capacitor.config.ts      # appId app.iwasp.digital, plugins natifs
├── tailwind.config.ts       # Tokens de design → variables CSS
├── src/
│   ├── main.tsx             # Montage React, ThemeProvider, gestion cache/erreurs
│   ├── App.tsx              # Routeur monolithique (~195 routes, 13 providers imbriqués)
│   ├── pages/               # ~145 pages (produit + funnels + admin + démos client)
│   │   ├── order/           # Tunnel de commande carte (7 étapes)
│   │   ├── express/         # Tunnel express (3 étapes)
│   │   ├── web-studio/      # Funnel générateur de site
│   │   └── admin/           # Back-office
│   ├── components/          # UI, landing/, admin/, templates/, print/…
│   │   └── landing/         # Sections conversion RÉUTILISABLES (voir §7)
│   ├── contexts/            # Providers d'état global
│   ├── hooks/               # ~55 hooks métier (useCards, useOrders, usePublicCard…)
│   ├── lib/                 # Logique pure (vcard, pricing, validation, palettes…)
│   ├── i18n/                # Config + locales/*.json
│   └── integrations/supabase/  # client.ts + types.ts (générés)
├── supabase/
│   ├── config.toml          # Config des 50 edge functions (verify_jwt par fonction)
│   ├── functions/           # ~50 edge functions Deno
│   └── migrations/          # ~50+ migrations SQL (schéma + RLS)
├── public/                  # Assets, robots.txt, manifest.json, AASA, icônes
├── ios-config/              # Templates Info.plist, guides
└── android-config/          # Guides Android
```

## 3. Routage

- **Point d'entrée :** `src/App.tsx` — un seul `<Routes>` avec ~195 `<Route>`, pages chargées en `lazy()`.
- **Groupes :**
  - **Public marketing :** `/` (accueil), `/produits`, `/produits/:productId`, `/pricing`↔`/tarifs`, `/features`, `/contact`, `/about`, `/faq`, pages légales (`/cgv`, `/privacy`, `/mentions-legales`).
  - **Carte publique NFC :** `/card/:slug` → `PublicCard` (résolveur dynamique) ; `/c/:slug` → redirection ; ~14 routes `/card/<nom>` client codées en dur.
  - **Auth :** `/login`, `/signup`, `/forgot-password`, `/reset-password`.
  - **Tunnels de commande :** `/order/*` (7 étapes), `/express/*` (3 étapes), `/cart`, `/checkout-tunnel`.
  - **Web Studio :** `/web-studio/*` (funnel de site généré).
  - **Espace client (garde `DashboardGuard`) :** `/dashboard`, `/settings`, `/orders`, `/subscription`, `/studio`, `/wallet-customizer`.
  - **Admin (garde `AdminGuard`) :** `/admin`, `/admin/orders`, `/admin/clients`, `/admin/creator`, `/admin/web-studio-orders`, `/admin/analytics`…
- **Gardes :** `DashboardGuard` (auth) et `AdminGuard` (rôle admin) — **gardes de rendu uniquement**, la vraie protection est la RLS Postgres.
- **Dette connue :** doublons de routes (`/elite`, `/admin/web-studio-ia`) et 8+ variantes d'accueil (voir AUDIT P1-HOME, P1-ADMIN, P1-ELITE).

## 4. Authentification & rôles

- **Supabase Auth** : email/mot de passe + Google OAuth. Session en `localStorage`, refresh automatique.
- **Rôles** : table `user_roles` (enum `app_role` = `admin` | `moderator` | `user`) + fonction `SECURITY DEFINER has_role(uid, role)`. Aucune policy d'écriture sur `user_roles` → pas d'auto-élévation.
- **Bootstrap admin** : edge function `bootstrap-admin` (vérifie le JWT + `email === ADMIN_EMAIL`, écrit via service-role).
- **Autorisation réelle** : appliquée par les policies RLS et par re-vérification dans les edge functions sensibles (ex. `create-client-account`).

## 5. Base de données (Supabase / PostgreSQL)

Entités principales (extrait — voir `src/integrations/supabase/types.ts`) :

| Table | Rôle |
|-------|------|
| `digital_cards` | La carte NFC / identité (nom, contact, réseaux, template, `slug`, `serial_code`, `view_count`, flags) — **entité centrale** |
| `profiles` | Profil utilisateur (`avatar_url`, nom) par `user_id` |
| `orders` | Commandes de cartes physiques (livraison, `order_items`, statut, prix, `print_file_url`) |
| `webstudio_orders` | Commandes de packs site web (IDs Stripe, montant, type de pack) |
| `subscriptions` | Abonnements (plan, prix, statut, expiration) |
| `leads` | Leads capturés par carte (contact + consentement + score) |
| `card_scans` | Événements de scan NFC/QR (`user_agent`) |
| `card_stories` / `story_analytics` | Stories éphémères 24 h + analytics |
| `user_roles` | RBAC |
| `push_subscriptions` / `*_logs` / `scheduled_*` | Web Push (VAPID) |
| `webhook_configs` / `webhook_logs` | Sync CRM sortant |
| `website_proposals` / `generated_websites` / `website_blog_*` | Pipeline Web Studio (IA) |

**Accès public sécurisé :** vue `public_cards` (booléens `has_*`) + RPC `get_public_card`, `get_card_action_url`, `get_vcard_data`, `increment_card_view` (toutes `SECURITY DEFINER`, filtrées sur `is_active = true`).

**Storage (buckets, tous publics) :** `card-assets` (photos/logos), `stories`, `brand-assets`, `website-images`. *À durcir : limites MIME/taille + scoping owner (AUDIT P2-STORAGE).*

## 6. Edge functions (~50, Deno)

- **Paiements/Stripe :** `create-checkout`, `create-*-payment`, `verify-*-payment`, `stripe-webhook`, `customer-portal`, `check-subscription`.
- **Emails (Resend) :** `send-order-email`, `send-welcome-email`, `send-admin-alert`, `send-webstudio-*`.
- **Wallet :** `apple-wallet`, `google-wallet`.
- **IA (Lovable) :** `generate-website(-code)`, `generate-image`, `generate-template`, `generate-palette`, `adaptive-template`, `regenerate-text`, `smart-suggestions`, `webstudio-chat`, `scrape-website`.
- **Notifications :** `send-push-*`, `process-scheduled-notifications`, `process-tag-reminders`.
- **Admin/divers :** `bootstrap-admin`, `verify-activation-code`, `blog-editor-api`, `serve-website`, `lead-webhook`, `fetch-ical`.
- `verify_jwt` est défini par fonction dans `supabase/config.toml` (les fonctions publiques comme les webhooks/wallet sont en `false` et doivent faire leur propre contrôle).

## 7. Frontend & conversion

- **Design tokens** dans `src/index.css` (variables CSS HSL, radii, ombres, timings) → mappés dans `tailwind.config.ts`.
- **Dette :** 4 modules de palette concurrents + incohérence de polices marque (voir AUDIT P2-PALETTE).
- **Atout sous-exploité :** `src/components/landing/` contient déjà des **sections de conversion réutilisables** — `HowItWorksSection`, `NFCDemoSection`, `PricingSection`, `ComparisonSection`, `SocialProofSection`, `FAQSection` — connectées à l'i18n. Elles ne sont **pas** utilisées par l'accueil actuel (`Index.tsx`), qui recode tout en jargon. La refonte de l'accueil consiste largement à assembler ces briques existantes autour d'un hero clair.

## 8. Modèle NFC (résumé)

- Modèle « **NFC-as-URL** » : la puce contient une URL HTTPS pré-encodée à la fabrication (pas d'écriture NFC dans l'app). Un tap ouvre le navigateur sur cette URL.
- L'URL cible la carte via son **`slug`** (`prenom-nom-<base36>`), pas un id séquentiel.
- Le QR de secours encode la même URL profil.
- **À corriger/compléter :** identifiant public opaque non dérivable, cycle de vie (suspend/remplacement/transfert), activation liant réellement la carte au compte (voir AUDIT P1-ACT, P2-LIFECYCLE et ROADMAP Étape NFC). Le format cible recommandé est `https://i-wasp.com/n/{identifiant-public}`.

## 9. Mobile (Capacitor)

- `appId: app.iwasp.digital`, `appName: IWASP`, `webDir: dist`.
- iOS : scheme `IWASP`, Associated Domains `applinks:i-wasp.com`, Info.plist déclare NFC/Camera/Photos/Contacts/Location (textes FR).
- Plugins natifs : Haptics, SplashScreen, StatusBar.
- **À corriger :** AASA avec bundle Lovable + placeholders, incohérence de scheme, ATS ouvert (voir AUDIT P0-4, P2-SCHEME et APP_STORE_CHECKLIST).

## 10. `i-wasp-studio` (dépôt satellite)

Site vitrine + générateur de sites IA, **standalone** sous `i-wasp-studio.com`. Même stack front (Vite/React/shadcn/Supabase) mais **sans base de données ni auth** : la seule fonction réelle est l'edge function `generate-website` (proposition JSON via passerelle Lovable) ; commande, déploiement et paiement sont **simulés** (WhatsApp / modales). À considérer comme un funnel marketing, pas un produit backend. Voir AUDIT annexe.

---

*Pour l'état des correctifs et la feuille de route, voir `ROADMAP.md`. Pour les variables d'environnement, voir `ENVIRONMENT.md`.*
