/**
 * Edge function: send-webstudio-followup
 * Sends a follow-up email to the client for their Web Studio order.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FollowupEmailRequest {
  orderId: string;
  email: string;
  siteName: string;
  subject: string;
  message: string;
  includeOrderDetails?: boolean;
}

function generateFollowupHtml(data: FollowupEmailRequest & { priceEur?: number; priceMad?: number; isExpress?: boolean }): string {
  const formattedMessage = data.message.replace(/\n/g, '<br>');
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.subject} - IWASP Web Studio</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0A0A0A;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #1A1A1A; border-radius: 16px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #D4AF37 0%, #F4E4BC 50%, #D4AF37 100%);">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #0A0A0A; letter-spacing: -0.5px;">
                📬 Suivi de votre projet
              </h1>
              <p style="margin: 10px 0 0; font-size: 14px; color: #333;">
                ${data.siteName}
              </p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; color: #F5F5F7; line-height: 1.6;">
                Bonjour,
              </p>
              
              <div style="margin: 0 0 30px; font-size: 16px; color: #F5F5F7; line-height: 1.8;">
                ${formattedMessage}
              </div>
              
              ${data.includeOrderDetails && (data.priceEur || data.priceMad) ? `
              <!-- Order Details Card -->
              <table role="presentation" style="width: 100%; background-color: #252525; border-radius: 12px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 16px; font-size: 14px; font-weight: 600; color: #D4AF37; text-transform: uppercase; letter-spacing: 1px;">📋 Rappel de votre commande</p>
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <p style="margin: 0; font-size: 12px; color: #8E8E93;">Projet</p>
                          <p style="margin: 4px 0 0; font-size: 16px; color: #F5F5F7;">${data.siteName}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <p style="margin: 0; font-size: 12px; color: #8E8E93;">Formule</p>
                          <p style="margin: 4px 0 0; font-size: 16px; color: #F5F5F7;">${data.isExpress ? 'Express (48h)' : 'Standard'}</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style="margin: 0; font-size: 12px; color: #8E8E93;">Prix estimé</p>
                          <p style="margin: 4px 0 0; font-size: 20px; font-weight: 600; color: #D4AF37;">${data.priceEur}€ <span style="font-size: 14px; color: #8E8E93;">/ ${data.priceMad} DH</span></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              ` : ''}
              
              <p style="margin: 0; font-size: 16px; color: #F5F5F7; line-height: 1.6;">
                N'hésitez pas à répondre directement à cet email si vous avez des questions.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #0A0A0A; text-align: center;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #8E8E93;">
                L'équipe IWASP Web Studio 🚀
              </p>
              <p style="margin: 0; font-size: 12px; color: #666;">
                © ${new Date().getFullYear()} IWASP Web Studio
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    // Verify admin auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Non autorisé" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Verify user is admin
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Non autorisé" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: "Accès admin requis" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data: FollowupEmailRequest = await req.json();

    console.log("send-webstudio-followup: sending to", data.email, "for order", data.orderId);

    if (!data.email || !data.subject || !data.message) {
      return new Response(
        JSON.stringify({ error: "Email, sujet et message requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch order details if needed
    let priceEur, priceMad, isExpress;
    if (data.includeOrderDetails && data.orderId) {
      const { data: order } = await supabase
        .from("website_proposals")
        .select("price_eur, price_mad, is_express")
        .eq("id", data.orderId)
        .single();
      
      if (order) {
        priceEur = order.price_eur;
        priceMad = order.price_mad;
        isExpress = order.is_express;
      }
    }

    const html = generateFollowupHtml({ ...data, priceEur, priceMad, isExpress });

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "IWASP Web Studio <contact@i-wasp.com>",
        to: [data.email],
        subject: data.subject,
        html,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("send-webstudio-followup: Resend error", errorText);
      throw new Error(`Resend API error: ${errorText}`);
    }

    const result = await emailResponse.json();
    console.log("send-webstudio-followup: email sent", result);

    // Log the email in status_history
    const { data: currentOrder } = await supabase
      .from("website_proposals")
      .select("status_history")
      .eq("id", data.orderId)
      .single();

    if (currentOrder) {
      const history = Array.isArray(currentOrder.status_history) ? currentOrder.status_history : [];
      history.push({
        status: "note",
        timestamp: new Date().toISOString(),
        note: `📧 Email envoyé: "${data.subject}"`
      });

      await supabase
        .from("website_proposals")
        .update({ 
          status_history: history,
          updated_at: new Date().toISOString()
        })
        .eq("id", data.orderId);
    }

    return new Response(JSON.stringify({ success: true, emailResponse: result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("send-webstudio-followup error:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
