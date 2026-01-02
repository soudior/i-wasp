import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, X, Smartphone, CheckCircle2, ArrowRight } from "lucide-react";
import iwaspLogo from "@/assets/iwasp-logo-white.png";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSInstructions(true);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <img src={iwaspLogo} alt="i-wasp" className="h-8 w-auto" />
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
          className="text-zinc-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {isInstalled ? (
          // Already installed state
          <div className="space-y-6 animate-fade-up">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="font-playfair text-2xl font-bold text-white mb-2">
                Application installée !
              </h1>
              <p className="text-zinc-400 text-sm">
                i-wasp est maintenant sur votre écran d'accueil.
              </p>
            </div>
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold gap-2"
            >
              Accéder au Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ) : showIOSInstructions ? (
          // iOS Instructions
          <div className="space-y-8 animate-fade-up max-w-sm">
            <div>
              <h1 className="font-playfair text-2xl font-bold text-white mb-2">
                Installer sur iPhone
              </h1>
              <p className="text-zinc-400 text-sm">
                Suivez ces étapes simples
              </p>
            </div>

            <div className="space-y-4 text-left">
              {[
                { step: 1, text: "Appuyez sur le bouton Partager", icon: "↑" },
                { step: 2, text: "Faites défiler et appuyez sur 'Sur l'écran d'accueil'", icon: "+" },
                { step: 3, text: "Appuyez sur 'Ajouter' en haut à droite", icon: "✓" },
              ].map(({ step, text, icon }) => (
                <div 
                  key={step}
                  className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold">
                    {step}
                  </div>
                  <p className="text-white text-sm flex-1">{text}</p>
                  <span className="text-2xl">{icon}</span>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => setShowIOSInstructions(false)}
              className="border-zinc-700 text-zinc-300"
            >
              Retour
            </Button>
          </div>
        ) : (
          // Install prompt
          <div className="space-y-8 animate-fade-up">
            {/* App icon preview */}
            <div className="relative">
              <div className="w-24 h-24 rounded-[28px] bg-black border-2 border-zinc-800 flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/20">
                <img src={iwaspLogo} alt="i-wasp" className="h-12 w-auto" />
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-[28px] bg-amber-500/20 blur-2xl -z-10" />
            </div>

            <div>
              <h1 className="font-playfair text-3xl font-bold text-white mb-3">
                Installez l'app i-wasp
              </h1>
              <p className="text-zinc-400 text-sm max-w-xs mx-auto">
                Gérez vos stories, suivez vos statistiques et recevez des notifications en un clic.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
              {[
                "Accès rapide",
                "Mode hors-ligne",
                "Notifications",
                "Expérience native"
              ].map((benefit) => (
                <div 
                  key={benefit}
                  className="flex items-center gap-2 text-xs text-zinc-400"
                >
                  <CheckCircle2 className="h-4 w-4 text-amber-500" />
                  {benefit}
                </div>
              ))}
            </div>

            {/* Install button */}
            <Button
              size="lg"
              onClick={handleInstall}
              className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 text-black font-semibold gap-3 px-8 py-6 rounded-xl shadow-lg shadow-amber-500/30"
            >
              <Download className="h-5 w-5" />
              {isIOS ? "Voir les instructions" : "Installer l'application"}
            </Button>

            <p className="text-xs text-zinc-600">
              Gratuit • Aucun téléchargement App Store requis
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-xs text-zinc-700">
          Powered by i-wasp • Tap. Connect. Empower.
        </p>
      </div>
    </div>
  );
};

export default Install;
