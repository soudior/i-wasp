import { useState } from "react";
import { Wallet, Lock, Loader2, Crown } from "lucide-react";
import { addToAppleWallet, addToGoogleWallet, WalletCardData, supportsAppleWallet, supportsGoogleWallet } from "@/lib/walletService";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export interface WalletPassData {
  id: string;
  firstName: string;
  lastName: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  location?: string;
  slug: string;
  photoUrl?: string | null;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  tagline?: string;
}

interface WalletPassButtonsProps {
  data: WalletPassData;
  variant?: "dark" | "light" | "gold";
  showUpgradeMessage?: boolean;
}

// Apple Wallet official icon SVG
function AppleWalletIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

// Google Wallet official icon SVG
function GoogleWalletIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"/>
    </svg>
  );
}

export function WalletPassButtons({ 
  data, 
  variant = "gold",
  showUpgradeMessage = true 
}: WalletPassButtonsProps) {
  const { isGold, isLoading: isLoadingSubscription } = useSubscription();
  const navigate = useNavigate();
  const [loadingApple, setLoadingApple] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const isAppleDevice = supportsAppleWallet();
  const isAndroidDevice = supportsGoogleWallet();
  const isDesktop = !isAppleDevice && !isAndroidDevice;

  const handleAppleWallet = async () => {
    if (!isGold) {
      toast.info("Passe en GOLD pour ajouter ta carte au Wallet", {
        action: {
          label: "Voir GOLD",
          onClick: () => navigate("/pricing"),
        },
      });
      return;
    }

    if (!data.id || !data.slug) {
      toast.error("Données de carte incomplètes");
      return;
    }
    
    setLoadingApple(true);
    try {
      const walletData: WalletCardData = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        title: data.title,
        company: data.company,
        email: data.email,
        phone: data.phone,
        website: data.website,
        location: data.location,
        slug: data.slug,
        photoUrl: data.photoUrl || undefined,
        linkedin: data.linkedin,
        instagram: data.instagram,
        twitter: data.twitter,
        tagline: data.tagline,
      };
      
      const success = await addToAppleWallet(walletData);
      if (success) {
        toast.success("Carte ajoutée à Apple Wallet !");
      }
    } finally {
      setLoadingApple(false);
    }
  };

  const handleGoogleWallet = async () => {
    if (!isGold) {
      toast.info("Passe en GOLD pour ajouter ta carte au Wallet", {
        action: {
          label: "Voir GOLD",
          onClick: () => navigate("/pricing"),
        },
      });
      return;
    }

    if (!data.id || !data.slug) {
      toast.error("Données de carte incomplètes");
      return;
    }
    
    setLoadingGoogle(true);
    try {
      const walletData: WalletCardData = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        title: data.title,
        company: data.company,
        email: data.email,
        phone: data.phone,
        website: data.website,
        location: data.location,
        slug: data.slug,
        photoUrl: data.photoUrl || undefined,
        linkedin: data.linkedin,
        instagram: data.instagram,
        twitter: data.twitter,
        tagline: data.tagline,
      };
      
      const success = await addToGoogleWallet(walletData);
      if (success) {
        toast.success("Carte ajoutée à Google Wallet !");
      }
    } finally {
      setLoadingGoogle(false);
    }
  };

  // Style variants
  const buttonStyles = {
    dark: {
      base: "relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all active:scale-[0.98]",
      apple: "bg-black text-white hover:bg-gray-900",
      google: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
      locked: "opacity-60 cursor-not-allowed",
      icon: "w-5 h-5",
    },
    light: {
      base: "relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all active:scale-[0.98]",
      apple: "bg-black text-white hover:bg-gray-900",
      google: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
      locked: "opacity-60 cursor-not-allowed",
      icon: "w-5 h-5",
    },
    gold: {
      base: "relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all active:scale-[0.98]",
      apple: "bg-gradient-to-r from-[#FFC700] to-[#FFD700] text-black hover:from-[#FFD700] hover:to-[#FFE44D] shadow-lg shadow-[#FFC700]/20",
      google: "bg-gradient-to-r from-[#FFC700] to-[#FFD700] text-black hover:from-[#FFD700] hover:to-[#FFE44D] shadow-lg shadow-[#FFC700]/20",
      locked: "from-gray-400 to-gray-500 cursor-not-allowed shadow-none",
      icon: "w-5 h-5",
    },
  };

  const s = buttonStyles[variant];

  // Don't render while loading subscription
  if (isLoadingSubscription) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="w-5 h-5 animate-spin text-[#FFC700]" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-5 h-5 text-[#FFC700]" />
        <span className="font-semibold text-sm">Wallet Pass iWasp</span>
        {isGold && (
          <span className="ml-auto px-2 py-0.5 bg-[#FFC700]/20 text-[#FFC700] text-xs font-bold rounded-full flex items-center gap-1">
            <Crown className="w-3 h-3" />
            GOLD
          </span>
        )}
      </div>

      {/* Wallet buttons - show based on device or all on desktop */}
      <div className="grid grid-cols-1 gap-3">
        {/* Apple Wallet - show on iOS or desktop */}
        {(isAppleDevice || isDesktop) && (
          <button
            onClick={handleAppleWallet}
            disabled={loadingApple}
            className={`${s.base} ${isGold ? s.apple : `${s.apple} ${s.locked}`}`}
          >
            {!isGold && <Lock className="w-4 h-4 absolute left-3" />}
            {loadingApple ? (
              <Loader2 className={`${s.icon} animate-spin`} />
            ) : (
              <AppleWalletIcon className={s.icon} />
            )}
            <span>Ajouter à Apple Wallet</span>
          </button>
        )}

        {/* Google Wallet - show on Android or desktop */}
        {(isAndroidDevice || isDesktop) && (
          <button
            onClick={handleGoogleWallet}
            disabled={loadingGoogle}
            className={`${s.base} ${isGold ? s.google : `${s.google} ${s.locked}`}`}
          >
            {!isGold && <Lock className="w-4 h-4 absolute left-3" />}
            {loadingGoogle ? (
              <Loader2 className={`${s.icon} animate-spin`} />
            ) : (
              <GoogleWalletIcon className={s.icon} />
            )}
            <span>Ajouter à Google Wallet</span>
          </button>
        )}
      </div>

      {/* Upgrade message for FREE users */}
      {!isGold && showUpgradeMessage && (
        <div className="mt-4 p-3 bg-[#FFC700]/10 border border-[#FFC700]/20 rounded-xl">
          <div className="flex items-start gap-2">
            <Crown className="w-4 h-4 text-[#FFC700] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-[#FFC700]">
                Fonctionnalité GOLD
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Passe en GOLD pour ajouter ta carte iWasp dans Apple Wallet et Google Wallet.
              </p>
              <button
                onClick={() => navigate("/pricing")}
                className="mt-2 text-xs font-semibold text-[#FFC700] hover:text-[#FFD700] transition-colors"
              >
                Découvrir GOLD →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info text for GOLD users */}
      {isGold && (
        <p className="text-xs text-muted-foreground text-center">
          Ta carte NFC sera synchronisée automatiquement dans ton Wallet.
        </p>
      )}
    </div>
  );
}
