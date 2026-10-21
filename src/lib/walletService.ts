import { supabase } from "@/integrations/supabase/client";
import { Capacitor } from "@capacitor/core";
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

// These values are public client configuration, matching integrations/supabase/client.ts.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://vwlngxifajsziexhkafe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_K9qQTKdVJG-k5-OKdSqZBw_DrURXgVV";
const APPLE_PASS_CONTENT_TYPE = "application/vnd.apple.pkpass";
const MAX_APPLE_PASS_BYTES = 10 * 1024 * 1024;

/** Keep vCard a deliberate contact action, never a disguised Wallet pass. */
function unavailable(cardData: WalletCardData, walletType: 'apple' | 'google'): void {
  toast.error(`${walletType === 'apple' ? 'Apple Wallet' : 'Google Wallet'} indisponible. Vérifiez votre connexion, vos droits ou la configuration du service.`, {
    duration: 8000,
    action: { label: "Télécharger le contact (.vcf)", onClick: () => downloadVCard(cardData as VCardData) },
  });
}

function safeFilename(card: WalletCardData) {
  const name = `${card.firstName}_${card.lastName}`
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 80) || 'carte';
  return `${name}.pkpass`;
}

/** Validate and download only a PKZip payload from the authenticated Apple endpoint. */
async function downloadApplePass(card: WalletCardData, signal?: AbortSignal): Promise<boolean> {
  if (signal?.aborted) return false;
  if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
    toast.error("Apple Wallet n’est pas encore pris en charge dans l’app iOS. Ouvrez i-wasp.com dans Safari avec votre compte pour ajouter le pass.");
    return false;
  }
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (signal?.aborted) return false;
  const accessToken = session?.access_token;
  if (sessionError || !accessToken) throw new Error('Authentication required');

  const response = await fetch(`${SUPABASE_URL}/functions/v1/apple-wallet`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      apikey: SUPABASE_PUBLISHABLE_KEY,
      'Content-Type': 'application/json',
      Accept: APPLE_PASS_CONTENT_TYPE,
    },
    // Owner data and visibility are loaded from Supabase under RLS by the function.
    // Send only the minimal identity needed to avoid PII in the request payload.
    body: JSON.stringify({ cardData: { id: card.id, slug: card.slug } }),
    credentials: 'omit',
    redirect: 'error',
    signal,
  });
  if (signal?.aborted) return false;
  if (!response.ok || response.redirected || (response.url && new URL(response.url).origin !== new URL(SUPABASE_URL).origin)) {
    throw new Error('Apple Wallet request rejected');
  }
  const contentType = response.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase();
  if (contentType !== APPLE_PASS_CONTENT_TYPE) throw new Error('Expected a signed Apple Wallet pass');
  const declaredLength = Number(response.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_APPLE_PASS_BYTES) throw new Error('Apple Wallet pass too large');
  const blob = await response.blob();
  if (signal?.aborted) return false;
  if (!blob.size || blob.size > MAX_APPLE_PASS_BYTES || blob.type.split(';', 1)[0].trim().toLowerCase() !== APPLE_PASS_CONTENT_TYPE) {
    throw new Error('Invalid Apple Wallet pass');
  }
  const magic = new Uint8Array(await blob.slice(0, 4).arrayBuffer());
  // A .pkpass is a ZIP archive; reject JSON/error payloads even when mislabeled.
  if (magic.length < 4 || magic[0] !== 0x50 || magic[1] !== 0x4b || ![0x03, 0x05, 0x07].includes(magic[2]) || ![0x04, 0x06, 0x08].includes(magic[3])) {
    throw new Error('Invalid Apple Wallet archive');
  }
  if (signal?.aborted) return false;
  const pass = new Blob([blob], { type: APPLE_PASS_CONTENT_TYPE });
  const objectUrl = URL.createObjectURL(pass);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = safeFilename(card);
  link.rel = 'noopener';
  document.body.appendChild(link);
  try {
    link.click();
  } finally {
    link.remove();
    // Keep the temporary file URL alive long enough for iOS Safari to finish opening it.
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
  }
  toast.info("Pass téléchargé. Ouvrez-le sur votre appareil pour confirmer l’ajout à Apple Wallet ; l’installation n’est pas vérifiée ici.");
  return true;
}

/** Google Wallet still follows its own authenticated save-URL contract. */
async function openGoogleWallet(cardData: WalletCardData, walletStyles?: WalletStyles, signal?: AbortSignal): Promise<boolean> {
  try {
    if (signal?.aborted) return false;
    const { data, error } = await supabase.functions.invoke<WalletResponse>('google-wallet', {
      body: { cardData, walletStyles }, signal,
    });
    if (signal?.aborted) return false;
    const rawUrl = data?.saveUrl;
    if (error || !data?.success || data.error || data.fallback || !rawUrl) {
      unavailable(cardData, 'google');
      return false;
    }
    const url = new URL(rawUrl);
    if (url.protocol !== 'https:' || url.username || url.password || url.hostname !== 'pay.google.com' || !url.pathname.startsWith('/gp/v/save/')) {
      unavailable(cardData, 'google');
      return false;
    }
    toast.info("Ouverture du Wallet. Confirmez l’ajout sur votre appareil ; l’installation n’est pas vérifiée ici.");
    window.location.assign(url.href);
    return true;
  } catch {
    if (signal?.aborted) return false;
    unavailable(cardData, 'google');
    return false;
  }
}

export function addToAppleWallet(cardData: WalletCardData, _walletStyles?: WalletStyles, signal?: AbortSignal): Promise<boolean> {
  return downloadApplePass(cardData, signal).catch(() => {
    if (signal?.aborted) return false;
    unavailable(cardData, 'apple');
    return false;
  });
}
export function addToGoogleWallet(cardData: WalletCardData, walletStyles?: WalletStyles, signal?: AbortSignal): Promise<boolean> {
  return openGoogleWallet(cardData, walletStyles, signal);
}

/** Check if device supports Apple Wallet (iOS). */
export function supportsAppleWallet(): boolean { return /iPhone|iPad|iPod/.test(navigator.userAgent); }
/** Check if device supports Google Wallet (Android). */
export function supportsGoogleWallet(): boolean { return /Android/.test(navigator.userAgent); }
/** Get the preferred wallet type based on device. */
export function getPreferredWallet(): 'apple' | 'google' | 'both' {
  if (supportsAppleWallet()) return 'apple';
  if (supportsGoogleWallet()) return 'google';
  return 'both';
}
