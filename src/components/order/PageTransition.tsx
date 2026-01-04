/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PAGE TRANSITION — VERROUILLÉ
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * NE PAS MODIFIER SANS INSTRUCTION EXPLICITE
 * 
 * Comportement garanti :
 * - Transitions ULTRA-RAPIDES (100ms max)
 * - Aucune animation bloquante
 * - Aucun délai avant affichage du contenu
 * - UX fluide et instantanée
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { motion } from "framer-motion";
import { ReactNode, useEffect } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

// VERROUILLÉ: Transitions ultra-rapides, non-bloquantes
const pageVariants = {
  initial: {
    opacity: 0.9,
    y: 4,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0.9,
    y: -4,
  },
};

// VERROUILLÉ: Transition instantanée
const pageTransition = {
  duration: 0.1,
  ease: "easeOut" as const,
};

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  // VERROUILLÉ: Scroll to top sur chaque transition
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// VERROUILLÉ: Animations de contenu ultra-rapides
export const contentVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.12,
      staggerChildren: 0.03,
      delayChildren: 0,
    }
  },
};

export const itemVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.1 }
  },
};
