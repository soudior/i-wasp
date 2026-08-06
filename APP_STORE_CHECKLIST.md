# APP_STORE_CHECKLIST — i-wasp (iOS & Android)

> Checklist de mise en conformité et de soumission des applications mobiles (Capacitor).
> Statut : ☐ à faire · ⚠️ partiel / à corriger · ✅ fait.
> Réfs croisées : voir `AUDIT.md` (P0-4, P2-SCHEME) et `STORE_DEPLOYMENT_GUIDE.md`.

## 1. Identité de l'application

| Item | Statut | Détail |
|------|--------|--------|
| Bundle identifier iOS/Android définitif | ⚠️ | `capacitor.config.ts` = `app.iwasp.digital`. **Mais** `public/apple-app-site-association` utilise encore `app.lovable.17c6de…` → **à unifier sur `app.iwasp.digital`**. |
| Team ID Apple | ☐ | Placeholder `TEAM_ID` dans l'AASA → remplacer par le vrai Team ID (Apple Developer). *Nécessite un compte Apple Developer.* |
| App ID numérique App Store | ☐ | `index.html:50,53` contient `YOUR_APP_ID` → remplacer par l'ID numérique **uniquement une fois l'app créée dans App Store Connect**. |
| Nom d'affichage | ✅ | `IWASP` (`capacitor.config.ts`). |
| Numéro de version / build | ☐ | À gérer proprement (versionName/versionCode Android, CFBundleShortVersionString/CFBundleVersion iOS). |

## 2. Deep links & Universal Links

| Item | Statut | Détail |
|------|--------|--------|
| Scheme deep-link cohérent | ⚠️ | Incohérence `iwasp://` (Info.plist) vs `IWASP` (Capacitor) vs `web+iwasp` (manifest). **Unifier sur `iwasp://`** (AUDIT P2-SCHEME). |
| Associated Domains (iOS) | ⚠️ | Info.plist déclare `applinks:i-wasp.com` / `www.i-wasp.com` ✅, mais l'AASA est invalide (bundle Lovable + `TEAM_ID`). |
| `apple-app-site-association` | ⚠️ | Corriger `appID` → `<TEAM_ID>.app.iwasp.digital` ; servir en `application/json` sans redirection sur `https://i-wasp.com/.well-known/apple-app-site-association`. |
| `assetlinks.json` (Android) | ☐ | À générer (`android-config/` est documentaire ; pas de projet `android/` en dépôt). |
| Universal Links testés | ☐ | À valider sur appareil réel une fois l'AASA corrigé. |

## 3. Icônes & écrans

| Item | Statut | Détail |
|------|--------|--------|
| Icône app 1024×1024 | ✅ | `public/app-icon-1024.png`. |
| Jeu d'icônes iOS/Android complet | ☐ | À générer depuis la source 1024 (Capacitor assets). |
| Launch screen / SplashScreen | ✅ | Configuré (`capacitor.config.ts`), fond `#000000`. |
| Icônes PWA (web) | ⚠️ | Références 404 (`/icon-192.png`…) — vrais fichiers dans `public/icons/*x*.png`. À corriger (AUDIT P0-3). |

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
| Déclaration des données collectées (App Privacy) | ☐ | Remplir dans App Store Connect (scans, emails, leads, analytics). |
| Suppression de compte **dans l'app** | ☐ | **Obligatoire** si un compte peut être créé (Guideline 5.1.1(v)). À implémenter (bouton + edge function de suppression). |
| Sign in with Apple | ☐ | **Obligatoire** si Google OAuth est proposé (Guideline 4.8). Ajouter SIWA ou retirer les connexions sociales tierces des builds store. |
| Pas de clé privée dans le bundle | ✅ | Aucun secret dans le frontend (vérifié). Confirmer qu'aucun `.env` secret n'est embarqué au build. |

## 6. Build & distribution

| Item | Statut | Détail |
|------|--------|--------|
| Bloc `server` Capacitor commenté pour le build store | ✅ | Déjà commenté (`capacitor.config.ts:9-14`) — supprimer la référence Lovable avant soumission. |
| Compilation Release sans erreur | ☐ | À exécuter (`npm run build` web ✅ ; `npx cap sync` puis build Xcode/Gradle). |
| Archive Xcode distribuable | ☐ | À produire. |
| Test sur appareil réel | ☐ | Obligatoire (NFC, deep links, wallet). |
| TestFlight | ☐ | Distribution beta avant soumission. |

## 7. Remplacements de placeholders (récapitulatif)

À faire dès que les valeurs réelles existent (⚠️ certaines nécessitent un compte Apple Developer / App Store Connect) :

- `index.html:50` → `apple-itunes-app` : remplacer `YOUR_APP_ID` par l'App ID numérique.
- `index.html:53` → `ios-app://YOUR_APP_ID` : idem.
- `public/apple-app-site-association` → remplacer `TEAM_ID.app.lovable.17c6de…` par `<TEAM_ID_REEL>.app.iwasp.digital`.
- `STORE_DEPLOYMENT_GUIDE.md`, `ios-config/README.md`, `android-config/README.md` → remplacer les références `app.lovable.17c6de…`.

> **Ne remplacer l'App ID que lorsqu'il existe réellement** (règle de l'énoncé). Tant qu'il n'existe pas, laisser un placeholder documenté plutôt qu'un faux ID.

## Éléments prêts à préparer sans compte externe

- ✅ Unifier le bundle id dans l'AASA sur `app.iwasp.digital` (le Team ID reste à insérer).
- ✅ Unifier le scheme deep-link sur `iwasp://`.
- ✅ Corriger les icônes PWA.
- ✅ Restreindre l'ATS.
- ☐ Implémenter la suppression de compte in-app (code — sans secret).
