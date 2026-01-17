/**
 * useReducedMotion Hook
 * Détecte les préférences utilisateur et les appareils à faible performance
 * pour réduire automatiquement la complexité des animations
 */

import { useState, useEffect, useCallback } from "react";

interface MotionConfig {
  /** L'utilisateur préfère moins de mouvements */
  prefersReduced: boolean;
  /** Appareil détecté comme peu puissant */
  isLowPowerDevice: boolean;
  /** Devrait-on simplifier les animations ? */
  shouldReduceMotion: boolean;
  /** Multiplicateur de durée (1 = normal, 0.5 = plus rapide) */
  durationMultiplier: number;
  /** Nombre maximum de particules recommandé */
  maxParticles: number;
  /** Animations infinies autorisées ? */
  allowInfiniteAnimations: boolean;
  /** Ombres complexes autorisées ? */
  allowComplexShadows: boolean;
}

/**
 * Détecte si l'appareil est peu puissant basé sur plusieurs heuristiques
 */
function detectLowPowerDevice(): boolean {
  if (typeof window === "undefined") return false;

  // 1. Check navigator.hardwareConcurrency (nombre de cœurs CPU)
  const cores = navigator.hardwareConcurrency || 4;
  if (cores <= 2) return true;

  // 2. Check deviceMemory API (disponible sur Chrome/Edge)
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (memory && memory < 4) return true;

  // 3. Check pour iOS ancien ou Android bas de gamme via User Agent
  const ua = navigator.userAgent.toLowerCase();
  
  // iOS devices plus anciens
  if (/iphone|ipad/.test(ua)) {
    // Détecte les anciens modèles iOS (avant iPhone X)
    const match = ua.match(/os (\d+)_/);
    if (match && parseInt(match[1]) < 13) return true;
  }

  // Android bas de gamme
  if (/android/.test(ua)) {
    // Vérifier si c'est un appareil bas de gamme via resolution
    if (window.screen.width < 400 || window.devicePixelRatio < 2) return true;
  }

  // 4. Check connection type pour save-data
  const connection = (navigator as Navigator & { 
    connection?: { saveData?: boolean; effectiveType?: string } 
  }).connection;
  
  if (connection?.saveData) return true;
  if (connection?.effectiveType === "2g" || connection?.effectiveType === "slow-2g") return true;

  return false;
}

/**
 * Hook principal pour gérer les animations adaptatives
 */
export function useReducedMotion(): MotionConfig {
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [isLowPowerDevice, setIsLowPowerDevice] = useState(false);

  useEffect(() => {
    // Détecter prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    // Détecter appareil peu puissant
    setIsLowPowerDevice(detectLowPowerDevice());

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const shouldReduceMotion = prefersReduced || isLowPowerDevice;

  return {
    prefersReduced,
    isLowPowerDevice,
    shouldReduceMotion,
    durationMultiplier: shouldReduceMotion ? 0.5 : 1,
    maxParticles: shouldReduceMotion ? 5 : 20,
    allowInfiniteAnimations: !shouldReduceMotion,
    allowComplexShadows: !shouldReduceMotion,
  };
}

/**
 * Variantes d'animation optimisées pour framer-motion
 * Utiliser avec: variants={getOptimizedVariants(shouldReduceMotion)}
 */
export function getOptimizedVariants(shouldReduce: boolean) {
  if (shouldReduce) {
    return {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration: 0.15 }
      },
      exit: { 
        opacity: 0,
        transition: { duration: 0.1 }
      }
    };
  }

  return {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: { duration: 0.2 }
    }
  };
}

/**
 * Configuration de transition optimisée
 */
export function getOptimizedTransition(shouldReduce: boolean, baseTransition: object = {}) {
  if (shouldReduce) {
    return {
      duration: 0.15,
      ease: "easeOut",
    };
  }

  return {
    duration: 0.3,
    ease: "easeOut",
    ...baseTransition,
  };
}

export default useReducedMotion;
