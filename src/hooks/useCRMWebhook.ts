import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WebhookConfig {
  webhookUrl: string;
  enabled: boolean;
}

/**
 * Trigger lead.created webhook to external CRM (Zapier/Make/etc.)
 */
export async function triggerLeadCreatedWebhook(
  leadId: string,
  webhookUrl: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke("lead-webhook", {
      body: {
        action: "trigger",
        lead_id: leadId,
        webhook_url: webhookUrl,
      },
    });

    if (error) {
      console.error("[CRM Webhook] Error triggering webhook:", error);
      return false;
    }

    console.log("[CRM Webhook] Lead created webhook triggered:", data);
    return true;
  } catch (err) {
    console.error("[CRM Webhook] Exception:", err);
    return false;
  }
}

/**
 * Trigger lead.score_updated webhook when score changes significantly
 */
export async function triggerScoreUpdatedWebhook(
  leadId: string,
  webhookUrl: string,
  oldScore: number,
  newScore: number
): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke("lead-webhook", {
      body: {
        action: "score_updated",
        lead_id: leadId,
        webhook_url: webhookUrl,
        old_score: oldScore,
        new_score: newScore,
      },
    });

    if (error) {
      console.error("[CRM Webhook] Error triggering score webhook:", error);
      return false;
    }

    console.log("[CRM Webhook] Score updated webhook triggered:", data);
    return true;
  } catch (err) {
    console.error("[CRM Webhook] Exception:", err);
    return false;
  }
}

/**
 * Test webhook connection with a simple ping
 */
export async function testWebhookConnection(webhookUrl: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke("lead-webhook", {
      body: {
        action: "test",
        webhook_url: webhookUrl,
      },
    });

    if (error) {
      toast.error("Échec du test webhook");
      return false;
    }

    toast.success("Webhook testé avec succès !");
    return true;
  } catch (err) {
    toast.error("Erreur de connexion webhook");
    return false;
  }
}

/**
 * Build payload for direct webhook calls (without edge function)
 * Useful for client-side Zapier/Make integration
 */
export function buildLeadPayload(lead: {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  message?: string | null;
  lead_score?: number;
  source?: string | null;
  device_type?: string | null;
  created_at: string;
  card_owner_name?: string;
  card_owner_company?: string;
}) {
  return {
    event: "lead.created",
    lead_id: lead.id,
    card_owner: lead.card_owner_name || "",
    card_owner_company: lead.card_owner_company || "",
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    message: lead.message,
    score: lead.lead_score || 0,
    source: lead.source || "nfc",
    device_type: lead.device_type,
    timestamp: lead.created_at,
    is_hot_lead: (lead.lead_score || 0) >= 50,
  };
}

/**
 * Direct webhook call from client (for Zapier no-CORS mode)
 */
export async function sendDirectWebhook(
  webhookUrl: string,
  payload: ReturnType<typeof buildLeadPayload>
): Promise<boolean> {
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors", // Zapier requires no-cors
      body: JSON.stringify(payload),
    });
    
    // With no-cors we can't check response status
    return true;
  } catch (err) {
    console.error("[Direct Webhook] Error:", err);
    return false;
  }
}
