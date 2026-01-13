/**
 * GeneratingAnimation - Animation de chargement premium
 * Affiche une animation élaborée pendant la génération IA
 */

import { motion } from "framer-motion";
import { Sparkles, Globe, Palette, Layout, Type, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const STEPS = [
  { icon: Globe, label: "Analyse du projet...", color: "#3B82F6" },
  { icon: Layout, label: "Structure des pages...", color: "#8B5CF6" },
  { icon: Palette, label: "Palette de couleurs...", color: "#EC4899" },
  { icon: Type, label: "Typographie...", color: "#F59E0B" },
  { icon: Sparkles, label: "Touches finales...", color: "#10B981" },
];

export function GeneratingAnimation() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % STEPS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-8"
    >
      {/* Main Animation */}
      <div className="relative w-40 h-40 mb-8">
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-primary/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Middle Ring */}
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-primary/30"
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner Ring with Gradient */}
        <motion.div
          className="absolute inset-8 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, ${STEPS[currentStep].color}, transparent, ${STEPS[currentStep].color})`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center Icon */}
        <div className="absolute inset-12 rounded-full bg-card flex items-center justify-center shadow-lg">
          <motion.div
            key={currentStep}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {(() => {
              const Icon = STEPS[currentStep].icon;
              return (
                <Icon 
                  className="w-10 h-10" 
                  style={{ color: STEPS[currentStep].color }}
                />
              );
            })()}
          </motion.div>
        </div>

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/40"
            style={{
              left: "50%",
              top: "50%",
            }}
            animate={{
              x: [0, Math.cos((i * Math.PI * 2) / 6) * 80, 0],
              y: [0, Math.sin((i * Math.PI * 2) / 6) * 80, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Step Label */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-center"
      >
        <h3 className="text-xl font-semibold text-foreground mb-2">
          L'IA construit votre site
        </h3>
        <p 
          className="text-sm font-medium"
          style={{ color: STEPS[currentStep].color }}
        >
          {STEPS[currentStep].label}
        </p>
      </motion.div>

      {/* Progress Dots */}
      <div className="flex gap-2 mt-6">
        {STEPS.map((step, idx) => (
          <motion.div
            key={idx}
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: idx === currentStep ? step.color : "hsl(var(--muted))",
            }}
            animate={{
              scale: idx === currentStep ? 1.3 : 1,
            }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        ))}
      </div>

      {/* Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="mt-8 flex items-center gap-2 text-xs text-muted-foreground"
      >
        <Zap className="w-3 h-3 text-primary" />
        <span>Génération en quelques secondes seulement</span>
      </motion.div>
    </motion.div>
  );
}
