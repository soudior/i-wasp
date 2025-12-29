import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
 * Generate and open Apple Wallet pass
 * Calls the backend edge function which uses PassKit.io
 */
export async function addToAppleWallet(cardData: WalletCardData): Promise<boolean> {
  try {
    console.log('Requesting Apple Wallet pass for:', cardData.firstName, cardData.lastName);
    
    const { data, error } = await supabase.functions.invoke<WalletResponse>('apple-wallet', {
      body: { cardData }
    });

    if (error) {
      console.error('Apple Wallet edge function error:', error);
      toast.error("Erreur lors de la génération du pass Apple Wallet");
      return false;
    }

    if (!data) {
      console.error('No data returned from Apple Wallet function');
      toast.error("Réponse vide du serveur");
      return false;
    }

    if (data.fallback || data.error) {
      console.warn('Apple Wallet fallback:', data.message);
      toast.error(data.message || "Service Apple Wallet temporairement indisponible");
      return false;
    }

    if (data.success && data.passUrl) {
      // Open the pass URL - this should trigger Safari to open the Wallet
      window.location.href = data.passUrl;
      toast.success("Pass ajouté à Apple Wallet");
      return true;
    }

    console.error('Unexpected response format:', data);
    toast.error("Format de réponse inattendu");
    return false;

  } catch (error) {
    console.error('Error adding to Apple Wallet:', error);
    toast.error("Erreur de connexion au service Wallet");
    return false;
  }
}

/**
 * Generate and open Google Wallet pass
 * Calls the backend edge function which generates a signed JWT
 */
export async function addToGoogleWallet(cardData: WalletCardData): Promise<boolean> {
  try {
    console.log('Requesting Google Wallet pass for:', cardData.firstName, cardData.lastName);
    
    const { data, error } = await supabase.functions.invoke<WalletResponse>('google-wallet', {
      body: { cardData }
    });

    if (error) {
      console.error('Google Wallet edge function error:', error);
      toast.error("Erreur lors de la génération du pass Google Wallet");
      return false;
    }

    if (!data) {
      console.error('No data returned from Google Wallet function');
      toast.error("Réponse vide du serveur");
      return false;
    }

    if (data.fallback || data.error) {
      console.warn('Google Wallet fallback:', data.message);
      toast.error(data.message || "Service Google Wallet temporairement indisponible");
      return false;
    }

    if (data.success && data.saveUrl) {
      // Open the Google Wallet save URL
      window.open(data.saveUrl, '_blank');
      toast.success("Pass ajouté à Google Wallet");
      return true;
    }

    console.error('Unexpected response format:', data);
    toast.error("Format de réponse inattendu");
    return false;

  } catch (error) {
    console.error('Error adding to Google Wallet:', error);
    toast.error("Erreur de connexion au service Wallet");
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
