/**
 * Authoritative NFC price table. Amounts are cents and are never converted.
 * `LAUNCH_OFFER_ENABLED` must stay in lockstep with `LAUNCH_OFFER.enabled`
 * in src/lib/launchOffer.ts and with the same date in the prepare_nfc_order migration.
 *
 * 32900 / 54900 / 98900 MAD are the deployed v7 catalog (Essentielle, Professionnelle,
 * Prestige). They stay payable so an order created before this grid still fulfills.
 * New orders are priced from the dated rows. Pack DUO shares 54900 MAD with that
 * legacy Professionnelle row, so callers must key by offer id, not by amount.
 */

export const LAUNCH_OFFER_ENABLED = true;
export const LAUNCH_OFFER_ENDS_AT = "2026-11-30T23:59:59+01:00";

export type NfcOfferId = "essentiel" | "signature" | "alliance" | "duo" | "team";
export type NfcCurrency = "MAD" | "EUR";

interface PriceRow {
  launch: number;
  standard: number | null;
  legacy: readonly number[];
}

export interface NfcOffer {
  id: NfcOfferId;
  name: string;
  quantity: 1;
  mad: PriceRow;
  eur: PriceRow;
}

export const NFC_OFFERS: Record<NfcOfferId, NfcOffer> = {
  essentiel: {
    id: "essentiel",
    name: "Essentielle",
    quantity: 1,
    mad: { launch: 19900, standard: 19900, legacy: [32900] },
    eur: { launch: 2900, standard: 2900, legacy: [] },
  },
  signature: {
    id: "signature",
    name: "Professionnelle",
    quantity: 1,
    mad: { launch: 24900, standard: 34900, legacy: [54900] },
    eur: { launch: 3500, standard: 4900, legacy: [] },
  },
  alliance: {
    id: "alliance",
    name: "Prestige",
    quantity: 1,
    mad: { launch: 59900, standard: 59900, legacy: [98900] },
    eur: { launch: 7900, standard: 7900, legacy: [] },
  },
  duo: {
    id: "duo",
    name: "DUO",
    quantity: 1,
    mad: { launch: 54900, standard: null, legacy: [] },
    eur: { launch: 7900, standard: null, legacy: [] },
  },
  team: {
    id: "team",
    name: "TEAM",
    quantity: 1,
    mad: { launch: 99900, standard: 129900, legacy: [] },
    eur: { launch: 11900, standard: 11900, legacy: [] },
  },
};

const LEGACY_MAD_OFFERS: Record<number, NfcOfferId> = {
  32900: "essentiel",
  54900: "signature",
  98900: "alliance",
};

export function isLaunchOfferActive(now: Date = new Date()): boolean {
  if (!LAUNCH_OFFER_ENABLED) return false;
  return now.getTime() <= Date.parse(LAUNCH_OFFER_ENDS_AT);
}

export function normalizeCurrency(value: string | null | undefined): NfcCurrency | null {
  const code = value?.toUpperCase();
  return code === "MAD" || code === "EUR" ? code : null;
}

export function productName(offer: NfcOffer): string {
  return `Carte NFC i-Wasp ${offer.name}`;
}

function priceRow(offer: NfcOffer, currency: NfcCurrency): PriceRow {
  return currency === "EUR" ? offer.eur : offer.mad;
}

export function currentPriceCents(
  offerId: NfcOfferId,
  currency: NfcCurrency,
  now: Date = new Date(),
): number | null {
  const row = priceRow(NFC_OFFERS[offerId], currency);
  if (offerId === "duo") return isLaunchOfferActive(now) ? row.launch : null;
  if (offerId === "signature" || offerId === "team") {
    return isLaunchOfferActive(now) ? row.launch : row.standard;
  }
  return row.standard;
}

export function knownPriceCents(offerId: NfcOfferId, currency: NfcCurrency): number[] {
  const row = priceRow(NFC_OFFERS[offerId], currency);
  return [...new Set([row.launch, row.standard, ...row.legacy].filter((value): value is number => typeof value === "number"))];
}

export function checkoutPriceAccepted(
  offerId: NfcOfferId,
  currency: NfcCurrency,
  amount: number,
  now: Date = new Date(),
): boolean {
  return currentPriceCents(offerId, currency, now) === amount
    || priceRow(NFC_OFFERS[offerId], currency).legacy.includes(amount);
}

export function fulfillmentPriceAccepted(
  offerId: NfcOfferId,
  currency: NfcCurrency,
  amount: number,
): boolean {
  return knownPriceCents(offerId, currency).includes(amount);
}

export function inferLegacyOffer(currency: string, amount: number): NfcOfferId | null {
  if (currency !== "MAD") return null;
  return LEGACY_MAD_OFFERS[amount] ?? null;
}

export function readStoredOfferId(orderItems: unknown): { present: boolean; offerId: NfcOfferId | null } {
  if (!Array.isArray(orderItems) || orderItems.length !== 1) return { present: false, offerId: null };
  const item = orderItems[0];
  if (!item || typeof item !== "object" || Array.isArray(item)) return { present: false, offerId: null };
  if (!Object.prototype.hasOwnProperty.call(item, "offerId")) return { present: false, offerId: null };
  const offerId = (item as { offerId?: unknown }).offerId;
  if (typeof offerId !== "string" || !(offerId in NFC_OFFERS)) return { present: true, offerId: null };
  return { present: true, offerId: offerId as NfcOfferId };
}
