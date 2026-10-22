/**
 * Stripe webhook for Web Studio and authoritative NFC order fulfillment.
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

import {
  createStripeWebhookHandler,
  type NfcFulfillmentOrder,
  type StripeCheckoutSessionLike,
  type StripeWebhookEventLike,
  WebhookSignatureError,
} from "./handler.ts";

const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!stripeKey || !webhookSecret || !supabaseUrl || !serviceRoleKey) {
  throw new Error("Stripe webhook backend configuration missing");
}

const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
const supabase = createClient(supabaseUrl, serviceRoleKey);

function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `WS-${year}${month}-${random}`;
}

async function processWebstudioSession(input: StripeCheckoutSessionLike): Promise<Record<string, unknown>> {
  const session = input as Stripe.Checkout.Session;
  const { data: existingOrder } = await supabase
    .from("webstudio_orders")
    .select("id")
    .eq("stripe_session_id", session.id)
    .maybeSingle();
  if (existingOrder) return { received: true, exists: true };

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
  const items = lineItems.data.map((item) => ({
    name: item.description || "Article",
    quantity: item.quantity || 1,
    amount_cents: item.amount_total || 0,
  }));

  let options: unknown[] = [];
  if (session.payment_intent) {
    try {
      const intentId = typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent.id;
      const paymentIntent = await stripe.paymentIntents.retrieve(intentId);
      if (paymentIntent.metadata?.options) options = JSON.parse(paymentIntent.metadata.options);
    } catch {
      console.warn("[STRIPE-WEBHOOK] Could not parse Web Studio options");
    }
  }

  const { data: order, error } = await supabase
    .from("webstudio_orders")
    .insert({
      stripe_session_id: session.id,
      stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
      stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
      customer_email: session.customer_details?.email || session.customer_email || "",
      customer_name: session.customer_details?.name || null,
      order_number: generateOrderNumber(),
      package_type: session.metadata?.package_type || "UNKNOWN",
      currency: (session.currency || "eur").toUpperCase(),
      amount_cents: session.amount_total || 0,
      items,
      options,
      status: "paid",
      paid_at: new Date().toISOString(),
    })
    .select("id,order_number")
    .single();
  if (error) throw error;
  return { received: true, orderId: order.id, orderNumber: order.order_number };
}

const handler = createStripeWebhookHandler({
  verifyEvent: async (body, signature) => {
    try {
      const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
      return event as unknown as StripeWebhookEventLike;
    } catch {
      throw new WebhookSignatureError();
    }
  },
  findNfcOrder: async (orderId) => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id,user_id,status,paid_at,payment_method,quantity,unit_price_cents,total_price_cents,currency,checkout_revision,stripe_session_id,digital_card_id,subscription_id,order_items",
      )
      .eq("id", orderId)
      .maybeSingle();
    if (error) throw new Error("NFC order lookup failed");
    return data as NfcFulfillmentOrder | null;
  },
  markNfcOrderPaid: async (input) => {
    const { data, error } = await supabase
      .from("orders")
      .update({
        status: "paid",
        paid_at: input.paidAt,
        payment_method: "stripe",
        stripe_session_id: input.stripeSessionId,
        stripe_payment_intent_id: input.stripePaymentIntentId,
      })
      .eq("id", input.orderId)
      .eq("status", "pending")
      .eq("checkout_revision", input.checkoutRevision)
      .or(`stripe_session_id.is.null,stripe_session_id.eq.${input.stripeSessionId}`)
      .select("id")
      .maybeSingle();
    if (error) throw error;
    return Boolean(data);
  },
  activateDigitalCard: async (cardId, userId) => {
    const { data, error } = await supabase
      .from("digital_cards")
      .update({ is_active: true, nfc_enabled: true, wallet_enabled: true })
      .eq("id", cardId)
      .eq("user_id", userId)
      .select("id")
      .maybeSingle();
    if (error) throw error;
    return Boolean(data);
  },
  activateSubscription: async (subscriptionId, userId, input) => {
    const expiresAt = new Date(input.paidAt);
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    const { data, error } = await supabase
      .from("subscriptions")
      .update({
        plan: "premium",
        status: "active",
        price_cents: input.priceCents,
        currency: input.currency,
        started_at: input.paidAt,
        expires_at: expiresAt.toISOString(),
        payment_method: "stripe",
        notes: `Commande NFC payée - ${input.offer}`,
        updated_at: input.paidAt,
      })
      .eq("id", subscriptionId)
      .eq("user_id", userId)
      .select("id")
      .maybeSingle();
    if (error) throw error;
    return Boolean(data);
  },
  markFulfillmentActivated: async (orderId, stripeSessionId, activatedAt) => {
    const { data, error } = await supabase
      .from("orders")
      .update({ fulfillment_activated_at: activatedAt })
      .eq("id", orderId)
      .eq("status", "paid")
      .eq("stripe_session_id", stripeSessionId)
      .select("id")
      .maybeSingle();
    if (error) throw error;
    return Boolean(data);
  },
  processWebstudioSession,
  now: () => new Date(),
});

serve(handler);
