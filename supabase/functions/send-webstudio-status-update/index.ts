/**
 * Edge function: send-webstudio-status-update
 * Sends an email to the client when their Web Studio order status changes.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StatusUpdateRequest {
  email: string;
  siteName: string;
  orderId: string;
  previousStatus: string;
  newStatus: string;
  adminNotes?: string;
}

const statusLabels: Record<string, { label: string; emoji: string; color: string; description: string }> = {
  new: {
    label: "Nouvelle demande",
    emoji: "📥",
    color: "#3B82F6",
    description: "Votre demande a été reçue et est en attente de traitement par notre équipe."
  },
  contacted: {
    label: "Prise de contact",
    emoji: "📞",
    color: "#8B5CF6",
    description: "Notre équipe a pris contact avec vous pour discuter des détails de votre projet."
  },
  in_progress: {
    label: "En développement",
    emoji: "💻",
    color: "#F59E0B",
    description: "Votre site web est en cours de développement. Notre équipe travaille activement dessus !"
  },
  review: {
    label: "En révision",
    emoji: "👀",
    color: "#EC4899",
    description: "Votre site est prêt pour révision. Nous attendons vos retours pour les ajustements finaux."
  },
  delivered: {
    label: "Livré",
    emoji: "🚀",
    color: "#10B981",
    description: "Félicitations ! Votre site web est terminé et mis en ligne. Merci de votre confiance !"
  },
  cancelled: {
    label: "Annulé",
    emoji: "❌",
    color: "#EF4444",
    description: "Cette commande a été annulée. N'hésitez pas à nous recontacter si vous changez d'avis."
  }
};

function generateStatusUpdateHtml(data: StatusUpdateRequest): string {
  const status = statusLabels[data.newStatus] || {
    label: data.newStatus,
    emoji: "📋",
    color: "#6B7280",
    description: "Le statut de votre commande a été mis à jour."
  };

  // Use only the published domain to avoid "dangerous link" warnings in Gmail
  const trackingUrl = `https://i-wasp.com/web-studio/suivi?id=${data.orderId}`;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mise à jour de votre commande - IWASP Web Studio</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0A0A0A;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #1A1A1A; border-radius: 16px; overflow: hidden;">
          
          <!-- Header with status color -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, ${status.color}33 0%, ${status.color}11 100%); border-bottom: 2px solid ${status.color};">
              <p style="margin: 0 0 10px; font-size: 48px;">${status.emoji}</p>
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #F5F5F7;">
                ${status.label}
              </h1>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; color: #F5F5F7; line-height: 1.6;">
                Bonjour,
              </p>
              <p style="margin: 0 0 30px; font-size: 16px; color: #F5F5F7; line-height: 1.6;">
                Le statut de votre projet <strong style="color: #D4AF37;">"${data.siteName}"</strong> vient d'être mis à jour.
              </p>
              
              <!-- Status Update Card -->
              <table role="presentation" style="width: 100%; background-color: #252525; border-radius: 12px; margin-bottom: 30px; border-left: 4px solid ${status.color};">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: ${status.color}; text-transform: uppercase; letter-spacing: 1px;">
                      Nouveau statut
                    </p>
                    <p style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #F5F5F7;">
                      ${status.emoji} ${status.label}
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #A1A1AA; line-height: 1.6;">
                      ${status.description}
                    </p>
                  </td>
                </tr>
              </table>

              ${data.adminNotes ? `
              <!-- Admin Notes -->
              <table role="presentation" style="width: 100%; background-color: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 12px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 12px; font-size: 12px; font-weight: 600; color: #D4AF37; text-transform: uppercase; letter-spacing: 1px;">
                      💬 Message de notre équipe
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #F5F5F7; line-height: 1.6; font-style: italic;">
                      "${data.adminNotes}"
                    </p>
                  </td>
                </tr>
              </table>
              ` : ''}
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; margin-bottom: 30px;">
                <tr>
                  <td style="text-align: center;">
                    <a href="${trackingUrl}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #D4AF37 0%, #F4E4BC 50%, #D4AF37 100%); color: #0A0A0A; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 8px;">
                      📍 Suivre ma commande
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px; font-size: 14px; color: #8E8E93; line-height: 1.6;">
                Référence : <span style="color: #F5F5F7; font-family: monospace;">${data.orderId.slice(0, 8).toUpperCase()}</span>
              </p>
              
              <p style="margin: 0; font-size: 14px; color: #8E8E93; line-height: 1.6;">
                Des questions ? Répondez directement à cet email.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #0A0A0A; text-align: center;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #8E8E93;">
                Merci de votre confiance 🙏
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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const data: StatusUpdateRequest = await req.json();

    console.log("send-webstudio-status-update:", {
      email: data.email,
      orderId: data.orderId,
      previousStatus: data.previousStatus,
      newStatus: data.newStatus
    });

    if (!data.email) {
      return new Response(
        JSON.stringify({ error: "Email requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Don't send email if status hasn't actually changed
    if (data.previousStatus === data.newStatus) {
      console.log("send-webstudio-status-update: status unchanged, skipping email");
      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: "status_unchanged" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const status = statusLabels[data.newStatus];
    const html = generateStatusUpdateHtml(data);

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "IWASP Web Studio <onboarding@resend.dev>",
        to: [data.email],
        subject: `${status?.emoji || "📋"} ${data.siteName} - ${status?.label || data.newStatus}`,
        html,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("send-webstudio-status-update: Resend error", errorText);
      throw new Error(`Resend API error: ${errorText}`);
    }

    const result = await emailResponse.json();
    console.log("send-webstudio-status-update: email sent successfully", result);

    return new Response(JSON.stringify({ success: true, emailResponse: result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("send-webstudio-status-update error:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
