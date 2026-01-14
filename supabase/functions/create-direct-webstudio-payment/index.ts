/**
 * Edge Function: create-direct-webstudio-payment
 * Creates a Stripe checkout session for direct Web Studio purchases
 * Supports cart with multiple items (package + options)
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type PackageType = 'STARTER' | 'STANDARD' | 'PREMIUM';
type Currency = 'EUR' | 'MAD';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

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

    const { packageType, currency, email, options = [], totalAmount } = await req.json() as {
      packageType: PackageType;
      currency: Currency;
      email?: string;
      options?: CartItem[];
      totalAmount?: number;
    };

    logStep("Request received", { packageType, currency, email, optionsCount: options.length, totalAmount });

    // Validate package type
    if (!packageType || !['STARTER', 'STANDARD', 'PREMIUM'].includes(packageType)) {
      return new Response(
        JSON.stringify({ error: "Type de forfait invalide" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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

    // Build line items for all cart items
    const currencyCode = currency === 'MAD' ? 'mad' : 'eur';
    
    // Package names for display
    const packageNames: Record<PackageType, string> = {
      STARTER: 'Pack Starter (1-3 pages)',
      STANDARD: 'Pack Standard (4-6 pages)',
      PREMIUM: 'Pack Premium (7-10 pages)',
    };

    // Package base prices (in cents/centimes)
    const packagePrices: Record<Currency, Record<PackageType, number>> = {
      MAD: { STARTER: 79000, STANDARD: 149000, PREMIUM: 229000 },
      EUR: { STARTER: 20000, STANDARD: 50000, PREMIUM: 100000 },
    };

    // Build line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // Add the main package
    lineItems.push({
      price_data: {
        currency: currencyCode,
        product_data: {
          name: packageNames[packageType],
          description: `Site web professionnel - ${packageType === 'STARTER' ? '1-3' : packageType === 'STANDARD' ? '4-6' : '7-10'} pages`,
        },
        unit_amount: packagePrices[currency][packageType],
      },
      quantity: 1,
    });

    // Add options if any
    for (const option of options) {
      if (option.price > 0 && option.quantity > 0) {
        lineItems.push({
          price_data: {
            currency: currencyCode,
            product_data: {
              name: option.name,
            },
            unit_amount: Math.round(option.price * 100), // Convert to cents
          },
          quantity: option.quantity,
        });
      }
    }

    logStep("Line items prepared", { count: lineItems.length });

    // Create checkout session with all items
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/web-studio/payment-success?session_id={CHECKOUT_SESSION_ID}&package=${packageType.toLowerCase()}`,
      cancel_url: `${origin}/pricing?cancelled=true`,
      metadata: {
        package_type: packageType,
        currency: currency,
        type: 'webstudio_direct',
        source: 'pricing_page',
        options_count: String(options.length),
        total_amount: String(totalAmount || 0),
      },
      payment_intent_data: {
        metadata: {
          package_type: packageType,
          currency: currency,
          type: 'webstudio_direct',
          options: JSON.stringify(options.map(o => ({ id: o.id, name: o.name, qty: o.quantity }))),
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
