import {
  fulfillmentPriceAccepted,
  inferLegacyOffer,
  NFC_OFFERS,
  normalizeCurrency,
  productName,
  readStoredOfferId,
  type NfcCurrency,
  type NfcOfferId,
} from "../_shared/nfcCatalog.ts";

export class WebhookSignatureError extends Error {
  constructor() {
    super("Invalid Stripe signature");
    this.name = "WebhookSignatureError";
  }
}

class WebhookLifecycleError extends Error {
  constructor(message: string, public readonly status = 409) {
    super(message);
    this.name = "WebhookLifecycleError";
  }
}

export interface StripeCheckoutSessionLike {
  id: string;
  payment_status?: string | null;
  status?: string | null;
  amount_total?: number | null;
  currency?: string | null;
  payment_intent?: string | { id?: string } | null;
  metadata?: Record<string, string> | null;
}

export interface StripeWebhookEventLike {
  id: string;
  type: string;
  data: { object: StripeCheckoutSessionLike };
}

export interface NfcFulfillmentOrder {
  id: string;
  user_id: string;
  status: string;
  paid_at: string | null;
  payment_method: string;
  quantity: number;
  unit_price_cents: number;
  total_price_cents: number;
  currency: string;
  checkout_revision: number;
  stripe_session_id: string | null;
  digital_card_id: string | null;
  subscription_id: string | null;
  order_items: unknown;
}

export interface StripeWebhookDependencies {
  verifyEvent: (body: string, signature: string) => Promise<StripeWebhookEventLike>;
  findNfcOrder: (orderId: string) => Promise<NfcFulfillmentOrder | null>;
  markNfcOrderPaid: (input: {
    orderId: string;
    checkoutRevision: number;
    stripeSessionId: string;
    stripePaymentIntentId: string | null;
    paidAt: string;
  }) => Promise<boolean>;
  activateDigitalCard: (cardId: string, userId: string) => Promise<boolean>;
  activateSubscription: (subscriptionId: string, userId: string, input: {
    offer: NfcOfferId;
    priceCents: number;
    currency: NfcCurrency;
    paidAt: string;
  }) => Promise<boolean>;
  markFulfillmentActivated: (orderId: string, stripeSessionId: string, activatedAt: string) => Promise<boolean>;
  processWebstudioSession: (session: StripeCheckoutSessionLike) => Promise<Record<string, unknown>>;
  now: () => Date;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function orderItemMatches(order: NfcFulfillmentOrder, expectedName: string): boolean {
  if (!Array.isArray(order.order_items) || order.order_items.length !== 1 || !isRecord(order.order_items[0])) {
    return false;
  }
  const item = order.order_items[0];
  return item.templateName === expectedName
    && item.quantity === 1
    && item.unitPriceCents === order.unit_price_cents;
}

function paymentIntentId(value: StripeCheckoutSessionLike["payment_intent"]): string | null {
  if (typeof value === "string") return value;
  return value && typeof value.id === "string" ? value.id : null;
}

export async function reconcileNfcPayment(
  session: StripeCheckoutSessionLike,
  dependencies: StripeWebhookDependencies,
): Promise<{ received: true; orderId: string; fulfilled: true }> {
  const metadata = session.metadata;
  const orderId = metadata?.order_id;
  if (!orderId || !UUID_PATTERN.test(orderId)) throw new Error("Invalid NFC order metadata");
  if (session.payment_status !== "paid" || session.status !== "complete") {
    throw new WebhookLifecycleError("NFC checkout is not paid");
  }

  const order = await dependencies.findNfcOrder(orderId);
  if (!order) throw new Error("Authoritative NFC order not found");
  if (!order.digital_card_id || !order.subscription_id) throw new Error("Order fulfillment linkage missing");
  if (order.payment_method !== "stripe" || !["pending", "paid"].includes(order.status)) {
    throw new Error("NFC order is not payable");
  }

  const currency = normalizeCurrency(order.currency);
  const storedOffer = readStoredOfferId(order.order_items);
  const offerId = storedOffer.present ? storedOffer.offerId : inferLegacyOffer(order.currency, order.unit_price_cents);
  const offer = offerId ? NFC_OFFERS[offerId] : null;
  const expectedName = offer ? productName(offer) : "";
  const offerResolved = Boolean(offer && currency && offerId && (!storedOffer.present || storedOffer.offerId));
  const authoritativeMatch = offerResolved
    && order.quantity === 1
    && order.total_price_cents === order.unit_price_cents
    && fulfillmentPriceAccepted(offerId!, currency!, order.unit_price_cents)
    && orderItemMatches(order, expectedName);
  const sessionIdMatches = order.status === "paid"
    ? order.stripe_session_id === session.id
    : order.stripe_session_id === null || order.stripe_session_id === session.id;
  const stripeMatch = sessionIdMatches
    && session.amount_total === order.total_price_cents
    && session.currency?.toLowerCase() === currency?.toLowerCase()
    && metadata?.offer === offer?.id
    && metadata?.quantity === "1"
    && metadata?.checkout_revision === String(order.checkout_revision);
  if (!authoritativeMatch || !stripeMatch) {
    throw new Error("Stripe session does not match authoritative order");
  }

  const paidAt = order.paid_at ?? dependencies.now().toISOString();
  if (order.status === "pending") {
    const marked = await dependencies.markNfcOrderPaid({
      orderId: order.id,
      checkoutRevision: order.checkout_revision,
      stripeSessionId: session.id,
      stripePaymentIntentId: paymentIntentId(session.payment_intent),
      paidAt,
    });
    if (!marked) throw new Error("NFC order payment reconciliation raced; retry required");
  }

  const cardActivated = await dependencies.activateDigitalCard(order.digital_card_id, order.user_id);
  if (!cardActivated) throw new Error("Linked NFC card activation failed");
  const subscriptionActivated = await dependencies.activateSubscription(order.subscription_id, order.user_id, {
    offer: offer!.id,
    priceCents: order.unit_price_cents,
    currency: currency!,
    paidAt,
  });
  if (!subscriptionActivated) throw new Error("Linked NFC subscription activation failed");
  const fulfillmentMarked = await dependencies.markFulfillmentActivated(order.id, session.id, paidAt);
  if (!fulfillmentMarked) throw new Error("NFC fulfillment reconciliation failed");

  return { received: true, orderId: order.id, fulfilled: true };
}

export function createStripeWebhookHandler(dependencies: StripeWebhookDependencies) {
  return async (request: Request): Promise<Response> => {
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
      const signature = request.headers.get("stripe-signature");
      if (!signature) return jsonResponse({ error: "Missing signature" }, 400);
      const event = await dependencies.verifyEvent(await request.text(), signature);

      if (
        event.type === "checkout.session.completed" ||
        event.type === "checkout.session.async_payment_succeeded"
      ) {
        const session = event.data.object;
        if (session.metadata?.type === "nfc_order") {
          if (session.payment_status !== "paid" || session.status !== "complete") {
            throw new WebhookLifecycleError("NFC checkout is not paid");
          }
          return jsonResponse(await reconcileNfcPayment(session, dependencies));
        }
        if (event.type === "checkout.session.completed" && session.metadata?.type === "webstudio_direct") {
          return jsonResponse(await dependencies.processWebstudioSession(session));
        }
        return jsonResponse({ received: true, skipped: true });
      }

      if (event.type === "checkout.session.async_payment_failed") {
        if (event.data.object.metadata?.type === "nfc_order") {
          throw new WebhookLifecycleError("NFC checkout payment failed");
        }
        return jsonResponse({ received: true, skipped: true });
      }

      return jsonResponse({ received: true });
    } catch (error) {
      if (error instanceof WebhookSignatureError) {
        return jsonResponse({ error: "Invalid signature" }, 400);
      }
      if (error instanceof WebhookLifecycleError) {
        return jsonResponse({ error: error.message }, error.status);
      }
      console.error("[STRIPE-WEBHOOK] Failed", error instanceof Error ? error.message : "Unknown error");
      return jsonResponse({ error: "Webhook processing failed" }, 500);
    }
  };
}
