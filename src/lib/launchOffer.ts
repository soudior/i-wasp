/**
 * Offre de lancement — une seule source.
 * Mettre `enabled` à false suffit à rétablir la grille officielle.
 *
 * Fin : 30 novembre 2026 à 23:59, heure d'Afrique/Casablanca (UTC+1, sans heure d'été).
 * Le dernier instant inclus est 23:59:59. À partir du 1er décembre 00:00, l'offre est close.
 */

export const LAUNCH_OFFER = {
  enabled: true,
  endsAt: "2026-11-30T23:59:59+01:00",
  timeZone: "Africa/Casablanca",
  professionnelle: {
    priceEur: 35,
    priceMad: 249,
    amountEurCents: 3500,
    amountMadCents: 24900,
    compareEur: 49,
    compareMad: 349,
    proMonths: 12,
  },
  duo: {
    id: "pack_duo",
    priceEur: 79,
    priceMad: 549,
    amountEurCents: 7900,
    amountMadCents: 54900,
    compareEur: 98,
    compareMad: 698,
    quantity: 2,
  },
} as const;

export function launchOfferEndsAt(): number {
  return Date.parse(LAUNCH_OFFER.endsAt);
}

export function isLaunchOfferActive(now: Date = new Date()): boolean {
  if (!LAUNCH_OFFER.enabled) return false;
  return now.getTime() <= launchOfferEndsAt();
}

export function launchCountdownParts(now: Date = new Date()): { days: number; hours: number; minutes: number; seconds: number } | null {
  if (!isLaunchOfferActive(now)) return null;
  const remaining = Math.max(0, launchOfferEndsAt() - now.getTime());
  const totalSeconds = Math.floor(remaining / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function formatLaunchCountdown(now: Date = new Date()): string | null {
  const parts = launchCountdownParts(now);
  if (!parts) return null;
  const hh = String(parts.hours).padStart(2, "0");
  const mm = String(parts.minutes).padStart(2, "0");
  const ss = String(parts.seconds).padStart(2, "0");
  return `${parts.days}j ${hh}:${mm}:${ss}`;
}
