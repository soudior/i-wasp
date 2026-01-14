/**
 * Edge Function: verify-webstudio-payment
 * Verifies a Stripe payment for Web Studio and triggers site generation
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-WEBSTUDIO-PAYMENT] ${step}${detailsStr}`);
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

    const { sessionId, proposalId } = await req.json();
    logStep("Request received", { sessionId, proposalId });

    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: "sessionId requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Session retrieved", { 
      status: session.status, 
      paymentStatus: session.payment_status,
      proposalIdFromMetadata: session.metadata?.proposal_id 
    });

    // Verify payment status
    if (session.status !== 'complete' || session.payment_status !== 'paid') {
      logStep("Payment not complete", { status: session.status, paymentStatus: session.payment_status });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Paiement non complété",
          status: session.status,
          paymentStatus: session.payment_status,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get proposal ID from session metadata or request
    const verifiedProposalId = session.metadata?.proposal_id || proposalId;
    
    if (!verifiedProposalId) {
      logStep("No proposal ID found");
      return new Response(
        JSON.stringify({ error: "Impossible d'identifier la commande" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase admin client
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Check current proposal status
    const { data: proposal, error: fetchError } = await admin
      .from("website_proposals")
      .select("status")
      .eq("id", verifiedProposalId)
      .single();

    if (fetchError || !proposal) {
      logStep("Proposal not found", { proposalId: verifiedProposalId, error: fetchError });
      return new Response(
        JSON.stringify({ error: "Proposition introuvable" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Skip if already processed
    if (proposal.status === 'paid' || proposal.status === 'generating' || proposal.status === 'site_generated') {
      logStep("Already processed, skipping", { status: proposal.status });
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Paiement déjà traité",
          status: proposal.status,
          proposalId: verifiedProposalId,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update proposal status to paid
    const nowIso = new Date().toISOString();
    const { error: updateError } = await admin
      .from("website_proposals")
      .update({
        status: "paid",
        updated_at: nowIso,
      })
      .eq("id", verifiedProposalId);

    if (updateError) {
      logStep("Update error", { error: updateError });
      throw new Error("Erreur lors de la mise à jour du statut");
    }

    logStep("Proposal marked as paid", { proposalId: verifiedProposalId });

    // Trigger automatic site generation
    logStep("Triggering site generation...");
    
    try {
      const generateResponse = await fetch(`${SUPABASE_URL}/functions/v1/generate-website-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ proposalId: verifiedProposalId }),
      });

      const generateResult = await generateResponse.json();
      
      if (generateResponse.ok) {
        logStep("Site generation triggered successfully", generateResult);
      } else {
        logStep("Site generation failed", { status: generateResponse.status, result: generateResult });
        // Don't fail the payment verification, just log the error
      }
    } catch (genError) {
      logStep("Site generation error", { error: genError instanceof Error ? genError.message : genError });
      // Don't fail the payment verification, site can be generated manually
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Paiement vérifié et génération démarrée",
        proposalId: verifiedProposalId,
        stripeSessionId: sessionId,
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
