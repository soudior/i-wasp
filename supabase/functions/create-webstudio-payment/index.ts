/**
 * Edge Function: create-webstudio-payment
 * Creates a Stripe checkout session for Web Studio orders
 * No authentication required - uses proposal ID and email verification
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Web Studio Stripe Price IDs
const WEBSTUDIO_PRICES = {
  STARTER: 'price_1SpKDVIvyaABH94u9C3Zq7i1',   // 200€
  STANDARD: 'price_1SpKDmIvyaABH94uhKxXCnW5',  // 500€
  PREMIUM: 'price_1SpKEGIvyaABH94uY8yuOQ4l',   // 1000€
};

function getPackageFromPrice(priceEur: number): keyof typeof WEBSTUDIO_PRICES {
  if (priceEur <= 200) return 'STARTER';
  if (priceEur <= 500) return 'STANDARD';
  return 'PREMIUM';
}

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-WEBSTUDIO-PAYMENT] ${step}${detailsStr}`);
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

    const { proposalId, email } = await req.json();
    logStep("Request received", { proposalId, email });

    if (!proposalId) {
      return new Response(
        JSON.stringify({ error: "proposalId requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase admin client
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Fetch the proposal
    const { data: proposal, error: fetchError } = await admin
      .from("website_proposals")
      .select("*")
      .eq("id", proposalId)
      .single();

    if (fetchError || !proposal) {
      logStep("Proposal not found", { proposalId, error: fetchError });
      return new Response(
        JSON.stringify({ error: "Proposition introuvable" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    logStep("Proposal found", { status: proposal.status, priceEur: proposal.price_eur });

    // Verify email matches
    const proposalEmail = proposal.form_data?.contactEmail;
    if (email && proposalEmail && email.toLowerCase() !== proposalEmail.toLowerCase()) {
      logStep("Email mismatch", { provided: email, expected: proposalEmail });
      return new Response(
        JSON.stringify({ error: "Email non autorisé pour cette commande" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if already paid
    if (proposal.status === 'paid' || proposal.status === 'generating' || proposal.status === 'site_generated') {
      logStep("Already processed", { status: proposal.status });
      return new Response(
        JSON.stringify({ error: "Cette commande a déjà été payée", status: proposal.status }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the appropriate price based on the proposal price
    const priceEur = proposal.price_eur || 200;
    const packageType = getPackageFromPrice(priceEur);
    const priceId = WEBSTUDIO_PRICES[packageType];

    logStep("Package determined", { priceEur, packageType, priceId });

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check if customer exists
    const customerEmail = proposalEmail || email;
    let customerId: string | undefined;

    if (customerEmail) {
      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Existing customer found", { customerId });
      }
    }

    // Get origin for redirect URLs
    const origin = req.headers.get("origin") || "https://i-wasp.com";

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/web-studio/payment-success?session_id={CHECKOUT_SESSION_ID}&proposal_id=${proposalId}`,
      cancel_url: `${origin}/web-studio/payment-cancelled?proposal_id=${proposalId}`,
      metadata: {
        proposal_id: proposalId,
        package_type: packageType,
        type: 'webstudio',
      },
      payment_intent_data: {
        metadata: {
          proposal_id: proposalId,
          package_type: packageType,
          type: 'webstudio',
        },
      },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    // Update proposal status to pending_payment with checkout session
    await admin
      .from("website_proposals")
      .update({
        status: "pending_payment",
        updated_at: new Date().toISOString(),
      })
      .eq("id", proposalId);

    logStep("Proposal updated to pending_payment");

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
