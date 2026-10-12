# Plan — En-têtes de sécurité HTTP (CSP + durcissement)

## Domaines tiers détectés (utilisés réellement par le site)

**Connexions réseau (fetch / websocket / pixel) :**
- `fyxiyevbbvidckzaequx.supabase.co` — backend Lovable Cloud (HTTPS + WebSocket `wss:` pour le temps réel)
- `ipapi.co` — détection de devise/pays (CurrencyContext, useGeolocalization)
- `nominatim.openstreetmap.org` — géocodage inverse (adresses)
- `www.googletagmanager.com` / `www.google-analytics.com` — Google Ads tag (injecté par `src/lib/analytics.ts`)
- `connect.facebook.net` / `graph.facebook.com` / `www.facebook.com` — Meta Pixel
- `hooks.zapier.com` — webhooks CRM

**Scripts externes :** `www.googletagmanager.com`, `connect.facebook.net` (injectés dynamiquement par analytics.ts). Polices auto-hébergées via @fontsource — **aucun Google Fonts** à autoriser.

**Images externes :** `images.unsplash.com`, `placehold.co`, storage Supabase, `data:`/`blob:` (QR codes, vCard, canvas).

**Iframes :** `www.google.com` / `maps.google.com` (cartes Google Maps intégrées), `open.spotify.com`, `www.youtube.com` (lecteurs intégrés).

**Pas de Stripe.js côté navigateur** (paiements par redirection vers Stripe Checkout — un simple lien, pas concerné par la CSP).

## Changements (2 fichiers, aucun code applicatif touché)

### 1. `vercel.json` — ajout d'un bloc `headers` global (`source: "/(.*)"`)

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://images.unsplash.com https://placehold.co https://fyxiyevbbvidckzaequx.supabase.co https://www.facebook.com;
  font-src 'self' data:;
  connect-src 'self' https://fyxiyevbbvidckzaequx.supabase.co wss://fyxiyevbbvidckzaequx.supabase.co https://ipapi.co https://nominatim.openstreetmap.org https://www.google-analytics.com https://www.googletagmanager.com https://graph.facebook.com https://hooks.zapier.com;
  frame-src https://www.google.com https://maps.google.com https://open.spotify.com https://www.youtube.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
  upgrade-insecure-requests

Strict-Transport-Security: max-age=63072000; includeSubDomains
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(self)
```

Choix assumés (mode non destructif) :
- `'unsafe-inline'` en script/style : **indispensable** — le script de garde-fou inline dans `index.html`, les styles inline du thème et les snippets Meta/Google injectés planteraient sinon. Objectif : CSP fonctionnelle, pas la plus stricte.
- `geolocation=(self)` : le site **utilise** la géolocalisation (détection d'adresse) — on ne la désactive pas.
- `frame-ancestors 'self'` + `X-Frame-Options: SAMEORIGIN` : anti-clickjacking, sans impact car le site n'est pas intégré en iframe ailleurs.
- Les règles AASA existantes dans `vercel.json` sont conservées telles quelles (le test `src/config/vercel.test.ts` doit rester vert).

### 2. `public/_headers` — miroir des mêmes en-têtes
Inerte sur Vercel mais conservé pour portabilité (Netlify/Cloudflare) ; on y ajoute les mêmes règles pour rester cohérent.

## Vérifications
1. `npm run test` (le test vercel.test.ts doit toujours passer) + typecheck.
2. Build de production local, puis vérification que la page démarre (le garde-fou inline doit être couvert par `'unsafe-inline'`).
3. Test Playwright sur la preview : page d'accueil + une carte publique — aucune erreur CSP « Refused to load » en console.

## Hors périmètre
- Aucune publication (tu publieras toi-même après validation).
- Aucun changement de design, contenu, routes ou données.
