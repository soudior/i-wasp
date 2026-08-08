# 🚀 IWASP - Guide de Déploiement App Store & Google Play

## ✅ Checklist Pré-Déploiement

### État Actuel du Projet
- [x] Application web fonctionnelle
- [x] PWA configurée (manifest.json)
- [x] Capacitor configuré
- [x] SEO et métadonnées optimisés
- [x] Internationalisation (FR, EN, ES, DE, IT, NL, AR)
- [x] Détection automatique devise/langue
- [x] Design Stealth Luxury cohérent
- [x] Authentication Supabase
- [x] Base de données sécurisée (RLS)

---

## 📱 DÉPLOIEMENT iOS (App Store)

### Prérequis
- Mac avec macOS 13+ (Ventura ou plus récent)
- Xcode 15+ installé depuis l'App Store
- Compte Apple Developer (99$/an) : https://developer.apple.com

### Étape 1 : Exporter vers GitHub
1. Cliquez sur **"Export to GitHub"** dans Lovable
2. Clonez le projet sur votre Mac :
```bash
git clone https://github.com/VOTRE_USERNAME/i-wasp.git
cd i-wasp
```

### Étape 2 : Installation et Build
```bash
npm install
npm run build
```

### Étape 3 : Ajouter iOS
```bash
npx cap add ios
npx cap sync ios
```

### Étape 4 : Ouvrir dans Xcode
```bash
npx cap open ios
```

### Étape 5 : Configuration Xcode

#### Signing & Capabilities
1. Sélectionnez le projet **App** dans le navigateur
2. Onglet **Signing & Capabilities**
3. Activez **Automatically manage signing**
4. Sélectionnez votre Team (Apple Developer)
5. Bundle ID: `app.iwasp.digital`

#### Capabilities à ajouter (+)
- **Near Field Communication Tag Reading** (NFC)
- **Associated Domains** (liens universels)
- **Push Notifications** (optionnel)
- **Background Modes** → Background fetch

#### Associated Domains
```
applinks:i-wasp.com
applinks:www.i-wasp.com
```

### Étape 6 : Icônes (OBLIGATOIRE)

Créez une icône 1024x1024 pixels et utilisez :
- https://appicon.co (recommandé)
- https://makeappicon.com

Placez les fichiers générés dans :
```
ios/App/App/Assets.xcassets/AppIcon.appiconset/
```

### Étape 7 : Build & Archive
1. **Product → Archive**
2. Attendez la compilation
3. **Distribute App → App Store Connect**

### Étape 8 : App Store Connect

#### Créer l'app
1. https://appstoreconnect.apple.com
2. **My Apps → (+) New App**
3. Bundle ID: `app.iwasp.digital`

#### Métadonnées

**Nom** : IWASP - Carte de visite NFC

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

#### Screenshots requis
| Device | Résolution |
|--------|-----------|
| iPhone 6.7" | 1290 x 2796 |
| iPhone 6.5" | 1242 x 2688 |
| iPhone 5.5" | 1242 x 2208 |
| iPad Pro 12.9" | 2048 x 2732 |

---

## 🤖 DÉPLOIEMENT ANDROID (Google Play)

### Prérequis
- Android Studio (dernière version)
- Compte Google Play Developer (25$ one-time) : https://play.google.com/console
- JDK 17+

### Étape 1 : Ajouter Android
```bash
npx cap add android
npx cap sync android
```

### Étape 2 : Ouvrir dans Android Studio
```bash
npx cap open android
```

### Étape 3 : Configuration

#### app/build.gradle
Vérifiez :
```gradle
android {
    namespace "app.lovable._17c6de152d8546a1a7d8e5c478c6f024"
    defaultConfig {
        applicationId "app.iwasp.digital"
        minSdkVersion 22
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

### Étape 4 : Icônes

Placez vos icônes dans :
```
android/app/src/main/res/
├── mipmap-hdpi/ic_launcher.png (72x72)
├── mipmap-mdpi/ic_launcher.png (48x48)
├── mipmap-xhdpi/ic_launcher.png (96x96)
├── mipmap-xxhdpi/ic_launcher.png (144x144)
├── mipmap-xxxhdpi/ic_launcher.png (192x192)
```

Utilisez **Android Studio → Image Asset Studio** :
1. Clic droit sur `res` → New → Image Asset
2. Sélectionnez votre icône 1024x1024
3. Générez automatiquement toutes les tailles

### Étape 5 : Générer le Keystore (IMPORTANT)

```bash
keytool -genkey -v -keystore iwasp-release.keystore -alias iwasp -keyalg RSA -keysize 2048 -validity 10000
```

⚠️ **CONSERVEZ CE FICHIER PRÉCIEUSEMENT** - il est nécessaire pour toutes les mises à jour futures !

### Étape 6 : Build Release

1. **Build → Generate Signed Bundle / APK**
2. Choisissez **Android App Bundle (AAB)**
3. Sélectionnez votre keystore
4. Build **release**

### Étape 7 : Google Play Console

#### Créer l'app
1. https://play.google.com/console
2. **Create app**
3. Remplissez les informations

#### Métadonnées

**Titre** : IWASP - Carte de visite NFC

**Description courte** :
```
Créez et partagez votre carte de visite digitale NFC premium
```

**Description complète** :
```
IWASP révolutionne le networking professionnel avec des cartes de visite NFC intelligentes.

✨ FONCTIONNALITÉS :
• Créez votre carte de visite digitale personnalisée
• Partagez vos coordonnées d'un simple tap NFC
• Suivez les statistiques de votre profil
• Capturez des leads automatiquement
• Interface premium et élégante

🎯 IDÉAL POUR :
• Entrepreneurs et startups
• Commerciaux et networkers
• Professionnels de l'immobilier
• Hôteliers et restaurateurs

🔒 SÉCURITÉ & CONFIDENTIALITÉ
Vos données sont chiffrées et protégées. RGPD compliant.

Téléchargez IWASP et passez au networking 2.0 !
```

**Catégorie** : Business

#### Screenshots requis
| Type | Résolution |
|------|-----------|
| Phone | 1080 x 1920 (minimum 2) |
| Tablet 7" | 1200 x 1920 |
| Tablet 10" | 1600 x 2560 |

---

## 🎨 Ressources Graphiques à Créer

### Icône App (OBLIGATOIRE)
- **1024 x 1024 px** - PNG sans transparence
- Design : Logo IWASP sur fond noir #000000
- Style : Minimal, premium

### Screenshots (OBLIGATOIRE)
Capturez ces écrans dans l'app :
1. Page d'accueil (hero)
2. Dashboard utilisateur
3. Carte de visite digitale
4. Tap NFC en action
5. Commande de carte

### Feature Graphic (Android)
- **1024 x 500 px**
- Design promotionnel

### App Preview Video (iOS - optionnel)
- 15-30 secondes
- Démonstration de l'app

---

## ⚡ Commandes Rapides

```bash
# Build complet
npm run build

# Sync iOS
npx cap sync ios

# Sync Android  
npx cap sync android

# Ouvrir iOS
npx cap open ios

# Ouvrir Android
npx cap open android
```

---

## 🔗 Liens Utiles

### Apple
- [App Store Connect](https://appstoreconnect.apple.com)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

### Google
- [Google Play Console](https://play.google.com/console)
- [Android App Quality Guidelines](https://developer.android.com/docs/quality-guidelines)
- [Material Design](https://material.io/design)

### Capacitor
- [Documentation Capacitor](https://capacitorjs.com/docs)
- [Capacitor iOS](https://capacitorjs.com/docs/ios)
- [Capacitor Android](https://capacitorjs.com/docs/android)

---

## 📞 Support

Pour toute question sur le déploiement :
- Email : support@i-wasp.com
- WhatsApp : +212 XXX XXX XXX

---

*Dernière mise à jour : Janvier 2026*
