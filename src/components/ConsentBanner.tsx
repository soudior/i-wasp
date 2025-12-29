/**
 * IWASP Consent Banner
 * Subtle, non-intrusive RGPD consent banner
 * Appears at bottom of screen, doesn't block content
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConsentBannerProps {
  cardId: string;
  onAccept: () => void;
  onDecline: () => void;
}

export function ConsentBanner({ cardId, onAccept, onDecline }: ConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasResponded, setHasResponded] = useState(false);

  useEffect(() => {
    // Check if user has already responded
    const consentKey = `iwasp_consent_banner_${cardId}`;
    const hasConsented = localStorage.getItem(consentKey);
    
    if (!hasConsented) {
      // Show banner after a delay for premium feel
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      setHasResponded(true);
    }
  }, [cardId]);

  const handleAccept = () => {
    localStorage.setItem(`iwasp_consent_banner_${cardId}`, "accepted");
    setHasResponded(true);
    setIsVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    localStorage.setItem(`iwasp_consent_banner_${cardId}`, "declined");
    setHasResponded(true);
    setIsVisible(false);
    onDecline();
  };

  if (hasResponded) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 z-40 max-w-lg mx-auto"
        >
          <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl shadow-black/20 p-4">
            {/* Close button */}
            <button
              onClick={handleDecline}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-secondary transition-colors"
            >
              <X size={16} className="text-muted-foreground" />
            </button>

            <div className="flex items-start gap-3">
              {/* Shield icon */}
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Shield size={20} className="text-primary" />
              </div>

              <div className="flex-1 min-w-0 pr-4">
                <p className="text-sm font-medium text-foreground mb-1">
                  Acceptez-vous de partager vos informations de visite ?
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Nous collectons des données anonymes pour améliorer votre expérience. 
                  Aucune information personnelle n'est stockée sans votre accord explicite.
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 mt-4">
              <Button
                onClick={handleAccept}
                size="sm"
                className="flex-1 h-9 rounded-xl bg-foreground text-background hover:bg-foreground/90"
              >
                <Check size={14} className="mr-1" />
                Accepter
              </Button>
              <Button
                onClick={handleDecline}
                variant="ghost"
                size="sm"
                className="h-9 rounded-xl text-muted-foreground"
              >
                Refuser
              </Button>
            </div>

            {/* RGPD badge */}
            <div className="flex items-center justify-center gap-1 mt-3 text-[10px] text-muted-foreground/60">
              <Shield size={10} />
              <span>Conforme RGPD</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
