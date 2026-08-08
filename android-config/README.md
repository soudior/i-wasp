# Configuration Android pour IWASP

## 📱 Prérequis

- Android Studio (dernière version) : https://developer.android.com/studio
- JDK 17+ installé
- Compte Google Play Developer (25$ one-time) : https://play.google.com/console

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

### 3. Ajouter la plateforme Android

```bash
npx cap add android
```

### 4. Synchroniser le projet

```bash
npm run build
npx cap sync android
```

### 5. Ouvrir dans Android Studio

```bash
npx cap open android
```

## 🎨 Configuration des Icônes

### Méthode 1 : Android Studio (Recommandé)

1. Dans Android Studio, clic droit sur `app/src/main/res`
2. **New → Image Asset**
3. Sélectionnez votre icône source (1024x1024 PNG)
4. Android Studio génère automatiquement toutes les tailles

### Méthode 2 : Manuelle

Placez vos icônes dans les dossiers suivants :

```
android/app/src/main/res/
├── mipmap-hdpi/
│   └── ic_launcher.png (72x72)
├── mipmap-mdpi/
│   └── ic_launcher.png (48x48)
├── mipmap-xhdpi/
│   └── ic_launcher.png (96x96)
├── mipmap-xxhdpi/
│   └── ic_launcher.png (144x144)
├── mipmap-xxxhdpi/
│   └── ic_launcher.png (192x192)
```

### Adaptive Icons (Android 8+)

Pour les icônes adaptatives, créez également :
- `ic_launcher_foreground.png` (108x108 dans zone de 72x72)
- `ic_launcher_background.png` ou couleur de fond

## 🖼️ Splash Screen

Le splash screen est configuré dans `capacitor.config.ts` :

```typescript
plugins: {
  SplashScreen: {
    launchShowDuration: 0,
    backgroundColor: '#000000',
    androidSplashResourceName: 'splash',
    androidScaleType: 'CENTER_CROP',
    showSpinner: false,
    splashFullScreen: true,
    splashImmersive: true
  }
}
```

Pour personnaliser le splash :
1. Créez une image `splash.png` (2732x2732px recommandé)
2. Placez-la dans `android/app/src/main/res/drawable/`

## ⚙️ Configuration dans Android Studio

### 1. Vérifier build.gradle (app)

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
    
    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 2. Permissions (AndroidManifest.xml)

Vérifiez que ces permissions sont présentes :

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.NFC" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_CONTACTS" />
<uses-permission android:name="android.permission.WRITE_CONTACTS" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

<uses-feature android:name="android.hardware.nfc" android:required="false" />
```

### 3. Intent Filters (Deep Links)

Dans `AndroidManifest.xml`, ajoutez dans `<activity>` :

```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" android:host="i-wasp.com" />
    <data android:scheme="https" android:host="www.i-wasp.com" />
</intent-filter>

<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="iwasp" />
</intent-filter>
```

## 🔐 Génération du Keystore

### Créer le keystore (IMPORTANT - À CONSERVER PRÉCIEUSEMENT)

```bash
keytool -genkey -v -keystore iwasp-release.keystore -alias iwasp -keyalg RSA -keysize 2048 -validity 10000
```

Répondez aux questions :
- Mot de passe du keystore
- Votre nom
- Votre organisation
- Ville, État, Pays

### Configuration dans gradle.properties

```properties
IWASP_UPLOAD_STORE_FILE=iwasp-release.keystore
IWASP_UPLOAD_STORE_PASSWORD=votre_mot_de_passe
IWASP_UPLOAD_KEY_ALIAS=iwasp
IWASP_UPLOAD_KEY_PASSWORD=votre_mot_de_passe
```

### Configuration dans build.gradle (app)

```gradle
android {
    signingConfigs {
        release {
            storeFile file(IWASP_UPLOAD_STORE_FILE)
            storePassword IWASP_UPLOAD_STORE_PASSWORD
            keyAlias IWASP_UPLOAD_KEY_ALIAS
            keyPassword IWASP_UPLOAD_KEY_PASSWORD
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

## 📤 Publication sur Google Play

### 1. Build Release

1. Dans Android Studio : **Build → Generate Signed Bundle / APK**
2. Choisissez **Android App Bundle (AAB)** (recommandé par Google)
3. Sélectionnez votre keystore
4. Choisissez **release**
5. Attendez la compilation

Le fichier AAB sera dans :
```
android/app/release/app-release.aab
```

### 2. Google Play Console

1. Allez sur https://play.google.com/console
2. **Create app**
3. Remplissez les informations de base

### 3. Métadonnées requises

**Titre** : IWASP - Carte de visite NFC

**Description courte** (80 caractères max) :
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

**Adresse email de contact** : support@i-wasp.com

**URL Politique de confidentialité** : https://i-wasp.com/privacy

### 4. Screenshots requis

| Type | Dimensions | Quantité |
|------|------------|----------|
| Phone | 1080 x 1920 px (min) | 2-8 |
| Tablet 7" | 1200 x 1920 px | 1-8 |
| Tablet 10" | 1600 x 2560 px | 1-8 |

### 5. Feature Graphic

- Dimensions : **1024 x 500 px**
- Format : PNG ou JPEG
- Design promotionnel de l'app

### 6. Soumettre pour review

1. Téléchargez votre AAB dans **Release → Production**
2. Remplissez les questionnaires (Content rating, Data safety)
3. **Submit for review**

Délai de review : 1-7 jours

## 📋 Checklist avant soumission

- [ ] Icônes toutes tailles générées
- [ ] Splash screen configuré
- [ ] Keystore créé et sauvegardé
- [ ] Build release sans erreurs
- [ ] APK/AAB testé sur appareil physique
- [ ] Screenshots pour toutes les tailles
- [ ] Feature graphic créé
- [ ] Politique de confidentialité publiée
- [ ] Data safety questionnaire rempli
- [ ] Content rating questionnaire rempli

## 🔗 Liens utiles

- [Documentation Capacitor Android](https://capacitorjs.com/docs/android)
- [Google Play Console](https://play.google.com/console)
- [Android App Quality Guidelines](https://developer.android.com/docs/quality-guidelines)
- [Material Design Guidelines](https://material.io/design)

## ⚠️ Notes importantes

1. **Le keystore est IRREMPLAÇABLE** - Sauvegardez-le dans un endroit sûr
2. **Incrémentez versionCode** à chaque mise à jour
3. **Testez sur plusieurs appareils** avant soumission
4. **Google peut demander des clarifications** - Répondez rapidement
