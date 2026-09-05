# ENVIRONMENT — i-wasp

> Ce document liste **uniquement les noms** des variables d'environnement.
> **Aucune valeur secrète ne doit figurer ici** ni être commitée dans le dépôt.
> Les valeurs se configurent dans : le fichier `.env` local (frontend, non commité), et le tableau de bord **Supabase → Project Settings → Edge Functions → Secrets** (backend).

## 1. Frontend (Vite — préfixe `VITE_`, exposées au navigateur)

Fichier : `.env` (à la racine). Ces valeurs sont **publiques par conception** (clé anon/publishable) — elles ne sont pas des secrets, mais `.env` ne devrait pas être suivi par git (voir note ci-dessous).

| Nom | Description | Utilisé dans |
|-----|-------------|--------------|
| `VITE_SUPABASE_URL` | URL du projet Supabase | `src/integrations/supabase/client.ts` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clé anon/publishable Supabase (rôle `anon`) | `src/integrations/supabase/client.ts` |
| `VITE_SUPABASE_PROJECT_ID` | Identifiant du projet Supabase | `.env` (référence) |

## 2. Backend (Supabase Edge Functions — `Deno.env.get`, SECRETS)

À définir dans **Supabase → Edge Functions → Secrets**. **Ne jamais** exposer côté frontend.

| Nom | Description | Fonctions concernées |
|-----|-------------|----------------------|
| `SUPABASE_URL` | URL du projet (injectée automatiquement) | toutes |
| `SUPABASE_ANON_KEY` | Clé anon (injectée automatiquement) | plusieurs |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service-role (**contourne la RLS — ultra-sensible**) | fonctions à écriture privilégiée |
| `IWALLET_CARD_BASE_URL` | Origine HTTPS publique de l’API iwallet-card utilisée en repli par `resolve-card` (jamais fournie par le navigateur) | `resolve-card` |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe (`sk_live_...`) | toutes les fonctions de paiement |
| `STRIPE_WEBHOOK_SECRET` | **⚠️ MANQUANTE — requise pour sécuriser `stripe-webhook`** (voir AUDIT P0-2) | `stripe-webhook` |
| `RESEND_API_KEY` | Clé API Resend (emails) | `send-*-email`, `send-admin-alert`, `send-webstudio-*` |
| `ADMIN_EMAIL` | Email du fondateur/admin (bootstrap + alertes) | `bootstrap-admin`, `send-admin-alert` |
| `AI_GATEWAY_URL` | URL du endpoint IA compatible OpenAI (`.../v1/chat/completions`) — **aucun fournisseur n'est écrit en dur dans le code** | fonctions `generate-*`, `webstudio-chat`, `smart-suggestions`, `adaptive-template`, `regenerate-text` |
| `AI_GATEWAY_API_KEY` | Clé d'API du fournisseur IA choisi | idem |
| `VAPID_PRIVATE_KEY` | Clé privée VAPID (Web Push) | `send-push-*` |
| `VAPID_PUBLIC_KEY` | Clé publique VAPID (probablement requise côté client/SW) | Web Push |
| `PASSKIT_API_KEY` | Clé API PassKit (Apple Wallet) | `apple-wallet` |
| `PASSKIT_API_SECRET` | Secret API PassKit | `apple-wallet` |
| `PASSKIT_JWT_TOKEN` | Jeton JWT PassKit | `apple-wallet` |
| `GOOGLE_WALLET_SERVICE_ACCOUNT_JSON` | JSON du compte de service Google Wallet | `google-wallet` |
| `FIRECRAWL_API_KEY` | Clé API Firecrawl (scraping) | `scrape-website` |

## 3. i-wasp-studio (dépôt satellite)

**Frontend (`.env`) :**
| Nom | Description |
|-----|-------------|
| `VITE_SUPABASE_URL` | URL du projet Supabase (studio) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clé anon/publishable |
| `VITE_SUPABASE_PROJECT_ID` | Identifiant du projet |

**Backend (edge function `generate-website`) :**
| Nom | Description |
|-----|-------------|
| `AI_GATEWAY_URL` | URL du endpoint IA compatible OpenAI |
| `AI_GATEWAY_API_KEY` | Clé d'API du fournisseur IA choisi |

## Notes de sécurité

1. **`.env` est actuellement suivi par git** dans les deux dépôts. Il ne contient que des clés publishable/anon (publiques par conception), donc **pas de fuite de secret** — mais par hygiène, `.env` devrait être retiré du suivi et ajouté à `.gitignore`, avec un `.env.example` listant les noms seuls. (Voir ROADMAP — autonomie du dépôt / hygiène.)
2. **`STRIPE_WEBHOOK_SECRET` est absente** et doit être ajoutée pour corriger la faille P0-2 (webhook Stripe non signé).
3. **Aucune clé secrète (`sk_`, service-role, Resend, PassKit) n'est présente dans le frontend** — vérifié. Elles ne doivent y figurer sous aucune forme.
4. Rotation recommandée pour tout secret ayant pu transiter par un environnement partagé (ex. mots de passe wifi présents dans un seed de migration — AUDIT P3-WIFI-SEED).
