/**
 * Edge Function: track-webstudio-order
 * Permet de récupérer le statut d'une commande Web Studio de manière sécurisée
 * par email ou par ID (contourne RLS avec service_role)
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TrackRequest {
  email?: string;
  id?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Configuration manquante");
    }

    const body: TrackRequest = await req.json();
    const { email, id } = body;

    if (!email && !id) {
      return new Response(
        JSON.stringify({ error: "Email ou ID requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    let query = admin.from("website_proposals").select(`
      id,
      created_at,
      updated_at,
      status,
      is_express,
      deadline,
      priority,
      price_eur,
      price_mad,
      form_data,
      proposal
    `);

    if (id) {
      query = query.eq("id", id);
    } else if (email) {
      // Search by email in form_data (case insensitive)
      query = query.ilike("form_data->>contactEmail", email);
    }

    const { data: proposal, error: fetchError } = await query
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error("track-webstudio-order: fetch error", fetchError);
      throw new Error("Erreur lors de la recherche");
    }

    if (!proposal) {
      return new Response(
        JSON.stringify({ found: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Also fetch generated website if available
    let generatedWebsite = null;
    if (proposal.status === "site_generated" || proposal.status === "generating" || proposal.status === "paid") {
      const { data: website } = await admin
        .from("generated_websites")
        .select("id, status, preview_url, slug, generated_at")
        .eq("proposal_id", proposal.id)
        .maybeSingle();
      
      generatedWebsite = website;
    }

    // Mask sensitive data before returning
    const safeFormData = {
      businessName: proposal.form_data?.businessName,
      businessType: proposal.form_data?.businessType,
      contactName: proposal.form_data?.contactName,
      // Mask email partially
      contactEmail: maskEmail(proposal.form_data?.contactEmail),
    };

    const safeProposal = {
      siteName: proposal.proposal?.siteName,
      tagline: proposal.proposal?.tagline,
      estimatedPages: proposal.proposal?.estimatedPages,
      complexity: proposal.proposal?.complexity,
    };

    return new Response(
      JSON.stringify({
        found: true,
        order: {
          id: proposal.id,
          created_at: proposal.created_at,
          updated_at: proposal.updated_at,
          status: proposal.status,
          is_express: proposal.is_express,
          deadline: proposal.deadline,
          priority: proposal.priority,
          price_eur: proposal.price_eur,
          price_mad: proposal.price_mad,
          form_data: safeFormData,
          proposal: safeProposal,
        },
        generatedWebsite: generatedWebsite ? {
          id: generatedWebsite.id,
          status: generatedWebsite.status,
          preview_url: generatedWebsite.preview_url,
          slug: generatedWebsite.slug,
          generated_at: generatedWebsite.generated_at,
        } : null,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("track-webstudio-order error:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function maskEmail(email?: string): string {
  if (!email) return "";
  const parts = email.split("@");
  if (parts.length !== 2) return "***@***";
  const local = parts[0];
  const domain = parts[1];
  const maskedLocal = local.length > 2 
    ? local[0] + "***" + local[local.length - 1]
    : "***";
  return `${maskedLocal}@${domain}`;
}
