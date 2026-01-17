/**
 * WizardProgress - Barre de progression premium IWASP
 * 
 * OPTIMISÉ POUR MOBILE:
 * - Animations réduites sur appareils peu puissants
 * - Support de prefers-reduced-motion
 */

import { motion } from "framer-motion";
import { Check, LucideIcon } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Step {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

interface WizardProgressProps {
  steps: Step[];
  currentStep: number;
  validation: Record<string, boolean>;
}

export function WizardProgress({ steps, currentStep, validation }: WizardProgressProps) {
  const { shouldReduceMotion, allowInfiniteAnimations } = useReducedMotion();
  
  return (
    <div className="flex items-center gap-1 md:gap-2">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep || validation[step.id];
        const isPast = index < currentStep;
        
        return (
          <div key={step.id} className="flex items-center">
            {/* Step indicator */}
            <div className="relative">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive && !shouldReduceMotion ? 1.1 : 1,
                  backgroundColor: isCompleted 
                    ? "hsl(var(--accent))" 
                    : isActive 
                      ? "hsl(var(--primary))" 
                      : "hsl(var(--muted))",
                }}
                transition={{ duration: shouldReduceMotion ? 0.1 : 0.3, ease: "easeInOut" }}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                  isCompleted || isActive ? "text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {isPast ? (
                  <Check size={16} />
                ) : (
                  <step.icon size={16} />
                )}
              </motion.div>
              
              {/* Active pulse - Désactivé en mode réduit */}
              {isActive && allowInfiniteAnimations && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.3, opacity: 0 }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                  className="absolute inset-0 rounded-full bg-primary/30"
                />
              )}
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="w-4 md:w-8 h-0.5 mx-1">
                <motion.div
                  initial={false}
                  animate={{
                    scaleX: isPast ? 1 : shouldReduceMotion ? 0.3 : 0,
                    backgroundColor: isPast 
                      ? "hsl(var(--accent))" 
                      : "hsl(var(--border))",
                  }}
                  transition={{ duration: shouldReduceMotion ? 0.1 : 0.3, ease: "easeInOut" }}
                  className="h-full origin-left bg-border"
                  style={{ 
                    scaleX: isPast ? 1 : 0.3,
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default WizardProgress;