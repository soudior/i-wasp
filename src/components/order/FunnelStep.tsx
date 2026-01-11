/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FUNNEL STEP — VERROUILLÉ
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Container standard pour chaque étape du tunnel:
 * - Une action par écran
 * - Une décision maximum par étape
 * - Scroll automatique en haut
 * - Navigation linéaire, sans surprise
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useEffect, ReactNode } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrderProgressBar } from "@/components/order/OrderProgressBar";
import { PageTransition } from "@/components/order/PageTransition";
import { PremiumButton } from "@/components/order/PremiumButton";
import { ArrowLeft } from "lucide-react";

interface FunnelStepProps {
  currentStep: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  
  // Navigation
  onBack?: () => void;
  onContinue?: () => void;
  backLabel?: string;
  continueLabel?: string;
  
  // Button state
  canContinue?: boolean;
  isLoading?: boolean;
  showContinue?: boolean;
  showBack?: boolean;
  
  // Optional footer content above buttons
  footerContent?: ReactNode;
}

export function FunnelStep({
  currentStep,
  title,
  subtitle,
  children,
  onBack,
  onContinue,
  backLabel = "Retour",
  continueLabel = "Continuer",
  canContinue = true,
  isLoading = false,
  showContinue = true,
  showBack = true,
  footerContent,
}: FunnelStepProps) {
  
  // VERROUILLÉ: Scroll en haut à chaque étape
  useEffect(() => {
    // Multiple méthodes pour compatibilité maximale
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // RAF pour s'assurer du rendu
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-deep-black">
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-40 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Progress Bar - Discret */}
            <OrderProgressBar currentStep={currentStep} />

            {/* Header - Clair et concis */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-display text-off-white mb-2">
                {title}
              </h1>
              {subtitle && (
                <p className="text-soft-gray">
                  {subtitle}
                </p>
              )}
            </motion.div>

            {/* Main Content - Une action par écran */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
            >
              {children}
            </motion.div>
          </div>
        </main>

        {/* Fixed Bottom Navigation - Toujours visible */}
        <div className="fixed bottom-0 left-0 right-0 bg-deep-black/95 backdrop-blur-lg border-t border-anthracite-light z-40">
          <div className="max-w-2xl mx-auto px-4 py-4 safe-area-inset-bottom">
            {/* Optional footer content */}
            {footerContent && (
              <div className="mb-4">
                {footerContent}
              </div>
            )}
            
            {/* Navigation buttons */}
            <div className="flex gap-3">
              {showBack && onBack && (
                <motion.button
                  onClick={onBack}
                  className="flex items-center justify-center gap-2 px-4 h-14 rounded-full 
                    text-soft-gray hover:text-off-white hover:bg-anthracite/50
                    transition-colors touch-manipulation"
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span className="hidden sm:inline">{backLabel}</span>
                </motion.button>
              )}
              
              {showContinue && onContinue && (
                <PremiumButton
                  onClick={onContinue}
                  disabled={!canContinue}
                  isLoading={isLoading}
                  className="flex-1"
                >
                  {continueLabel}
                </PremiumButton>
              )}
            </div>
          </div>
        </div>
      </PageTransition>

      <Footer />
    </div>
  );
}

export default FunnelStep;
