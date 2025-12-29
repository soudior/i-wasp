/**
 * IWASP Lead Consent Modal
 * Apple-level premium consent flow - Non-blocking
 * RGPD compliant - Explicit consent required
 */

import { motion, AnimatePresence } from "framer-motion";
import { Share2, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeadConsentModalProps {
  open: boolean;
  onConsent: () => void;
  onDecline: () => void;
  cardOwnerName: string;
  cardOwnerPhoto?: string | null;
}

export function LeadConsentModal({ 
  open, 
  onConsent, 
  onDecline, 
  cardOwnerName,
  cardOwnerPhoto
}: LeadConsentModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop - Subtle blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onDecline}
          />
          
          {/* Modal - Apple-style center dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto"
          >
            <div className="bg-background border border-border/30 rounded-3xl shadow-2xl overflow-hidden">
              {/* Card owner avatar */}
              <div className="pt-8 pb-4 px-6 text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-foreground/10 flex items-center justify-center mx-auto mb-4 ring-4 ring-foreground/5">
                  {cardOwnerPhoto ? (
                    <img src={cardOwnerPhoto} alt={cardOwnerName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-semibold text-foreground/60">
                      {cardOwnerName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </span>
                  )}
                </div>
                
                <h2 className="font-display text-xl font-semibold text-foreground tracking-tight mb-3">
                  Souhaitez-vous partager vos coordonnées avec ce contact ?
                </h2>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Vos informations resteront privées et ne seront jamais partagées sans votre accord.
                </p>
              </div>
              
              {/* Actions */}
              <div className="px-4 pb-4 space-y-2">
                <Button
                  onClick={onConsent}
                  className="w-full h-13 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-medium text-base"
                >
                  <Share2 size={18} className="mr-2" />
                  Partager mes coordonnées
                </Button>
                
                <Button
                  onClick={onDecline}
                  variant="ghost"
                  className="w-full h-11 rounded-xl text-muted-foreground hover:text-foreground"
                >
                  Continuer sans partager
                </Button>
              </div>
              
              {/* RGPD Badge */}
              <div className="flex items-center justify-center gap-2 py-4 border-t border-border/30 text-xs text-muted-foreground/60">
                <Shield size={12} />
                <span>Conforme RGPD · Consentement explicite</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
