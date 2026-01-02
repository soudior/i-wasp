import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import iwaspLogo from "@/assets/iwasp-logo.png";

interface SplashScreenProps {
  onComplete?: () => void;
  minDuration?: number;
}

/**
 * SplashScreen Premium IWASP
 * Design noir profond (#000000) avec effet shimmer or brossé
 * Fade-in/out 1.5s pour transition fluide
 */
export function SplashScreen({ onComplete, minDuration = 1500 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration]);

  // Gérer la fin de l'animation de sortie
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
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ backgroundColor: '#000000' }}
        >
          {/* Gradient radial or subtil */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-30"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.4) 0%, rgba(184,134,11,0.2) 40%, transparent 70%)'
              }}
            />
          </div>

          {/* Logo avec effet shimmer or brossé */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative z-10"
          >
            {/* Halo lumineux or */}
            <motion.div
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute inset-0 blur-3xl rounded-full"
              style={{ 
                background: 'radial-gradient(circle, rgba(212,175,55,0.5) 0%, transparent 70%)',
                transform: 'scale(2)'
              }}
            />
            
            {/* Logo principal avec shimmer */}
            <div className="relative overflow-hidden">
              <img 
                src={iwaspLogo} 
                alt="i-wasp" 
                className="relative z-10 h-28 w-auto"
                style={{
                  filter: 'drop-shadow(0 0 40px rgba(212,175,55,0.6))'
                }}
              />
              
              {/* Effet shimmer or brossé qui traverse le logo */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 0.5
                }}
                className="absolute inset-0 z-20 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.4) 50%, transparent 100%)',
                  width: '50%'
                }}
              />
            </div>
          </motion.div>

          {/* Tagline avec fade-in décalé */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
            className="mt-8 text-sm tracking-[0.25em] uppercase font-light"
            style={{ color: 'rgba(212,175,55,0.8)' }}
          >
            Tap. Connect. Empower.
          </motion.p>

          {/* Indicateur de chargement minimaliste */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-16 flex gap-1.5"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  opacity: [0.2, 1, 0.2],
                  scale: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut"
                }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: 'rgba(212,175,55,0.9)' }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
