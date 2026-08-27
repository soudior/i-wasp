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

type PackageType = 'BASIC' | 'PRO' | 'ENTERPRISE';
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

    // NB: `totalAmount` n'est plus lu — le total est recalculé côté serveur.
    const { packageType, currency, email, options = [] } = await req.json() as {
      packageType: PackageType;
      currency: Currency;
      email?: string;
      options?: CartItem[];
    };

    logStep("Request received", { packageType, currency, email, optionsCount: options.length });

    // Validate package type
    if (!packageType || !['BASIC', 'PRO', 'ENTERPRISE'].includes(packageType)) {
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
    const origin = req.headers.get("origin") || "https://i-wasp.com";

    // ---- CATALOGUE SERVEUR DES OPTIONS (source de vérité des prix) ----
    // Miroir de WEB_OPTIONS / MAINTENANCE_PLANS (src/contexts/PricingCartContext.tsx).
    // Montants en centimes. Toute évolution tarifaire se fait ICI *et* côté client.
    const WEB_OPTIONS_CATALOG: Record<string, { name: string; price: Record<Currency, number>; hasQuantity: boolean }> = {
      extra_pages:         { name: "Page supplémentaire",   price: { MAD: 50000,  EUR: 5000  }, hasQuantity: true  },
      ecommerce:           { name: "E-commerce",            price: { MAD: 100000, EUR: 10000 }, hasQuantity: false },
      seo:                 { name: "SEO avancé",            price: { MAD: 50000,  EUR: 5000  }, hasQuantity: false },
      branding:            { name: "Logo / Branding",       price: { MAD: 150000, EUR: 15000 }, hasQuantity: false },
      multilingual:        { name: "Multilingue",           price: { MAD: 80000,  EUR: 8000  }, hasQuantity: false },
      express:             { name: "Express 24-48h",        price: { MAD: 50000,  EUR: 5000  }, hasQuantity: false },
      maintenance_monthly: { name: "Maintenance mensuelle", price: { MAD: 20000,  EUR: 2000  }, hasQuantity: false },
      maintenance_yearly:  { name: "Maintenance annuelle",  price: { MAD: 200000, EUR: 20000 }, hasQuantity: false },
    };

    // Build line items for all cart items
    const currencyCode = currency === 'MAD' ? 'mad' : 'eur';
    
    // Package names for display
    const packageNames: Record<PackageType, string> = {
      BASIC: 'Pack Basic (5 pages)',
      PRO: 'Pack Pro (10 pages)',
      ENTERPRISE: 'Pack Enterprise (Illimité)',
    };

    // Package base prices (in cents/centimes)
    const packagePrices: Record<Currency, Record<PackageType, number>> = {
      MAD: { BASIC: 200000, PRO: 500000, ENTERPRISE: 1000000 },
      EUR: { BASIC: 20000, PRO: 50000, ENTERPRISE: 100000 },
    };

    // Build line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // Add the main package
    lineItems.push({
      price_data: {
        currency: currencyCode,
        product_data: {
          name: packageNames[packageType],
          description: `Site web professionnel - ${packageType === 'BASIC' ? '5' : packageType === 'PRO' ? '10' : 'Illimité'} pages`,
        },
        unit_amount: packagePrices[currency][packageType],
      },
      quantity: 1,
    });

    // Options : CATALOGUE SERVEUR uniquement. Le client n'envoie que des `id`
    // (et éventuellement une quantité, plafonnée) ; le nom et le PRIX viennent
    // TOUJOURS d'ici. Auparavant `option.price` et `option.quantity` venaient du
    // corps de la requête → un client pouvait payer 0,01 € une prestation.
    const catalogue = WEB_OPTIONS_CATALOG;
    const acceptedOptions: Array<{ id: string; name: string; quantity: number }> = [];

    for (const option of options) {
      const entry = catalogue[option?.id as string];
      if (!entry) {
        logStep("Option inconnue ignorée", { id: option?.id });
        continue;
      }
      // Quantité : 1 par défaut, entier, uniquement pour les options qui en
      // acceptent une, et bornée pour éviter les commandes aberrantes.
      const requested = Number(option?.quantity);
      const quantity = entry.hasQuantity
        ? Math.min(Math.max(Number.isFinite(requested) ? Math.floor(requested) : 1, 1), 50)
        : 1;

      lineItems.push({
        price_data: {
          currency: currencyCode,
          product_data: { name: entry.name },
          unit_amount: entry.price[currency],
        },
        quantity,
      });
      acceptedOptions.push({ id: option.id, name: entry.name, quantity });
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
        options_count: String(acceptedOptions.length),
        // Total RECALCULÉ côté serveur à partir des line items (le `totalAmount`
        // envoyé par le client n'est plus stocké : il n'était pas fiable).
        total_amount: String(
          lineItems.reduce((sum, li) => sum + (li.price_data?.unit_amount ?? 0) * (li.quantity ?? 1), 0),
        ),
      },
      payment_intent_data: {
        metadata: {
          package_type: packageType,
          currency: currency,
          type: 'webstudio_direct',
          options: JSON.stringify(acceptedOptions),
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
