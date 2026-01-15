import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ExitIntentPopupProps {
  discountCode?: string;
  discountPercent?: number;
}

export function ExitIntentPopup({ 
  discountCode = "IWASP10", 
  discountPercent = 10 
}: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Check if popup was already shown in this session
  useEffect(() => {
    const popupShown = sessionStorage.getItem("exit-popup-shown");
    if (popupShown) {
      setHasShown(true);
    }
  }, []);

  // Exit intent detection
  const handleMouseLeave = useCallback((e: MouseEvent) => {
    // Only trigger when mouse leaves through top of viewport
    if (e.clientY <= 5 && !hasShown && !isVisible) {
      setIsVisible(true);
      setHasShown(true);
      sessionStorage.setItem("exit-popup-shown", "true");
    }
  }, [hasShown, isVisible]);

  // Mobile: detect back button or scroll to top aggressively
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && !hasShown) {
      // User is leaving the tab
      setIsVisible(true);
      setHasShown(true);
      sessionStorage.setItem("exit-popup-shown", "true");
    }
  }, [hasShown]);

  useEffect(() => {
    // Desktop: mouse leave detection
    document.addEventListener("mouseleave", handleMouseLeave);
    
    // Mobile: visibility change
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleMouseLeave, handleVisibilityChange]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(discountCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = discountCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={handleClose}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-[101] inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md sm:w-full"
          >
            <div className="bg-[hsl(0,0%,8%)] border border-foreground/10 p-8 sm:p-10 relative overflow-hidden">
              {/* Subtle gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(210,30%,50%)] to-transparent" />

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="text-center">
                {/* Discount badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-flex items-center justify-center mb-6"
                >
                  <span className="px-4 py-2 border border-[hsl(210,30%,50%)] text-[hsl(210,30%,60%)] font-body text-xs tracking-[0.3em] uppercase">
                    Offre exclusive
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="font-display text-3xl sm:text-4xl tracking-wide text-foreground mb-4"
                >
                  -{discountPercent}% sur votre carte
                </motion.h2>

                {/* Subtext */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="font-body text-muted-foreground mb-8 leading-relaxed"
                >
                  Avant de partir, profitez d'une réduction exclusive
                  sur votre première carte I-WASP.
                </motion.p>

                {/* Discount code */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mb-8"
                >
                  <button
                    onClick={handleCopyCode}
                    className="group relative w-full py-4 px-6 bg-[hsl(0,0%,12%)] border border-foreground/10 hover:border-[hsl(210,30%,50%)/40] transition-all duration-500"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-body text-xs text-muted-foreground tracking-wide uppercase">
                        Code promo
                      </span>
                      <span className="font-body text-xs text-[hsl(210,30%,60%)] tracking-wide">
                        {codeCopied ? "Copié !" : "Cliquer pour copier"}
                      </span>
                    </div>
                    <div className="mt-2 font-display text-2xl tracking-[0.2em] text-foreground">
                      {discountCode}
                    </div>
                  </button>
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="space-y-4"
                >
                  <Link
                    to="/express/offre"
                    onClick={handleClose}
                    className="group relative flex items-center justify-center gap-3 w-full py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase overflow-hidden transition-all duration-700"
                  >
                    <span className="relative z-10">Profiter de l'offre</span>
                    <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-[hsl(210,30%,50%)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
                  </Link>

                  <button
                    onClick={handleClose}
                    className="w-full py-3 font-body text-xs text-muted-foreground hover:text-foreground tracking-wide transition-colors duration-300"
                  >
                    Non merci, je continue sans réduction
                  </button>
                </motion.div>

                {/* Trust line */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="mt-6 font-body text-xs text-muted-foreground/60"
                >
                  Offre limitée. Code valable 24h.
                </motion.p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
