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

/**
 * Download vCard as fallback when wallet fails
 */
function downloadVCardFallback(cardData: WalletCardData, walletType: 'apple' | 'google'): void {
  const vcardData: VCardData = {
    firstName: cardData.firstName,
    lastName: cardData.lastName,
    title: cardData.title,
    company: cardData.company,
    email: cardData.email,
    phone: cardData.phone,
  };

  downloadVCard(vcardData);
  
  const walletName = walletType === 'apple' ? 'Apple Wallet' : 'Google Wallet';
  toast.info(
    `${walletName} temporairement indisponible. Le contact a été téléchargé en format vCard.`,
    { duration: 5000 }
  );
}

/**
 * Generate and open Apple Wallet pass
 * Calls the backend edge function which uses PassKit.io
 * Falls back to vCard download if the service is unavailable
 */
export async function addToAppleWallet(cardData: WalletCardData, walletStyles?: WalletStyles): Promise<boolean> {
  try {
    console.log('Requesting Apple Wallet pass for:', cardData.firstName, cardData.lastName);
    console.log('With custom styles:', walletStyles);
    
    const { data, error } = await supabase.functions.invoke<WalletResponse>('apple-wallet', {
      body: { cardData, walletStyles }
    });

    if (error) {
      console.error('Apple Wallet edge function error:', error);
      downloadVCardFallback(cardData, 'apple');
      return false;
    }

    if (!data) {
      console.error('No data returned from Apple Wallet function');
      downloadVCardFallback(cardData, 'apple');
      return false;
    }

    if (data.fallback || data.error) {
      console.warn('Apple Wallet fallback:', data.message);
      downloadVCardFallback(cardData, 'apple');
      return false;
    }

    if (data.success && data.passUrl) {
      // Open the pass URL - this should trigger Safari to open the Wallet
      window.location.href = data.passUrl;
      toast.success("Pass ajouté à Apple Wallet");
      return true;
    }

    console.error('Unexpected response format:', data);
    downloadVCardFallback(cardData, 'apple');
    return false;

  } catch (error) {
    console.error('Error adding to Apple Wallet:', error);
    downloadVCardFallback(cardData, 'apple');
    return false;
  }
}

/**
 * Generate and open Google Wallet pass
 * Calls the backend edge function which generates a signed JWT
 * Falls back to vCard download if the service is unavailable
 */
export async function addToGoogleWallet(cardData: WalletCardData, walletStyles?: WalletStyles): Promise<boolean> {
  try {
    console.log('Requesting Google Wallet pass for:', cardData.firstName, cardData.lastName);
    console.log('With custom styles:', walletStyles);
    
    const { data, error } = await supabase.functions.invoke<WalletResponse>('google-wallet', {
      body: { cardData, walletStyles }
    });

    if (error) {
      console.error('Google Wallet edge function error:', error);
      downloadVCardFallback(cardData, 'google');
      return false;
    }

    if (!data) {
      console.error('No data returned from Google Wallet function');
      downloadVCardFallback(cardData, 'google');
      return false;
    }

    if (data.fallback || data.error) {
      console.warn('Google Wallet fallback:', data.message);
      downloadVCardFallback(cardData, 'google');
      return false;
    }

    if (data.success && data.saveUrl) {
      // Open the Google Wallet save URL
      window.open(data.saveUrl, '_blank');
      toast.success("Pass ajouté à Google Wallet");
      return true;
    }

    console.error('Unexpected response format:', data);
    downloadVCardFallback(cardData, 'google');
    return false;

  } catch (error) {
    console.error('Error adding to Google Wallet:', error);
    downloadVCardFallback(cardData, 'google');
    return false;
  }
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
