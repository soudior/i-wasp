/**
 * Paiement NFC : le bouton n'ouvre Stripe que si la fonction confirme
 * exactement la devise et le montant affichés. L'ancienne fonction (MAD seul,
 * sans version) ne crée pas de session tant que le devis ne correspond pas.
 */
import { canonicalTierId, NFC_PAYMENT_VERSION, serverChargeCents, type MarketCurrency } from "./nfcChargeCatalog";

export type NfcInvoke = (
  name: string,
  options: { body: Record<string, unknown> },
) => Promise<{ data: unknown; error: { message?: string } | null }>;

type QuoteTier = { EUR?: number; MAD?: number };

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? value as Record<string, unknown> : null;
}

export function quotedTierAmount(data: unknown, tierId: string, currency: MarketCurrency): number | null {
  const body = asRecord(data);
  if (!body || body.version !== NFC_PAYMENT_VERSION) return null;
  const tier = canonicalTierId(tierId);
  const tiers = asRecord(body.tiers);
  if (!tier || !tiers) return null;
  const row = asRecord(tiers[tier]) as QuoteTier | null;
  const amount = row?.[currency];
  return typeof amount === "number" ? amount : null;
}

export function confirmedSession(data: unknown): { url: string; currency: MarketCurrency; amount: number } | null {
  const body = asRecord(data);
  if (!body || body.version !== NFC_PAYMENT_VERSION) return null;
  const currency = body.currency === "EUR" || body.currency === "MAD" ? body.currency : null;
  const amount = typeof body.amount === "number" ? body.amount : null;
  const url = typeof body.url === "string" && body.url ? body.url : null;
  if (!currency || amount == null || !url) return null;
  return { url, currency, amount };
}

export async function createConfirmedNfcCheckout(
  invoke: NfcInvoke,
  input: { tierId: string; currency: MarketCurrency; orderId: string; email?: string; now?: Date },
): Promise<{ ok: true; url: string } | { ok: false; reason: "unconfirmed" | "mismatch" }> {
  const expected = serverChargeCents(input.tierId, input.currency, input.now);
  if (expected == null) return { ok: false, reason: "unconfirmed" };

  const quote = await invoke("create-nfc-payment", { body: { action: "quote" } });
  if (quote.error || quotedTierAmount(quote.data, input.tierId, input.currency) !== expected) {
    return { ok: false, reason: "unconfirmed" };
  }

  const created = await invoke("create-nfc-payment", {
    body: {
      tierId: input.tierId,
      currency: input.currency,
      orderId: input.orderId,
      ...(input.email ? { email: input.email } : {}),
    },
  });
  if (created.error) return { ok: false, reason: "unconfirmed" };
  const session = confirmedSession(created.data);
  if (!session || session.currency !== input.currency || session.amount !== expected) {
    return { ok: false, reason: "mismatch" };
  }
  return { ok: true, url: session.url };
}
