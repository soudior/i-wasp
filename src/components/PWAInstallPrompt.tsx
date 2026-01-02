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
          // iOS Installation Guide
          <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 border border-amber-500/30 rounded-2xl p-5 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Comment installer</h3>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleDismiss}
                className="h-6 w-6 text-zinc-500 hover:text-zinc-300"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                  <span className="text-amber-400 text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="text-white text-sm">Appuyez sur le bouton</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Share className="h-5 w-5 text-blue-400" />
                    <span className="text-gray-400 text-xs">Partager</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                  <span className="text-amber-400 text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="text-white text-sm">Puis sélectionnez</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Plus className="h-5 w-5 text-gray-300" />
                    <span className="text-gray-400 text-xs">Sur l'écran d'accueil</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                  <span className="text-green-400 text-sm font-bold">✓</span>
                </div>
                <p className="text-gray-400 text-sm">
                  L'app i-wasp sera sur votre écran d'accueil !
                </p>
              </div>
            </div>

            <Button
              onClick={handleDismiss}
              className="w-full mt-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold"
            >
              J'ai compris
            </Button>
          </div>
        ) : (
          // Initial Prompt
          <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 border border-amber-500/30 rounded-2xl p-4 shadow-2xl shadow-black/50">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
                <Smartphone className="h-6 w-6 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white mb-1">
                  Installez l'app i-wasp
                </p>
                <p className="text-xs text-gray-400 mb-3">
                  Accès rapide à votre profil NFC depuis l'écran d'accueil. Fonctionne hors-ligne !
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleInstall}
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black text-xs font-semibold gap-1.5 shadow-lg shadow-amber-500/20"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Installer
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDismiss}
                    className="text-zinc-500 hover:text-zinc-300 text-xs"
                  >
                    Plus tard
                  </Button>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleDismiss}
                className="h-6 w-6 text-zinc-600 hover:text-zinc-400 shrink-0"
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
