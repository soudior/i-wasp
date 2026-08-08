/**
 * Edge Function: create-nfc-payment
 * Creates a Stripe checkout session for NFC card orders
 * No authentication required - guest checkout supported
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// NFC Stripe Price IDs (MAD currency)
const NFC_PRICES: Record<string, { priceId: string; name: string; quantity: number; priceMad: number }> = {
  single: {
    priceId: 'price_1Spet5IvyaABH94uidZ843Q4',
    name: 'Carte NFC Unitaire',
    quantity: 1,
    priceMad: 249,
  },
  pack_10: {
    priceId: 'price_1SpetKIvyaABH94uhbYUQPze',
    name: 'Pack Mini NFC (10 cartes)',
    quantity: 10,
    priceMad: 1900,
  },
  pack_50: {
    priceId: 'price_1SpetXIvyaABH94uaXdvz8zf',
    name: 'Pack Standard NFC (50 cartes)',
    quantity: 50,
    priceMad: 4900,
  },
  pack_100: {
    priceId: 'price_1SpetjIvyaABH94u9Hc5nip0',
    name: 'Pack Volume Pro NFC (100 cartes)',
    quantity: 100,
    priceMad: 7900,
  },
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-NFC-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Backend configuration missing");

    const { tierId, email, extras = [] } = await req.json() as {
      tierId: string;
      email?: string;
      extras?: Array<{ id: string; name: string; priceCents: number }>;
    };

    logStep("Request received", { tierId, email, extrasCount: extras.length });

    // Validate tier
    const tier = NFC_PRICES[tierId];
    if (!tier) {
      return new Response(
        JSON.stringify({ error: "Pack NFC invalide" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Initialize Supabase
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Try to get user from auth header if present
    const authHeader = req.headers.get("Authorization");
    let userEmail = email;

    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const { data: userData } = await supabaseClient.auth.getUser(token);
        if (userData?.user?.email) {
          userEmail = userData.user.email;
          logStep("User authenticated", { userId: userData.user.id, email: userEmail });
        }
      } catch (e) {
        logStep("No auth or invalid token - proceeding as guest");
      }
    }

    // Look up existing Stripe customer
    let customerId: string | undefined;
    if (userEmail) {
      const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Existing customer found", { customerId });
      }
    }

    // Get origin for redirect URLs
    const origin = req.headers.get("origin") || "https://i-wasp.com";

    // Build line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price: tier.priceId,
        quantity: 1,
      },
    ];

    // Add extras if any
    for (const extra of extras) {
      if (extra.priceCents > 0) {
        lineItems.push({
          price_data: {
            currency: 'mad',
            product_data: { name: extra.name },
            unit_amount: extra.priceCents,
          },
          quantity: 1,
        });
      }
    }

    logStep("Line items prepared", { count: lineItems.length });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/nfc-success?session_id={CHECKOUT_SESSION_ID}&tier=${tierId}`,
      cancel_url: `${origin}/tarifs-complets?cancelled=true`,
      metadata: {
        type: 'nfc_order',
        tier_id: tierId,
        quantity: String(tier.quantity),
        extras: JSON.stringify(extras.map(e => e.id)),
      },
      payment_intent_data: {
        metadata: {
          type: 'nfc_order',
          tier_id: tierId,
          quantity: String(tier.quantity),
        },
      },
      ...(userEmail ? {} : { customer_creation: 'always' }),
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
