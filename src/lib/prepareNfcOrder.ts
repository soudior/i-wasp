/**
 * Builds the payload for public.prepare_nfc_order.
 * The database chooses the amount. The client only names the offer and the market currency.
 */
import { supabase } from "@/integrations/supabase/client";
import { shippingCountryForMarket, type MarketCurrency } from "@/lib/nfcChargeCatalog";

export const NFC_STYLE_BY_TEMPLATE: Record<string, { styleId: string; template: string }> = {
  signature: { styleId: "essential", template: "signature" },
  "dark-luxury": { styleId: "signature", template: "dark-luxury" },
  executive: { styleId: "executive", template: "executive" },
  boutique: { styleId: "boutique", template: "boutique" },
};

const CHECKOUT_KEY = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function checkoutKeyForUser(userId: string): string {
  const storageKey = `iwasp.nfcCheckoutKey.${userId}`;
  const existing = sessionStorage.getItem(storageKey);
  if (existing && CHECKOUT_KEY.test(existing)) return existing;
  const key = crypto.randomUUID();
  sessionStorage.setItem(storageKey, key);
  return key;
}

export interface PrepareNfcOrderInput {
  checkoutKey: string;
  offerId: string;
  paymentMethod: "stripe" | "cod";
  currency: MarketCurrency;
  templateId: string;
  firstName: string;
  lastName: string;
  publishContacts?: boolean;
  /** When false, the linked card stays private even for cash on delivery. */
  publishProfile?: boolean;
  customerEmail?: string | null;
  email?: string | null;
  phone?: string | null;
  title?: string | null;
  company?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  website?: string | null;
  tagline?: string | null;
  photoUrl?: string | null;
  logoUrl?: string | null;
  shippingPhone?: string | null;
  shippingAddress?: string | null;
  shippingCity?: string | null;
  shippingCountry?: string | null;
}

export function buildPrepareNfcOrderArgs(input: PrepareNfcOrderInput) {
  const style = NFC_STYLE_BY_TEMPLATE[input.templateId];
  if (!style) throw new Error("Style de carte non pris en charge");
  const publish = input.publishContacts !== false;
  return {
    p_checkout_key: input.checkoutKey,
    p_offer_id: input.offerId,
    p_payment_method: input.paymentMethod,
    p_card: {
      styleId: style.styleId,
      template: style.template,
      accentColor: "#B8860B",
      publish: input.publishProfile !== false,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: publish ? input.email ?? "" : "",
      phone: publish ? input.phone ?? "" : "",
      title: input.title ?? "",
      company: input.company ?? "",
      whatsapp: publish ? input.whatsapp ?? "" : "",
      instagram: publish ? input.instagram ?? "" : "",
      linkedin: publish ? input.linkedin ?? "" : "",
      website: publish ? input.website ?? "" : "",
      tagline: input.tagline ?? "",
      photoUrl: input.photoUrl ?? "",
      logoUrl: input.logoUrl ?? "",
    },
    p_order: {
      currency: input.currency,
      customerEmail: input.customerEmail ?? "",
      shippingPhone: input.shippingPhone ?? "",
      shippingAddress: input.shippingAddress ?? "",
      shippingCity: input.shippingCity ?? "",
      shippingCountry: shippingCountryForMarket(input.currency, input.shippingCountry),
    },
  };
}

export async function readPreparedOrder(orderId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("id,order_number,total_price_cents,currency")
    .eq("id", orderId)
    .single();
  if (error || !data) throw error ?? new Error("Commande introuvable");
  return data;
}

export async function prepareNfcOrder(input: PrepareNfcOrderInput): Promise<string> {
  const args = buildPrepareNfcOrderArgs(input);
  const { data, error } = await supabase.rpc("prepare_nfc_order", args);
  if (error || typeof data !== "string") {
    throw error ?? new Error("Commande non préparée");
  }
  return data;
}
