# APP_STORE_CHECKLIST — i-wasp (iOS & Android)

> Checklist de mise en conformité et de soumission des applications mobiles (Capacitor).
> Statut : ☐ à faire · ⚠️ partiel / à corriger · ✅ fait.
> Réfs croisées : voir `AUDIT.md` (P0-4, P2-SCHEME) et `STORE_DEPLOYMENT_GUIDE.md`.

## 1. Identité de l'application

| Item | Statut | Détail |
|------|--------|--------|
| Bundle identifier iOS/Android définitif | ✅ | **`app.iwasp.digital`** — unifié partout : `capacitor.config.ts`, AASA (+ `.well-known/`), `CFBundleURLName` (Info.plist), meta Android (`index.html`), `id` du manifest PWA, et toute la doc. Aucune référence `com.iwasp.app` ni Lovable restante. |
| Team ID Apple | ✅ | `Y4JV4X2DJ6` renseigné dans l'AASA (`Y4JV4X2DJ6.app.iwasp.digital`). Compte inscrit au Apple Developer Program. |
| App ID numérique App Store | ✅ | **`6799452085`** renseigné dans `index.html` (`apple-itunes-app` + `ios-app://`). Fiche créée dans App Store Connect (SKU `IWASP-IOS-001`). |
| Nom d'affichage | ✅ | `IWASP` (`capacitor.config.ts`). |
| Numéro de version / build | ⚠️ | Cible **version 1.0** / build 1. À définir dans Xcode (`CFBundleShortVersionString = 1.0`, `CFBundleVersion = 1`) lors de la génération du projet. |

## 2. Deep links & Universal Links

| Item | Statut | Détail |
|------|--------|--------|
| Scheme deep-link `iwasp://` | ✅ | Déclaré dans `Info.plist.template`. Le `scheme:'IWASP'` de Capacitor est le schéma **interne** du serveur WKWebView (distinct, à ne pas confondre). |
| Associated Domains (iOS) | ✅ | Déclarés (`applinks:i-wasp.com` / `www.i-wasp.com`) dans `Info.plist.template` + fichier d'entitlements prêt (`ios-config/App.entitlements`). À activer dans Xcode (capability). |
| `apple-app-site-association` | ✅ | `appID = Y4JV4X2DJ6.app.iwasp.digital`, présent en racine **et** `.well-known/`. Reste : le servir en `application/json` sans redirection à la mise en ligne. |
| `assetlinks.json` (Android) | ☐ | À générer avec le SHA-256 de la clé de signature (voir MANUAL_ACTIONS §3), package `app.iwasp.digital`. |
| Universal Links testés | ☐ | À valider sur appareil réel **après déploiement** du site (AASA servi) + build iOS. |

## 3. Icônes & écrans

| Item | Statut | Détail |
|------|--------|--------|
| Icône app 1024×1024 | ✅ | `public/app-icon-1024.png`. |
| Jeu d'icônes iOS/Android complet | ☐ | À générer depuis la source 1024 (Capacitor assets). |
| Launch screen / SplashScreen | ✅ | Configuré (`capacitor.config.ts`), fond `#000000`. |
| Icônes PWA (web) | ✅ | Corrigé : manifest pointe vers `public/icons/*x*.png` (AUDIT P0-3 résolu). |

## 4. Permissions (iOS) — textes explicatifs

| Item | Statut | Détail |
|------|--------|--------|
| Descriptions d'usage (NFC, Camera, Photos, Contacts, Location) | ✅ | Présentes en FR dans `ios-config/Info.plist.template`. |
| Permissions minimales | ⚠️ | Vérifier que chaque permission déclarée est réellement utilisée ; retirer les superflues. |
| ATS (`NSAllowsArbitraryLoads`) | ⚠️ | Actuellement `true` → **App Review le questionnera**. Restreindre aux domaines nécessaires (AUDIT P2). |

## 5. Confidentialité & conformité App Store

| Item | Statut | Détail |
|------|--------|--------|
| Politique de confidentialité accessible | ⚠️ | Page `/privacy` existe → publier une URL stable et la lier dans la fiche store. |
| Déclaration des données collectées (App Privacy) | ✅ | Réponses prêtes dans `APP_STORE_LISTING.md` §4 → reste à recopier dans App Store Connect. |
| Contenu de la fiche (description, mots-clés, âge, catégorie) | ✅ | Prêt à copier-coller : `APP_STORE_LISTING.md` §3. |
| Compte de démo App Review + notes reviewer | ✅ | Modèle prêt : `APP_STORE_LISTING.md` §5 & §7 (créer le compte démo côté Supabase). |
| Statut trader UE (DSA) | ☐ | À déclarer dans App Store Connect → Business : `APP_STORE_LISTING.md` §6. |
| Suppression de compte **dans l'app** | ✅ | Implémentée : bouton « Supprimer définitivement mon compte » (Settings.tsx, confirmation typée « SUPPRIMER ») + edge function `delete-account` (service-role, suppression réelle côté serveur, anonymisation des commandes, révocation des sessions). Reste : `supabase functions deploy delete-account`. Détail : `APP_STORE_LISTING.md` §2. |
| Sign in with Apple | ✅ | **Non requis** (Guideline 4.8) : l'app fournit une auth first-party email/mot de passe → Google n'est pas le mécanisme exclusif. Décision + plan de repli documentés dans `APP_STORE_LISTING.md` §1. |
| Pas de clé privée dans le bundle | ✅ | Aucun secret dans le frontend (vérifié). Confirmer qu'aucun `.env` secret n'est embarqué au build. |

## 6. Build & distribution

| Item | Statut | Détail |
|------|--------|--------|
| Bloc `server` Capacitor distant | ✅ | Aucun (référence Lovable supprimée) — le build sert `dist` local. |
| Build web | ✅ | `npm run build` OK. |
| Génération projet `ios/` + Compilation Release | ☐ | **Mac requis** — voir §8 (séquence exacte). |
| Archive Xcode distribuable | ☐ | **Mac requis** — §8. |
| Test sur appareil réel | ☐ | Via TestFlight (NFC, deep links, wallet). |
| TestFlight | ☐ | Distribution beta avant soumission. |

## 7. Identité Apple — valeurs finales (toutes renseignées)

| Clé | Valeur |
|-----|--------|
| Bundle ID | `app.iwasp.digital` |
| Team ID | `Y4JV4X2DJ6` |
| App ID numérique (App Store) | `6799452085` |
| Version initiale | `1.0` (build `1`) |
| SKU | `IWASP-IOS-001` |

✅ **Aucun placeholder Apple ne subsiste dans le code** (`YOUR_APP_ID`, `TEAM_ID`, `com.iwasp.app`, bundle Lovable : tous remplacés).

## 8. PROCHAINE ACTION MANUELLE — génération & build iOS (⚠️ Mac + Xcode requis)

> Le dossier `ios/` **n'est pas** dans le dépôt (généré par Capacitor). Il **doit** être
> créé sur un **Mac avec Xcode + CocoaPods** — impossible sur Linux/CI sans Xcode.
> Séquence exacte à exécuter sur le Mac, dans le dossier du dépôt `i-wasp` :

```sh
# 1. Dépendances + build web
npm install
npm run build

# 2. Générer le projet natif iOS (crée le dossier ios/)
npx cap add ios
npx cap sync ios

# 3. Générer icônes + launch screen depuis public/app-icon-1024.png
npx @capacitor/assets generate --ios

# 4. Ouvrir dans Xcode
npx cap open ios
```

**Dans Xcode :**
1. Cible **App** → **Signing & Capabilities** :
   - **Team** : sélectionner l'équipe `Y4JV4X2DJ6`.
   - **Bundle Identifier** : vérifier `app.iwasp.digital` (doit correspondre à `capacitor.config.ts`).
   - **＋ Capability → Associated Domains** → ajouter `applinks:i-wasp.com` et `applinks:www.i-wasp.com`
     (ou copier `ios-config/App.entitlements` dans `ios/App/App/App.entitlements`).
   - (optionnel) **＋ Capability → Near Field Communication Tag Reading** si lecture NFC.
2. **General** → **Version** `1.0`, **Build** `1`.
3. Reporter les clés de `ios-config/Info.plist.template` dans `ios/App/App/Info.plist`
   (permissions FR, URL scheme `iwasp`, ATS restreint).
4. **Product → Scheme → Edit Scheme → Run → Build Configuration : Release**, puis **Product → Build** (⌘B).
5. **Product → Archive** → **Distribute App → TestFlight (& App Store)** → upload.
6. Tester sur appareil réel via **TestFlight** (NFC, deep links, wallet).

> Version/build, entitlements et Info.plist sont préparés en dépôt comme références ;
> leur application se fait dans Xcode (aucune simulation de compilation possible ici).

## Éléments prêts à préparer sans compte externe

- ✅ Unifier le bundle id dans l'AASA sur `app.iwasp.digital` (le Team ID reste à insérer).
- ✅ Unifier le scheme deep-link sur `iwasp://`.
- ✅ Corriger les icônes PWA.
- ✅ Restreindre l'ATS.
- ☐ Implémenter la suppression de compte in-app (code — sans secret).
