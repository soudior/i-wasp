/**
 * Studio Funnel Step - Container pour chaque étape du tunnel Web Studio
 */

import { useEffect, ReactNode } from "react";
import { motion } from "framer-motion";
import { CoutureNavbar } from "@/components/CoutureNavbar";
import { CoutureFooter } from "@/components/CoutureFooter";
import { StudioProgressBar } from "./StudioProgressBar";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

const STUDIO = {
  noir: "#050505",
  noirCard: "#111111",
  or: "#D4A853",
  orLight: "#E8C87A",
  ivoire: "#F5F5F5",
  gris: "#6B6B6B",
};

interface StudioFunnelStepProps {
  currentStep: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onBack?: () => void;
  onContinue?: () => void;
  backLabel?: string;
  continueLabel?: string;
  canContinue?: boolean;
  isLoading?: boolean;
  showContinue?: boolean;
  showBack?: boolean;
  footerContent?: ReactNode;
}

export function StudioFunnelStep({
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
}: StudioFunnelStepProps) {
  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [currentStep]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: STUDIO.noir }}>
      <CoutureNavbar />

      <main className="pt-24 pb-40 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <StudioProgressBar currentStep={currentStep} />

          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1
              className="text-2xl md:text-3xl font-light tracking-tight mb-2"
              style={{ color: STUDIO.ivoire }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm" style={{ color: STUDIO.gris }}>
                {subtitle}
              </p>
            )}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Fixed Bottom Navigation */}
      <div
        className="fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t z-40"
        style={{
          backgroundColor: `${STUDIO.noir}F0`,
          borderColor: `${STUDIO.ivoire}10`,
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-4 safe-area-inset-bottom">
          {footerContent && <div className="mb-4">{footerContent}</div>}

          <div className="flex gap-3">
            {showBack && onBack && (
              <motion.button
                onClick={onBack}
                className="flex items-center justify-center gap-2 px-4 h-14 rounded-xl transition-colors"
                style={{
                  color: STUDIO.gris,
                  backgroundColor: `${STUDIO.ivoire}05`,
                }}
                whileHover={{ backgroundColor: `${STUDIO.ivoire}10` }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">{backLabel}</span>
              </motion.button>
            )}

            {showContinue && onContinue && (
              <motion.button
                onClick={onContinue}
                disabled={!canContinue || isLoading}
                className="flex-1 flex items-center justify-center gap-2 h-14 rounded-xl font-medium text-sm relative overflow-hidden"
                style={{
                  background: canContinue
                    ? `linear-gradient(135deg, ${STUDIO.or} 0%, ${STUDIO.orLight} 100%)`
                    : STUDIO.gris,
                  color: canContinue ? STUDIO.noir : STUDIO.ivoire,
                  opacity: canContinue ? 1 : 0.5,
                  boxShadow: canContinue ? `0 8px 24px ${STUDIO.or}30` : "none",
                }}
                whileHover={canContinue ? { scale: 1.01 } : {}}
                whileTap={canContinue ? { scale: 0.99 } : {}}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Chargement...</span>
                  </>
                ) : (
                  <>
                    <span>{continueLabel}</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}

                {/* Shimmer effect */}
                {canContinue && !isLoading && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)`,
                    }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  />
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <CoutureFooter />
    </div>
  );
}
