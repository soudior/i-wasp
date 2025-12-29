import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WebhookPayload {
  event: "lead.created" | "lead.score_updated";
  lead_id: string;
  card_owner: string;
  card_owner_company: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  message: string | null;
  score: number;
  source: string;
  device_type: string | null;
  consent_given: boolean;
  timestamp: string;
}

// Simple logging helper
function log(message: string, data?: unknown) {
  console.log(`[lead-webhook] ${message}`, data ? JSON.stringify(data) : "");
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, lead_id, webhook_url, old_score, new_score } = await req.json();

    log("Received request", { action, lead_id, webhook_url });

    // Action: trigger webhook for a specific lead
    if (action === "trigger") {
      if (!lead_id || !webhook_url) {
        return new Response(
          JSON.stringify({ error: "Missing lead_id or webhook_url" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Fetch lead with card owner info
      const { data: lead, error: leadError } = await supabase
        .from("leads")
        .select(`
          *,
          digital_cards (
            first_name,
            last_name,
            company
          )
        `)
        .eq("id", lead_id)
        .single();

      if (leadError || !lead) {
        log("Lead not found", { lead_id, error: leadError });
        return new Response(
          JSON.stringify({ error: "Lead not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Build webhook payload
      const payload: WebhookPayload = {
        event: "lead.created",
        lead_id: lead.id,
        card_owner: `${lead.digital_cards?.first_name || ""} ${lead.digital_cards?.last_name || ""}`.trim(),
        card_owner_company: lead.digital_cards?.company || "",
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        message: lead.message,
        score: lead.lead_score || 0,
        source: lead.source || "nfc",
        device_type: lead.device_type,
        consent_given: lead.consent_given || false,
        timestamp: lead.created_at,
      };

      log("Sending webhook", { webhook_url, payload });

      // Send webhook
      try {
        const webhookResponse = await fetch(webhook_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        log("Webhook response", { status: webhookResponse.status });

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Webhook triggered successfully",
            webhook_status: webhookResponse.status 
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (webhookError) {
        log("Webhook error", webhookError);
        return new Response(
          JSON.stringify({ error: "Failed to send webhook", details: String(webhookError) }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Action: score_updated trigger
    if (action === "score_updated") {
      if (!lead_id || !webhook_url) {
        return new Response(
          JSON.stringify({ error: "Missing lead_id or webhook_url" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Fetch lead with card owner info
      const { data: lead, error: leadError } = await supabase
        .from("leads")
        .select(`
          *,
          digital_cards (
            first_name,
            last_name,
            company
          )
        `)
        .eq("id", lead_id)
        .single();

      if (leadError || !lead) {
        return new Response(
          JSON.stringify({ error: "Lead not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Build webhook payload for score update
      const payload: WebhookPayload = {
        event: "lead.score_updated",
        lead_id: lead.id,
        card_owner: `${lead.digital_cards?.first_name || ""} ${lead.digital_cards?.last_name || ""}`.trim(),
        card_owner_company: lead.digital_cards?.company || "",
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        message: lead.message,
        score: new_score || lead.lead_score || 0,
        source: lead.source || "nfc",
        device_type: lead.device_type,
        consent_given: lead.consent_given || false,
        timestamp: new Date().toISOString(),
      };

      log("Sending score_updated webhook", { webhook_url, old_score, new_score });

      try {
        const webhookResponse = await fetch(webhook_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...payload,
            old_score,
            new_score,
            is_hot_lead: new_score >= 50,
          }),
        });

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Score update webhook triggered",
            is_hot_lead: new_score >= 50 
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (webhookError) {
        return new Response(
          JSON.stringify({ error: "Failed to send webhook" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Action: test webhook connection
    if (action === "test") {
      if (!webhook_url) {
        return new Response(
          JSON.stringify({ error: "Missing webhook_url" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const testPayload = {
        event: "test",
        message: "IWASP webhook connection test",
        timestamp: new Date().toISOString(),
        source: "iwasp_crm",
      };

      try {
        const webhookResponse = await fetch(webhook_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(testPayload),
        });

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Test webhook sent successfully",
            webhook_status: webhookResponse.status 
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (webhookError) {
        return new Response(
          JSON.stringify({ error: "Webhook test failed", details: String(webhookError) }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use 'trigger', 'score_updated', or 'test'" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    log("Handler error", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
