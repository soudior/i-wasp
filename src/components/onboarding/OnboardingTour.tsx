/**
 * OnboardingTour - Interactive Product Tour
 * 
 * Apple-like guided tour with spotlight tooltips
 * Shows key features to new users
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

interface TourStep {
  id: string;
  target: string; // CSS selector
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
  route?: string; // Optional route to navigate to
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    target: "body",
    title: "Bienvenue sur i-wasp 👋",
    description: "Découvrez comment créer votre carte NFC digitale en quelques étapes simples.",
    position: "bottom",
  },
  {
    id: "create-card",
    target: '[data-tour="create-card"]',
    title: "Créez votre carte",
    description: "Appuyez ici pour créer votre première carte NFC personnalisée.",
    position: "top",
  },
  {
    id: "dashboard",
    target: '[data-tour="dashboard"]',
    title: "Votre Dashboard",
    description: "Accédez à toutes vos cartes, statistiques et contacts depuis votre espace personnel.",
    position: "top",
  },
  {
    id: "profile",
    target: '[data-tour="profile"]',
    title: "Votre Profil",
    description: "Gérez vos paramètres et personnalisez votre expérience i-wasp.",
    position: "top",
  },
];

const TOUR_KEY = "iwasp-onboarding-tour-completed";

export function OnboardingTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if tour should be shown
  useEffect(() => {
    const hasCompletedTour = localStorage.getItem(TOUR_KEY);
    const isHomePage = location.pathname === "/";
    
    // Only show on home page for new users, after a delay
    if (!hasCompletedTour && isHomePage) {
      const timer = setTimeout(() => {
        setIsActive(true);
      }, 2000); // Show after 2 seconds on home page
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  // Find and highlight target element
  useEffect(() => {
    if (!isActive) return;

    const step = TOUR_STEPS[currentStep];
    if (!step) return;

    const findTarget = () => {
      if (step.target === "body") {
        // Center modal for welcome step
        setTargetRect(null);
        return;
      }

      const element = document.querySelector(step.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
      } else {
        setTargetRect(null);
      }
    };

    // Initial find
    findTarget();

    // Re-find on scroll/resize
    window.addEventListener("scroll", findTarget, { passive: true });
    window.addEventListener("resize", findTarget);

    return () => {
      window.removeEventListener("scroll", findTarget);
      window.removeEventListener("resize", findTarget);
    };
  }, [isActive, currentStep]);

  const triggerHaptic = useCallback(async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      // Haptics not available
    }
  }, []);

  const handleNext = useCallback(() => {
    triggerHaptic();
    if (currentStep < TOUR_STEPS.length - 1) {
      const nextStep = TOUR_STEPS[currentStep + 1];
      if (nextStep.route && location.pathname !== nextStep.route) {
        navigate(nextStep.route);
      }
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  }, [currentStep, location.pathname, navigate, triggerHaptic]);

  const handlePrev = useCallback(() => {
    triggerHaptic();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, triggerHaptic]);

  const handleComplete = useCallback(() => {
    triggerHaptic();
    localStorage.setItem(TOUR_KEY, "true");
    setIsActive(false);
  }, [triggerHaptic]);

  const handleSkip = useCallback(() => {
    triggerHaptic();
    localStorage.setItem(TOUR_KEY, "true");
    setIsActive(false);
  }, [triggerHaptic]);

  if (!isActive) return null;

  const step = TOUR_STEPS[currentStep];
  const isLastStep = currentStep === TOUR_STEPS.length - 1;
  const isFirstStep = currentStep === 0;
  const isWelcomeStep = step.target === "body";

  // Calculate tooltip position
  const getTooltipStyle = () => {
    if (!targetRect || isWelcomeStep) {
      return {
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    const padding = 16;
    const tooltipWidth = 320;
    const tooltipHeight = 180;

    switch (step.position) {
      case "top":
        return {
          left: Math.max(padding, Math.min(window.innerWidth - tooltipWidth - padding, targetRect.left + targetRect.width / 2 - tooltipWidth / 2)),
          top: Math.max(padding, targetRect.top - tooltipHeight - 16),
        };
      case "bottom":
        return {
          left: Math.max(padding, Math.min(window.innerWidth - tooltipWidth - padding, targetRect.left + targetRect.width / 2 - tooltipWidth / 2)),
          top: targetRect.bottom + 16,
        };
      case "left":
        return {
          left: Math.max(padding, targetRect.left - tooltipWidth - 16),
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
        };
      case "right":
        return {
          left: targetRect.right + 16,
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
        };
      default:
        return {
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        };
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100]"
      >
        {/* Backdrop with spotlight */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm">
          {targetRect && !isWelcomeStep && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute rounded-2xl ring-4 ring-primary/50 ring-offset-4 ring-offset-transparent"
              style={{
                left: targetRect.left - 8,
                top: targetRect.top - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.7)",
              }}
            />
          )}
        </div>

        {/* Tooltip Card */}
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute z-10 w-80 max-w-[calc(100vw-32px)]"
          style={getTooltipStyle()}
        >
          <div className="bg-[#0A0A0A] border border-[#B8956C]/30 rounded-2xl p-5 shadow-2xl shadow-black/60">
            {/* Close button */}
            <button
              onClick={handleSkip}
              className="absolute top-3 right-3 p-1.5 rounded-full text-[#6B6B6B] hover:text-[#F5F5F5] hover:bg-white/10 transition-colors"
            >
              <X size={16} />
            </button>

            {/* Welcome icon */}
            {isWelcomeStep && (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B8956C] to-[#D4B896] flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-7 h-7 text-[#0A0A0A]" />
              </div>
            )}

            {/* Content */}
            <div className={isWelcomeStep ? "text-center" : ""}>
              <h3 className="text-[#F5F5F5] font-semibold text-lg mb-2 tracking-wide">
                {step.title}
              </h3>
              <p className="text-[#8E8E93] text-sm leading-relaxed mb-5">
                {step.description}
              </p>
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1.5 mb-4">
              {TOUR_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? "w-6 bg-[#B8956C]"
                      : index < currentStep
                      ? "bg-[#B8956C]/60"
                      : "bg-[#3A3A3C]"
                  }`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {!isFirstStep && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrev}
                  className="flex-1 text-[#8E8E93] hover:text-[#F5F5F5] hover:bg-white/10"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Retour
                </Button>
              )}
              
              <Button
                size="sm"
                onClick={handleNext}
                className={`flex-1 bg-[#B8956C] hover:bg-[#D4B896] text-[#0A0A0A] font-semibold ${
                  isFirstStep ? "w-full" : ""
                }`}
              >
                {isLastStep ? (
                  <>
                    <Check size={16} className="mr-1" />
                    Terminer
                  </>
                ) : (
                  <>
                    Suivant
                    <ArrowRight size={16} className="ml-1" />
                  </>
                )}
              </Button>
            </div>

            {/* Skip link */}
            {!isLastStep && (
              <button
                onClick={handleSkip}
                className="w-full mt-3 text-center text-xs text-[#6B6B6B] hover:text-[#8E8E93] transition-colors"
              >
                Passer le tour
              </button>
            )}
          </div>

          {/* Arrow pointer (for non-welcome steps) */}
          {!isWelcomeStep && targetRect && (
            <div
              className={`absolute w-4 h-4 bg-[#0A0A0A] border-[#B8956C]/30 transform rotate-45 ${
                step.position === "top"
                  ? "bottom-[-8px] left-1/2 -translate-x-1/2 border-r border-b"
                  : step.position === "bottom"
                  ? "top-[-8px] left-1/2 -translate-x-1/2 border-l border-t"
                  : step.position === "left"
                  ? "right-[-8px] top-1/2 -translate-y-1/2 border-t border-r"
                  : "left-[-8px] top-1/2 -translate-y-1/2 border-b border-l"
              }`}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook to restart tour
export function useOnboardingTour() {
  const restartTour = useCallback(() => {
    localStorage.removeItem(TOUR_KEY);
    window.location.reload();
  }, []);

  return { restartTour };
}
