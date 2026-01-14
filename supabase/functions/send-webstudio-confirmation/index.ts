/**
 * Edge function: send-webstudio-confirmation
 * Sends a confirmation email to the client when their Web Studio order is created.
 * Includes payment link for Stripe checkout.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WebStudioConfirmationRequest {
  email: string;
  siteName: string;
  businessType?: string;
  isExpress: boolean;
  priceEur: number;
  priceMad: number;
  orderId: string;
}

function generateConfirmationHtml(data: WebStudioConfirmationRequest): string {
  const expressLabel = data.isExpress ? "Express (48h)" : "Standard (7-10 jours)";
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://fyxiyevbbvidckzaequx.supabase.co";
  
  // Payment link - calls create-webstudio-payment function
  const paymentUrl = `https://i-wasp.lovable.app/web-studio/checkout?proposal_id=${data.orderId}`;
  const trackingUrl = `https://i-wasp.lovable.app/track-webstudio-order?id=${data.orderId}`;
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmez votre commande - IWASP Web Studio</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0A0A0A;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #1A1A1A; border-radius: 16px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #D4AF37 0%, #F4E4BC 50%, #D4AF37 100%);">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #0A0A0A; letter-spacing: -0.5px;">
                🎨 Votre site web vous attend !
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
                Merci pour votre demande de création de site web ! Voici le récapitulatif de votre commande :
              </p>
              
              <!-- Order Details Card -->
              <table role="presentation" style="width: 100%; background-color: #252525; border-radius: 12px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 24px;">
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="padding-bottom: 16px; border-bottom: 1px solid #333;">
                          <p style="margin: 0; font-size: 12px; color: #8E8E93; text-transform: uppercase; letter-spacing: 1px;">Projet</p>
                          <p style="margin: 8px 0 0; font-size: 20px; font-weight: 600; color: #D4AF37;">${data.siteName}</p>
                        </td>
                      </tr>
                      ${data.businessType ? `
                      <tr>
                        <td style="padding: 16px 0; border-bottom: 1px solid #333;">
                          <p style="margin: 0; font-size: 12px; color: #8E8E93; text-transform: uppercase; letter-spacing: 1px;">Type d'activité</p>
                          <p style="margin: 8px 0 0; font-size: 16px; color: #F5F5F7;">${data.businessType}</p>
                        </td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding: 16px 0; border-bottom: 1px solid #333;">
                          <p style="margin: 0; font-size: 12px; color: #8E8E93; text-transform: uppercase; letter-spacing: 1px;">Formule</p>
                          <p style="margin: 8px 0 0; font-size: 16px; color: #F5F5F7;">${expressLabel}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 16px;">
                          <p style="margin: 0; font-size: 12px; color: #8E8E93; text-transform: uppercase; letter-spacing: 1px;">Prix</p>
                          <p style="margin: 8px 0 0; font-size: 24px; font-weight: 700; color: #D4AF37;">${data.priceEur}€ <span style="font-size: 14px; color: #8E8E93;">/ ${data.priceMad} DH</span></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button - Pay Now -->
              <table role="presentation" style="width: 100%; margin-bottom: 30px;">
                <tr>
                  <td style="text-align: center;">
                    <a href="${paymentUrl}" style="display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #F4E4BC 50%, #D4AF37 100%); color: #0A0A0A; text-decoration: none; padding: 16px 48px; border-radius: 12px; font-size: 18px; font-weight: 700; box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4);">
                      💳 Payer et lancer la création
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 12px;">
                    <p style="margin: 0; font-size: 12px; color: #8E8E93;">
                      Paiement sécurisé par Stripe
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- How it works -->
              <table role="presentation" style="width: 100%; background-color: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 12px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 16px; font-size: 14px; font-weight: 600; color: #D4AF37; text-transform: uppercase; letter-spacing: 1px;">🚀 Comment ça marche ?</p>
                    <ol style="margin: 0; padding-left: 20px; color: #F5F5F7; font-size: 14px; line-height: 1.8;">
                      <li><strong>Vous payez</strong> en cliquant sur le bouton ci-dessus</li>
                      <li><strong>L'IA génère</strong> votre site en quelques minutes</li>
                      <li><strong>Vous recevez</strong> un email avec le lien de votre site</li>
                      <li><strong>Vous validez</strong> ou demandez des ajustements</li>
                    </ol>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px; font-size: 14px; color: #8E8E93; line-height: 1.6;">
                Référence commande : <span style="color: #F5F5F7; font-family: monospace;">${data.orderId.slice(0, 8).toUpperCase()}</span>
              </p>
              
              <p style="margin: 0 0 10px; font-size: 14px; color: #8E8E93; line-height: 1.6;">
                <a href="${trackingUrl}" style="color: #D4AF37; text-decoration: underline;">Suivre ma commande</a>
              </p>
              
              <p style="margin: 0; font-size: 16px; color: #F5F5F7; line-height: 1.6;">
                Des questions ? Répondez directement à cet email ou contactez-nous sur WhatsApp.
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
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const data: WebStudioConfirmationRequest = await req.json();

    console.log("send-webstudio-confirmation: sending to", data.email);

    if (!data.email) {
      return new Response(
        JSON.stringify({ error: "Email requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const html = generateConfirmationHtml(data);

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "IWASP Web Studio <onboarding@resend.dev>",
        to: [data.email],
        subject: `💳 Finalisez votre commande - ${data.siteName}`,
        html,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("send-webstudio-confirmation: Resend error", errorText);
      throw new Error(`Resend API error: ${errorText}`);
    }

    const result = await emailResponse.json();
    console.log("send-webstudio-confirmation: email sent", result);

    return new Response(JSON.stringify({ success: true, emailResponse: result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("send-webstudio-confirmation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
