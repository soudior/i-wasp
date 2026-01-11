/**
 * i-wasp Push Notification Sender
 * Sends web push notifications to subscribers
 * 
 * Note: Full Web Push encryption requires complex ECDH/AES-GCM.
 * This implementation logs the intent and prepares for future
 * integration with a proper web-push service.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Web Push VAPID keys - generated for i-wasp
const VAPID_PUBLIC_KEY = "BKPG55qfcSMyf2ot_WtrcPgQmBhgXp_4a3JfJwRQUUwgALI-OWXhfFN_Jmx6iYemIU0j48FJ-VQGoCa-3iq3K9s";
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY") || "";
const VAPID_SUBJECT = "mailto:ssouhail.92@gmail.com";

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

// Base64 URL encoding
function base64UrlEncode(input: string): string {
  return btoa(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Base64 URL decoding
function base64UrlDecode(str: string): string {
  const padding = '='.repeat((4 - str.length % 4) % 4);
  const base64 = (str + padding).replace(/-/g, '+').replace(/_/g, '/');
  return atob(base64);
}

// Create unsigned JWT token for VAPID (for logging/debugging purposes)
function createUnsignedVapidToken(audience: string): { header: string; payload: string; full: string } {
  const header = { alg: "ES256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    aud: audience,
    exp: now + 12 * 60 * 60,
    sub: VAPID_SUBJECT,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  return {
    header: encodedHeader,
    payload: encodedPayload,
    full: `${encodedHeader}.${encodedPayload}`,
  };
}

// Attempt to send push notification
// Web Push Protocol requires ECDH encryption - this is a simplified version
async function sendPushNotification(
  subscription: PushSubscription,
  payload: PushPayload
): Promise<{ success: boolean; status?: number; error?: string }> {
  try {
    const endpoint = subscription.endpoint;
    const url = new URL(endpoint);
    const audience = `${url.protocol}//${url.host}`;

    logStep("Preparing push", { 
      endpoint: endpoint.substring(0, 60) + "...",
      audience
    });

    // Check if VAPID keys are configured
    if (!VAPID_PRIVATE_KEY) {
      return { success: false, error: "VAPID_PRIVATE_KEY not configured" };
    }

    // Log the token info for debugging
    const tokenInfo = createUnsignedVapidToken(audience);
    logStep("VAPID token prepared", { 
      headerLength: tokenInfo.header.length,
      payloadLength: tokenInfo.payload.length
    });

    // For FCM endpoints, try a simple approach
    // Note: Full RFC 8291 encryption would be needed for guaranteed delivery
    const isFCM = endpoint.includes("fcm.googleapis.com") || endpoint.includes("firebase");
    const isMozilla = endpoint.includes("mozilla.com") || endpoint.includes("push.services.mozilla.com");

    logStep("Push endpoint type", { isFCM, isMozilla, endpoint: endpoint.substring(0, 40) });

    // Attempt the push request with minimal headers
    // The service worker will receive this and show the notification
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          "TTL": "86400",
          "Urgency": "normal",
        },
        body: JSON.stringify(payload),
      });

      logStep("Push response", { 
        status: response.status, 
        statusText: response.statusText 
      });

      // 201 = Created (success for FCM)
      // 200 = OK (success for some providers)
      if (response.status === 201 || response.status === 200) {
        return { success: true, status: response.status };
      }

      // 410 = Gone (subscription expired)
      // 404 = Not Found (subscription invalid)
      if (response.status === 410 || response.status === 404) {
        return { success: false, status: response.status, error: "Subscription expired" };
      }

      // 401/403 = Auth required (VAPID signature needed)
      if (response.status === 401 || response.status === 403) {
        logStep("Auth required - VAPID signature needed", { status: response.status });
        // For now, log and mark as pending
        return { success: false, status: response.status, error: "VAPID auth required" };
      }

      const errorText = await response.text().catch(() => "");
      return { success: false, status: response.status, error: errorText || response.statusText };
    } catch (fetchError) {
      console.error("[Push] Fetch error:", fetchError);
      return { success: false, error: String(fetchError) };
    }
  } catch (error) {
    console.error("[Push] Error:", error);
    return { success: false, error: String(error) };
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Request received");

    // Check VAPID key
    if (!VAPID_PRIVATE_KEY) {
      console.error("[Push] VAPID_PRIVATE_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Push notifications not configured - missing VAPID key" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    logStep("VAPID key configured", { keyLength: VAPID_PRIVATE_KEY.length });

    // Get request body
    const { cardId, title, body, url } = await req.json();

    if (!cardId || !title || !body) {
      return new Response(
        JSON.stringify({ error: "cardId, title, and body are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    logStep("Parsed request", { cardId, title, bodyLength: body.length });

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
      .select("id, user_id, first_name, last_name, slug")
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

    logStep("Authorization verified", { 
      cardOwner: `${card.first_name} ${card.last_name}`,
      slug: card.slug
    });

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
        JSON.stringify({ 
          sent: 0, 
          failed: 0, 
          total: 0,
          message: "Aucun abonné aux notifications" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare payload
    const payload: PushPayload = {
      title,
      body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-96x96.png",
      tag: `iwasp-${cardId}-${Date.now()}`,
      data: { 
        url: url || `/c/${card.slug}`,
        cardId,
        timestamp: Date.now(),
      },
    };

    logStep("Payload prepared", { 
      title: payload.title,
      tag: payload.tag
    });

    // Send notifications in parallel
    let sent = 0;
    let failed = 0;
    const failedIds: string[] = [];
    const expiredIds: string[] = [];

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        const result = await sendPushNotification(sub, payload);
        return { id: sub.id, ...result };
      })
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        if (result.value.success) {
          sent++;
          // Update last_used_at
          await supabase
            .from("push_subscriptions")
            .update({ last_used_at: new Date().toISOString() })
            .eq("id", result.value.id);
        } else {
          failed++;
          // Check if subscription is expired
          if (result.value.status === 410 || result.value.status === 404) {
            expiredIds.push(result.value.id);
          } else {
            failedIds.push(result.value.id);
          }
          logStep("Push failed", { 
            id: result.value.id, 
            status: result.value.status,
            error: result.value.error 
          });
        }
      } else {
        failed++;
        logStep("Push promise rejected", { reason: result.reason });
      }
    }

    // Deactivate expired subscriptions
    if (expiredIds.length > 0) {
      await supabase
        .from("push_subscriptions")
        .update({ is_active: false })
        .in("id", expiredIds);
      
      logStep("Deactivated expired subscriptions", { count: expiredIds.length });
    }

    logStep("Notifications completed", { 
      sent, 
      failed, 
      expired: expiredIds.length,
      total: subscriptions.length 
    });

    // Return result
    const message = sent > 0 
      ? `${sent} notification${sent > 1 ? 's' : ''} envoyée${sent > 1 ? 's' : ''}`
      : failed > 0 
        ? "Erreur d'envoi - vérifiez les logs" 
        : "Aucune notification à envoyer";

    return new Response(
      JSON.stringify({ 
        sent, 
        failed, 
        total: subscriptions.length,
        message
      }),
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
