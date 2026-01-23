import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.iwasp.digital',
  appName: 'IWASP',
  webDir: 'dist',
  // Production mode: use local dist folder for Xcode export
  // Comment out server block for App Store build
  /*
  server: {
    url: 'https://17c6de15-2d85-46a1-a7d8-e5c478c6f024.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  */
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
