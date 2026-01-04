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
 * 
 * Ce composant est intégré dans App.tsx et s'exécute automatiquement.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // VERROUILLÉ: Reset instantané du scroll à chaque changement de route
    // Multiple méthodes pour compatibilité maximale
    
    // Méthode 1: Standard
    window.scrollTo(0, 0);
    
    // Méthode 2: Document element (Firefox/Safari)
    document.documentElement.scrollTop = 0;
    
    // Méthode 3: Body (legacy)
    document.body.scrollTop = 0;
    
    // Méthode 4: Fallback iOS momentum scroll
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);
    
    // Méthode 5: RAF pour cycle de rendu
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
