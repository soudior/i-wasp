/**
 * Backend function: webstudio-order
 * Creates a Web Studio order reliably (server-side insert), even for non-authenticated visitors.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type WebStudioOrderPayload = {
  sessionId?: string;
  formData?: Record<string, unknown>;
  proposal?: Record<string, unknown>;
  isExpress?: boolean;
  priceEur?: number;
  priceMad?: number;
};

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function asNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Backend configuration is missing");
    }

    const body: WebStudioOrderPayload = await req.json();

    const sessionId = asString(body.sessionId);
    const formData = body.formData;
    const proposal = body.proposal;

    if (!sessionId) {
      return new Response(JSON.stringify({ error: "sessionId requis" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!formData || typeof formData !== "object") {
      return new Response(JSON.stringify({ error: "formData requis" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!proposal || typeof proposal !== "object") {
      return new Response(JSON.stringify({ error: "proposal requis" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isExpress = Boolean(body.isExpress);
    const priceEur = asNumber(body.priceEur);
    const priceMad = asNumber(body.priceMad);

    if (priceEur === null || priceMad === null) {
      return new Response(JSON.stringify({ error: "Prix invalide" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const fd = formData as Record<string, unknown>;
    const p = proposal as Record<string, unknown>;

    const businessName = asString(fd.businessName) || asString(p.siteName) || "Client Web Studio";
    const businessType = asString(fd.businessType);
    const contactEmail = asString(fd.contactEmail);
    const contactPhone = asString(fd.contactPhone);
    const products = asString(fd.products);
    const description = asString(fd.description) || asString(p.tagline);

    if (!contactEmail) {
      return new Response(JSON.stringify({ error: "Email de contact requis" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const nowIso = new Date().toISOString();

    console.log("webstudio-order: creating proposal", {
      sessionId,
      isExpress,
      hasProducts: Boolean(products),
    });

    const statusHistory = [
      {
        at: nowIso,
        type: "ordered",
        note: "Commande créée depuis Web Studio",
      },
      ...(products
        ? [
            {
              at: nowIso,
              type: "note",
              note: `Produits/Services fournis: ${products.slice(0, 500)}`,
            },
          ]
        : []),
    ];

    const { data: createdProposal, error: proposalError } = await admin
      .from("website_proposals")
      .insert([
        {
          session_id: sessionId,
          form_data: fd,
          proposal: p,
          is_express: isExpress,
          price_eur: priceEur,
          price_mad: priceMad,
          status: "pending_payment", // Changed from "ordered" to "pending_payment"
          status_history: statusHistory,
          updated_at: nowIso,
        },
      ])
      .select("id")
      .single();

    if (proposalError) {
      console.error("webstudio-order: proposal insert error", proposalError);
      return new Response(JSON.stringify({ error: proposalError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const message =
      `Nouvelle commande Web Studio\n\n` +
      `Projet: ${asString(p.siteName) || businessName}\n` +
      (businessType ? `Type: ${businessType}\n` : "") +
      `Express: ${isExpress ? "Oui" : "Non"}\n` +
      `Prix estimé: ${priceEur}€ / ${priceMad}DH\n\n` +
      (description ? `Description: ${description}\n\n` : "") +
      (products ? `Produits/Services:\n${products}\n\n` : "") +
      `ID commande: ${createdProposal.id}`;

    const { error: contactError } = await admin.from("contact_requests").insert({
      name: businessName,
      email: contactEmail,
      phone: contactPhone || null,
      company: asString(fd.businessName) || null,
      message,
      request_type: "website_order",
      status: "new",
    });

    if (contactError) {
      // We keep the proposal created (most important), but return a warning.
      console.error("webstudio-order: contact request insert error", contactError);
      return new Response(
        JSON.stringify({ proposalId: createdProposal.id, warning: "Commande créée, mais notification interne échouée." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send confirmation email to client
    try {
      const siteName = asString(p.siteName) || businessName;
      
      const emailPayload = {
        email: contactEmail,
        siteName,
        businessType: businessType || undefined,
        isExpress,
        priceEur,
        priceMad,
        orderId: createdProposal.id,
      };

      const emailResponse = await fetch(`${SUPABASE_URL}/functions/v1/send-webstudio-confirmation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify(emailPayload),
      });

      if (!emailResponse.ok) {
        const emailError = await emailResponse.text();
        console.error("webstudio-order: confirmation email failed", emailError);
        // Continue anyway - order is created, email is secondary
      } else {
        console.log("webstudio-order: confirmation email sent to", contactEmail);
      }
    } catch (emailErr) {
      console.error("webstudio-order: email send error", emailErr);
      // Continue anyway
    }

    return new Response(JSON.stringify({ proposalId: createdProposal.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("webstudio-order error:", error);
    const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
