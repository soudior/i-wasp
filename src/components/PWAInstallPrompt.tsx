import { useState, useEffect } from "react";
import { X, Download, Smartphone, Share, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Don't show if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if already dismissed
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    const dismissedAt = dismissed ? parseInt(dismissed) : 0;
    const daysSinceDismissed = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
    
    // Show again after 7 days
    if (dismissedAt && daysSinceDismissed < 7) {
      return;
    }

    // Wait for page to load, then show prompt
    const timer = setTimeout(() => {
      setShow(true);
    }, 3000); // Show after 3 seconds

    // Listen for install prompt (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleDismiss = () => {
    setShow(false);
    setShowIOSGuide(false);
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShow(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      navigate('/install');
    }
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 md:bottom-6 left-4 right-4 z-[60] sm:left-auto sm:right-6 sm:max-w-sm"
      >
        {showIOSGuide ? (
          // iOS Installation Guide - Stealth Luxury
          <div className="bg-[#050807] border border-[#A5A9B4]/20 rounded-2xl p-5 shadow-2xl shadow-black/50 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#D1D5DB] font-semibold tracking-wide text-sm uppercase">Comment installer</h3>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleDismiss}
                className="h-6 w-6 text-[#A5A9B4]/50 hover:text-[#D1D5DB]"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#A5A9B4]/10 border border-[#A5A9B4]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#A5A9B4] text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="text-[#D1D5DB] text-sm">Appuyez sur le bouton</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Share className="h-5 w-5 text-[#A5A9B4]" />
                    <span className="text-[#A5A9B4]/60 text-xs">Partager</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#A5A9B4]/10 border border-[#A5A9B4]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#A5A9B4] text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="text-[#D1D5DB] text-sm">Puis sélectionnez</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Plus className="h-5 w-5 text-[#D1D5DB]" />
                    <span className="text-[#A5A9B4]/60 text-xs">Sur l'écran d'accueil</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#A5A9B4]/20 border border-[#A5A9B4]/30 flex items-center justify-center shrink-0">
                  <span className="text-[#D1D5DB] text-sm font-bold">✓</span>
                </div>
                <p className="text-[#A5A9B4]/70 text-sm">
                  L'app i-wasp sera sur votre écran d'accueil !
                </p>
              </div>
            </div>

            <Button
              onClick={handleDismiss}
              className="w-full mt-4 bg-[#A5A9B4] hover:bg-[#D1D5DB] text-[#050807] font-bold uppercase text-[10px] tracking-[0.15em] rounded-full py-3"
            >
              J'ai compris
            </Button>
          </div>
        ) : (
          // Initial Prompt - Stealth Luxury
          <div className="bg-[#050807] border border-[#A5A9B4]/20 rounded-2xl p-4 shadow-2xl shadow-black/50 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#A5A9B4]/10 border border-[#A5A9B4]/20 flex items-center justify-center shrink-0">
                <Smartphone className="h-6 w-6 text-[#A5A9B4]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#D1D5DB] mb-1 tracking-wide">
                  Installez l'app i-wasp
                </p>
                <p className="text-xs text-[#A5A9B4]/70 mb-3">
                  Accès rapide à votre profil NFC depuis l'écran d'accueil. Fonctionne hors-ligne !
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleInstall}
                    className="bg-[#A5A9B4] hover:bg-[#D1D5DB] text-[#050807] text-[10px] font-bold uppercase tracking-[0.1em] gap-1.5 rounded-full px-5 shadow-lg shadow-[#A5A9B4]/10"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Installer
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDismiss}
                    className="text-[#A5A9B4]/50 hover:text-[#D1D5DB] text-xs"
                  >
                    Plus tard
                  </Button>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleDismiss}
                className="h-6 w-6 text-[#A5A9B4]/30 hover:text-[#D1D5DB] shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
