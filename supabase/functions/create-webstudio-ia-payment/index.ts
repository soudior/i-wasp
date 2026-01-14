import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-WEBSTUDIO-IA-PAYMENT] ${step}${detailsStr}`);
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

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { proposalId, priceId, email, packageName, isInstant } = await req.json();
    logStep("Request data", { proposalId, priceId, email, packageName, isInstant });

    if (!proposalId || !priceId || !email) {
      throw new Error("Missing required fields: proposalId, priceId, email");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check if customer exists
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    }

    // Determine success/cancel URLs
    const origin = req.headers.get("origin") || "https://i-wasp.com";
    const successUrl = `${origin}/web-studio/ia-success?session_id={CHECKOUT_SESSION_ID}&proposal_id=${proposalId}`;
    const cancelUrl = `${origin}/web-studio/paiement?pack=${isInstant ? 'starter' : 'pro'}`;

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        proposalId,
        packageName,
        isInstant: isInstant ? 'true' : 'false',
        email,
      },
      payment_intent_data: {
        metadata: {
          proposalId,
          packageName,
        },
      },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    // Update proposal with session ID
    const { error: updateError } = await supabase
      .from('website_proposals')
      .update({ 
        session_id: session.id,
        status: 'pending_payment' 
      })
      .eq('id', proposalId);

    if (updateError) {
      logStep("Warning: Failed to update proposal", { error: updateError.message });
    }

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
