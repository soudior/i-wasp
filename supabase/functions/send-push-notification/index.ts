import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PUSH-NOTIFICATION] ${step}${detailsStr}`);
};

function generateEmailHtml(title: string, body: string, orderNumber: string, trackingNumber?: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F5F5F7;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: #FFFFFF; border-radius: 24px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
          
          <!-- Logo -->
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; font-weight: 700; color: #1D1D1F; margin: 0;">IWASP</h1>
            <p style="font-size: 12px; color: #8E8E93; margin: 4px 0 0 0; letter-spacing: 1px;">DIGITAL BUSINESS CARDS</p>
          </div>
          
          <!-- Title -->
          <h2 style="font-size: 24px; font-weight: 600; color: #1D1D1F; text-align: center; margin: 0 0 16px 0;">
            ${title}
          </h2>
          
          <!-- Body -->
          <p style="font-size: 16px; color: #1D1D1F; line-height: 1.6; text-align: center; margin: 0 0 24px 0;">
            ${body}
          </p>
          
          <!-- Order Number -->
          <div style="background: #F5F5F7; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <p style="font-size: 12px; color: #8E8E93; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 1px;">Numéro de commande</p>
            <p style="font-size: 18px; font-weight: 600; color: #1D1D1F; margin: 0;">${orderNumber}</p>
          </div>
          
          ${trackingNumber ? `
          <!-- Tracking Number -->
          <div style="background: #007AFF; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <p style="font-size: 12px; color: rgba(255,255,255,0.8); margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 1px;">Numéro de suivi</p>
            <p style="font-size: 18px; font-weight: 600; color: #FFFFFF; margin: 0;">${trackingNumber}</p>
          </div>
          ` : ''}
          
          <!-- CTA Button -->
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="https://iwasp.app/orders" style="display: inline-block; background: #1D1D1F; color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-size: 14px; font-weight: 600;">
              Suivre ma commande
            </a>
          </div>
          
          <!-- Footer -->
          <div style="border-top: 1px solid #E5E5E5; padding-top: 24px; text-align: center;">
            <p style="font-size: 12px; color: #8E8E93; margin: 0 0 8px 0;">
              Tap. Connect. Empower.
            </p>
            <p style="font-size: 11px; color: #8E8E93; margin: 0;">
              © ${new Date().getFullYear()} IWASP. Tous droits réservés.
            </p>
          </div>
          
        </div>
      </div>
    </body>
    </html>
  `;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    const resend = new Resend(resendApiKey);

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
        body: `Votre commande a été confirmée et va être préparée avec soin.`
      },
      in_production: {
        title: "🏭 En production",
        body: `Votre carte NFC est en cours de fabrication. Nous mettons tout en œuvre pour vous livrer rapidement.`
      },
      shipped: {
        title: "📦 Votre commande est expédiée !",
        body: trackingNumber 
          ? `Votre commande est en route vers vous. Utilisez le numéro de suivi ci-dessous pour suivre votre colis.`
          : `Votre commande a été expédiée et sera bientôt chez vous.`
      },
      delivered: {
        title: "🎉 Commande livrée !",
        body: `Votre commande a été livrée. Profitez de votre carte NFC IWASP et impressionnez vos contacts !`
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
      try {
        const emailHtml = generateEmailHtml(
          notification.title,
          notification.body,
          order.order_number,
          trackingNumber
        );

        const emailResponse = await resend.emails.send({
          from: "IWASP <notifications@iwasp.app>",
          to: [order.customer_email],
          subject: `${notification.title} - Commande ${order.order_number}`,
          html: emailHtml,
        });

        logStep("Email sent successfully", { emailResponse });
        emailSent = true;
      } catch (emailError) {
        logStep("Email sending failed", { error: emailError instanceof Error ? emailError.message : String(emailError) });
        // Don't throw - continue with response
      }
    }

    logStep("Notification processed", { 
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
