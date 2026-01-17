/**
 * GeneratingAnimation - Animation de chargement ultra-immersive
 * Design Premium Noir & Or avec effets 3D et particules
 * 
 * OPTIMISÉ POUR MOBILE:
 * - Détection automatique des appareils peu puissants
 * - Réduction des particules et animations complexes
 * - Support de prefers-reduced-motion
 */

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Globe, Palette, Layout, Type, Zap, Brain, Code, Wand2 } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Palette Premium
const STUDIO = {
  noir: "#050505",
  noirSoft: "#0A0A0A",
  noirCard: "#111111",
  or: "#D4A853",
  orLight: "#E8C87A",
  orDark: "#B8923C",
  ivoire: "#F5F5F5",
  gris: "#6B6B6B",
};

const STEPS = [
  { icon: Brain, label: "Analyse de votre vision...", sublabel: "Compréhension du projet" },
  { icon: Globe, label: "Structuration du contenu...", sublabel: "Architecture des pages" },
  { icon: Palette, label: "Création de l'identité...", sublabel: "Couleurs & typographie" },
  { icon: Layout, label: "Design des sections...", sublabel: "Mise en page optimisée" },
  { icon: Code, label: "Génération du code...", sublabel: "Technologies modernes" },
  { icon: Wand2, label: "Touches finales...", sublabel: "Polissage & optimisation" },
];

export function GeneratingAnimation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const { shouldReduceMotion, maxParticles, allowInfiniteAnimations, allowComplexShadows } = useReducedMotion();

  // Mémoriser le nombre de particules pour éviter les recalculs
  const particleCount = useMemo(() => Math.min(maxParticles, 20), [maxParticles]);
  const sparkleCount = useMemo(() => shouldReduceMotion ? 3 : 8, [shouldReduceMotion]);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % STEPS.length);
    }, shouldReduceMotion ? 2500 : 2000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + (shouldReduceMotion ? 1 : 0.5);
      });
    }, shouldReduceMotion ? 80 : 50);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [shouldReduceMotion]);

  // Animation simplifiée pour mode réduit
  const orbAnimation = allowInfiniteAnimations ? {
    boxShadow: [
      `0 0 60px ${STUDIO.or}30, inset 0 0 40px ${STUDIO.or}10, 0 20px 40px ${STUDIO.noir}`,
      `0 0 80px ${STUDIO.or}50, inset 0 0 60px ${STUDIO.or}20, 0 20px 40px ${STUDIO.noir}`,
      `0 0 60px ${STUDIO.or}30, inset 0 0 40px ${STUDIO.or}10, 0 20px 40px ${STUDIO.noir}`,
    ],
  } : {};

  const orbTransition = allowInfiniteAnimations ? { duration: 2, repeat: Infinity } : { duration: 0 };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: shouldReduceMotion ? 0.15 : 0.3 }}
      className="relative flex flex-col items-center justify-center py-16 px-8 min-h-[500px] overflow-hidden"
      style={{ backgroundColor: STUDIO.noir }}
    >
      {/* Background Effects - Simplifié sur mobile */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial gradient - Statique si mode réduit */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full will-change-transform"
          style={{ 
            background: `radial-gradient(circle, ${STUDIO.or}15 0%, transparent 70%)`,
          }}
          animate={allowInfiniteAnimations ? {
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5],
          } : {
            scale: 1.15,
            opacity: 0.65,
          }}
          transition={allowInfiniteAnimations ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
        />
        
        {/* Orbiting particles - Réduit sur mobile */}
        {[...Array(particleCount)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full will-change-transform"
            style={{
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              backgroundColor: i % 2 === 0 ? STUDIO.or : STUDIO.ivoire,
              left: "50%",
              top: "50%",
              opacity: 0.6,
              // Position statique pour mode réduit
              transform: shouldReduceMotion 
                ? `translate(${Math.cos((i * Math.PI * 2) / particleCount) * (100 + i * 8)}px, ${Math.sin((i * Math.PI * 2) / particleCount) * (100 + i * 8)}px)`
                : undefined,
            }}
            animate={allowInfiniteAnimations ? {
              x: [
                Math.cos((i * Math.PI * 2) / particleCount) * (100 + i * 8),
                Math.cos((i * Math.PI * 2) / particleCount + Math.PI) * (100 + i * 8),
                Math.cos((i * Math.PI * 2) / particleCount) * (100 + i * 8),
              ],
              y: [
                Math.sin((i * Math.PI * 2) / particleCount) * (100 + i * 8),
                Math.sin((i * Math.PI * 2) / particleCount + Math.PI) * (100 + i * 8),
                Math.sin((i * Math.PI * 2) / particleCount) * (100 + i * 8),
              ],
              opacity: [0.2, 0.8, 0.2],
            } : undefined}
            transition={allowInfiniteAnimations ? {
              duration: 6 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1,
            } : undefined}
          />
        ))}
        
        {/* Grid lines */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(${STUDIO.or} 1px, transparent 1px),
              linear-gradient(90deg, ${STUDIO.or} 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Main 3D Orb Animation */}
      <div className="relative w-48 h-48 mb-10" style={{ perspective: shouldReduceMotion ? undefined : "1000px" }}>
        {/* Outer rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full will-change-transform"
          style={{
            border: `2px solid ${STUDIO.or}30`,
            boxShadow: allowComplexShadows ? `0 0 40px ${STUDIO.or}20` : undefined,
          }}
          animate={allowInfiniteAnimations ? { rotateY: 360, rotateX: 15 } : { rotateY: 0, rotateX: 5 }}
          transition={allowInfiniteAnimations ? { duration: 8, repeat: Infinity, ease: "linear" } : { duration: 0 }}
        />
        
        {/* Second ring - opposite direction (caché en mode réduit) */}
        {!shouldReduceMotion && (
          <motion.div
            className="absolute inset-4 rounded-full will-change-transform"
            style={{
              border: `1px solid ${STUDIO.or}20`,
            }}
            animate={{ rotateY: -360, rotateZ: 10 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
        )}
        
        {/* Third ring with gradient (caché en mode réduit) */}
        {!shouldReduceMotion && (
          <motion.div
            className="absolute inset-8 rounded-full overflow-hidden will-change-transform"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `conic-gradient(from 0deg, ${STUDIO.or}, transparent 30%, transparent 70%, ${STUDIO.or})`,
                opacity: 0.6,
              }}
            />
          </motion.div>
        )}
        
        {/* Inner glowing orb */}
        <motion.div
          className="absolute inset-12 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${STUDIO.noirCard} 0%, ${STUDIO.noir} 100%)`,
            border: `1px solid ${STUDIO.or}40`,
            boxShadow: allowComplexShadows 
              ? `0 0 60px ${STUDIO.or}30, inset 0 0 40px ${STUDIO.or}10, 0 20px 40px ${STUDIO.noir}`
              : `0 0 30px ${STUDIO.or}20`,
          }}
          animate={orbAnimation}
          transition={orbTransition}
        >
          {/* Animated Icon */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ scale: shouldReduceMotion ? 0.9 : 0, rotate: shouldReduceMotion ? 0 : -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: shouldReduceMotion ? 0.9 : 0, rotate: shouldReduceMotion ? 0 : 180, opacity: 0 }}
              transition={shouldReduceMotion 
                ? { duration: 0.15 }
                : { type: "spring", stiffness: 200, damping: 15 }
              }
            >
              {(() => {
                const Icon = STEPS[currentStep].icon;
                return (
                  <Icon 
                    className="w-10 h-10" 
                    style={{ color: STUDIO.or }}
                  />
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
        
        {/* Floating sparkles - Réduit sur mobile */}
        {[...Array(sparkleCount)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute will-change-transform"
            style={{
              left: "50%",
              top: "50%",
            }}
            animate={allowInfiniteAnimations ? {
              x: [0, Math.cos((i * Math.PI * 2) / sparkleCount) * 90, 0],
              y: [0, Math.sin((i * Math.PI * 2) / sparkleCount) * 90, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            } : {
              x: Math.cos((i * Math.PI * 2) / sparkleCount) * 60,
              y: Math.sin((i * Math.PI * 2) / sparkleCount) * 60,
              opacity: 0.5,
            }}
            transition={allowInfiniteAnimations ? {
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.25,
              ease: "easeOut",
            } : { duration: 0 }}
          >
            <Sparkles size={12} style={{ color: STUDIO.or }} />
          </motion.div>
        ))}
      </div>

      {/* Text Content */}
      <div className="relative z-10 text-center">
        <motion.div
          className="mb-3"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.15 : 0.3 }}
        >
          <span 
            className="text-[10px] uppercase tracking-[0.4em] px-4 py-1.5 rounded-full"
            style={{ 
              backgroundColor: `${STUDIO.or}15`,
              color: STUDIO.or,
              border: `1px solid ${STUDIO.or}30`,
            }}
          >
            IA en action
          </span>
        </motion.div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
            transition={{ duration: shouldReduceMotion ? 0.2 : 0.5 }}
            className="mt-6"
          >
            <h3 
              className="text-2xl font-light tracking-tight mb-2"
              style={{ color: STUDIO.ivoire }}
            >
              {STEPS[currentStep].label}
            </h3>
            <p 
              className="text-sm font-light"
              style={{ color: STUDIO.gris }}
            >
              {STEPS[currentStep].sublabel}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="relative z-10 mt-10 w-full max-w-xs">
        <div 
          className="h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: `${STUDIO.ivoire}10` }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${STUDIO.or} 0%, ${STUDIO.orLight} 100%)`,
              boxShadow: allowComplexShadows ? `0 0 20px ${STUDIO.or}60` : undefined,
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
        
        {/* Step indicators - Simplifié sur mobile */}
        <div className="flex justify-between mt-4">
          {STEPS.map((step, idx) => (
            <motion.div
              key={idx}
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: idx <= currentStep ? `${STUDIO.or}20` : `${STUDIO.ivoire}05`,
                border: `1px solid ${idx <= currentStep ? STUDIO.or : STUDIO.ivoire}20`,
              }}
              animate={!shouldReduceMotion && idx === currentStep ? {
                scale: [1, 1.2, 1],
                boxShadow: [`0 0 0px ${STUDIO.or}`, `0 0 20px ${STUDIO.or}60`, `0 0 0px ${STUDIO.or}`],
              } : {
                scale: 1,
              }}
              transition={{ duration: 1, repeat: !shouldReduceMotion && idx === currentStep ? Infinity : 0 }}
            >
              {idx < currentStep ? (
                <motion.div
                  initial={{ scale: shouldReduceMotion ? 1 : 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: STUDIO.or }}
                />
              ) : idx === currentStep ? (
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: STUDIO.or }}
                  animate={allowInfiniteAnimations ? { scale: [1, 1.5, 1] } : { scale: 1 }}
                  transition={allowInfiniteAnimations ? { duration: 1, repeat: Infinity } : { duration: 0 }}
                />
              ) : null}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tip with animation - Simplifié */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: shouldReduceMotion ? 0.3 : 1, duration: shouldReduceMotion ? 0.2 : 0.4 }}
        className="relative z-10 mt-10 flex items-center gap-3 px-5 py-3 rounded-xl"
        style={{ 
          backgroundColor: `${STUDIO.noirCard}80`,
          border: `1px solid ${STUDIO.ivoire}10`,
        }}
      >
        <motion.div
          animate={allowInfiniteAnimations ? { rotate: [0, 15, -15, 0] } : {}}
          transition={allowInfiniteAnimations ? { duration: 2, repeat: Infinity } : {}}
        >
          <Zap size={16} style={{ color: STUDIO.or }} />
        </motion.div>
        <span className="text-xs" style={{ color: STUDIO.gris }}>
          Notre IA crée votre site en moins de 30 secondes
        </span>
      </motion.div>
    </motion.div>
  );
}
