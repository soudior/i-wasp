/**
 * ═══════════════════════════════════════════════════════════════════════════
 * USE TAP HANDLER — MOBILE-FIRST INTERACTION
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Hook for handling single-tap actions with:
 * - Double-tap prevention
 * - Loading state management
 * - Automatic button disable during action
 * - Haptic feedback (if available)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useCallback, useRef } from "react";

interface UseTapHandlerOptions {
  /** Delay before re-enabling the handler (ms) */
  cooldownMs?: number;
  /** Enable haptic feedback */
  haptic?: boolean;
  /** Callback on tap */
  onTap?: () => void | Promise<void>;
}

interface UseTapHandlerResult {
  /** Whether the handler is currently processing */
  isProcessing: boolean;
  /** Whether the button should be disabled */
  isDisabled: boolean;
  /** Handler to attach to onClick */
  handleTap: (e?: React.MouseEvent | React.TouchEvent) => void;
  /** Manually reset the handler state */
  reset: () => void;
}

export function useTapHandler(options: UseTapHandlerOptions = {}): UseTapHandlerResult {
  const { cooldownMs = 1000, haptic = true, onTap } = options;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const lastTapRef = useRef<number>(0);
  const processingRef = useRef<boolean>(false);

  const handleTap = useCallback(
    async (e?: React.MouseEvent | React.TouchEvent) => {
      // Prevent if already processing
      if (processingRef.current) {
        e?.preventDefault();
        return;
      }

      // Prevent rapid double-taps
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        e?.preventDefault();
        return;
      }
      lastTapRef.current = now;

      // Lock processing
      processingRef.current = true;
      setIsProcessing(true);

      // Haptic feedback
      if (haptic && navigator.vibrate) {
        navigator.vibrate(10);
      }

      try {
        // Execute the tap handler
        if (onTap) {
          await onTap();
        }
      } finally {
        // Reset after cooldown
        setTimeout(() => {
          processingRef.current = false;
          setIsProcessing(false);
        }, cooldownMs);
      }
    },
    [cooldownMs, haptic, onTap]
  );

  const reset = useCallback(() => {
    processingRef.current = false;
    setIsProcessing(false);
    lastTapRef.current = 0;
  }, []);

  return {
    isProcessing,
    isDisabled: isProcessing,
    handleTap,
    reset,
  };
}

/**
 * Simple wrapper for preventing double-taps on any element
 */
export function preventDoubleTap<T extends (...args: any[]) => any>(
  handler: T,
  cooldownMs = 500
): T {
  let lastCall = 0;
  let isProcessing = false;

  return ((...args: Parameters<T>) => {
    const now = Date.now();
    
    if (isProcessing || now - lastCall < cooldownMs) {
      return;
    }
    
    lastCall = now;
    isProcessing = true;
    
    const result = handler(...args);
    
    // Handle async handlers
    if (result instanceof Promise) {
      result.finally(() => {
        isProcessing = false;
      });
    } else {
      setTimeout(() => {
        isProcessing = false;
      }, cooldownMs);
    }
    
    return result;
  }) as T;
}

export default useTapHandler;
