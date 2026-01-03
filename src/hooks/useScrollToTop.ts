/**
 * useScrollToTop - Hook for automatic scroll to top on route changes
 * 
 * Usage:
 * - Call scrollToTop() after navigation to ensure user sees top of page
 * - Automatically integrates with OrderFunnel for step transitions
 */

import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollToTop() {
  const location = useLocation();

  // Scroll to top function with smooth behavior fallback
  const scrollToTop = useCallback((smooth = true) => {
    if (typeof window !== 'undefined') {
      try {
        // Try smooth scroll first
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: smooth ? 'smooth' : 'instant'
        });
        
        // Fallback for older browsers
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        // Force iOS scroll reset
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 50);
      } catch {
        // Ultimate fallback
        window.scrollTo(0, 0);
      }
    }
  }, []);

  // Auto scroll on route change
  useEffect(() => {
    scrollToTop(false);
  }, [location.pathname, scrollToTop]);

  return { scrollToTop };
}

// Standalone scroll function for use without hook
export function scrollToTopInstant() {
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
}
