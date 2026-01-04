/**
 * Page Transition wrapper for order funnel steps
 * 
 * OPTIMIZED for mobile:
 * - Fast, subtle animations that don't block navigation
 * - No delay on entry - instant content visibility
 * - Premium feel without sacrificing responsiveness
 */

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

// Optimized page variants - faster, no blocking
const pageVariants = {
  initial: {
    opacity: 0.8,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0.8,
    y: -8,
  },
};

// Fast, non-blocking transition
const pageTransition = {
  duration: 0.15,
  ease: "easeOut" as const,
};

export function PageTransition({ children, className = "" }: PageTransitionProps) {
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

// Content transition for staggered children - faster
export const contentVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.2,
      staggerChildren: 0.05,
      delayChildren: 0,
    }
  },
};

export const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.15 }
  },
};
