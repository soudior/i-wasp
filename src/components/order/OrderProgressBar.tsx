/**
 * OrderProgressBar - Visual step indicator for order funnel
 * 
 * Clean, Apple-style progress bar with step labels
 */

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useOrderFunnel } from "@/contexts/OrderFunnelContext";

const STEPS = [
  { number: 1, label: "Offre" },
  { number: 2, label: "Infos" },
  { number: 3, label: "Design" },
  { number: 4, label: "Options" },
  { number: 5, label: "Récap" },
  { number: 6, label: "Paiement" },
];

interface OrderProgressBarProps {
  currentStep: number;
}

export function OrderProgressBar({ currentStep }: OrderProgressBarProps) {
  const { canAccessStep, goToStep } = useOrderFunnel();

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-8">
      {/* Progress Line Background */}
      <div className="relative">
        {/* Background line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted rounded-full" />
        
        {/* Active progress line */}
        <motion.div 
          className="absolute top-4 left-0 h-0.5 bg-primary rounded-full"
          initial={{ width: "0%" }}
          animate={{ 
            width: `${Math.max(0, ((currentStep - 1) / (STEPS.length - 1)) * 100)}%` 
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />

        {/* Step indicators */}
        <div className="relative flex justify-between">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const isAccessible = canAccessStep(step.number);

            return (
              <button
                key={step.number}
                onClick={() => isAccessible && goToStep(step.number)}
                disabled={!isAccessible}
                className="flex flex-col items-center gap-2 group"
              >
                {/* Circle */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted || isCurrent 
                      ? "hsl(var(--primary))" 
                      : "hsl(var(--muted))",
                  }}
                  transition={{ duration: 0.2 }}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    font-semibold text-sm z-10
                    ${isCompleted || isCurrent 
                      ? "text-primary-foreground" 
                      : "text-muted-foreground"
                    }
                    ${isAccessible && !isCurrent 
                      ? "cursor-pointer hover:ring-2 hover:ring-primary/30" 
                      : "cursor-default"
                    }
                    transition-all duration-200
                  `}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <Check size={16} strokeWidth={3} />
                    </motion.div>
                  ) : (
                    step.number
                  )}
                </motion.div>

                {/* Label */}
                <span 
                  className={`
                    text-xs font-medium transition-colors duration-200
                    ${isCurrent 
                      ? "text-primary" 
                      : isCompleted 
                        ? "text-foreground" 
                        : "text-muted-foreground"
                    }
                    hidden sm:block
                  `}
                >
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile: Current step label */}
      <div className="sm:hidden text-center mt-4">
        <span className="text-sm font-medium text-primary">
          Étape {currentStep}: {STEPS[currentStep - 1]?.label}
        </span>
      </div>
    </div>
  );
}
