import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-SAAS-CHECKOUT] ${step}${detailsStr}`);
};

// SaaS Plan Price IDs
const SAAS_PRICE_IDS = {
  identity: 'price_1SpYFDIvyaABH94uC2gdPZHU',      // $29/month
  professional: 'price_1SpYFaIvyaABH94uEGnzrZ0k',  // $79/month
  enterprise: 'price_1SpYFpIvyaABH94ujt0myXhE',    // $249/month
};

type SaaSPlan = keyof typeof SAAS_PRICE_IDS;

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
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
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

    const body = await req.json();
    const plan = (body.plan as SaaSPlan) || 'professional';
    
    if (!SAAS_PRICE_IDS[plan]) {
      throw new Error(`Invalid plan: ${plan}. Valid plans: identity, professional, enterprise`);
    }
    
    const priceId = SAAS_PRICE_IDS[plan];
    logStep("Plan selected", { plan, priceId });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
      
      // Check if already has an active subscription to this plan
      const existingSubs = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 10,
      });
      
      const alreadySubscribed = existingSubs.data.some((sub: Stripe.Subscription) => 
        sub.items.data.some((item: Stripe.SubscriptionItem) => item.price.id === priceId)
      );
      
      if (alreadySubscribed) {
        logStep("User already subscribed to this plan");
        return new Response(JSON.stringify({ 
          error: "Already subscribed to this plan",
          already_subscribed: true,
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
    }

    const origin = req.headers.get("origin") || "https://i-wasp.lovable.app";
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/dashboard?subscription=success&plan=${plan}`,
      cancel_url: `${origin}/pricing?subscription=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      metadata: {
        user_id: user.id,
        plan: plan,
        plan_type: 'saas',
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          plan: plan,
        },
      },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url, session_id: session.id }), {
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
