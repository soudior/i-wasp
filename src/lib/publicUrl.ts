/**
 * URL publiques canoniques i-Wasp.
 *
 * Pourquoi ce fichier existe :
 * plusieurs QR codes et PDF d'impression construisaient leur URL à partir de
 * `window.location.origin`. Générés depuis une preview, un domaine temporaire,
 * un tunnel ou localhost, ils encodaient une adresse morte — gravée pour de bon
 * sur une puce NFC ou imprimée sur une carte physique. Irréparable après coup.
 *
 * Règle : tout ce qui finit sur un support physique, dans un QR code ou dans un
 * pass Wallet passe par ces fonctions, jamais par window.location.
 */

/** Domaine public définitif du produit. */
export const PUBLIC_SITE_URL = "https://i-wasp.com";

/** URL NFC canonique d'une carte client. C'est l'URL gravée sur la puce. */
export function publicCardUrl(slug: string): string {
  return `${PUBLIC_SITE_URL}/card/${slug}`;
}

/** Ancien format de lien court, conservé pour les supports déjà distribués. */
export function publicLegacyCardUrl(slug: string): string {
  return `${PUBLIC_SITE_URL}/c/${slug}`;
}

/** URL d'activation imprimée au dos des cartes, avec code de série pré-rempli. */
export function publicActivationUrl(serialCode?: string | null): string {
  return serialCode
    ? `${PUBLIC_SITE_URL}/activation?code=${encodeURIComponent(serialCode)}`
    : `${PUBLIC_SITE_URL}/activation`;
}
