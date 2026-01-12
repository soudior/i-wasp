/**
 * PageTransitionWrapper — Smooth page transitions for order funnel
 * Uses framer-motion AnimatePresence for fluid step transitions
 */

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { COUTURE } from "@/lib/hauteCouturePalette";

interface PageTransitionWrapperProps {
  children: ReactNode;
  direction?: "forward" | "backward";
}

// Elegant fade with subtle slide
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

// Stagger children animations
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 15 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

// Fade in from bottom
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

// Fade in only
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: "easeOut",
    },
  },
};

// Scale in
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export function PageTransitionWrapper({ children }: PageTransitionWrapperProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

// Honeycomb background pattern component
export function HoneycombBackground() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='${encodeURIComponent("#1a1a1a")}' stroke-width='0.5' stroke-opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundSize: '56px 100px',
      }}
    />
  );
}

// Loading spinner for transitions
export function TransitionLoader() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: COUTURE.jet }}
    >
      <HoneycombBackground />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10"
      >
        <div 
          className="w-8 h-8 border border-t-transparent rounded-full animate-spin"
          style={{ borderColor: `${COUTURE.gold}40`, borderTopColor: 'transparent' }}
        />
      </motion.div>
    </div>
  );
}
