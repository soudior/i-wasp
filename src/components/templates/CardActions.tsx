import { useState } from "react";
import { Plus, Wallet, Share2, Loader2 } from "lucide-react";
import { downloadVCard, VCardData } from "@/lib/vcard";
import { addToAppleWallet, addToGoogleWallet, WalletCardData } from "@/lib/walletService";
import { LeadCaptureSheet } from "@/components/LeadCaptureSheet";
import { toast } from "sonner";

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

// Variant styles
const styles = {
  dark: {
    addBtn: "w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
    walletBtn: "py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
    walletIcon: "text-slate-400",
    walletText: "text-sm text-slate-300",
    shareBtn: "w-full mt-4 py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-slate-200 transition-all active:scale-[0.98]",
  },
  light: {
    addBtn: "w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.98]",
    walletBtn: "py-3 border border-neutral-200 hover:border-neutral-300 rounded-xl flex items-center justify-center gap-2 text-neutral-600 transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
    walletIcon: "text-neutral-600",
    walletText: "text-sm",
    shareBtn: "w-full mt-3 py-4 border border-neutral-200 hover:border-neutral-300 rounded-xl flex items-center justify-center gap-2 text-neutral-500 hover:text-neutral-700 transition-all active:scale-[0.98]",
  },
  glass: {
    addBtn: "w-full py-4 bg-white hover:bg-white/90 text-purple-600 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-xl active:scale-[0.98]",
    walletBtn: "py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
    walletIcon: "text-white",
    walletText: "text-sm text-white",
    shareBtn: "w-full mt-4 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center gap-2 text-white/70 hover:text-white transition-all active:scale-[0.98]",
  },
  amber: {
    addBtn: "w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98]",
    walletBtn: "py-3 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-500/20 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
    walletIcon: "text-amber-400/60",
    walletText: "text-sm text-amber-200/60",
    shareBtn: "w-full mt-4 py-4 bg-amber-900/20 hover:bg-amber-900/30 border border-amber-500/20 rounded-xl flex items-center justify-center gap-2 text-amber-200/60 hover:text-amber-100 transition-all active:scale-[0.98]",
  },
  rose: {
    addBtn: "w-full py-4 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
    walletBtn: "py-3 bg-stone-800 hover:bg-stone-700 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
    walletIcon: "text-stone-400",
    walletText: "text-sm text-stone-300",
    shareBtn: "w-full mt-4 py-4 bg-stone-800/50 hover:bg-stone-700/50 border border-stone-700/50 rounded-xl flex items-center justify-center gap-2 text-stone-400 hover:text-stone-200 transition-all active:scale-[0.98]",
  },
  tech: {
    addBtn: "w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-mono font-bold rounded flex items-center justify-center gap-2 transition-colors active:scale-[0.98]",
    walletBtn: "py-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded flex items-center justify-center gap-2 transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
    walletIcon: "text-gray-500",
    walletText: "text-sm font-mono text-gray-400",
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
  const [showLeadSheet, setShowLeadSheet] = useState(false);
  const [loadingApple, setLoadingApple] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

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

      {/* Wallet buttons */}
      {showWalletButtons && (
        <div className={variant === "tech" ? "grid grid-cols-2 gap-3 mt-4" : "grid grid-cols-2 gap-3 mt-4"}>
          <button
            onClick={handleAppleWallet}
            disabled={loadingApple}
            className={s.walletBtn}
          >
            {loadingApple ? (
              <Loader2 size={18} className={`${s.walletIcon} animate-spin`} />
            ) : (
              <Wallet size={18} className={s.walletIcon} />
            )}
            <span className={s.walletText}>Apple Wallet</span>
          </button>
          <button
            onClick={handleGoogleWallet}
            disabled={loadingGoogle}
            className={s.walletBtn}
          >
            {loadingGoogle ? (
              <Loader2 size={18} className={`${s.walletIcon} animate-spin`} />
            ) : (
              <Wallet size={18} className={s.walletIcon} />
            )}
            <span className={s.walletText}>Google Wallet</span>
          </button>
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
