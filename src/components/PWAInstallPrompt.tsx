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
          // iOS Installation Guide - Luxe Gold Theme
          <div className="bg-[#0A0A0A] border border-[#B8956C]/30 rounded-2xl p-5 shadow-2xl shadow-black/60 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#F5F5F5] font-semibold tracking-wide text-sm uppercase">Comment installer</h3>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleDismiss}
                className="h-6 w-6 text-[#6B6B6B] hover:text-[#F5F5F5]"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#B8956C]/15 border border-[#B8956C]/30 flex items-center justify-center shrink-0">
                  <span className="text-[#B8956C] text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="text-[#F5F5F5] text-sm">Appuyez sur le bouton</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Share className="h-5 w-5 text-[#B8956C]" />
                    <span className="text-[#6B6B6B] text-xs">Partager</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#B8956C]/15 border border-[#B8956C]/30 flex items-center justify-center shrink-0">
                  <span className="text-[#B8956C] text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="text-[#F5F5F5] text-sm">Puis sélectionnez</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Plus className="h-5 w-5 text-[#F5F5F5]" />
                    <span className="text-[#6B6B6B] text-xs">Sur l'écran d'accueil</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#B8956C]/25 border border-[#B8956C]/40 flex items-center justify-center shrink-0">
                  <span className="text-[#B8956C] text-sm font-bold">✓</span>
                </div>
                <p className="text-[#6B6B6B] text-sm">
                  L'app i-wasp sera sur votre écran d'accueil !
                </p>
              </div>
            </div>

            <Button
              onClick={handleDismiss}
              className="w-full mt-4 bg-[#B8956C] hover:bg-[#D4B896] text-[#0A0A0A] font-bold uppercase text-[10px] tracking-[0.15em] rounded-full py-3"
            >
              J'ai compris
            </Button>
          </div>
        ) : (
          // Initial Prompt - Luxe Gold Theme
          <div className="bg-[#0A0A0A] border border-[#B8956C]/30 rounded-2xl p-4 shadow-2xl shadow-black/60 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#B8956C]/15 border border-[#B8956C]/30 flex items-center justify-center shrink-0">
                <Smartphone className="h-6 w-6 text-[#B8956C]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#F5F5F5] mb-1 tracking-wide">
                  Installez l'app i-wasp
                </p>
                <p className="text-xs text-[#6B6B6B] mb-3">
                  Accès rapide à votre profil NFC depuis l'écran d'accueil. Fonctionne hors-ligne !
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleInstall}
                    className="bg-[#B8956C] hover:bg-[#D4B896] text-[#0A0A0A] text-[10px] font-bold uppercase tracking-[0.1em] gap-1.5 rounded-full px-5 shadow-lg shadow-[#B8956C]/20"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Installer
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDismiss}
                    className="text-[#6B6B6B] hover:text-[#F5F5F5] text-xs"
                  >
                    Plus tard
                  </Button>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleDismiss}
                className="h-6 w-6 text-[#6B6B6B]/50 hover:text-[#F5F5F5] shrink-0"
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
