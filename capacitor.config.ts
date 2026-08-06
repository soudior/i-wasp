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
    SplashScreen: {
      // Désactivé : on utilise notre propre loader web
      launchShowDuration: 0,
      launchAutoHide: true,
      launchFadeOutDuration: 0,
      backgroundColor: '#000000',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#000000'
    },
    Haptics: {
      enabled: true
    }
  }
};

export default config;
