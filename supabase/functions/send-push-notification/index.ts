import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PUSH-NOTIFICATION] ${step}${detailsStr}`);
};

// Email notification as fallback (push notifications require native app)
async function sendEmailNotification(
  email: string,
  subject: string,
  message: string,
  orderId: string
) {
  // For now, we'll log the notification - in production, integrate with an email service
  logStep("Email notification would be sent", { email, subject, orderId });
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { orderId, newStatus, trackingNumber } = await req.json();
    if (!orderId || !newStatus) {
      throw new Error("orderId and newStatus are required");
    }
    logStep("Request received", { orderId, newStatus, trackingNumber });

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error(`Order not found: ${orderId}`);
    }
    logStep("Order found", { orderNumber: order.order_number, email: order.customer_email });

    // Generate notification message based on status
    const statusMessages: Record<string, { title: string; body: string }> = {
      paid: {
        title: "✅ Commande confirmée",
        body: `Votre commande ${order.order_number} a été confirmée et va être préparée.`
      },
      in_production: {
        title: "🏭 En production",
        body: `Votre carte NFC ${order.order_number} est en cours de fabrication.`
      },
      shipped: {
        title: "📦 Expédiée !",
        body: trackingNumber 
          ? `Votre commande ${order.order_number} est en route. Suivi: ${trackingNumber}`
          : `Votre commande ${order.order_number} a été expédiée.`
      },
      delivered: {
        title: "🎉 Livrée !",
        body: `Votre commande ${order.order_number} a été livrée. Profitez de votre carte NFC !`
      }
    };

    const notification = statusMessages[newStatus];
    if (!notification) {
      logStep("No notification for status", { newStatus });
      return new Response(JSON.stringify({ sent: false, reason: "No notification for this status" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Send email notification if customer email exists
    let emailSent = false;
    if (order.customer_email) {
      emailSent = await sendEmailNotification(
        order.customer_email,
        notification.title,
        notification.body,
        orderId
      );
    }

    // Log notification for analytics
    logStep("Notification sent", { 
      orderNumber: order.order_number, 
      status: newStatus,
      emailSent,
      title: notification.title 
    });

    return new Response(JSON.stringify({ 
      sent: true, 
      emailSent,
      notification: {
        title: notification.title,
        body: notification.body
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage, sent: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});
