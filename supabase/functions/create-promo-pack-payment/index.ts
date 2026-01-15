/**
 * Edge Function: create-promo-pack-payment
 * Creates a Stripe checkout session for Promo Pack orders (NFC + Website bundle)
 * No authentication required - guest checkout supported
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Promo Pack Stripe Price IDs (MAD currency)
const PROMO_PACKS: Record<string, { priceId: string; name: string; priceMad: number }> = {
  business: {
    priceId: 'price_1SpetzIvyaABH94uxGb0EVKS',
    name: 'Pack Business (Site + NFC)',
    priceMad: 5900,
  },
  premium: {
    priceId: 'price_1SpeuCIvyaABH94uqUbngAFt',
    name: 'Pack Premium (Site + NFC + Maintenance)',
    priceMad: 12900,
  },
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PROMO-PACK-PAYMENT] ${step}${detailsStr}`);
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

    const { packId, email, businessInfo } = await req.json() as {
      packId: string;
      email?: string;
      businessInfo?: {
        businessName?: string;
        phone?: string;
        notes?: string;
      };
    };

    logStep("Request received", { packId, email, hasBusinessInfo: !!businessInfo });

    // Validate pack
    const pack = PROMO_PACKS[packId];
    if (!pack) {
      return new Response(
        JSON.stringify({ error: "Pack promo invalide" }),
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
    const origin = req.headers.get("origin") || "https://i-wasp.lovable.app";

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price: pack.priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/pack-success?session_id={CHECKOUT_SESSION_ID}&pack=${packId}`,
      cancel_url: `${origin}/tarifs-complets?cancelled=true`,
      metadata: {
        type: 'promo_pack_order',
        pack_id: packId,
        pack_name: pack.name,
        business_name: businessInfo?.businessName || '',
        phone: businessInfo?.phone || '',
        notes: businessInfo?.notes || '',
      },
      payment_intent_data: {
        metadata: {
          type: 'promo_pack_order',
          pack_id: packId,
          pack_name: pack.name,
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
