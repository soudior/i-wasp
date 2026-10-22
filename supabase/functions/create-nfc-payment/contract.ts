import { NFC_ORDER_CATALOG } from "../_shared/nfcCatalog.ts";

export { NFC_ORDER_CATALOG } from "../_shared/nfcCatalog.ts";

export class ContractError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ContractError";
  }
}

export interface NfcOrderRecord {
  id: string;
  user_id: string;
  status: string;
  paid_at: string | null;
  payment_method: string;
  quantity: number;
  unit_price_cents: number;
  total_price_cents: number;
  currency: string;
  checkout_key: string | null;
  checkout_revision: number;
  digital_card_id: string | null;
  subscription_id: string | null;
  order_items: unknown;
}

export interface CheckoutContract {
  orderId: string;
  checkoutKey: string;
  offer: keyof typeof NFC_ORDER_CATALOG;
  amountCents: number;
  currency: "mad";
  productName: string;
  quantity: 1;
  metadata: {
    type: "nfc_order";
    order_id: string;
    offer: keyof typeof NFC_ORDER_CATALOG;
    quantity: "1";
    checkout_revision: string;
  };
  idempotencyKey: string;
}

export function buildStripeCheckoutRequest(
  checkout: CheckoutContract,
  origin: string,
  customerId?: string,
  verifiedEmail?: string,
) {
  return {
    params: {
      customer: customerId,
      customer_email: customerId ? undefined : verifiedEmail,
      line_items: [{
        price_data: {
          currency: checkout.currency,
          product_data: { name: checkout.productName },
          unit_amount: checkout.amountCents,
        },
        quantity: checkout.quantity,
      }],
      mode: "payment" as const,
      success_url: `${origin}/nfc-success?session_id={CHECKOUT_SESSION_ID}&order_id=${checkout.orderId}&checkout_ref=${checkout.checkoutKey}`,
      cancel_url: `${origin}/create?step=order&payment=cancelled&checkout_ref=${checkout.checkoutKey}`,
      metadata: checkout.metadata,
      payment_intent_data: { metadata: checkout.metadata },
      ...(verifiedEmail ? {} : { customer_creation: "always" as const }),
    },
    options: { idempotencyKey: checkout.idempotencyKey },
  };
}

function normalizedHttpOrigin(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function resolveCheckoutOrigin(
  requestOrigin: string | null,
  configuredOrigins: string | undefined,
  configuredDefault: string | undefined,
): string {
  const hardFallback = "https://i-wasp.com";
  const fallback = normalizedHttpOrigin(configuredDefault) ?? hardFallback;
  const allowed = new Set(
    (configuredOrigins ?? "")
      .split(",")
      .map((value) => normalizedHttpOrigin(value.trim()))
      .filter((value): value is string => Boolean(value)),
  );
  allowed.add(fallback);
  const candidate = normalizedHttpOrigin(requestOrigin);
  return candidate && allowed.has(candidate) ? candidate : fallback;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseBearerToken(header: string | null): string {
  const match = header?.match(/^Bearer\s+(.+)$/i);
  const token = match?.[1]?.trim();
  if (!token) throw new ContractError("Authentification requise", 401);
  return token;
}

export function parseCheckoutRequest(value: unknown): { orderId: string } {
  if (!isRecord(value) || Object.keys(value).length !== 1) {
    throw new ContractError("Requête de paiement invalide", 400);
  }
  const orderId = value.orderId;
  if (typeof orderId !== "string" || !UUID_PATTERN.test(orderId)) {
    throw new ContractError("Requête de paiement invalide", 400);
  }
  return { orderId };
}

function productName(offer: (typeof NFC_ORDER_CATALOG)[keyof typeof NFC_ORDER_CATALOG]): string {
  return `Carte NFC i-Wasp ${offer.name}`;
}

function hasMatchingOrderItem(orderItems: unknown, expectedName: string, amountCents: number): boolean {
  if (!Array.isArray(orderItems) || orderItems.length !== 1 || !isRecord(orderItems[0])) return false;
  const item = orderItems[0];
  return item.quantity === 1
    && item.unitPriceCents === amountCents
    && item.templateName === expectedName;
}

export function resolveCheckoutContract(
  order: NfcOrderRecord | null,
  verifiedUserId: string,
): CheckoutContract {
  if (!order || order.user_id !== verifiedUserId) {
    throw new ContractError("Commande introuvable", 404);
  }
  if (order.status !== "pending" || order.paid_at !== null || order.payment_method !== "stripe") {
    throw new ContractError("Commande non payable", 409);
  }
  if (!order.digital_card_id || !order.subscription_id) {
    throw new ContractError("Commande sans fulfillment sécurisé", 400);
  }
  if (!order.checkout_key || !UUID_PATTERN.test(order.checkout_key)) {
    throw new ContractError("Commande incohérente", 400);
  }
  if (!Number.isInteger(order.checkout_revision) || order.checkout_revision < 1) {
    throw new ContractError("Commande incohérente", 400);
  }

  const offer = Object.values(NFC_ORDER_CATALOG).find(
    (candidate) => candidate.priceCents === order.unit_price_cents,
  );
  if (!offer) throw new ContractError("Offre de commande non prise en charge", 400);

  const expectedProductName = productName(offer);
  const isConsistent = order.quantity === offer.quantity
    && order.total_price_cents === offer.priceCents * offer.quantity
    && order.currency === "MAD"
    && hasMatchingOrderItem(order.order_items, expectedProductName, offer.priceCents);
  if (!isConsistent) throw new ContractError("Commande incohérente", 400);

  const metadata = {
    type: "nfc_order" as const,
    order_id: order.id,
    offer: offer.id,
    quantity: "1" as const,
    checkout_revision: String(order.checkout_revision),
  };

  return {
    orderId: order.id,
    checkoutKey: order.checkout_key,
    offer: offer.id,
    amountCents: offer.priceCents,
    currency: "mad",
    productName: expectedProductName,
    quantity: 1,
    metadata,
    idempotencyKey: `nfc-order-${order.id}-r${order.checkout_revision}`,
  };
}
