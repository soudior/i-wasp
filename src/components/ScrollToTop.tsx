/**
 * ScrollToTop - Global component for automatic scroll to top on route changes
 * 
 * CRITICAL for mobile UX:
 * - Forces scroll to top on EVERY route change
 * - Works on all pages, all devices
 * - No animation delay - instant reset
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force immediate scroll to top on route change
    // Multiple methods for maximum compatibility across devices
    
    // Method 1: Standard scroll
    window.scrollTo(0, 0);
    
    // Method 2: Document element (Firefox/Safari)
    document.documentElement.scrollTop = 0;
    
    // Method 3: Body scroll (legacy browsers)
    document.body.scrollTop = 0;
    
    // Method 4: Delayed fallback for iOS momentum scroll
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);
    
    // Method 5: RAF for smooth paint cycle
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
