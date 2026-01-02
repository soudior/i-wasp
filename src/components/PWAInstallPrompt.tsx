import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Don't show if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if already dismissed
    const dismissed = sessionStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      return;
    }

    // Wait for page to load, then show prompt
    const timer = setTimeout(() => {
      setShow(true);
    }, 5000); // Show after 5 seconds

    // Listen for install prompt
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
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShow(false);
      }
      setDeferredPrompt(null);
    } else {
      // Navigate to install page for iOS instructions
      navigate('/install');
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 animate-fade-up sm:left-auto sm:right-6 sm:max-w-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-2xl shadow-black/50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shrink-0">
            <Smartphone className="h-5 w-5 text-black" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white mb-1">
              Installez l'app i-wasp
            </p>
            <p className="text-xs text-zinc-400 mb-3">
              Gérez vos stories en un clic depuis votre écran d'accueil
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleInstall}
                className="bg-amber-500 hover:bg-amber-600 text-black text-xs font-semibold gap-1.5"
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
    </div>
  );
}
