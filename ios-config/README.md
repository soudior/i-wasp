# Configuration iOS pour IWASP

## 📱 Prérequis

- Mac avec macOS 13+ (Ventura ou plus récent)
- Xcode 15+ installé depuis l'App Store
- Compte Apple Developer (99$/an) : https://developer.apple.com

## 🚀 Étapes de Configuration

### 1. Cloner le projet

```bash
git clone https://github.com/soudior/i-wasp.git
cd i-wasp
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Ajouter la plateforme iOS

```bash
npx cap add ios
```

### 4. Synchroniser le projet

```bash
npm run build
npx cap sync ios
```

### 5. Ouvrir dans Xcode

```bash
npx cap open ios
```

## 🎨 Configuration des Icônes (1024x1024)

### Icônes requises pour l'App Store

Créez un fichier `AppIcon.png` de **1024x1024 pixels** et placez-le dans :
```
ios/App/App/Assets.xcassets/AppIcon.appiconset/
```

### Génération automatique des tailles

Utilisez l'un de ces outils :
- **App Icon Generator** : https://appicon.co
- **MakeAppIcon** : https://makeappicon.com

Tailles générées automatiquement :
- 20x20, 29x29, 40x40, 58x58, 60x60
- 76x76, 80x80, 87x87, 120x120
- 152x152, 167x167, 180x180, 1024x1024

## 🖼️ Splash Screen

### Configuration dans Xcode

1. Ouvrez `ios/App/App/Assets.xcassets/Splash.imageset`
2. Ajoutez votre image splash (2732x2732px recommandé)
3. Configurez le LaunchScreen.storyboard

### Couleurs recommandées IWASP

- Background : `#F5F5F7`
- Logo gold : `#D4AF37`
- Texte : `#1D1D1F`

## ⚙️ Configuration dans Xcode

### 1. Signing & Capabilities

1. Sélectionnez le projet dans le navigateur
2. Onglet "Signing & Capabilities"
3. Activez "Automatically manage signing"
4. Sélectionnez votre Team (Apple Developer)

### 2. Ajouter les Capabilities

Cliquez sur "+ Capability" et ajoutez :
- **Near Field Communication Tag Reading** (pour NFC)
- **Associated Domains** (pour les liens universels)
- **Push Notifications** (optionnel)
- **Background Modes** > Background fetch

### 3. Associated Domains

Ajoutez :
```
applinks:i-wasp.com
applinks:www.i-wasp.com
```

## 📤 Publication sur l'App Store

### 1. Archive

1. Dans Xcode : Product → Archive
2. Attendez la compilation complète

### 2. App Store Connect

1. Allez sur https://appstoreconnect.apple.com
2. Créez une nouvelle app avec le Bundle ID : `app.lovable.17c6de152d8546a1a7d8e5c478c6f024`
3. Remplissez les métadonnées

### 3. Métadonnées requises

**Nom de l'app** : IWASP - Carte de visite NFC

**Sous-titre** : Networking digital premium

**Description** :
```
IWASP révolutionne le networking professionnel avec des cartes de visite NFC intelligentes.

✨ FONCTIONNALITÉS CLÉS :
• Créez votre carte de visite digitale en quelques minutes
• Partagez vos coordonnées d'un simple tap NFC
• Suivez qui consulte votre profil
• Ajoutez votre carte à Apple Wallet
• Capturez des leads automatiquement

🏆 POUR QUI ?
• Entrepreneurs et freelances
• Commerciaux et networkers
• Hôtels et restaurants
• Agents immobiliers

🔒 SÉCURISÉ & PREMIUM
Vos données sont protégées et votre image reste professionnelle.

Rejoignez la révolution du networking digital avec IWASP.
```

**Mots-clés** : carte visite, NFC, networking, business card, professionnel, digital, contact

**Catégorie** : Business

### 4. Screenshots requis

- iPhone 6.7" (1290 x 2796) - iPhone 15 Pro Max
- iPhone 6.5" (1242 x 2688) - iPhone 11 Pro Max
- iPhone 5.5" (1242 x 2208) - iPhone 8 Plus
- iPad Pro 12.9" (2048 x 2732)

## 📋 Checklist avant soumission

- [ ] Icône 1024x1024 ajoutée
- [ ] Splash screen configuré
- [ ] Info.plist avec toutes les descriptions de permissions
- [ ] Privacy Policy URL configurée (/privacy)
- [ ] Screenshots pour toutes les tailles
- [ ] Métadonnées complètes
- [ ] Test sur appareil physique
- [ ] Build sans erreurs ni warnings

## 🔗 Liens utiles

- [Documentation Capacitor iOS](https://capacitorjs.com/docs/ios)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
