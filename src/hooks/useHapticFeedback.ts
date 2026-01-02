/**
 * Haptic Feedback Hook
 * 
 * Provides native-like haptic feedback for iOS/Android apps.
 * Uses the Vibration API with fallback patterns.
 */

type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

interface HapticPatterns {
  [key: string]: number | number[];
}

const hapticPatterns: HapticPatterns = {
  light: 10,
  medium: 20,
  heavy: 30,
  success: [10, 50, 10],
  warning: [20, 50, 20],
  error: [30, 50, 30, 50, 30],
  selection: 5,
};

export function useHapticFeedback() {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const trigger = (style: HapticStyle = 'light') => {
    if (!isSupported) return;
    
    try {
      const pattern = hapticPatterns[style];
      navigator.vibrate(pattern);
    } catch (error) {
      // Silently fail if vibration not available
      console.debug('Haptic feedback not available');
    }
  };

  const impactLight = () => trigger('light');
  const impactMedium = () => trigger('medium');
  const impactHeavy = () => trigger('heavy');
  const notificationSuccess = () => trigger('success');
  const notificationWarning = () => trigger('warning');
  const notificationError = () => trigger('error');
  const selectionChanged = () => trigger('selection');

  return {
    trigger,
    impactLight,
    impactMedium,
    impactHeavy,
    notificationSuccess,
    notificationWarning,
    notificationError,
    selectionChanged,
    isSupported,
  };
}

/**
 * Utility function for inline haptic feedback
 * Can be used without the hook in simple cases
 */
export function triggerHaptic(style: HapticStyle = 'light') {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      const pattern = hapticPatterns[style];
      navigator.vibrate(pattern);
    } catch {
      // Silently fail
    }
  }
}
