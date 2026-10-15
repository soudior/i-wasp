import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { verifiedPaymentProposal } from "../_shared/webstudioPaymentBinding.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  console.log(`[VERIFY-WEBSTUDIO-IA-PAYMENT] ${step}${details ? ` - ${JSON.stringify(details)}` : ''}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not set");

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { sessionId, proposalId } = await req.json();
    if (!sessionId || !proposalId) throw new Error("Missing sessionId or proposalId");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.status !== "complete" || session.payment_status !== "paid") {
      return new Response(JSON.stringify({ success: false, error: "Payment not completed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const verifiedProposalId = verifiedPaymentProposal(session, proposalId, "ia");
    if (!verifiedProposalId) return new Response(JSON.stringify({ success: false, error: "Paiement et proposition incompatibles" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    logStep("Payment verified", { sessionId });

    const isInstant = session.metadata?.isInstant === 'true';

    const { data: proposal, error: lookupError } = await supabase.from("website_proposals")
      .select("status").eq("id", verifiedProposalId).single();
    if (lookupError || !proposal) throw new Error("Proposition introuvable");
    if (["generating", "site_generated"].includes(proposal.status)) return new Response(JSON.stringify({ success: true, isInstant }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    if (proposal.status !== "paid") {
      const { data: updated, error: updateError } = await supabase.from("website_proposals")
        .update({ status: "paid" }).eq("id", verifiedProposalId).eq("status", proposal.status)
        .select("id").maybeSingle();
      if (updateError) throw new Error("Mise à jour du paiement impossible");
      if (!updated) return new Response(JSON.stringify({ success: true, isInstant }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // For instant packages, trigger generation
    if (isInstant) {
      logStep("Triggering instant generation");
      await supabase.functions.invoke('generate-website-code', { body: { proposalId: verifiedProposalId } });
    }

    return new Response(JSON.stringify({ success: true, isInstant }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    logStep("ERROR", { message: error instanceof Error ? error.message : String(error) });
    return new Response(JSON.stringify({ success: false, error: String(error) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
