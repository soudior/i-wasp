import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import iwaspLogo from "@/assets/iwasp-logo.png";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface SplashScreenProps {
  onComplete?: () => void;
  minDuration?: number;
}

/**
 * SplashScreen Premium IWASP
 * Style SaaS Professional - Clean, minimal
 * Optimized: 800ms for fast startup while maintaining premium feel
 * 
 * OPTIMISÉ POUR MOBILE:
 * - Animations réduites sur appareils peu puissants
 * - Support de prefers-reduced-motion
 */
export function SplashScreen({ onComplete, minDuration = 800 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const { shouldReduceMotion, allowInfiniteAnimations } = useReducedMotion();

  // Réduire la durée sur mobile peu puissant
  const effectiveDuration = shouldReduceMotion ? Math.min(minDuration, 500) : minDuration;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, effectiveDuration);

    return () => clearTimeout(timer);
  }, [effectiveDuration]);

  const handleExitComplete = () => {
    setIsVisible(false);
    onComplete?.();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: shouldReduceMotion ? 1 : 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.25, ease: "easeOut" }}
            className="relative z-10"
          >
            <img 
              src={iwaspLogo} 
              alt="i-wasp" 
              className="h-20 w-auto"
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: shouldReduceMotion ? 0.05 : 0.1, duration: shouldReduceMotion ? 0.1 : 0.2, ease: "easeOut" }}
            className="mt-6 text-xs tracking-[0.2em] uppercase font-medium text-muted-foreground"
          >
            Tap. Connect. Empower.
          </motion.p>

          {/* Loading indicator - simplifié sur mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: shouldReduceMotion ? 0.08 : 0.15 }}
            className="absolute bottom-16 flex gap-1.5"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={allowInfiniteAnimations ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.7 }}
                transition={allowInfiniteAnimations ? {
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                } : { duration: 0 }}
                className="w-1.5 h-1.5 rounded-full bg-primary"
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
