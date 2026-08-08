# SIGN_IN_WITH_APPLE — Configuration & implémentation (i-wasp)

> Sign in with Apple est **requis** (Guideline 4.8) car l'app propose Google OAuth
> pour le compte principal. Décision produit : **conserver Google ET ajouter Apple**.
>
> 🔒 **Aucune clé `.p8`, aucun secret, aucun mot de passe dans le chat ni dans
> GitHub.** Les secrets se saisissent uniquement dans les dashboards sécurisés
> indiqués ci-dessous. Ce document ne contient que des **noms** de variables.

---

## 1. Ce qui est déjà fait dans le dépôt (aucun secret requis)

| Élément | Fichier |
|---------|---------|
| Bouton « Continuer avec Apple » conforme HIG (fond noir, logo Apple, ≥44pt) | `src/components/auth/AppleSignInButton.tsx` |
| Logique nonce (SHA-256), détection e-mail relais, classification d'erreurs | `src/lib/appleAuth.ts` (+ tests `appleAuth.test.ts`) |
| Orchestration web (`signInWithOAuth`) + iOS natif (`signInWithIdToken`) | `src/hooks/useAppleAuth.ts` |
| Bouton intégré aux écrans Connexion & Inscription | `src/pages/Login.tsx`, `src/pages/Signup.tsx` |
| Liaison à un compte existant (anti-doublon) | `useAppleAuth().linkAppleIdentity()` |
| Révocation des jetons Apple à la suppression de compte (best-effort, gated) | `supabase/functions/delete-account/index.ts` |

**Web → flux OAuth Supabase classique** (`signInWithOAuth`, redirection navigateur,
échange `?code=` automatique via PKCE/`detectSessionInUrl` — parcours inchangé).

**iOS Capacitor → flux OAuth mobile COMPLET** (`src/lib/nativeOAuth.ts`) — pas une
auth enfermée dans la WebView :
1. `signInWithOAuth({ skipBrowserRedirect: true })` → URL d'autorisation (PKCE,
   `code_verifier` stocké par supabase-js) ;
2. ouverture dans le **navigateur système** (`@capacitor/browser`, SFSafariViewController) ;
3. Apple → callback Supabase (state vérifié côté Supabase) → redirection **deep link**
   `iwasp://auth/callback?code=…` ;
4. iOS rouvre l'app → écoute **`appUrlOpen`** (`@capacitor/app`) → **validation
   stricte** de l'URL (`isNativeOAuthCallback`, testée) ;
5. **`exchangeCodeForSession(code)`** — n'aboutit que si le `code_verifier` PKCE
   local correspond (un code intercepté est inutilisable) ;
6. **fermeture du navigateur** + retrait des listeners ; **annulation** (navigateur
   fermé, `error=access_denied`, timeout 5 min) gérée sans erreur bloquante ;
   **aucun token ni URL de callback dans les logs**.

> Note toolchain (cause racine des échecs Swift en CI, diagnostiquée sur les
> `.swiftinterface` du binaire) : `capacitor-swift-pm` 8.x est compilé avec
> **Swift 6.2 (Xcode 26)** et une partie de son API publique (`call.reject`,
> `getString` à 1 argument, `bridge.viewController`, `color(fromHex:)`) est émise
> derrière `#if compiler(>=5.3) && $NonescapableTypes` — **invisible** pour un
> compilateur plus ancien. Les runners `macos-14` (Xcode 16.2) échouaient donc sur
> quasiment tous les plugins. **Correctif : runners `macos-26` (Xcode 26)** dans les
> deux workflows. Conséquences : `@capacitor/app@8.1.1` et `@capacitor/browser@8.0.4`
> compilent **sans patch** ; `status-bar`/`splash-screen` (retirés plus tôt sur la
> base d'un diagnostic devenu obsolète) sont **réintégrables** plus tard si besoin.
> `@capacitor-community/apple-sign-in` (feuille native) reste lui réellement
> incompatible (épingle `capacitor-swift-pm` 7.x → conflit SPM) ; les utilitaires de
> nonce (`src/lib/appleAuth.ts`) restent prêts pour le réactiver.

### URLs exactes à enregistrer (mobile + web)

| Où | Champ | Valeur exacte |
|----|-------|---------------|
| Apple Developer → Services ID → Sign In with Apple → **Return URLs** | Return URL | `https://<PROJECT_REF>.supabase.co/auth/v1/callback` |
| Apple Developer → Services ID → **Domains** | Domain | `<PROJECT_REF>.supabase.co` et `i-wasp.com` |
| Supabase → Authentication → **URL Configuration → Redirect URLs** | Redirect URL | `iwasp://auth/callback` (mobile) |
| Supabase → Redirect URLs (web, déjà requis) | Redirect URL | `https://i-wasp.com/**` et `https://www.i-wasp.com/**` |
| Info.plist (déjà dans `ios-config/Info.plist.template`) | URL scheme | `iwasp` |

⚠️ Sans `iwasp://auth/callback` dans les Redirect URLs Supabase, le retour mobile
échouera silencieusement (Supabase refuse la redirection).

### Statut de vérification — à ne pas confondre

- ✅ **Compilation** : le flux (plugins inclus) compile en CI (workflow non signé).
- ✅ **Logique testée** : validation d'URL / extraction code / erreurs (tests unitaires).
- ☐ **Connexion réelle sur iPhone** : NON testée — nécessite build signé + appareil
  + provider Apple configuré dans Supabase. À faire via TestFlight (checklist
  `APP_STORE_CHECKLIST.md` §7ter) avant toute soumission.

---

## 2. Actions Apple Developer (developer.apple.com)

1. ☐ **Certificates, Identifiers & Profiles → Identifiers → App ID `app.iwasp.digital`** :
   cocher la capability **Sign In with Apple**, enregistrer.
2. ☐ **Identifiers → ＋ → Services IDs** : créer un Services ID (ex. `app.iwasp.signin`).
   - Description : `IWASP Sign in`.
   - Activer **Sign In with Apple** → **Configure** :
     - Primary App ID : `app.iwasp.digital`.
     - **Domains and Subdomains** : `i-wasp.com`, `<PROJECT_REF>.supabase.co`.
     - **Return URLs** : `https://<PROJECT_REF>.supabase.co/auth/v1/callback`.
3. ☐ **Keys → ＋** : créer une clé, activer **Sign In with Apple**, Primary App ID
   `app.iwasp.digital`. Télécharger le fichier **`AuthKey_XXXXXXXXXX.p8`**
   (téléchargeable **une seule fois**). Noter le **Key ID** (10 car.).
4. ☐ Noter le **Team ID** : `Y4JV4X2DJ6` (déjà connu).

> Valeurs à conserver précieusement (jamais dans le dépôt) : le fichier `.p8`, le
> **Key ID**, le **Services ID**, le **Team ID**.

---

## 3. Actions Supabase (Authentication → Providers → Apple)

> Dashboard : `https://supabase.com/dashboard/project/<PROJECT_REF>/auth/providers`

1. ☐ Activer le provider **Apple**.
2. 🔑 **Client IDs** : renseigner le **Services ID** (web) **et** le **Bundle ID**
   `app.iwasp.digital` (natif iOS), séparés par une virgule si les deux champs sont
   fusionnés — sinon utiliser les champs dédiés.
3. 🔑 **Secret Key (for OAuth)** : Supabase génère le client secret à partir de :
   **Team ID** `Y4JV4X2DJ6`, **Key ID**, **Services ID**, et le contenu du **`.p8`**.
   Coller ces valeurs **dans le dashboard Supabase uniquement**.
4. ☐ **URL Configuration → Redirect URLs** : ajouter les URLs de retour de l'app
   (`https://i-wasp.com/**`, `https://www.i-wasp.com/**`, et en dev `http://localhost:*`).
5. ☐ **Liaison d'identités par e-mail** : conserver le linking automatique par e-mail
   vérifié (défaut GoTrue) pour éviter les doublons quand l'e-mail Apple correspond.

---

## 4. Anti-doublon & e-mail masqué (« Hide My Email »)

- Si l'utilisateur **ne masque pas** son e-mail : Supabase relie l'identité Apple au
  compte existant portant le même e-mail vérifié → **pas de doublon**.
- Si l'utilisateur **masque** son e-mail : Apple fournit une adresse relais
  (`…@privaterelay.appleid.com`) qui **ne correspond pas** à l'e-mail réel → risque
  de doublon. Mitigations en place :
  1. Un utilisateur **déjà connecté** peut **lier** Apple à son compte via
     `linkAppleIdentity()` (à exposer dans les Réglages) plutôt que d'en recréer un.
  2. `isApplePrivateRelayEmail()` permet à l'UI de ne pas prétendre disposer de
     l'e-mail réel (ex. inviter à compléter le profil).
- ⚠️ Apple ne renvoie le **nom** qu'à la **première** autorisation : le stocker dès
  la première connexion (le flux natif expose `result.response.givenName/familyName`).

---

## 5. Révocation des jetons Apple à la suppression de compte (exigée par Apple)

Apple impose : une app qui permet **création + suppression** de compte **et** propose
Sign in with Apple **doit révoquer** le jeton Apple lors de la suppression.

**Déjà en place (best-effort, non bloquant) :** `delete-account` appelle
`https://appleid.apple.com/auth/revoke` **si** les secrets sont configurés et si un
refresh token Apple est stocké pour l'utilisateur.

**À finaliser (nécessite secrets + décision de stockage du refresh token) :**
1. 🔑 Secrets **Supabase → Edge Functions → Secrets** (noms exacts) :
   - `APPLE_REVOKE_CLIENT_ID` — Services ID (web) ou Bundle ID (natif) selon le jeton.
   - `APPLE_TEAM_ID` — `Y4JV4X2DJ6`.
   - `APPLE_KEY_ID` — Key ID de la clé `.p8`.
   - `APPLE_PRIVATE_KEY` — **contenu** du `.p8` (`-----BEGIN PRIVATE KEY----- …`).
2. ☐ **Stocker le refresh token Apple** dans une table `apple_auth_tokens`
   (migration à préparer : colonnes `user_id`, `refresh_token`, `created_at`, RLS
   service-role uniquement). Le refresh token s'obtient en échangeant le
   `authorizationCode` (flux natif) contre un token, côté serveur, avec le client
   secret. Tant que cette table est absente, la révocation est **ignorée
   proprement** (log `SKIP`), sans bloquer la suppression.

> Même sans révocation, la suppression reste conforme au strict minimum
> (compte + données supprimés, reconnexion impossible) ; la révocation ajoute la
> conformité **complète** exigée par Apple pour SIWA.

---

## 6. Tests

- ✅ Unitaires : `src/lib/appleAuth.test.ts` (nonce, SHA-256 vecteur connu, e-mail
  relais, classification d'erreurs).
- ☐ Manuel **web** : bouton Apple → redirection Apple → retour connecté ; vérifier
  qu'aucun doublon n'est créé pour un e-mail existant.
- ☐ Manuel **iOS** (après build natif) : feuille Apple native → session ouverte ;
  tester « Masquer mon e-mail » ; tester la suppression de compte + révocation.

---

## 7. Récapitulatif des secrets (dashboards uniquement)

| Secret | Où | Jamais |
|--------|-----|--------|
| Clé `.p8` Sign in with Apple | Supabase → Auth → Providers → Apple (client secret) **et** Edge Functions → Secrets (`APPLE_PRIVATE_KEY`) | chat / code / GitHub |
| Key ID, Services ID | Supabase Auth (provider Apple) | chat / code / GitHub |
| `APPLE_REVOKE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY` | Supabase → Edge Functions → Secrets | chat / code / GitHub |

Valeurs **non secrètes** : Team ID `Y4JV4X2DJ6`, Bundle ID `app.iwasp.digital`,
`PROJECT_REF` Supabase.
