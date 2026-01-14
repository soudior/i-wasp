/**
 * Edge Function: create-direct-webstudio-payment
 * Creates a Stripe checkout session for direct Web Studio purchases
 * No proposal required - direct payment from pricing page
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Web Studio Stripe Price IDs (EUR)
const WEBSTUDIO_PRICES_EUR = {
  STARTER: 'price_1SpKDVIvyaABH94u9C3Zq7i1',   // 200€
  STANDARD: 'price_1SpKDmIvyaABH94uhKxXCnW5',  // 500€
  PREMIUM: 'price_1SpKEGIvyaABH94uY8yuOQ4l',   // 1000€
};

// Web Studio Stripe Price IDs (MAD)
const WEBSTUDIO_PRICES_MAD = {
  STARTER: 'price_1SpKRXIvyaABH94u3XFnG4qg',   // 790 DH (≈200€)
  STANDARD: 'price_1SpKRqIvyaABH94uKQIXaEIW',  // 1490 DH (≈500€)  
  PREMIUM: 'price_1SpKS3IvyaABH94ujjmo6jDb',   // 2290 DH (≈1000€)
};

type PackageType = 'STARTER' | 'STANDARD' | 'PREMIUM';
type Currency = 'EUR' | 'MAD';

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[DIRECT-WEBSTUDIO-PAYMENT] ${step}${detailsStr}`);
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

    const { packageType, currency, email } = await req.json() as {
      packageType: PackageType;
      currency: Currency;
      email?: string;
    };

    logStep("Request received", { packageType, currency, email });

    // Validate package type
    if (!packageType || !['STARTER', 'STANDARD', 'PREMIUM'].includes(packageType)) {
      return new Response(
        JSON.stringify({ error: "Type de forfait invalide" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the appropriate price ID based on currency
    const priceId = currency === 'MAD' 
      ? WEBSTUDIO_PRICES_MAD[packageType]
      : WEBSTUDIO_PRICES_EUR[packageType];

    if (!priceId) {
      return new Response(
        JSON.stringify({ error: "Prix non configuré pour cette devise" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    logStep("Price determined", { packageType, currency, priceId });

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check if customer exists (optional - for logged in users)
    let customerId: string | undefined;
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
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/web-studio/payment-success?session_id={CHECKOUT_SESSION_ID}&package=${packageType.toLowerCase()}`,
      cancel_url: `${origin}/pricing?cancelled=true`,
      metadata: {
        package_type: packageType,
        currency: currency,
        type: 'webstudio_direct',
        source: 'pricing_page',
      },
      payment_intent_data: {
        metadata: {
          package_type: packageType,
          currency: currency,
          type: 'webstudio_direct',
        },
      },
      // Allow customer to enter email if not logged in
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
