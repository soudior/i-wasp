# MANUAL_ACTIONS — Actions manuelles restantes (i-wasp)

> Tout ce qui suit **ne peut pas être fait depuis le dépôt** : cela requiert un
> accès à un service externe (Stripe, Supabase, Apple) ou une valeur qui vous
> est propre. Le code et la configuration côté dépôt sont **déjà prêts**.
>
> 🔒 **Règle de sécurité :** ne collez **jamais** une clé secrète dans une
> conversation, dans le code, ni dans GitHub. Les secrets se saisissent
> uniquement dans les tableaux de bord sécurisés indiqués ci-dessous.

Légende : ☐ à faire · 🔑 nécessite un secret (à saisir dans un dashboard, jamais ici).

---

## 1. Stripe — sécuriser le webhook (P0)

**Contexte :** le code du webhook (`supabase/functions/stripe-webhook/index.ts`)
vérifie désormais la signature Stripe et **refuse** tout événement non signé
(fail-closed). Il lui faut le secret de signature du endpoint.

1. ☐ Ouvrir **Stripe → Developers → Webhooks** (https://dashboard.stripe.com/webhooks).
2. ☐ Créer (ou ouvrir) le endpoint pointant vers votre fonction :
   `https://<PROJECT_REF>.supabase.co/functions/v1/stripe-webhook`
   - Événements à écouter : `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`.
3. 🔑 Copier le **Signing secret** du endpoint (commence par `whsec_…`).
4. 🔑 Le saisir dans **Supabase → Project Settings → Edge Functions → Secrets**,
   nom exact : `STRIPE_WEBHOOK_SECRET`. (Ne pas le mettre ailleurs.)
5. ☐ Redéployer la fonction : `supabase functions deploy stripe-webhook`.
6. ✅ **Vérifier :** dans Stripe → Webhooks → « Send test event » (`checkout.session.completed`).
   Réponse attendue : `200`. Un POST sans signature valide doit renvoyer `400`.

> Rappel : `STRIPE_SECRET_KEY` doit déjà être configuré dans les secrets Supabase
> (utilisé par toutes les fonctions de paiement).

---

## 2. Supabase — appliquer les migrations

**Contexte :** deux migrations de sécurité sont prêtes dans `supabase/migrations/`.

1. ☐ Se connecter au projet : `supabase link --project-ref <PROJECT_REF>`.
2. ☐ Revoir puis appliquer :
   - `20260806000000_fix_blog_tokens_rls_lockdown.sql` — referme l'accès public aux tokens d'édition de blog.
   - `20260806000001_random_serial_code.sql` — code d'activation aléatoire pour les **nouvelles** cartes (aucun impact sur les cartes déjà imprimées).
   - `20260806000002_storage_bucket_limits.sql` — limites MIME/taille sur les buckets d'images (`card-assets`, `stories`). Sûr, sans effet de bord.
   - Commande : `supabase db push` (ou coller le SQL dans **Supabase → SQL Editor**).
3. ✅ **Vérifier (blog tokens) :** avec la clé anon, `select * from website_blog_tokens`
   doit renvoyer **0 ligne** ; l'édition de blog (service-role) doit toujours fonctionner.
4. ✅ **Vérifier (serial) :** créer une carte de test → son `serial_code` ne doit
   plus correspondre aux 12 premiers caractères hex de son `id`.

**Migrations complémentaires (à décider) :** voir `SECURITY_NOTES.md` pour les
drafts + mises en garde (scoping du storage, RPC wifi, activation liée au compte,
gardes des fonctions IA). Elles nécessitent une revue car elles touchent des
dépendances frontend ou des données de production.

---

## 3. Universal Links (iOS) & App Links (Android)

**Contexte :** le fichier `public/apple-app-site-association` (et sa copie
`public/.well-known/apple-app-site-association`) utilise désormais le bon
bundle id `app.iwasp.digital`. Il reste **une** valeur à insérer : votre **Team ID** Apple.

1. ✅ **Team ID récupéré : `Y4JV4X2DJ6`** (Apple Developer → Membership).
2. ✅ **Renseigné dans l'AASA** (`Y4JV4X2DJ6.app.iwasp.digital`) :
   - `public/apple-app-site-association`
   - `public/.well-known/apple-app-site-association`
3. ☐ Déployer le site et **vérifier** que l'AASA est servi :
   - `https://i-wasp.com/.well-known/apple-app-site-association`
   - en `Content-Type: application/json`, **sans redirection** (HTTP 200 direct).
     (Le `_redirects` sert les fichiers statiques en priorité ; vérifier tout de même.)
4. ☐ **Android :** générer `assetlinks.json` avec l'empreinte SHA-256 de votre clé
   de signature (`keytool -list -v -keystore <votre.keystore>`), le placer à
   `https://i-wasp.com/.well-known/assetlinks.json` avec le package `app.iwasp.digital`.
5. ✅ **Vérifier :** valider l'AASA via https://branch.io/resources/aasa-validator/
   ou l'outil Apple ; tester un lien `https://i-wasp.com/card/<slug>` sur un appareil réel.

> Note technique : le `scheme: 'IWASP'` dans `capacitor.config.ts` est le schéma
> **interne** du serveur local WKWebView de Capacitor — il est distinct du schéma
> de deep-link `iwasp://` (déclaré dans l'Info.plist). Ne pas les confondre ni les
> « fusionner » : changer le scheme interne modifie l'origine et le stockage local
> de l'app.

---

## 4. Build iOS (Xcode) & App Store Connect

**Contexte :** `capacitor.config.ts` est nettoyé (plus de serveur de dev distant).
Voir aussi `APP_STORE_CHECKLIST.md`.

### Préparation du projet natif
1. ☐ `npm run build && npx cap sync ios`.
2. ☐ Ouvrir dans Xcode : `npx cap open ios`.
3. ☐ Dans Xcode → Signing & Capabilities : sélectionner votre **Team**, activer
   **Associated Domains** (`applinks:i-wasp.com`, `applinks:www.i-wasp.com`).
4. ☐ Renseigner **version** (CFBundleShortVersionString, ex. `1.0.0`) et **build**
   (CFBundleVersion, ex. `1`).
5. ☐ Générer le jeu d'icônes depuis `public/app-icon-1024.png`
   (`npx capacitor-assets generate` ou l'outil de votre choix).
6. ☐ Restreindre l'ATS : dans `ios-config/Info.plist.template`, retirer
   `NSAllowsArbitraryLoads=true` ou le limiter aux domaines nécessaires (App Review
   le questionne systématiquement).

### App Store Connect
7. ☐ Créer l'app dans **App Store Connect** (https://appstoreconnect.apple.com)
   avec le bundle id `app.iwasp.digital`.
8. ☐ Récupérer l'**App ID numérique** (Apple ID de l'app, ex. `6740000000`).
   *(Non secret.)*
9. ☐ Remplacer le placeholder `YOUR_APP_ID` dans `index.html` (2 occurrences :
   `apple-itunes-app` et `ios-app://YOUR_APP_ID`) par cet identifiant numérique.
10. ☐ Renseigner la **App Privacy** (données collectées : scans, emails, leads,
    analytics) et lier la **politique de confidentialité** (page `/privacy`).
11. ☐ **Obligatoire si création de compte in-app :** ajouter une **suppression de
    compte** dans l'app (Guideline 5.1.1(v)).
12. ☐ **Obligatoire si connexion Google proposée :** ajouter **Sign in with Apple**
    (Guideline 4.8), ou retirer la connexion sociale tierce du build store.
13. ☐ Archive Xcode → distribuer sur **TestFlight** → tester sur appareil réel
    (NFC, deep links, wallet) → soumettre.

---

## 5. Récapitulatif des secrets (à saisir uniquement dans les dashboards)

| Secret | Où le saisir | Jamais |
|--------|--------------|--------|
| `STRIPE_WEBHOOK_SECRET` (`whsec_…`) | Supabase → Edge Functions → Secrets | chat / code / GitHub |
| `STRIPE_SECRET_KEY` (`sk_…`) | Supabase → Edge Functions → Secrets | chat / code / GitHub |
| `RESEND_API_KEY`, `VAPID_*`, `PASSKIT_*`, `GOOGLE_WALLET_*`, `FIRECRAWL_API_KEY` | Supabase → Edge Functions → Secrets | chat / code / GitHub |

Valeurs **non secrètes** (peuvent aller dans le code/config) : Team ID Apple,
App ID numérique App Store, empreinte SHA-256 de signature Android, `PROJECT_REF` Supabase.

---

## 6. Ce qui est déjà prêt dans le dépôt (aucune action de code nécessaire)

- ✅ Webhook Stripe : vérification de signature implémentée (attend `STRIPE_WEBHOOK_SECRET`).
- ✅ Migration RLS blog-tokens + migration serial_code aléatoire.
- ✅ AASA corrigé sur `app.iwasp.digital` (+ copie `.well-known/`), chemins `/c/*`, `/card/*`, `/n/*`.
- ✅ Capacitor : bloc serveur Lovable retiré.
- ✅ `ENVIRONMENT.md` : liste des noms de variables (sans valeurs).
