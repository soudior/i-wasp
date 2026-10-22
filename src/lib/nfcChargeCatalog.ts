/**
 * Montants facturés, identiques au catalogue de create-nfc-payment.
 * Le client ne choisit jamais le montant : il choisit seulement la devise du marché.
 */
import { NFC_PRICING } from "./nfcPricing";
import { isLaunchOfferActive, LAUNCH_OFFER } from "./launchOffer";

export type MarketCurrency = "EUR" | "MAD";

export const NFC_PAYMENT_VERSION = 2;

const TIER_ALIASES: Record<string, string> = {
  essentiel: "essentielle",
  signature: "professionnelle",
  alliance: "prestige",
  single: "essentielle",
  duo: "pack_duo",
  pack_duo: "pack_duo",
  team: "pack_team",
  essentielle: "essentielle",
  professionnelle: "professionnelle",
  prestige: "prestige",
  pack_team: "pack_team",
};

export function canonicalTierId(id: string | null | undefined): string | null {
  const key = (id ?? "").trim();
  return TIER_ALIASES[key] ?? null;
}

export function serverChargeCents(
  tierId: string | null | undefined,
  currency: MarketCurrency,
  now: Date = new Date(),
): number | null {
  const tier = canonicalTierId(tierId);
  if (!tier) return null;
  const launch = isLaunchOfferActive(now);
  if (tier === "pack_duo") {
    if (!launch) return null;
    return currency === "EUR" ? LAUNCH_OFFER.duo.amountEurCents : LAUNCH_OFFER.duo.amountMadCents;
  }
  if (tier === "professionnelle" && launch) {
    return currency === "EUR"
      ? LAUNCH_OFFER.professionnelle.amountEurCents
      : LAUNCH_OFFER.professionnelle.amountMadCents;
  }
  if (tier === "pack_team" && launch) {
    return currency === "EUR" ? LAUNCH_OFFER.team.amountEurCents : LAUNCH_OFFER.team.amountMadCents;
  }
  const card = {
    essentielle: NFC_PRICING.cards.ESSENTIELLE,
    professionnelle: NFC_PRICING.cards.PROFESSIONNELLE,
    prestige: NFC_PRICING.cards.PRESTIGE,
    pack_team: NFC_PRICING.cards.PACK_TEAM,
  }[tier];
  if (!card) return null;
  return currency === "EUR" ? Math.round(card.priceEur * 100) : Math.round(card.priceMad * 100);
}

export function proTrialMonths(tierId: string | null | undefined, now: Date = new Date()): number {
  const tier = canonicalTierId(tierId);
  if (tier === "professionnelle" && isLaunchOfferActive(now)) return LAUNCH_OFFER.professionnelle.proMonths;
  return 3;
}

/** Prix barré de l'offre de lancement, ou null hors période / hors produit. */
export function launchCompareAmounts(
  tierId: string | null | undefined,
  now: Date = new Date(),
): { eur: number; mad: number } | null {
  if (!isLaunchOfferActive(now)) return null;
  const tier = canonicalTierId(tierId);
  if (tier === "professionnelle") {
    return { eur: LAUNCH_OFFER.professionnelle.compareEur, mad: LAUNCH_OFFER.professionnelle.compareMad };
  }
  if (tier === "pack_duo") {
    return { eur: LAUNCH_OFFER.duo.compareEur, mad: LAUNCH_OFFER.duo.compareMad };
  }
  if (tier === "pack_team") {
    return { eur: LAUNCH_OFFER.team.compareEur, mad: LAUNCH_OFFER.team.compareMad };
  }
  return null;
}

export function shippingCountryForMarket(
  currency: MarketCurrency,
  explicit?: string | null,
): string {
  const value = (explicit ?? "").trim();
  if (/^[A-Za-z]{2}$/.test(value)) {
    const code = value.toUpperCase();
    if (code === "MA") return currency === "MAD" ? "MA" : "FR";
    return code;
  }
  if (value && value.toLowerCase() !== "maroc") return value;
  return currency === "MAD" ? "MA" : "FR";
}
