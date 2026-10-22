/**
 * Creates an authenticated Stripe Checkout Session for an existing NFC order.
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

import { createNfcPaymentHandler } from "./handler.ts";
import type { NfcOrderRecord } from "./contract.ts";

const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!stripeKey || !supabaseUrl || !serviceRoleKey) {
  throw new Error("Backend configuration missing");
}

const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
const supabase = createClient(supabaseUrl, serviceRoleKey);

const handler = createNfcPaymentHandler({
  allowedOrigins: Deno.env.get("NFC_CHECKOUT_ALLOWED_ORIGINS"),
  defaultOrigin: Deno.env.get("NFC_CHECKOUT_DEFAULT_ORIGIN"),
  verifyUser: async (token) => {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return null;
    return { id: data.user.id, email: data.user.email };
  },
  findOrder: async (orderId) => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id,user_id,status,paid_at,payment_method,quantity,unit_price_cents,total_price_cents,currency,checkout_key,checkout_revision,digital_card_id,subscription_id,order_items",
      )
      .eq("id", orderId)
      .maybeSingle();
    if (error) throw new Error("Order lookup failed");
    return data as NfcOrderRecord | null;
  },
  findCustomer: async (email) => {
    const customers = await stripe.customers.list({ email, limit: 1 });
    return customers.data[0]?.id;
  },
  createCheckoutSession: (params, options) => stripe.checkout.sessions.create(params, options),
  recordCheckoutSession: async (orderId, userId, sessionId, checkoutRevision) => {
    const { data, error } = await supabase
      .from("orders")
      .update({ stripe_session_id: sessionId })
      .eq("id", orderId)
      .eq("user_id", userId)
      .eq("status", "pending")
      .eq("checkout_revision", checkoutRevision)
      .select("id")
      .maybeSingle();
    if (error || !data) throw new Error("Checkout session persistence failed");
  },
});

serve(handler);
