import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key",
};

// Input validation schemas
const uuidSchema = z.string().uuid();
const urlSchema = z.string().url().max(2048);

const triggerRequestSchema = z.object({
  action: z.enum(["trigger", "sync_lead"]),
  lead_id: uuidSchema,
  webhook_url: urlSchema,
  config_id: uuidSchema.optional(),
  user_id: uuidSchema.optional(),
  field_mapping: z.object({
    name: z.boolean().optional(),
    email: z.boolean().optional(),
    phone: z.boolean().optional(),
    company: z.boolean().optional(),
    score: z.boolean().optional(),
    source: z.boolean().optional(),
    consent_status: z.boolean().optional(),
    timestamp: z.boolean().optional(),
    card_owner: z.boolean().optional(),
    actions: z.boolean().optional(),
  }).optional(),
  retry_count: z.number().int().min(1).max(5).optional().default(3),
  sync_consented_only: z.boolean().optional().default(true),
});

const scoreUpdateRequestSchema = z.object({
  action: z.literal("score_updated"),
  lead_id: uuidSchema,
  webhook_url: urlSchema,
  old_score: z.number().int().min(0).max(100).optional(),
  new_score: z.number().int().min(0).max(100).optional(),
  config_id: uuidSchema.optional(),
  user_id: uuidSchema.optional(),
  retry_count: z.number().int().min(1).max(5).optional().default(3),
  sync_consented_only: z.boolean().optional().default(true),
});

const testRequestSchema = z.object({
  action: z.literal("test"),
  webhook_url: urlSchema,
  config_id: uuidSchema.optional(),
  user_id: uuidSchema.optional(),
});

const bulkSyncRequestSchema = z.object({
  action: z.literal("bulk_sync"),
  lead_ids: z.array(uuidSchema).min(1).max(100),
  webhook_url: urlSchema,
  retry_count: z.number().int().min(1).max(5).optional().default(3),
  sync_consented_only: z.boolean().optional().default(true),
  user_id: uuidSchema.optional(),
});

// Validate webhook URL is not a private/internal IP
function isValidWebhookUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    
    // Block private/internal IPs and localhost
    const blockedPatterns = [
      /^localhost$/i,
      /^127\./,
      /^10\./,
      /^192\.168\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^0\./,
      /^169\.254\./,
      /^::1$/,
      /^fc00:/i,
      /^fe80:/i,
    ];
    
    for (const pattern of blockedPatterns) {
      if (pattern.test(hostname)) {
        return false;
      }
    }
    
    // Only allow HTTPS for security
    if (parsed.protocol !== "https:") {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

interface WebhookPayload {
  event: "lead.created" | "lead.score_updated" | "test";
  lead_id?: string;
  card_owner?: string;
  card_owner_company?: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  message?: string | null;
  score?: number;
  source?: string;
  device_type?: string | null;
  consent_given?: boolean;
  consent_status?: string;
  timestamp: string;
  actions?: string[];
  is_hot_lead?: boolean;
  old_score?: number;
  new_score?: number;
}

interface FieldMapping {
  name?: boolean;
  email?: boolean;
  phone?: boolean;
  company?: boolean;
  score?: boolean;
  source?: boolean;
  consent_status?: boolean;
  timestamp?: boolean;
  card_owner?: boolean;
  actions?: boolean;
}

// Simple logging helper
function log(message: string, data?: unknown) {
  console.log(`[lead-webhook] ${message}`, data ? JSON.stringify(data) : "");
}

// Retry helper with exponential backoff
async function sendWithRetry(
  webhookUrl: string,
  payload: WebhookPayload,
  maxRetries: number = 3
): Promise<{ success: boolean; status?: number; error?: string; attempts: number }> {
  let lastError: string | undefined;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      log(`Attempt ${attempt}/${maxRetries}`, { webhookUrl });
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "IWASP-Webhook/1.0",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok || response.status < 500) {
        // Success or client error (don't retry client errors)
        return { 
          success: response.ok, 
          status: response.status, 
          attempts: attempt 
        };
      }

      // Server error, will retry
      lastError = `HTTP ${response.status}`;
      log(`Retry needed: ${lastError}`);
      
    } catch (error) {
      lastError = String(error);
      log(`Attempt ${attempt} failed: ${lastError}`);
    }

    // Exponential backoff: 1s, 2s, 4s
    if (attempt < maxRetries) {
      const delay = Math.pow(2, attempt - 1) * 1000;
      await new Promise(r => setTimeout(r, delay));
    }
  }

  return { success: false, error: lastError, attempts: maxRetries };
}

// Apply field mapping to filter payload
function applyFieldMapping(payload: WebhookPayload, mapping: FieldMapping): Partial<WebhookPayload> {
  const result: Partial<WebhookPayload> = {
    event: payload.event,
    timestamp: payload.timestamp,
  };

  if (payload.lead_id) result.lead_id = payload.lead_id;
  if (mapping.name && payload.name) result.name = payload.name;
  if (mapping.email && payload.email) result.email = payload.email;
  if (mapping.phone && payload.phone) result.phone = payload.phone;
  if (mapping.company && payload.company) result.company = payload.company;
  if (mapping.score) {
    result.score = payload.score;
    result.is_hot_lead = payload.is_hot_lead;
    if (payload.old_score !== undefined) result.old_score = payload.old_score;
    if (payload.new_score !== undefined) result.new_score = payload.new_score;
  }
  if (mapping.source) {
    result.source = payload.source;
    result.device_type = payload.device_type;
  }
  if (mapping.consent_status) {
    result.consent_given = payload.consent_given;
    result.consent_status = payload.consent_given ? "consented" : "not_consented";
  }
  if (mapping.card_owner) {
    result.card_owner = payload.card_owner;
    result.card_owner_company = payload.card_owner_company;
  }
  if (mapping.actions && payload.actions) {
    result.actions = payload.actions;
  }
  if (payload.message) result.message = payload.message;

  return result;
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

    // Parse and validate request body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Basic action check
    const action = (body as Record<string, unknown>)?.action;
    if (!action || typeof action !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid action" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    log("Received request", { action });

    // Helper to log webhook attempt
    async function logWebhookAttempt(
      configId: string | null,
      leadId: string | null,
      userId: string,
      eventType: string,
      status: string,
      attempts: number,
      responseStatus?: number,
      errorMessage?: string,
      payload?: WebhookPayload
    ) {
      try {
        await supabase.from("webhook_logs").insert({
          webhook_config_id: configId,
          lead_id: leadId,
          user_id: userId,
          event_type: eventType,
          status,
          attempts,
          last_attempt_at: new Date().toISOString(),
          response_status: responseStatus,
          error_message: errorMessage,
          payload: payload as unknown as Record<string, unknown>,
        });
      } catch (e) {
        log("Failed to log webhook attempt", e);
      }
    }

    // Action: trigger webhook for a specific lead
    if (action === "trigger" || action === "sync_lead") {
      // Validate input with Zod
      const parseResult = triggerRequestSchema.safeParse(body);
      if (!parseResult.success) {
        log("Validation failed", parseResult.error.flatten());
        return new Response(
          JSON.stringify({ error: "Invalid request", details: parseResult.error.flatten() }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const { lead_id, webhook_url, config_id, user_id, field_mapping, retry_count, sync_consented_only } = parseResult.data;
      
      // Validate webhook URL (SSRF protection)
      if (!isValidWebhookUrl(webhook_url)) {
        return new Response(
          JSON.stringify({ error: "Invalid webhook URL. Must be HTTPS and not a private/internal address." }),
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

      // RGPD: Check consent if required
      if (sync_consented_only && !lead.consent_given) {
        log("Lead consent not given, skipping sync", { lead_id });
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: "Lead has not given consent (RGPD)",
            skipped: true 
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Build full webhook payload
      const fullPayload: WebhookPayload = {
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
        consent_status: lead.consent_given ? "consented" : "not_consented",
        timestamp: lead.created_at,
        is_hot_lead: (lead.lead_score || 0) >= 50,
      };

      // Apply field mapping if provided
      const finalPayload = field_mapping 
        ? applyFieldMapping(fullPayload, field_mapping) 
        : fullPayload;

      log("Sending webhook with retry", { webhook_url, retry_count });

      // Send with retry logic
      const result = await sendWithRetry(webhook_url, finalPayload as WebhookPayload, retry_count);

      // Log the attempt
      if (user_id) {
        await logWebhookAttempt(
          config_id || null,
          lead_id,
          user_id,
          "lead.created",
          result.success ? "success" : "failed",
          result.attempts,
          result.status,
          result.error,
          finalPayload as WebhookPayload
        );
      }

      return new Response(
        JSON.stringify({ 
          success: result.success, 
          message: result.success ? "Webhook triggered successfully" : "Webhook failed after retries",
          webhook_status: result.status,
          attempts: result.attempts,
          error: result.error
        }),
        { status: result.success ? 200 : 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Action: score_updated trigger
    if (action === "score_updated") {
      // Validate input with Zod
      const parseResult = scoreUpdateRequestSchema.safeParse(body);
      if (!parseResult.success) {
        log("Validation failed", parseResult.error.flatten());
        return new Response(
          JSON.stringify({ error: "Invalid request", details: parseResult.error.flatten() }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const { lead_id, webhook_url, old_score, new_score, config_id, user_id, retry_count, sync_consented_only } = parseResult.data;
      
      // Validate webhook URL (SSRF protection)
      if (!isValidWebhookUrl(webhook_url)) {
        return new Response(
          JSON.stringify({ error: "Invalid webhook URL. Must be HTTPS and not a private/internal address." }),
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

      // RGPD check
      if (sync_consented_only && !lead.consent_given) {
        return new Response(
          JSON.stringify({ success: false, message: "Lead has not given consent", skipped: true }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
        score: new_score ?? lead.lead_score ?? 0,
        old_score,
        new_score,
        source: lead.source || "nfc",
        device_type: lead.device_type,
        consent_given: lead.consent_given || false,
        consent_status: lead.consent_given ? "consented" : "not_consented",
        timestamp: new Date().toISOString(),
        is_hot_lead: (new_score ?? 0) >= 50,
      };

      log("Sending score_updated webhook", { webhook_url, old_score, new_score });

      const result = await sendWithRetry(webhook_url, payload, retry_count);

      if (user_id) {
        await logWebhookAttempt(
          config_id || null,
          lead_id,
          user_id,
          "lead.score_updated",
          result.success ? "success" : "failed",
          result.attempts,
          result.status,
          result.error,
          payload
        );
      }

      return new Response(
        JSON.stringify({ 
          success: result.success, 
          message: result.success ? "Score update webhook triggered" : "Webhook failed",
          is_hot_lead: (new_score ?? 0) >= 50,
          attempts: result.attempts
        }),
        { status: result.success ? 200 : 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Action: test webhook connection
    if (action === "test") {
      // Validate input with Zod
      const parseResult = testRequestSchema.safeParse(body);
      if (!parseResult.success) {
        log("Validation failed", parseResult.error.flatten());
        return new Response(
          JSON.stringify({ error: "Invalid request", details: parseResult.error.flatten() }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const { webhook_url, config_id, user_id } = parseResult.data;
      
      // Validate webhook URL (SSRF protection)
      if (!isValidWebhookUrl(webhook_url)) {
        return new Response(
          JSON.stringify({ error: "Invalid webhook URL. Must be HTTPS and not a private/internal address." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const testPayload: WebhookPayload = {
        event: "test",
        timestamp: new Date().toISOString(),
        name: "Test Lead",
        email: "test@iwasp.com",
        phone: "+33612345678",
        company: "IWASP Test",
        score: 75,
        source: "test",
        consent_given: true,
        consent_status: "consented",
        card_owner: "Test Owner",
        card_owner_company: "IWASP",
        is_hot_lead: true,
      };

      const result = await sendWithRetry(webhook_url, testPayload, 1);

      if (user_id) {
        await logWebhookAttempt(
          config_id || null,
          null,
          user_id,
          "test",
          result.success ? "success" : "failed",
          result.attempts,
          result.status,
          result.error,
          testPayload
        );
      }

      return new Response(
        JSON.stringify({ 
          success: result.success, 
          message: result.success ? "Test webhook sent successfully" : "Test failed",
          webhook_status: result.status,
          error: result.error
        }),
        { status: result.success ? 200 : 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Action: bulk sync leads
    if (action === "bulk_sync") {
      // Validate input with Zod
      const parseResult = bulkSyncRequestSchema.safeParse(body);
      if (!parseResult.success) {
        log("Validation failed", parseResult.error.flatten());
        return new Response(
          JSON.stringify({ error: "Invalid request", details: parseResult.error.flatten() }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const { lead_ids, webhook_url, retry_count, sync_consented_only, user_id } = parseResult.data;
      
      // Validate webhook URL (SSRF protection)
      if (!isValidWebhookUrl(webhook_url)) {
        return new Response(
          JSON.stringify({ error: "Invalid webhook URL. Must be HTTPS and not a private/internal address." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const results = { success: 0, failed: 0, skipped: 0 };

      for (const lid of lead_ids) {
        const { data: lead } = await supabase
          .from("leads")
          .select(`*, digital_cards (first_name, last_name, company)`)
          .eq("id", lid)
          .single();

        if (!lead) {
          results.failed++;
          continue;
        }

        if (sync_consented_only && !lead.consent_given) {
          results.skipped++;
          continue;
        }

        const payload: WebhookPayload = {
          event: "lead.created",
          lead_id: lead.id,
          card_owner: `${lead.digital_cards?.first_name || ""} ${lead.digital_cards?.last_name || ""}`.trim(),
          card_owner_company: lead.digital_cards?.company || "",
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          company: lead.company,
          score: lead.lead_score || 0,
          source: lead.source || "nfc",
          consent_given: lead.consent_given || false,
          consent_status: lead.consent_given ? "consented" : "not_consented",
          timestamp: lead.created_at,
          is_hot_lead: (lead.lead_score || 0) >= 50,
        };

        const result = await sendWithRetry(webhook_url, payload, retry_count);
        if (result.success) {
          results.success++;
        } else {
          results.failed++;
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Bulk sync completed: ${results.success} success, ${results.failed} failed, ${results.skipped} skipped`,
          results 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use 'trigger', 'sync_lead', 'score_updated', 'test', or 'bulk_sync'" }),
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

serve(handler);
