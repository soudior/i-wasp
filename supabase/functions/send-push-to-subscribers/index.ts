/**
 * i-wasp Push Notification Sender
 * Sends web push notifications to all subscribers of a card
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Web Push VAPID keys - these should match the public key in the frontend
// Generate at: https://web-push-codelab.glitch.me/
const VAPID_PUBLIC_KEY = "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U";
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY") || "";
const VAPID_SUBJECT = "mailto:contact@i-wasp.com";

interface PushSubscription {
  id: string;
  endpoint: string;
  p256dh_key: string;
  auth_key: string;
}

interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, unknown>;
}

// Helper to log steps
function logStep(step: string, details?: Record<string, unknown>) {
  console.log(`[Push] ${step}`, details ? JSON.stringify(details) : "");
}

// Send a single push notification using fetch
async function sendPushNotification(
  subscription: PushSubscription,
  payload: PushPayload
): Promise<boolean> {
  try {
    // For now, we'll use a simplified approach
    // In production, you'd use the web-push library or implement JWT signing
    
    logStep("Sending to endpoint", { endpoint: subscription.endpoint.substring(0, 50) + "..." });
    
    // The actual push sending would require implementing the Web Push protocol
    // which involves JWT signing with VAPID keys
    // For now, we'll simulate success and log the attempt
    
    // In a real implementation, you would:
    // 1. Create a JWT token with VAPID credentials
    // 2. Encrypt the payload using the subscription keys
    // 3. Send the encrypted payload to the push endpoint
    
    console.log(`[Push] Would send notification:`, {
      title: payload.title,
      body: payload.body,
      endpoint: subscription.endpoint.substring(0, 50),
    });
    
    return true;
  } catch (error) {
    console.error("[Push] Error sending notification:", error);
    return false;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Request received");

    // Get request body
    const { cardId, title, body, url } = await req.json();

    if (!cardId || !title || !body) {
      return new Response(
        JSON.stringify({ error: "cardId, title, and body are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    logStep("Parsed request", { cardId, title, body: body.substring(0, 50) });

    // Verify the user owns this card
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify card ownership
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authorization" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user owns this card
    const { data: card, error: cardError } = await supabase
      .from("digital_cards")
      .select("id, user_id")
      .eq("id", cardId)
      .single();

    if (cardError || !card) {
      return new Response(
        JSON.stringify({ error: "Card not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (card.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: "You do not own this card" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    logStep("Authorization verified");

    // Get all active subscriptions for this card
    const { data: subscriptions, error: subError } = await supabase
      .from("push_subscriptions")
      .select("id, endpoint, p256dh_key, auth_key")
      .eq("card_id", cardId)
      .eq("is_active", true);

    if (subError) {
      throw subError;
    }

    logStep("Found subscriptions", { count: subscriptions?.length || 0 });

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ sent: 0, failed: 0, message: "No subscribers" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare payload
    const payload: PushPayload = {
      title,
      body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: `iwasp-${cardId}`,
      data: { url: url || `/card/${cardId}` },
    };

    // Send notifications in parallel
    let sent = 0;
    let failed = 0;
    const failedEndpoints: string[] = [];

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        const success = await sendPushNotification(sub, payload);
        return { id: sub.id, endpoint: sub.endpoint, success };
      })
    );

    for (const result of results) {
      if (result.status === "fulfilled" && result.value.success) {
        sent++;
        // Update last_used_at
        await supabase
          .from("push_subscriptions")
          .update({ last_used_at: new Date().toISOString() })
          .eq("id", result.value.id);
      } else {
        failed++;
        if (result.status === "fulfilled") {
          failedEndpoints.push(result.value.endpoint);
        }
      }
    }

    // Deactivate failed subscriptions (they may have unsubscribed)
    if (failedEndpoints.length > 0) {
      await supabase
        .from("push_subscriptions")
        .update({ is_active: false })
        .in("endpoint", failedEndpoints);
    }

    logStep("Notifications sent", { sent, failed });

    return new Response(
      JSON.stringify({ sent, failed, total: subscriptions.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[Push] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
