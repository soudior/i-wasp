/**
 * StudioThemeToggle - Toggle de thème premium pour Web Studio
 * Design Noir & Or avec animations fluides
 */

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Palette Premium
const STUDIO = {
  noir: "#050505",
  noirSoft: "#0A0A0A",
  noirCard: "#111111",
  or: "#D4A853",
  orLight: "#E8C87A",
  ivoire: "#F5F5F5",
  gris: "#6B6B6B",
};

interface StudioThemeToggleProps {
  className?: string;
}

export function StudioThemeToggle({ className = "" }: StudioThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-20 h-10 rounded-full ${className}`} style={{ backgroundColor: STUDIO.noirCard }} />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative w-20 h-10 rounded-full p-1 transition-all duration-500 ${className}`}
      style={{
        backgroundColor: isDark ? STUDIO.noirCard : "#E5E5E7",
        border: `1px solid ${isDark ? STUDIO.or : "#D1D1D6"}20`,
        boxShadow: isDark 
          ? `inset 0 2px 8px ${STUDIO.noir}, 0 0 20px ${STUDIO.or}10`
          : `inset 0 2px 8px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05)`,
      }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
    >
      {/* Track background gradient */}
      <motion.div
        className="absolute inset-0 rounded-full overflow-hidden"
        initial={false}
        animate={{
          opacity: isDark ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Stars effect for dark mode */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 rounded-full"
            style={{
              backgroundColor: STUDIO.or,
              left: `${20 + (i % 4) * 15}%`,
              top: `${25 + Math.floor(i / 4) * 50}%`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>

      {/* Slider knob */}
      <motion.div
        className="relative w-8 h-8 rounded-full flex items-center justify-center"
        initial={false}
        animate={{
          x: isDark ? 38 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        style={{
          background: isDark
            ? `linear-gradient(135deg, ${STUDIO.or} 0%, ${STUDIO.orLight} 100%)`
            : `linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)`,
          boxShadow: isDark
            ? `0 4px 12px ${STUDIO.or}40, 0 0 20px ${STUDIO.or}20`
            : `0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)`,
        }}
      >
        {/* Icon with rotation animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={resolvedTheme}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {isDark ? (
              <Moon 
                size={16} 
                strokeWidth={2}
                style={{ color: STUDIO.noir }}
              />
            ) : (
              <Sun 
                size={16} 
                strokeWidth={2}
                style={{ color: "#F59E0B" }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{
            boxShadow: isDark
              ? [
                  `0 0 0px ${STUDIO.or}`,
                  `0 0 15px ${STUDIO.or}60`,
                  `0 0 0px ${STUDIO.or}`,
                ]
              : [
                  `0 0 0px #F59E0B`,
                  `0 0 10px #F59E0B40`,
                  `0 0 0px #F59E0B`,
                ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Labels */}
      <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
        <motion.span
          className="text-[9px] font-medium uppercase tracking-wide"
          animate={{
            opacity: isDark ? 0.4 : 0,
            x: isDark ? 0 : -5,
          }}
          style={{ color: STUDIO.gris }}
        >
          
        </motion.span>
        <motion.span
          className="text-[9px] font-medium uppercase tracking-wide"
          animate={{
            opacity: isDark ? 0 : 0.6,
            x: isDark ? 5 : 0,
          }}
          style={{ color: "#8E8E93" }}
        >
          
        </motion.span>
      </div>
    </motion.button>
  );
}

// Compact pill version
export function StudioThemeTogglePill({ className = "" }: StudioThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`w-10 h-10 rounded-xl ${className}`} />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden ${className}`}
      style={{
        backgroundColor: isDark ? `${STUDIO.noirCard}` : "#FFFFFF",
        border: `1px solid ${isDark ? STUDIO.or : "#E5E5E7"}30`,
        boxShadow: isDark 
          ? `0 8px 24px ${STUDIO.noir}80, 0 0 40px ${STUDIO.or}05`
          : `0 8px 24px rgba(0,0,0,0.08)`,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
    >
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark 
            ? `radial-gradient(circle at center, ${STUDIO.or}15 0%, transparent 70%)`
            : `radial-gradient(circle at center, #F59E0B15 0%, transparent 70%)`,
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={resolvedTheme}
          initial={{ y: 20, opacity: 0, rotate: -30 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -20, opacity: 0, rotate: 30 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {isDark ? (
            <Moon 
              size={20} 
              strokeWidth={1.5}
              style={{ color: STUDIO.or }}
            />
          ) : (
            <Sun 
              size={20} 
              strokeWidth={1.5}
              style={{ color: "#F59E0B" }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
