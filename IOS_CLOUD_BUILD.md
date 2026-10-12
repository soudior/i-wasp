# IOS_CLOUD_BUILD — Build iOS dans le cloud (sans Mac)

> Deux options prêtes dans le dépôt : **GitHub Actions** (recommandé, le dépôt est
> déjà sur GitHub) et **Codemagic** (alternative). Les deux :
> - génèrent le projet Capacitor iOS, installent CocoaPods, compilent en Release ;
> - **ne se lancent jamais toutes seules** (déclenchement manuel) ;
> - **n'envoient rien à Apple** sans une action de confirmation explicite de votre part.
>
> 🔒 **Jamais de certificat, mot de passe, clé `.p8`, code 2FA dans le chat ni dans
> GitHub/dépôt.** Tous les secrets se saisissent dans les **espaces sécurisés**
> (GitHub Secrets / Codemagic UI) indiqués ci-dessous. Ce document ne contient que
> des **noms** de secrets.

---

## Préflight obligatoire du backend iOS

Les workflows GitHub signé et non signé contrôlent maintenant le backend avant
l’installation des dépendances et la compilation. Les trois variables de dépôt
`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` et
`VITE_SUPABASE_PROJECT_ID` doivent être renseignées ensemble. Une quatrième
variable obligatoire, `IWASP_IOS_APPROVED_PROJECT_ID`, doit désigner le backend
explicitement validé après vérification de son propriétaire, des données attendues
et de son fonctionnement. Elle doit correspondre au projet des trois variables
frontend. Les replis du client
et les fichiers `.env` ne complètent jamais une configuration iOS partielle.

Le 11 octobre 2026, le backend Lovable Cloud du projet original a été identifié
depuis une URL de fonction fournie par la console du propriétaire :
`fyxiyevbbvidckzaequx`. La paire URL/clé publique du site a ensuite été acceptée
par Auth (HTTP 200, email activé). La migration historique de la PR #3 vers
`vwlngxifajsziexhkafe` ne correspond pas à ce backend actif. Cette référence doit
être validée explicitement pour le build ; aucune clé n’est créée ni copiée dans
le code du garde-fou. Le workflow s’arrête si le projet ne correspond pas
à `IWASP_IOS_APPROVED_PROJECT_ID`, si une clé
JWT n’est pas une clé anon du même projet ou si le serveur n’accepte pas la paire
URL/clé. Une clé publishable opaque doit également passer le contrôle serveur.
Ne jamais utiliser une clé secret/service-role dans ces variables frontend.

Le contrôle effectue uniquement un GET `/auth/v1/settings`, avec un délai maximal
de 10 secondes et sans suivre les redirections. Il ne crée pas de compte, ne
connecte pas un utilisateur et ne modifie aucune clé, aucun provider ni aucune
permission. Une erreur réseau, une réponse autre que JSON, un statut HTTP en
échec ou l’absence du provider email bloque le build. Ne pas supprimer ce contrôle
pour contourner un échec : vérifier d’abord la configuration et l’état du backend.

Tests locaux du garde-fou : `npm run test:ios-backend` (Node 22+, sans dépendances).
`npm test` inclut également ces tests après la suite Vitest.

Ce contrôle ne prouve pas que les identifiants de démonstration fonctionnent,
que les politiques de données sont correctes ou que les parcours Apple/Google
sont opérationnels. Un nouvel IPA et un test réel du compte App Review sur
l’appareil restent nécessaires. Une configuration correcte du backend ne règle
pas à elle seule les autres points App Store.

Pour la validation sans coût de cette branche : le workflow non signé exige un
dépôt public et le runner standard `macos-26`. Le cache npm est désactivé et
`save_artifact` reste désactivé par défaut pour ne pas ajouter de stockage
persistant. Aucun binaire téléchargeable n’est conservé dans ce mode. Activer
`save_artifact` exige de vérifier séparément le quota de stockage disponible.
La branche `codex/ios-login-backend-guard` est exclue des déploiements automatiques
Vercel ; les autres branches ne changent pas. Cette validation non signée
n’envoie rien à Apple.

---

## Étape 1 — Valider la compilation (build NON signé, aucun secret)

C'est l'étape à faire en premier. Elle prouve que le projet compile, sans aucune
clé Apple.

**GitHub Actions :**
1. Onglet **Actions** du dépôt → workflow **« iOS Build (unsigned validation) »**.
2. Bouton **Run workflow** (branche de votre choix) → lancer.
3. Résultat attendu : job vert. La dernière étape confirme « Le projet iOS compile ».

> 💸 **Coût :** les runners **macOS** GitHub sont **facturés** sur un dépôt privé
> (≈ 10× les minutes Linux). Le workflow est en **déclenchement manuel** exprès :
> rien ne tourne tant que vous ne cliquez pas. Un build de validation ≈ 10–20 min.

**Codemagic :** connecter le dépôt à Codemagic, puis lancer le workflow
**`ios-unsigned`** (fichier `codemagic.yaml` détecté automatiquement).

Fichiers : `.github/workflows/ios-build-unsigned.yml` · `codemagic.yaml` (`ios-unsigned`).

---

## Étape 2 — Secrets Apple nécessaires pour le build SIGNÉ + TestFlight

Vous avez besoin de **deux** choses côté Apple :

### A. Un certificat de distribution (.p12)
Le certificat **Apple Distribution** + sa clé privée, exportés en un fichier `.p12`
protégé par mot de passe.
- Si vous n'avez pas de Mac pour l'exporter : vous pouvez générer la CSR et le
  certificat via des outils comme **Fastlane** (`fastlane cert`) ou l'assistant de
  Codemagic (qui sait créer/gérer les certificats via l'API App Store Connect —
  dans ce cas le `.p12` n'est même pas nécessaire, voir § Codemagic).

### B. Une clé API App Store Connect (.p8)
**App Store Connect → Users and Access → Integrations → App Store Connect API →**
générer une clé (rôle **App Manager**). Vous obtenez : le fichier
**`AuthKey_XXXXXXXXXX.p8`** (téléchargeable **une seule fois**), un **Key ID**, et un
**Issuer ID**. Cette clé sert à la fois à la **signature automatique** (Xcode gère le
provisioning) et à l'**envoi** vers TestFlight — sans mot de passe ni 2FA.

### Où placer chaque secret (GitHub Actions)

**Settings → Secrets and variables → Actions → New repository secret :**

| Nom du secret (exact) | Contenu | Comment l'obtenir |
|-----------------------|---------|-------------------|
| `IOS_DIST_CERT_P12_BASE64` | le fichier `.p12` encodé en base64 | `base64 -i cert.p12 \| pbcopy` (ou `base64 -w0 cert.p12`) |
| `IOS_DIST_CERT_PASSWORD` | mot de passe du `.p12` | choisi à l'export |
| `APP_STORE_CONNECT_API_KEY_ID` | le **Key ID** (10 car.) | App Store Connect → API |
| `APP_STORE_CONNECT_API_ISSUER_ID` | l'**Issuer ID** (UUID) | App Store Connect → API |
| `APP_STORE_CONNECT_API_KEY_BASE64` | le `.p8` encodé en base64 | `base64 -w0 AuthKey_XXXX.p8` |

**Variable non secrète** (Settings → Secrets and variables → Actions → **Variables**) :

| Nom | Valeur |
|-----|--------|
| `APPLE_TEAM_ID` | `Y4JV4X2DJ6` (facultatif : déjà en valeur par défaut dans le workflow) |

> Rien de tout cela ne doit apparaître dans le chat, le code ou un commit. Le
> workflow lit ces secrets à l'exécution ; ils ne sont jamais journalisés.

### Prérequis Apple Developer (à activer une fois)

Avant un build signé qui embarque les capabilities du projet :
1. **App ID `app.iwasp.digital`** → activer **Associated Domains** et
   **Sign In with Apple** (cf. `SIGN_IN_WITH_APPLE.md`).
2. La signature **automatique** (via la clé API + `-allowProvisioningUpdates`) créera
   / mettra à jour le provisioning profile App Store incluant ces capabilities.

---

## Étape 3 — Build signé + envoi TestFlight (seulement sur votre accord)

**GitHub Actions :** onglet **Actions** → **« iOS TestFlight (signed) »** → **Run workflow**.
- Laisser **`confirm_upload` VIDE** → le workflow **archive** l'app et publie l'**IPA
  comme artefact**, **sans rien envoyer à Apple**. (Idéal pour un premier essai signé.)
- Pour **envoyer réellement** vers TestFlight → saisir exactement
  **`UPLOAD-TO-TESTFLIGHT`** dans `confirm_upload`. C'est le seul cas où un binaire
  part chez Apple.

Fichier : `.github/workflows/ios-testflight.yml`.

**Codemagic :** workflow **`ios-signed`** → produit l'IPA en artefact, **sans envoi**
(aucun bloc `publishing`). Pour activer l'envoi TestFlight après votre accord, ajouter
à ce workflow :
```yaml
    publishing:
      app_store_connect:
        auth: integration
        submit_to_testflight: true
```
et créer l'intégration **App Store Connect** nommée `IWASP_ASC_KEY` dans
**Codemagic → Teams → Integrations** (clé `.p8` + Key ID + Issuer ID saisis dans
l'UI Codemagic, jamais dans le dépôt). Le code signing se gère dans
**Codemagic → Code signing identities** (le `.p12`) ou automatiquement via l'API.

---

## Récapitulatif des garde-fous

| Garantie | Comment |
|----------|---------|
| Aucun lancement automatique | Workflows en `workflow_dispatch` (GitHub) / sans `triggering` (Codemagic). |
| Aucun service payant déclenché à votre insu | Vous lancez chaque build manuellement ; l'étape 1 (validation) ne coûte que quelques minutes macOS. |
| Aucun envoi Apple sans accord | Upload GitHub gated par `confirm_upload = UPLOAD-TO-TESTFLIGHT` ; Codemagic sans bloc `publishing`. |
| Aucun secret dans le dépôt | Tous les secrets en GitHub Secrets / Codemagic UI. |

---

## Séquence recommandée

1. ▶️ Lancer **iOS Build (unsigned validation)** → confirmer que ça compile.
2. 🔑 Ajouter les 5 secrets + la variable ci-dessus (Étape 2).
3. 🍎 Activer les capabilities sur l'App ID (Associated Domains, Sign in with Apple).
4. ▶️ Lancer **iOS TestFlight (signed)** avec `confirm_upload` **vide** → récupérer
   l'IPA en artefact et vérifier l'archive.
5. ✅ Quand vous êtes prêt : relancer avec `confirm_upload = UPLOAD-TO-TESTFLIGHT`.
