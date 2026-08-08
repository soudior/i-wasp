import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.iwasp.digital',
  appName: 'IWASP',
  webDir: 'dist',
  // Build de production : on sert le dossier dist local (export Xcode).
  // Ne PAS ajouter de bloc `server.url` distant pour un build App Store.
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    backgroundColor: '#000000',
    scheme: 'IWASP',
    allowsLinkPreview: false,
    scrollEnabled: true,
    limitsNavigationsToAppBoundDomains: true,
  },
  android: {
    backgroundColor: '#000000',
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    // NB : le plugin natif @capacitor/splash-screen a été retiré (sa source 8.0.x
    // n'est pas compatible avec le core Swift capacitor-swift-pm 8.5.x — API
    // getString/color(fromHex:) supprimée). Le splash est de toute façon géré côté
    // web (src/components/SplashScreen.tsx) et l'écran de lancement natif reste
    // fourni par le storyboard iOS. À réintroduire quand une version compatible
    // Cap 8.5 sera publiée.
    Haptics: {
      enabled: true
    }
  }
};

export default config;
