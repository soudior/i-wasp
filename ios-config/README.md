# Configuration iOS pour IWASP

## 📱 Prérequis

- Mac avec macOS 13+ (Ventura ou plus récent)
- Xcode 15+ installé depuis l'App Store
- Compte Apple Developer (99$/an) : https://developer.apple.com

## 🚀 Étapes de Configuration

### 1. Exporter depuis Lovable vers GitHub

Dans Lovable, cliquez sur **"Export to GitHub"** pour transférer le projet.

### 2. Cloner le projet

```bash
git clone https://github.com/VOTRE_USERNAME/i-wasp.git
cd i-wasp
```

### 3. Installer les dépendances

```bash
npm install
```

### 4. Build du projet

```bash
npm run build
```

### 5. Ajouter la plateforme iOS

```bash
npx cap add ios
```

### 6. Synchroniser le projet

```bash
npx cap sync ios
```

### 7. Ouvrir dans Xcode

```bash
npx cap open ios
```

## 🎨 Configuration des Icônes (1024x1024)

### Icônes requises pour l'App Store

Créez un fichier `AppIcon.png` de **1024x1024 pixels** et utilisez un générateur :

- **App Icon Generator** : https://appicon.co (recommandé)
- **MakeAppIcon** : https://makeappicon.com

Placez les fichiers générés dans :
```
ios/App/App/Assets.xcassets/AppIcon.appiconset/
```

### Tailles générées automatiquement
- 20x20, 29x29, 40x40, 58x58, 60x60
- 76x76, 80x80, 87x87, 120x120
- 152x152, 167x167, 180x180, 1024x1024

## 🖼️ Splash Screen

### Configuration dans Xcode

1. Ouvrez `ios/App/App/Assets.xcassets/Splash.imageset`
2. Ajoutez votre image splash (2732x2732px recommandé)
3. Configurez le LaunchScreen.storyboard

### Couleurs IWASP Stealth Luxury

- Background : `#000000` (Noir profond)
- Accent : `#D4AF37` (Or subtil)
- Texte : `#FFFFFF`

## ⚙️ Configuration dans Xcode

### 1. Signing & Capabilities

1. Sélectionnez le projet **App** dans le navigateur
2. Onglet **Signing & Capabilities**
3. Activez **Automatically manage signing**
4. Sélectionnez votre Team (Apple Developer)
5. Bundle ID : `app.iwasp.digital`

### 2. Ajouter les Capabilities

Cliquez sur **"+ Capability"** et ajoutez :
- **Near Field Communication Tag Reading** (pour NFC)
- **Associated Domains** (pour les liens universels)
- **Push Notifications** (optionnel)
- **Background Modes** → Background fetch

### 3. Associated Domains

Dans le champ Associated Domains, ajoutez :
```
applinks:i-wasp.com
applinks:www.i-wasp.com
```

### 4. Info.plist

Vérifiez que ces clés sont présentes :

```xml
<key>NFCReaderUsageDescription</key>
<string>IWASP utilise le NFC pour partager votre carte de visite digitale</string>

<key>NSCameraUsageDescription</key>
<string>IWASP utilise la caméra pour scanner les QR codes et personnaliser votre profil</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>IWASP accède à vos photos pour personnaliser votre carte de visite</string>

<key>NSContactsUsageDescription</key>
<string>IWASP peut ajouter des contacts à votre carnet d'adresses</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>IWASP utilise votre position pour personnaliser votre expérience</string>
```

## 📤 Publication sur l'App Store

### 1. Build Release

1. Dans Xcode, sélectionnez **Any iOS Device (arm64)**
2. **Product → Archive**
3. Attendez la compilation complète

### 2. Distribute App

1. Dans l'Organizer, sélectionnez votre archive
2. **Distribute App → App Store Connect**
3. Suivez les instructions

### 3. App Store Connect

1. Allez sur https://appstoreconnect.apple.com
2. **My Apps → (+) New App**
3. Bundle ID: `app.iwasp.digital`
4. Remplissez les métadonnées

### 4. Métadonnées requises

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

**URL Politique de confidentialité** : https://i-wasp.com/privacy

**URL Support** : https://i-wasp.com/contact

### 5. Screenshots requis

| Device | Résolution |
|--------|-----------|
| iPhone 6.7" | 1290 x 2796 |
| iPhone 6.5" | 1242 x 2688 |
| iPhone 5.5" | 1242 x 2208 |
| iPad Pro 12.9" | 2048 x 2732 |

### 6. Soumettre pour review

1. Téléchargez votre build
2. Remplissez tous les champs requis
3. **Submit for Review**

Délai de review : 24-48 heures généralement

## 📋 Checklist avant soumission

- [ ] Icône 1024x1024 ajoutée
- [ ] Splash screen configuré
- [ ] Info.plist avec toutes les descriptions de permissions
- [ ] Privacy Policy URL configurée (/privacy)
- [ ] Screenshots pour toutes les tailles
- [ ] Métadonnées complètes
- [ ] Test sur appareil physique
- [ ] Build sans erreurs ni warnings
- [ ] Capabilities NFC et Associated Domains configurées

## 🔗 Liens utiles

- [Documentation Capacitor iOS](https://capacitorjs.com/docs/ios)
- [App Store Connect](https://appstoreconnect.apple.com)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
