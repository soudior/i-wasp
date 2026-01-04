/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCROLL TO TOP — COMPORTEMENT VERROUILLÉ
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * NE PAS MODIFIER SANS INSTRUCTION EXPLICITE
 * 
 * Comportement garanti :
 * - Scroll TOUJOURS réinitialisé en haut à chaque changement de route
 * - Aucune animation de scroll (instantané)
 * - Fonctionne sur tous les appareils (iOS, Android, Desktop)
 * - Multiple fallbacks pour compatibilité maximale
 * 
 * Ce composant est intégré dans App.tsx et s'exécute automatiquement.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

// Use layoutEffect for immediate execution before paint
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function ScrollToTop() {
  const { pathname, search } = useLocation();

  // VERROUILLÉ: Reset instantané du scroll à chaque changement de route
  useIsomorphicLayoutEffect(() => {
    // Méthode 1: Standard (synchrone, avant paint)
    window.scrollTo(0, 0);
    
    // Méthode 2: Document element (Firefox/Safari)
    document.documentElement.scrollTop = 0;
    
    // Méthode 3: Body (legacy browsers)
    document.body.scrollTop = 0;
    
    // Méthode 4: Force scroll with behavior: instant
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant" as ScrollBehavior,
      });
    } catch {
      // Fallback for browsers that don't support behavior: instant
      window.scrollTo(0, 0);
    }
  }, [pathname, search]);

  // Additional effect for iOS momentum scroll issues
  useEffect(() => {
    // Delayed reset for iOS momentum scroll
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);

    // RAF for render cycle completion
    const rafId = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
    };
  }, [pathname, search]);

  return null;
}
