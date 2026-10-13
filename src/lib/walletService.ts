import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { downloadVCard, VCardData } from "@/lib/vcard";

export interface WalletCardData {
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
  photoUrl?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  tagline?: string;
}

export interface WalletStyles {
  backgroundColor?: string;
  labelColor?: string;
  foregroundColor?: string;
  showTitle?: boolean;
  showCompany?: boolean;
  showPhone?: boolean;
  showEmail?: boolean;
  showWebsite?: boolean;
  showLocation?: boolean;
}

interface WalletResponse {
  success?: boolean;
  passUrl?: string;
  saveUrl?: string;
  error?: string;
  message?: string;
  fallback?: boolean;
}

/** Keep vCard a deliberate contact action, never a disguised Wallet pass. */
function unavailable(cardData: WalletCardData, walletType: 'apple' | 'google'): void {
  toast.error(`${walletType === 'apple' ? 'Apple Wallet' : 'Google Wallet'} indisponible. Vérifiez votre connexion, vos droits ou la configuration du service.`, {
    duration: 8000,
    action: { label: "Télécharger le contact (.vcf)", onClick: () => downloadVCard(cardData as VCardData) },
  });
}

/** true means navigation requested, never proof of installation. Same-tab navigation
 * avoids pop-up blocking after the asynchronous request and preserves browser Back. */
async function openWallet(type: 'apple' | 'google', cardData: WalletCardData, walletStyles?: WalletStyles): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke<WalletResponse>(`${type}-wallet`, {
      body: { cardData, walletStyles },
    });
    const rawUrl = type === 'apple' ? data?.passUrl : data?.saveUrl;
    if (error || !data?.success || data.error || data.fallback || !rawUrl) {
      unavailable(cardData, type);
      return false;
    }
    const url = new URL(rawUrl);
    const validHost = type === 'google'
      ? url.hostname === 'pay.google.com' && url.pathname.startsWith('/gp/v/save/')
      : url.hostname === 'pub1.pskt.io' || url.hostname.endsWith('.pskt.io');
    if (url.protocol !== 'https:' || url.username || url.password || !validHost) {
      unavailable(cardData, type);
      return false;
    }
    toast.info("Ouverture du Wallet. Confirmez l’ajout sur votre appareil ; l’installation n’est pas vérifiée ici.");
    window.location.assign(url.href);
    return true;
  } catch {
    unavailable(cardData, type);
    return false;
  }
}
export function addToAppleWallet(cardData: WalletCardData, walletStyles?: WalletStyles): Promise<boolean> {
  return openWallet('apple', cardData, walletStyles);
}
export function addToGoogleWallet(cardData: WalletCardData, walletStyles?: WalletStyles): Promise<boolean> {
  return openWallet('google', cardData, walletStyles);
}

/**
 * Check if device supports Apple Wallet (iOS)
 */
export function supportsAppleWallet(): boolean {
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua);
}

/**
 * Check if device supports Google Wallet (Android)
 */
export function supportsGoogleWallet(): boolean {
  const ua = navigator.userAgent;
  return /Android/.test(ua);
}

/**
 * Get the preferred wallet type based on device
 */
export function getPreferredWallet(): 'apple' | 'google' | 'both' {
  if (supportsAppleWallet()) return 'apple';
  if (supportsGoogleWallet()) return 'google';
  return 'both'; // Desktop - show both options
}
