# i-wasp

Plateforme premium de **cartes de visite NFC** et d'**identité digitale**.

Une carte NFC premium. Une identité digitale toujours à jour. Un contact suffit pour partager toutes vos informations — **aucune application requise** pour la personne qui reçoit.

## Stack

- **Frontend** : Vite + React 18 + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion
- **Backend** : Supabase (PostgreSQL, Auth, Storage, Edge Functions Deno)
- **Paiements** : Stripe · **Emails** : Resend · **Wallet** : Apple PassKit / Google Wallet
- **Mobile** : Capacitor (iOS & Android) · **PWA** : vite-plugin-pwa (Workbox)
- **i18n** : i18next (français langue primaire)

## Démarrage

Prérequis : Node.js 18+ et npm.

```sh
# Installer les dépendances
npm install

# Copier le modèle d'environnement et renseigner les valeurs
cp .env.example .env

# Lancer le serveur de développement
npm run dev
```

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement (port 8080) |
| `npm run build` | Build de production |
| `npm run build:dev` | Build en mode développement |
| `npm run lint` | Analyse ESLint |
| `npm run preview` | Prévisualisation du build |

## Variables d'environnement

Voir [`ENVIRONMENT.md`](./ENVIRONMENT.md) — **noms uniquement**, jamais de valeurs.
Le frontend n'utilise que des clés publiques (`VITE_SUPABASE_*`). Tous les secrets
(Stripe, Resend, service-role, wallet…) sont configurés côté Supabase Edge Functions.

## Documentation

| Document | Contenu |
|----------|---------|
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Architecture, stack, routes, base de données, NFC, mobile |
| [`AUDIT.md`](./AUDIT.md) | Audit technique, problèmes classés P0→P3 |
| [`ROADMAP.md`](./ROADMAP.md) | Feuille de route priorisée + journal des modifications |
| [`APP_STORE_CHECKLIST.md`](./APP_STORE_CHECKLIST.md) | Conformité et soumission iOS/Android |
| [`ENVIRONMENT.md`](./ENVIRONMENT.md) | Variables d'environnement (noms) |
| [`PROTECTED_FILES.md`](./PROTECTED_FILES.md) | Fichiers clients à ne pas modifier |

## Application mobile

Le projet embarque Capacitor. Après un `npm run build` :

```sh
npx cap sync
npx cap open ios      # ou android
```

Voir [`APP_STORE_CHECKLIST.md`](./APP_STORE_CHECKLIST.md) pour la préparation de la soumission.

## Licence

Propriétaire — © i-wasp. Tous droits réservés.
