import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SAAS-SUBSCRIPTION] ${step}${detailsStr}`);
};

// SaaS Product IDs mapping
const SAAS_PRODUCT_IDS = {
  'prod_Tn8WPxz16dwjIl': { plan: 'identity', tier: 1 },
  'prod_Tn8WtygsFfDTca': { plan: 'professional', tier: 2 },
  'prod_Tn8WC7DS971gvQ': { plan: 'enterprise', tier: 3 },
};

// Legacy Gold products (backward compatibility)
const LEGACY_PRODUCT_IDS = {
  'prod_TkashOgkZlDDzm': { plan: 'gold', tier: 2 },  // Gold Monthly -> maps to Professional
  'prod_TkasPk75rM1k69': { plan: 'gold', tier: 2 },  // Gold Annual -> maps to Professional
};

interface SubscriptionResponse {
  subscribed: boolean;
  plan: string;
  plan_tier: number;
  product_id: string | null;
  price_id: string | null;
  subscription_id: string | null;
  subscription_end: string | null;
  cancel_at_period_end: boolean;
  features: {
    nfcCardsPerMonth: number;
    sitePages: number;
    lovableCredits: number;
    logoOnCard: boolean;
    ecommerce: boolean;
    analytics: string;
    support: string;
  };
}

const getFeaturesByPlan = (plan: string) => {
  switch (plan) {
    case 'identity':
      return {
        nfcCardsPerMonth: 10,
        sitePages: 1,
        lovableCredits: 3,
        logoOnCard: false,
        ecommerce: false,
        analytics: 'basic',
        support: 'email',
      };
    case 'professional':
    case 'gold':
      return {
        nfcCardsPerMonth: 25,
        sitePages: 10,
        lovableCredits: 10,
        logoOnCard: true,
        ecommerce: false,
        analytics: 'detailed',
        support: 'chat_24_7',
      };
    case 'enterprise':
      return {
        nfcCardsPerMonth: 75,
        sitePages: 20,
        lovableCredits: 30,
        logoOnCard: true,
        ecommerce: true,
        analytics: 'advanced',
        support: 'dedicated_manager',
      };
    default:
      return {
        nfcCardsPerMonth: 0,
        sitePages: 0,
        lovableCredits: 0,
        logoOnCard: false,
        ecommerce: false,
        analytics: 'none',
        support: 'email',
      };
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    // Find customer by email
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, user is not subscribed");
      const response: SubscriptionResponse = {
        subscribed: false,
        plan: 'free',
        plan_tier: 0,
        product_id: null,
        price_id: null,
        subscription_id: null,
        subscription_end: null,
        cancel_at_period_end: false,
        features: getFeaturesByPlan('free'),
      };
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 10,
      expand: ['data.items.data.price'],
    });

    // Also check for trialing subscriptions
    const trialingSubscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "trialing",
      limit: 10,
      expand: ['data.items.data.price'],
    });

    const allActiveSubscriptions = [...subscriptions.data, ...trialingSubscriptions.data];

    if (allActiveSubscriptions.length === 0) {
      logStep("No active subscription found");
      const response: SubscriptionResponse = {
        subscribed: false,
        plan: 'free',
        plan_tier: 0,
        product_id: null,
        price_id: null,
        subscription_id: null,
        subscription_end: null,
        cancel_at_period_end: false,
        features: getFeaturesByPlan('free'),
      };
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Find the highest tier subscription
    let bestSubscription = allActiveSubscriptions[0];
    let bestTier = 0;
    let bestPlan = 'free';
    let bestProductId: string | null = null;
    let bestPriceId: string | null = null;

    for (const subscription of allActiveSubscriptions) {
      const productId = subscription.items.data[0].price.product as string;
      const priceId = subscription.items.data[0].price.id;
      
      // Check SaaS products first
      if (SAAS_PRODUCT_IDS[productId as keyof typeof SAAS_PRODUCT_IDS]) {
        const { plan, tier } = SAAS_PRODUCT_IDS[productId as keyof typeof SAAS_PRODUCT_IDS];
        if (tier > bestTier) {
          bestTier = tier;
          bestPlan = plan;
          bestSubscription = subscription;
          bestProductId = productId;
          bestPriceId = priceId;
        }
      }
      // Check legacy products
      else if (LEGACY_PRODUCT_IDS[productId as keyof typeof LEGACY_PRODUCT_IDS]) {
        const { plan, tier } = LEGACY_PRODUCT_IDS[productId as keyof typeof LEGACY_PRODUCT_IDS];
        if (tier > bestTier) {
          bestTier = tier;
          bestPlan = plan;
          bestSubscription = subscription;
          bestProductId = productId;
          bestPriceId = priceId;
        }
      }
    }

    if (bestTier === 0) {
      // Has subscription but to unknown product
      bestProductId = bestSubscription.items.data[0].price.product as string;
      bestPriceId = bestSubscription.items.data[0].price.id;
      bestPlan = 'unknown';
      bestTier = 1;
    }

    const subscriptionEnd = new Date(bestSubscription.current_period_end * 1000).toISOString();
    
    logStep("Active subscription found", { 
      subscriptionId: bestSubscription.id, 
      productId: bestProductId,
      plan: bestPlan,
      tier: bestTier,
      endDate: subscriptionEnd,
      cancelAtPeriodEnd: bestSubscription.cancel_at_period_end,
    });

    const response: SubscriptionResponse = {
      subscribed: true,
      plan: bestPlan,
      plan_tier: bestTier,
      product_id: bestProductId,
      price_id: bestPriceId,
      subscription_id: bestSubscription.id,
      subscription_end: subscriptionEnd,
      cancel_at_period_end: bestSubscription.cancel_at_period_end,
      features: getFeaturesByPlan(bestPlan),
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
