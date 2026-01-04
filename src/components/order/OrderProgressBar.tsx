/**
 * ORDER PROGRESS BAR — 5 ÉTAPES
 */

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useOrderFunnel, STEP_LABELS, TOTAL_STEPS } from "@/contexts/OrderFunnelContext";

interface OrderProgressBarProps {
  currentStep: number;
}

export function OrderProgressBar({ currentStep }: OrderProgressBarProps) {
  const { canAccessStep, goToStep, state } = useOrderFunnel();

  const progressPercent = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-8">
      {/* Barre de progression - Jaune #FFC700 */}
      <div className="relative h-1.5 bg-muted rounded-full overflow-hidden mb-4">
        <motion.div 
          className="absolute inset-y-0 left-0 bg-[#FFC700] rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Indicateurs d'étapes */}
      <div className="flex justify-between items-center">
        {STEP_LABELS.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;
          const isAccessible = canAccessStep(stepNumber);

          return (
            <button
              key={stepNumber}
              onClick={() => isAccessible && !state.isTransitioning && goToStep(stepNumber)}
              disabled={!isAccessible || state.isTransitioning}
              className="flex flex-col items-center gap-1 group touch-manipulation"
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.15 : 1,
                  backgroundColor: isCompleted || isCurrent 
                    ? "#FFC700" 
                    : "hsl(var(--muted))",
                }}
                transition={{ duration: 0.15 }}
                className={`
                  w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center
                  font-semibold text-xs z-10
                  ${isCompleted || isCurrent ? "text-black" : "text-muted-foreground"}
                  ${isAccessible && !isCurrent && !state.isTransitioning ? "cursor-pointer active:scale-95" : "cursor-default"}
                `}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : stepNumber}
              </motion.div>

              <span className={`text-xs font-medium hidden sm:block ${
                isCurrent ? "text-[#FFC700]" : isCompleted ? "text-foreground" : "text-muted-foreground"
              }`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile: Current step */}
      <div className="sm:hidden text-center mt-3">
        <span className="text-sm font-medium text-[#FFC700]">
          {currentStep}/{TOTAL_STEPS} · {STEP_LABELS[currentStep - 1]}
        </span>
      </div>
    </div>
  );
}
