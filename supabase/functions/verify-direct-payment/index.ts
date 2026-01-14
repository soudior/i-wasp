/**
 * Edge Function: verify-direct-payment
 * Verifies a direct payment from Stripe checkout session
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-DIRECT-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");

    const { sessionId } = await req.json() as { sessionId: string };
    
    if (!sessionId) {
      return new Response(
        JSON.stringify({ success: false, error: "Session ID manquant" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    logStep("Verifying session", { sessionId });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent'],
    });

    logStep("Session retrieved", { 
      status: session.payment_status,
      amount: session.amount_total,
      currency: session.currency,
    });

    if (session.payment_status !== 'paid') {
      return new Response(
        JSON.stringify({ success: false, error: "Paiement non complété" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build order details
    const lineItems = session.line_items?.data || [];
    const items = lineItems.map((item: Stripe.LineItem) => ({
      name: item.description || 'Article',
      quantity: item.quantity || 1,
      amount: formatAmount(item.amount_total || 0, session.currency || 'eur'),
    }));

    const orderDetails = {
      amount: formatAmount(session.amount_total || 0, session.currency || 'eur'),
      currency: (session.currency || 'eur').toUpperCase(),
      email: session.customer_details?.email || session.customer_email || '',
      items,
    };

    logStep("Payment verified successfully", orderDetails);

    return new Response(
      JSON.stringify({ 
        success: true,
        orderDetails,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function formatAmount(amountInCents: number, currency: string): string {
  const amount = amountInCents / 100;
  const symbol = currency.toLowerCase() === 'mad' ? 'DH' : '€';
  return `${amount.toLocaleString('fr-FR')} ${symbol}`;
}
