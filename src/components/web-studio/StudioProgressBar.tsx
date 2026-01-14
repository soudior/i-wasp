/**
 * Studio Progress Bar - Indicateur de progression du tunnel Web Studio
 */

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useWebStudio, STEP_LABELS } from "@/contexts/WebStudioContext";

const STUDIO_GOLD = "#D4A853";

interface StudioProgressBarProps {
  currentStep: number;
}

export function StudioProgressBar({ currentStep }: StudioProgressBarProps) {
  const { canAccessStep, goToStep } = useWebStudio();
  const totalSteps = STEP_LABELS.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-8">
      {/* Progress line */}
      <div className="relative h-1 bg-white/10 rounded-full overflow-hidden mb-6">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: STUDIO_GOLD }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between">
        {STEP_LABELS.map((label, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isAccessible = canAccessStep(index);

          return (
            <button
              key={label}
              onClick={() => isAccessible && goToStep(index)}
              disabled={!isAccessible}
              className={`flex flex-col items-center gap-2 transition-all ${
                isAccessible ? "cursor-pointer" : "cursor-not-allowed opacity-50"
              }`}
            >
              {/* Circle indicator */}
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border transition-all ${
                  isCompleted
                    ? "border-transparent"
                    : isCurrent
                    ? "border-2"
                    : "border border-white/20"
                }`}
                style={{
                  backgroundColor: isCompleted ? STUDIO_GOLD : isCurrent ? `${STUDIO_GOLD}20` : "transparent",
                  borderColor: isCurrent ? STUDIO_GOLD : undefined,
                  color: isCompleted ? "#050505" : isCurrent ? STUDIO_GOLD : "#6B6B6B",
                }}
                whileHover={isAccessible ? { scale: 1.1 } : {}}
                whileTap={isAccessible ? { scale: 0.95 } : {}}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.div>

              {/* Label - Hidden on mobile except current */}
              <span
                className={`text-[10px] uppercase tracking-wider hidden sm:block ${
                  isCurrent ? "font-medium" : "font-normal"
                }`}
                style={{ color: isCurrent ? STUDIO_GOLD : "#6B6B6B" }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile: Current step label */}
      <div className="sm:hidden text-center mt-4">
        <span
          className="text-xs uppercase tracking-wider font-medium"
          style={{ color: STUDIO_GOLD }}
        >
          {STEP_LABELS[currentStep]}
        </span>
      </div>
    </div>
  );
}
