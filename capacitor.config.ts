import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.17c6de152d8546a1a7d8e5c478c6f024',
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
    backgroundColor: '#F5F5F7',
    scheme: 'IWASP',
    // Hardware acceleration for video playback
    allowsLinkPreview: false,
    scrollEnabled: true,
    limitsNavigationsToAppBoundDomains: true,
  },
  android: {
    backgroundColor: '#F5F5F7',
    // Hardware acceleration
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      launchFadeOutDuration: 300,
      backgroundColor: '#F5F5F7',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#F5F5F7'
    },
    Haptics: {
      enabled: true
    }
  }
};

export default config;
