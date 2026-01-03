import { useState } from "react";
import { Plus, Share2, Loader2, Crown, Lock } from "lucide-react";
import { downloadVCard, VCardData } from "@/lib/vcard";
import { addToAppleWallet, addToGoogleWallet, WalletCardData, supportsAppleWallet, supportsGoogleWallet } from "@/lib/walletService";
import { LeadCaptureSheet } from "@/components/LeadCaptureSheet";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";

export interface CardActionsData {
  id?: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  location?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  tagline?: string;
  photoUrl?: string | null;
  slug?: string;
}

interface CardActionsProps {
  data: CardActionsData;
  showWalletButtons?: boolean;
  onShareInfo?: () => void;
  variant?: "dark" | "light" | "glass" | "amber" | "rose" | "tech";
  cardId?: string; // For lead capture
  enableLeadCapture?: boolean;
}

// vCard download handler
export function handleAddToContacts(data: CardActionsData): void {
  const vcardData: VCardData = {
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    title: data.title,
    company: data.company,
    email: data.email,
    phone: data.phone,
  };

  downloadVCard(vcardData);
  toast.success("Contact téléchargé !");
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

// Variant styles
const styles = {
  dark: {
    addBtn: "w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
    walletBtn: "py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl",
    walletApple: "bg-black text-white hover:bg-gray-900",
    walletGoogle: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
    walletLocked: "bg-gray-800 border border-gray-700 opacity-60 cursor-not-allowed",
    walletIcon: "w-5 h-5",
    walletText: "text-sm font-medium",
    shareBtn: "w-full mt-4 py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-slate-200 transition-all active:scale-[0.98]",
  },
  light: {
    addBtn: "w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.98]",
    walletBtn: "py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl",
    walletApple: "bg-black text-white hover:bg-gray-900",
    walletGoogle: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
    walletLocked: "bg-gray-100 border border-gray-200 opacity-60 cursor-not-allowed",
    walletIcon: "w-5 h-5",
    walletText: "text-sm font-medium",
    shareBtn: "w-full mt-3 py-4 border border-neutral-200 hover:border-neutral-300 rounded-xl flex items-center justify-center gap-2 text-neutral-500 hover:text-neutral-700 transition-all active:scale-[0.98]",
  },
  glass: {
    addBtn: "w-full py-4 bg-white hover:bg-white/90 text-purple-600 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-xl active:scale-[0.98]",
    walletBtn: "py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl",
    walletApple: "bg-black text-white hover:bg-gray-900",
    walletGoogle: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
    walletLocked: "bg-white/10 border border-white/20 opacity-60 cursor-not-allowed",
    walletIcon: "w-5 h-5",
    walletText: "text-sm font-medium",
    shareBtn: "w-full mt-4 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center gap-2 text-white/70 hover:text-white transition-all active:scale-[0.98]",
  },
  amber: {
    addBtn: "w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98]",
    walletBtn: "py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl",
    walletApple: "bg-gradient-to-r from-[#FFC700] to-[#FFD700] text-black hover:from-[#FFD700] hover:to-[#FFE44D] shadow-lg shadow-[#FFC700]/20",
    walletGoogle: "bg-gradient-to-r from-[#FFC700] to-[#FFD700] text-black hover:from-[#FFD700] hover:to-[#FFE44D] shadow-lg shadow-[#FFC700]/20",
    walletLocked: "bg-amber-900/30 border border-amber-500/20 opacity-60 cursor-not-allowed",
    walletIcon: "w-5 h-5",
    walletText: "text-sm font-medium",
    shareBtn: "w-full mt-4 py-4 bg-amber-900/20 hover:bg-amber-900/30 border border-amber-500/20 rounded-xl flex items-center justify-center gap-2 text-amber-200/60 hover:text-amber-100 transition-all active:scale-[0.98]",
  },
  rose: {
    addBtn: "w-full py-4 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
    walletBtn: "py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl",
    walletApple: "bg-black text-white hover:bg-gray-900",
    walletGoogle: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
    walletLocked: "bg-stone-800 opacity-60 cursor-not-allowed",
    walletIcon: "w-5 h-5",
    walletText: "text-sm font-medium",
    shareBtn: "w-full mt-4 py-4 bg-stone-800/50 hover:bg-stone-700/50 border border-stone-700/50 rounded-xl flex items-center justify-center gap-2 text-stone-400 hover:text-stone-200 transition-all active:scale-[0.98]",
  },
  tech: {
    addBtn: "w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-mono font-bold rounded flex items-center justify-center gap-2 transition-colors active:scale-[0.98]",
    walletBtn: "py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed rounded",
    walletApple: "bg-black text-white hover:bg-gray-900",
    walletGoogle: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
    walletLocked: "bg-gray-900 border border-gray-800 opacity-60 cursor-not-allowed",
    walletIcon: "w-5 h-5",
    walletText: "text-sm font-mono font-medium",
    shareBtn: "w-full mt-3 py-4 bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 rounded flex items-center justify-center gap-2 text-gray-500 hover:text-cyan-400 transition-all active:scale-[0.98]",
  },
};

export function CardActionButtons({ 
  data, 
  showWalletButtons = true, 
  onShareInfo, 
  variant = "dark",
  cardId,
  enableLeadCapture = false
}: CardActionsProps) {
  const s = styles[variant];
  const { isGold } = useSubscription();
  const navigate = useNavigate();
  const [showLeadSheet, setShowLeadSheet] = useState(false);
  const [loadingApple, setLoadingApple] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const isAppleDevice = supportsAppleWallet();
  const isAndroidDevice = supportsGoogleWallet();
  const isDesktop = !isAppleDevice && !isAndroidDevice;

  const handleAddClick = () => {
    if (enableLeadCapture && cardId) {
      setShowLeadSheet(true);
    } else {
      handleAddToContacts(data);
    }
  };

  const handleLeadComplete = (shared: boolean) => {
    setShowLeadSheet(false);
    // Always download the vCard after lead capture flow
    handleAddToContacts(data);
  };

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
        firstName: data.firstName || "",
        lastName: data.lastName || "",
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
      
      await addToAppleWallet(walletData);
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
        firstName: data.firstName || "",
        lastName: data.lastName || "",
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
      
      await addToGoogleWallet(walletData);
    } finally {
      setLoadingGoogle(false);
    }
  };

  const cardOwnerName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'ce contact';

  return (
    <>
      {/* Add to contacts button - min 44px height for mobile */}
      <button
        onClick={handleAddClick}
        className={s.addBtn}
      >
        <Plus size={20} />
        {variant === "tech" ? "CONNECT" : "Ajouter aux contacts"}
      </button>

      {/* Wallet buttons with GOLD restriction */}
      {showWalletButtons && (
        <div className="mt-4 space-y-3">
          {/* GOLD badge header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-[#FFC700]" />
              Wallet Pass
            </span>
            {!isGold && (
              <span className="text-xs text-[#FFC700] font-medium flex items-center gap-1">
                <Lock className="w-3 h-3" />
                GOLD
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Apple Wallet - show on iOS or desktop */}
            {(isAppleDevice || isDesktop) && (
              <button
                onClick={handleAppleWallet}
                disabled={loadingApple}
                className={`${s.walletBtn} ${isGold ? s.walletApple : s.walletLocked}`}
              >
                {loadingApple ? (
                  <Loader2 className={`${s.walletIcon} animate-spin`} />
                ) : (
                  <>
                    {!isGold && <Lock className="w-3.5 h-3.5" />}
                    <AppleWalletIcon className={s.walletIcon} />
                  </>
                )}
                <span className={s.walletText}>Apple</span>
              </button>
            )}

            {/* Google Wallet - show on Android or desktop */}
            {(isAndroidDevice || isDesktop) && (
              <button
                onClick={handleGoogleWallet}
                disabled={loadingGoogle}
                className={`${s.walletBtn} ${isGold ? s.walletGoogle : s.walletLocked}`}
              >
                {loadingGoogle ? (
                  <Loader2 className={`${s.walletIcon} animate-spin`} />
                ) : (
                  <>
                    {!isGold && <Lock className="w-3.5 h-3.5" />}
                    <GoogleWalletIcon className={s.walletIcon} />
                  </>
                )}
                <span className={s.walletText}>Google</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Share info button */}
      {onShareInfo && (
        <button
          onClick={onShareInfo}
          className={s.shareBtn}
        >
          <Share2 size={18} />
          <span className={variant === "tech" ? "text-sm font-mono" : "text-sm"}>
            {variant === "tech" ? "SHARE_INFO" : "Partager mes coordonnées"}
          </span>
        </button>
      )}

      {/* Lead Capture Sheet */}
      {enableLeadCapture && cardId && (
        <LeadCaptureSheet
          open={showLeadSheet}
          onClose={() => setShowLeadSheet(false)}
          onComplete={handleLeadComplete}
          cardOwnerName={cardOwnerName}
          cardOwnerPhoto={data.photoUrl}
          cardOwnerCompany={data.company}
          cardId={cardId}
        />
      )}
    </>
  );
}
