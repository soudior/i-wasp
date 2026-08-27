# VERIFICATIONS — Contrôles de conformité (i-wasp)

> Résultats des 5 vérifications demandées. Statut : ✅ vérifié · ⚠️ à confirmer sur
> l'environnement de production · 🔧 corrigé dans ce lot.

---

## 1. `public/_headers` est-il réellement supporté par l'hébergeur ? ✅ RÉSOLU 🔧

**Réponse : NON — et c'était un vrai bug.** L'hébergeur de production est
**Vercel** (présence de `vercel.json` avec les rewrites SPA). Or `public/_headers`
est une convention **Netlify / Cloudflare Pages** : Vercel l'ignore purement et
simplement. Le fichier AASA était donc servi **sans** `Content-Type:
application/json` → **les Universal Links iOS ne pouvaient pas fonctionner**
(un lien `i-wasp.com/card/...` ouvrait Safari au lieu de l'app).

**Correction 🔧 :** la règle a été portée dans **`vercel.json`** :

```json
"headers": [
  { "source": "/.well-known/apple-app-site-association",
    "headers": [{ "key": "Content-Type", "value": "application/json" }] },
  { "source": "/apple-app-site-association",
    "headers": [{ "key": "Content-Type", "value": "application/json" }] }
]
```

Ordre de routage Vercel : `redirects` → `headers` → système de fichiers →
`rewrites`. Le fichier statique est donc servi **avant** la règle SPA
`/(.*) → /index.html`, avec le bon en-tête.

**Verrouillé par un test** (`src/config/vercel.test.ts`) : plusieurs agents
modifient ce dépôt, la règle ne peut plus disparaître silencieusement.
`public/_headers` est conservé, annoté comme inerte sur Vercel, au cas où
l'hébergement changerait.

**Test de prod (à faire après déploiement) :**
`curl -sI https://i-wasp.com/.well-known/apple-app-site-association`
→ attendu `HTTP/2 200` + `content-type: application/json`, sans redirection.

## 2. Les chemins AASA correspondent-ils aux vraies URLs publiques ? ✅🔧

**Constat :** l'AASA déclarait `/c/*`, `/card/*`, `/n/*`. Audit des routes
(`src/App.tsx`) :
- `/c/:slug` → `LegacyCardRedirect` ✅ existe.
- `/card/:slug` → `PublicCard` ✅ existe.
- `/n/*` → **aucune route** (seuls `/nfc-success` et `/nails` existent).

**Correction 🔧 :** `/n/*` retiré des deux fichiers AASA
(`public/apple-app-site-association` et `public/.well-known/apple-app-site-association`).
Chemins restants : `/c/*`, `/card/*` — tous adossés à de vraies URLs.

**À décider (produit) :** si l'URL courte NFC canonique doit être `i-wasp.com/n/{public-id}`,
il faut **d'abord créer la route** `/n/:publicId`, **puis** rajouter `/n/*` à l'AASA.
Tant que la route n'existe pas, l'inclure dans l'AASA pointerait vers du vide.

---

## 3. La suppression de compte empêche-t-elle toute reconnexion ? ✅

**Vérification :** `delete-account` appelle `admin.auth.admin.deleteUser(userId)`,
qui supprime la ligne `auth.users` **et toutes ses identités** (email, Google, Apple)
et révoque toutes les sessions. Conséquences :
- Connexion email/mot de passe → impossible (utilisateur inexistant).
- Google / Apple → l'identité liée n'existe plus ; une nouvelle connexion crée un
  **compte neuf et vide**, sans accès aux anciennes données.
- Sessions actives → invalidées.

En complément, la révocation du jeton Apple (§5 `SIGN_IN_WITH_APPLE.md`) coupe aussi
l'autorisation côté Apple lorsque configurée.

---

## 4. La commande anonymisée ne conserve-t-elle aucune donnée identifiante ? ✅🔧

**Renforcement 🔧 :** l'anonymisation des `orders` efface désormais **toutes** les
colonnes pouvant identifier directement la personne :

| Effacé / neutralisé | Valeur après |
|---------------------|--------------|
| `user_id` | UUID sentinelle `00000000-…-000000000000` |
| `customer_email` | `deleted@anonymized.local` |
| `shipping_name` | `Utilisateur supprimé` |
| `shipping_phone`, `shipping_address`, `shipping_city`, `shipping_postal_code`, `shipping_country` | `null` |
| `tracking_number` | `null` |
| `order_items` (JSON — peut contenir le nom imprimé) | `[]` |
| `admin_notes` (peut citer le client) | `null` |
| `logo_url`, `background_image_url`, `print_file_url` (URLs pouvant encoder un nom) | `null` |

**Conservé (non identifiant, obligations comptables) :** `order_number`, `quantity`,
`unit_price_cents`, `total_price_cents`, `currency`, `order_type`, `template`,
`status`, dates (`created_at`, `paid_at`, …).

> Note : `orders.user_id` est `NOT NULL` et **sans** clé étrangère vers `auth.users`
> (vérifié dans la migration de création) → la suppression du compte Auth ne casse
> rien et ne supprime pas la commande ; l'anonymisation par sentinelle est donc sûre.

---

## 5. `delete-account` n'est déployée qu'après revue complète ? ✅

- **Non déployée.** Le dépôt contient le **code** + l'enregistrement
  `supabase/config.toml` (`verify_jwt = true`), mais **aucun déploiement** n'a été
  effectué (et ne peut l'être d'ici : pas d'accès Supabase).
- Bandeau **« NE PAS DÉPLOYER AVANT REVUE COMPLÈTE »** ajouté en tête du fichier
  `supabase/functions/delete-account/index.ts`.
- Procédure de déploiement (après revue) + test de non-reconnexion : `APP_STORE_LISTING.md` §2/§8.

---

## Récapitulatif build (ce lot)

`npm run build` ✅ · `npm run typecheck` ✅ · `npm run lint` ✅ (0 erreur) ·
`npm run test` ✅ (58 tests, dont `appleAuth` 12 + `accountDeletion` 6).
