import { Plus, Wallet, Share2 } from "lucide-react";
import { downloadVCard, VCardData } from "@/lib/vcard";
import { downloadAppleWalletPass, downloadGoogleWalletPass, WalletCardData } from "@/lib/walletMock";
import { toast } from "sonner";

export interface CardActionsData {
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
}

interface CardActionsProps {
  data: CardActionsData;
  showWalletButtons?: boolean;
  onShareInfo?: () => void;
  variant?: "dark" | "light" | "glass" | "amber" | "rose" | "tech";
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
    website: data.website,
    location: data.location,
    linkedin: data.linkedin,
    instagram: data.instagram,
    twitter: data.twitter,
    tagline: data.tagline,
  };

  downloadVCard(vcardData);
  toast.success("Contact téléchargé !");
}

// Apple Wallet handler
export function handleAppleWallet(data: CardActionsData): void {
  const walletData: WalletCardData = {
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    title: data.title,
    company: data.company,
    email: data.email,
    phone: data.phone,
    website: data.website,
    location: data.location,
  };

  downloadAppleWalletPass(walletData);
}

// Google Wallet handler
export function handleGoogleWallet(data: CardActionsData): void {
  const walletData: WalletCardData = {
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    title: data.title,
    company: data.company,
    email: data.email,
    phone: data.phone,
    website: data.website,
    location: data.location,
  };

  downloadGoogleWalletPass(walletData);
}

// Variant styles
const styles = {
  dark: {
    addBtn: "w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all",
    walletBtn: "py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center justify-center gap-2 transition-colors",
    walletIcon: "text-slate-400",
    walletText: "text-xs text-slate-300",
    shareBtn: "w-full mt-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-slate-200 transition-all",
  },
  light: {
    addBtn: "w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors",
    walletBtn: "py-2.5 border border-neutral-200 hover:border-neutral-300 rounded-xl flex items-center justify-center gap-2 text-neutral-600 transition-colors",
    walletIcon: "text-neutral-600",
    walletText: "text-xs",
    shareBtn: "w-full mt-3 py-3 border border-neutral-200 hover:border-neutral-300 rounded-xl flex items-center justify-center gap-2 text-neutral-500 hover:text-neutral-700 transition-all",
  },
  glass: {
    addBtn: "w-full py-3.5 bg-white hover:bg-white/90 text-purple-600 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-xl",
    walletBtn: "py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center gap-2 transition-colors",
    walletIcon: "text-white",
    walletText: "text-xs text-white",
    shareBtn: "w-full mt-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center gap-2 text-white/70 hover:text-white transition-all",
  },
  amber: {
    addBtn: "w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20",
    walletBtn: "py-2.5 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-500/20 rounded-xl flex items-center justify-center gap-2 transition-colors",
    walletIcon: "text-amber-400/60",
    walletText: "text-xs text-amber-200/60",
    shareBtn: "w-full mt-4 py-3 bg-amber-900/20 hover:bg-amber-900/30 border border-amber-500/20 rounded-xl flex items-center justify-center gap-2 text-amber-200/60 hover:text-amber-100 transition-all",
  },
  rose: {
    addBtn: "w-full py-3.5 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all",
    walletBtn: "py-2.5 bg-stone-800 hover:bg-stone-700 rounded-xl flex items-center justify-center gap-2 transition-colors",
    walletIcon: "text-stone-400",
    walletText: "text-xs text-stone-300",
    shareBtn: "w-full mt-4 py-3 bg-stone-800/50 hover:bg-stone-700/50 border border-stone-700/50 rounded-xl flex items-center justify-center gap-2 text-stone-400 hover:text-stone-200 transition-all",
  },
  tech: {
    addBtn: "w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-mono font-bold rounded flex items-center justify-center gap-2 transition-colors",
    walletBtn: "py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded flex items-center justify-center gap-2 transition-colors",
    walletIcon: "text-gray-500",
    walletText: "text-xs font-mono text-gray-400",
    shareBtn: "w-full mt-3 py-2.5 bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 rounded flex items-center justify-center gap-2 text-gray-500 hover:text-cyan-400 transition-all",
  },
};

export function CardActionButtons({ data, showWalletButtons = true, onShareInfo, variant = "dark" }: CardActionsProps) {
  const s = styles[variant];

  return (
    <>
      {/* Add to contacts button */}
      <button
        onClick={() => handleAddToContacts(data)}
        className={s.addBtn}
      >
        <Plus size={18} />
        {variant === "tech" ? "CONNECT" : "Ajouter aux contacts"}
      </button>

      {/* Wallet buttons */}
      {showWalletButtons && (
        <div className={variant === "tech" ? "grid grid-cols-2 gap-2 mt-3" : "grid grid-cols-2 gap-3 mt-4"}>
          <button
            onClick={() => handleAppleWallet(data)}
            className={s.walletBtn}
          >
            <Wallet size={16} className={s.walletIcon} />
            <span className={s.walletText}>Apple</span>
          </button>
          <button
            onClick={() => handleGoogleWallet(data)}
            className={s.walletBtn}
          >
            <Wallet size={16} className={s.walletIcon} />
            <span className={s.walletText}>Google</span>
          </button>
        </div>
      )}

      {/* Share info button */}
      {onShareInfo && (
        <button
          onClick={onShareInfo}
          className={s.shareBtn}
        >
          <Share2 size={16} />
          <span className={variant === "tech" ? "text-xs font-mono" : "text-sm"}>
            {variant === "tech" ? "SHARE_INFO" : "Partager mes coordonnées"}
          </span>
        </button>
      )}
    </>
  );
}
