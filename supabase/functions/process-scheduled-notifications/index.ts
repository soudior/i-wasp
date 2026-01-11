/**
 * Process Scheduled Push Notifications
 * This function is called by a cron job to send scheduled notifications
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const VAPID_PUBLIC_KEY = "BKPG55qfcSMyf2ot_WtrcPgQmBhgXp_4a3JfJwRQUUwgALI-OWXhfFN_Jmx6iYemIU0j48FJ-VQGoCa-3iq3K9s";

function logStep(step: string, details?: Record<string, unknown>) {
  console.log(`[SCHEDULED-PUSH] ${step}`, details ? JSON.stringify(details) : "");
}

interface PushSubscription {
  id: string;
  endpoint: string;
  p256dh_key: string;
  auth_key: string;
}

interface ScheduledNotification {
  id: string;
  card_id: string;
  user_id: string;
  title: string;
  body: string;
  scheduled_at: string;
}

async function sendPushNotification(
  subscription: PushSubscription,
  payload: { title: string; body: string; url?: string }
): Promise<{ success: boolean; status?: number }> {
  try {
    const response = await fetch(subscription.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        TTL: "86400",
      },
      body: JSON.stringify(payload),
    });

    return { success: response.ok, status: response.status };
  } catch (error) {
    logStep("Push send error", { error: String(error) });
    return { success: false };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Processing scheduled notifications");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get pending notifications that are due
    const now = new Date().toISOString();
    const { data: pendingNotifications, error: fetchError } = await supabase
      .from("scheduled_push_notifications")
      .select("*")
      .eq("status", "pending")
      .lte("scheduled_at", now)
      .limit(50);

    if (fetchError) {
      logStep("Error fetching scheduled notifications", { error: fetchError.message });
      throw fetchError;
    }

    if (!pendingNotifications || pendingNotifications.length === 0) {
      logStep("No pending notifications to process");
      return new Response(JSON.stringify({ processed: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    logStep(`Found ${pendingNotifications.length} notifications to process`);

    let totalSent = 0;
    let totalFailed = 0;

    for (const notification of pendingNotifications as ScheduledNotification[]) {
      logStep("Processing notification", { id: notification.id, cardId: notification.card_id });

      // Get subscriptions for this card
      const { data: subscriptions, error: subsError } = await supabase
        .from("push_subscriptions")
        .select("id, endpoint, p256dh_key, auth_key")
        .eq("card_id", notification.card_id)
        .eq("is_active", true);

      if (subsError) {
        logStep("Error fetching subscriptions", { error: subsError.message });
        continue;
      }

      if (!subscriptions || subscriptions.length === 0) {
        logStep("No subscribers for card", { cardId: notification.card_id });
        // Mark as sent with 0 count
        await supabase
          .from("scheduled_push_notifications")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
            sent_count: 0,
            failed_count: 0,
          })
          .eq("id", notification.id);
        continue;
      }

      // Get card slug for URL
      const { data: cardData } = await supabase
        .from("digital_cards")
        .select("slug")
        .eq("id", notification.card_id)
        .single();

      const url = cardData?.slug
        ? `${supabaseUrl.replace(".supabase.co", ".lovable.app")}/c/${cardData.slug}`
        : undefined;

      const payload = {
        title: notification.title,
        body: notification.body,
        url,
      };

      let sent = 0;
      let failed = 0;

      // Send to all subscribers
      const results = await Promise.allSettled(
        subscriptions.map((sub) => sendPushNotification(sub as PushSubscription, payload))
      );

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status === "fulfilled" && result.value.success) {
          sent++;
          // Update last_used_at
          await supabase
            .from("push_subscriptions")
            .update({ last_used_at: new Date().toISOString() })
            .eq("id", subscriptions[i].id);
        } else {
          failed++;
          // Check if subscription should be deactivated
          if (
            result.status === "fulfilled" &&
            (result.value.status === 404 || result.value.status === 410)
          ) {
            await supabase
              .from("push_subscriptions")
              .update({ is_active: false })
              .eq("id", subscriptions[i].id);
          }
        }
      }

      totalSent += sent;
      totalFailed += failed;

      // Update notification status
      await supabase
        .from("scheduled_push_notifications")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          sent_count: sent,
          failed_count: failed,
        })
        .eq("id", notification.id);

      // Also log to push_notification_logs
      await supabase.from("push_notification_logs").insert({
        card_id: notification.card_id,
        user_id: notification.user_id,
        title: notification.title,
        body: notification.body,
        sent_count: sent,
        failed_count: failed,
      });

      logStep("Notification processed", { id: notification.id, sent, failed });
    }

    logStep("All notifications processed", {
      total: pendingNotifications.length,
      sent: totalSent,
      failed: totalFailed,
    });

    return new Response(
      JSON.stringify({
        processed: pendingNotifications.length,
        sent: totalSent,
        failed: totalFailed,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    logStep("Error processing scheduled notifications", { error: String(error) });
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
