import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, X, Smartphone, CheckCircle2, ArrowRight, Apple, Monitor, Chrome } from "lucide-react";
import iwaspLogo from "@/assets/iwasp-logo-white.png";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type DeviceType = 'ios' | 'android' | 'desktop' | 'unknown';

const Install = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>('unknown');
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    const isAndroid = /android/.test(userAgent);
    const isMobile = isIOS || isAndroid;
    
    if (isIOS) {
      setDeviceType('ios');
    } else if (isAndroid) {
      setDeviceType('android');
    } else {
      setDeviceType('desktop');
    }

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
    } else {
      setShowInstructions(true);
    }
  };

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'ios': return <Apple className="h-6 w-6" />;
      case 'android': return <Smartphone className="h-6 w-6" />;
      default: return <Monitor className="h-6 w-6" />;
    }
  };

  const getDeviceName = () => {
    switch (deviceType) {
      case 'ios': return 'iPhone / iPad';
      case 'android': return 'Android';
      default: return 'Ordinateur';
    }
  };

  const renderIOSInstructions = () => (
    <div className="space-y-6 text-left">
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
        <Apple className="h-8 w-8 text-white" />
        <div>
          <p className="text-white font-medium">Safari requis</p>
          <p className="text-zinc-500 text-xs">L'installation ne fonctionne que dans Safari</p>
        </div>
      </div>
      
      {[
        { step: 1, title: "Partager", desc: "Appuyez sur l'icône Partager en bas de Safari", icon: "⬆️" },
        { step: 2, title: "Écran d'accueil", desc: "Faites défiler et choisissez 'Sur l'écran d'accueil'", icon: "➕" },
        { step: 3, title: "Ajouter", desc: "Confirmez en appuyant sur 'Ajouter'", icon: "✓" },
      ].map(({ step, title, desc, icon }) => (
        <div 
          key={step}
          className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/50"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-bold text-lg flex-shrink-0">
            {step}
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold mb-1">{title}</p>
            <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
          </div>
          <span className="text-3xl">{icon}</span>
        </div>
      ))}
    </div>
  );

  const renderAndroidInstructions = () => (
    <div className="space-y-6 text-left">
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
        <Chrome className="h-8 w-8 text-white" />
        <div>
          <p className="text-white font-medium">Chrome recommandé</p>
          <p className="text-zinc-500 text-xs">Fonctionne aussi avec Edge et Samsung Internet</p>
        </div>
      </div>
      
      {deferredPrompt ? (
        <div className="text-center py-8">
          <p className="text-zinc-400 mb-6">L'installation automatique est disponible !</p>
          <Button
            size="lg"
            onClick={handleInstall}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold gap-3 px-8"
          >
            <Download className="h-5 w-5" />
            Installer maintenant
          </Button>
        </div>
      ) : (
        [
          { step: 1, title: "Menu Chrome", desc: "Appuyez sur les 3 points ⋮ en haut à droite", icon: "⋮" },
          { step: 2, title: "Installer l'app", desc: "Choisissez 'Installer l'application' ou 'Ajouter à l'écran d'accueil'", icon: "📲" },
          { step: 3, title: "Confirmer", desc: "Appuyez sur 'Installer' dans la popup", icon: "✓" },
        ].map(({ step, title, desc, icon }) => (
          <div 
            key={step}
            className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/50"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-bold text-lg flex-shrink-0">
              {step}
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold mb-1">{title}</p>
              <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
            </div>
            <span className="text-3xl">{icon}</span>
          </div>
        ))
      )}
    </div>
  );

  const renderDesktopInstructions = () => (
    <div className="space-y-6 text-left">
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
        <Chrome className="h-8 w-8 text-white" />
        <div>
          <p className="text-white font-medium">Chrome, Edge ou Brave</p>
          <p className="text-zinc-500 text-xs">Safari desktop ne supporte pas les PWA</p>
        </div>
      </div>
      
      {deferredPrompt ? (
        <div className="text-center py-8">
          <p className="text-zinc-400 mb-6">L'installation automatique est disponible !</p>
          <Button
            size="lg"
            onClick={handleInstall}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold gap-3 px-8"
          >
            <Download className="h-5 w-5" />
            Installer maintenant
          </Button>
        </div>
      ) : (
        [
          { step: 1, title: "Icône d'installation", desc: "Cliquez sur l'icône dans la barre d'adresse (ou menu ⋮)", icon: "📥" },
          { step: 2, title: "Installer", desc: "Confirmez l'installation dans la popup", icon: "✓" },
        ].map(({ step, title, desc, icon }) => (
          <div 
            key={step}
            className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/50"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-bold text-lg flex-shrink-0">
              {step}
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold mb-1">{title}</p>
              <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
            </div>
            <span className="text-3xl">{icon}</span>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <Link to="/">
          <img src={iwaspLogo} alt="IWASP" className="h-8 w-auto" />
        </Link>
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
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {isInstalled ? (
          // Already installed state
          <div className="space-y-6 animate-fade-up text-center max-w-sm">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="font-playfair text-3xl font-bold text-white mb-3">
                Application installée !
              </h1>
              <p className="text-zinc-400">
                IWASP est maintenant sur votre écran d'accueil. Profitez de l'expérience complète !
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold gap-2 px-8"
            >
              Accéder au Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ) : showInstructions ? (
          // Device-specific instructions
          <div className="w-full max-w-md animate-fade-up">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4 text-amber-500">
                {getDeviceIcon()}
              </div>
              <h1 className="font-playfair text-2xl font-bold text-white mb-2">
                Installer sur {getDeviceName()}
              </h1>
              <p className="text-zinc-500 text-sm">
                Suivez ces étapes simples
              </p>
            </div>

            {deviceType === 'ios' && renderIOSInstructions()}
            {deviceType === 'android' && renderAndroidInstructions()}
            {deviceType === 'desktop' && renderDesktopInstructions()}

            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => setShowInstructions(false)}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-900"
              >
                ← Retour
              </Button>
            </div>
          </div>
        ) : (
          // Main install prompt
          <div className="space-y-8 animate-fade-up text-center max-w-sm">
            {/* App icon preview */}
            <div className="relative">
              <div className="w-28 h-28 rounded-[32px] bg-gradient-to-br from-zinc-900 to-black border-2 border-zinc-800 flex items-center justify-center mx-auto shadow-2xl">
                <img src={iwaspLogo} alt="IWASP" className="h-14 w-auto" />
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-[32px] bg-amber-500/20 blur-3xl -z-10 scale-150" />
            </div>

            {/* Device detection badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-zinc-400">
              {getDeviceIcon()}
              <span>Détecté : <span className="text-white font-medium">{getDeviceName()}</span></span>
            </div>

            <div>
              <h1 className="font-playfair text-3xl font-bold text-white mb-4">
                Installez IWASP
              </h1>
              <p className="text-zinc-400 leading-relaxed">
                Accédez à votre profil digital en un clic depuis votre écran d'accueil. Gratuit et instantané.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "⚡", title: "Accès rapide", desc: "1 tap pour ouvrir" },
                { icon: "📴", title: "Mode hors-ligne", desc: "Fonctionne partout" },
                { icon: "🔔", title: "Notifications", desc: "Nouveaux contacts" },
                { icon: "✨", title: "Expérience native", desc: "Comme une vraie app" }
              ].map(({ icon, title, desc }) => (
                <div 
                  key={title}
                  className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 text-left"
                >
                  <span className="text-2xl">{icon}</span>
                  <p className="text-white font-medium text-sm mt-2">{title}</p>
                  <p className="text-zinc-500 text-xs">{desc}</p>
                </div>
              ))}
            </div>

            {/* Install button */}
            <Button
              size="lg"
              onClick={handleInstall}
              className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 text-black font-semibold gap-3 py-7 rounded-2xl shadow-lg shadow-amber-500/30 text-base"
            >
              <Download className="h-5 w-5" />
              {deferredPrompt ? "Installer l'application" : "Voir les instructions"}
            </Button>

            <p className="text-xs text-zinc-600">
              Gratuit • Aucun téléchargement App Store requis
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 text-center border-t border-zinc-900">
        <p className="text-xs text-zinc-700">
          IWASP • Tap. Connect. Empower.
        </p>
      </div>
    </div>
  );
};

export default Install;
