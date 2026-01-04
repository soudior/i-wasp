/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ORDER PROGRESS BAR — VERROUILLÉ
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * NE PAS MODIFIER SANS INSTRUCTION EXPLICITE
 * 
 * Design: Discret, minimal, mobile-first
 * - Progression claire et visible
 * - Pas de distraction
 * - Navigation linéaire uniquement
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useOrderFunnel } from "@/contexts/OrderFunnelContext";

// Étapes simplifiées pour un tunnel premium
const STEPS = [
  { number: 1, label: "Type" },
  { number: 2, label: "Infos" },
  { number: 3, label: "Adresse" },
  { number: 4, label: "Design" },
  { number: 5, label: "Options" },
  { number: 6, label: "Récap" },
  { number: 7, label: "Paiement" },
];

interface OrderProgressBarProps {
  currentStep: number;
}

export function OrderProgressBar({ currentStep }: OrderProgressBarProps) {
  const { canAccessStep, goToStep } = useOrderFunnel();

  // Calcul du pourcentage de progression
  const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-8">
      {/* Barre de progression principale - Ultra simple */}
      <div className="relative h-1 bg-muted rounded-full overflow-hidden mb-4">
        <motion.div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-amber-400 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Indicateurs d'étapes - Mobile: compact, Desktop: avec labels */}
      <div className="flex justify-between items-center">
        {STEPS.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isAccessible = canAccessStep(step.number);

          return (
            <button
              key={step.number}
              onClick={() => isAccessible && goToStep(step.number)}
              disabled={!isAccessible}
              className="flex flex-col items-center gap-1 group touch-manipulation"
              aria-label={`Étape ${step.number}: ${step.label}`}
            >
              {/* Circle indicator */}
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.15 : 1,
                  backgroundColor: isCompleted || isCurrent 
                    ? "hsl(var(--primary))" 
                    : "hsl(var(--muted))",
                }}
                transition={{ duration: 0.15 }}
                className={`
                  w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center
                  font-semibold text-xs z-10
                  ${isCompleted || isCurrent 
                    ? "text-primary-foreground" 
                    : "text-muted-foreground"
                  }
                  ${isAccessible && !isCurrent 
                    ? "cursor-pointer active:scale-95" 
                    : "cursor-default"
                  }
                  transition-transform duration-100
                `}
              >
                {isCompleted ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  step.number
                )}
              </motion.div>

              {/* Label - Hidden on mobile, visible on larger screens */}
              <span 
                className={`
                  text-xs font-medium transition-colors duration-150
                  hidden sm:block
                  ${isCurrent 
                    ? "text-primary" 
                    : isCompleted 
                      ? "text-foreground" 
                      : "text-muted-foreground"
                  }
                `}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile: Current step label - Always visible */}
      <div className="sm:hidden text-center mt-3">
        <span className="text-sm font-medium text-primary">
          {currentStep}/{STEPS.length} · {STEPS[currentStep - 1]?.label}
        </span>
      </div>
    </div>
  );
}
