/**
 * OnboardingStepper - Visual 5-step progress indicator
 * Apple Cupertino style, mobile-first
 */

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  { id: 1, title: "Créer", description: "Votre carte digitale" },
  { id: 2, title: "Personnaliser", description: "Design & infos" },
  { id: 3, title: "Lier", description: "Carte NFC" },
  { id: 4, title: "Tester", description: "Premier scan" },
  { id: 5, title: "Commander", description: "Carte physique" },
];

interface OnboardingStepperProps {
  currentStep?: number;
  className?: string;
}

export function OnboardingStepper({ currentStep = 0, className }: OnboardingStepperProps) {
  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      {/* Steps container */}
      <div className="flex items-start justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500 ease-out"
          style={{ width: `${Math.max(0, ((currentStep - 1) / (steps.length - 1)) * 100)}%` }}
        />
        
        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          
          return (
            <div 
              key={step.id} 
              className="flex flex-col items-center relative z-10"
            >
              {/* Step circle */}
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                  isCompleted && "bg-primary text-primary-foreground",
                  isActive && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  !isCompleted && !isActive && "bg-secondary text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check size={18} strokeWidth={3} />
                ) : (
                  step.id
                )}
              </div>
              
              {/* Step label */}
              <div className="mt-3 text-center">
                <p 
                  className={cn(
                    "text-xs font-medium transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </p>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5 hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { steps };
