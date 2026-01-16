/**
 * Edge function: send-admin-alert
 * Sends automatic email alerts to admin when new orders are created.
 * Supports both Express orders and Web Studio orders.
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const adminEmail = Deno.env.get("ADMIN_EMAIL") || "contact@i-wasp.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ExpressOrderAlert {
  type: "express";
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  city: string;
  offerName: string;
  totalPrice: number;
  paymentMethod: string;
}

interface WebStudioOrderAlert {
  type: "webstudio";
  orderId: string;
  siteName: string;
  customerEmail: string;
  businessType?: string;
  isExpress: boolean;
  priceEur: number;
  priceMad: number;
}

type AdminAlertRequest = ExpressOrderAlert | WebStudioOrderAlert;

function formatPrice(cents: number, currency: string = "MAD"): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency
  }).format(cents / 100);
}

function generateExpressAlertHtml(data: ExpressOrderAlert): string {
  const paymentBadge = data.paymentMethod === "cod" 
    ? '<span style="background: #FED7AA; color: #7B341E; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">💵 Paiement à la livraison</span>'
    : '<span style="background: #C6F6D5; color: #22543D; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">💳 Stripe</span>';

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F5F5F7;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 30px 40px; background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #FFFFFF;">
                🎉 Nouvelle commande Express !
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <div style="text-align: center; margin-bottom: 30px;">
                ${paymentBadge}
              </div>
              
              <!-- Order Info -->
              <table role="presentation" style="width: 100%; background-color: #F8F9FA; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 8px; font-size: 12px; color: #8E8E93; text-transform: uppercase; letter-spacing: 1px;">Numéro de commande</p>
                    <p style="margin: 0; font-size: 20px; font-weight: 700; color: #1D1D1F;">#${data.orderNumber}</p>
                  </td>
                </tr>
              </table>

              <!-- Customer Details -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #E5E7EB;">
                    <span style="color: #8E8E93; font-size: 14px;">Client</span>
                    <span style="float: right; color: #1D1D1F; font-weight: 500;">${data.customerName}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #E5E7EB;">
                    <span style="color: #8E8E93; font-size: 14px;">Email</span>
                    <span style="float: right; color: #007AFF; font-weight: 500;">${data.customerEmail}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #E5E7EB;">
                    <span style="color: #8E8E93; font-size: 14px;">Téléphone</span>
                    <span style="float: right; color: #1D1D1F; font-weight: 500;">${data.customerPhone}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #E5E7EB;">
                    <span style="color: #8E8E93; font-size: 14px;">Ville</span>
                    <span style="float: right; color: #1D1D1F; font-weight: 500;">${data.city}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #E5E7EB;">
                    <span style="color: #8E8E93; font-size: 14px;">Offre</span>
                    <span style="float: right; color: #D4AF37; font-weight: 600;">${data.offerName}</span>
                  </td>
                </tr>
              </table>

              <!-- Total -->
              <table role="presentation" style="width: 100%; background: linear-gradient(135deg, #1D1D1F 0%, #2D2D2F 100%); border-radius: 12px; margin-top: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <span style="color: #8E8E93; font-size: 14px;">Total</span>
                    <span style="float: right; color: #D4AF37; font-size: 24px; font-weight: 700;">${formatPrice(data.totalPrice)}</span>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <div style="text-align: center; margin-top: 32px;">
                <a href="https://i-wasp.lovable.app/admin/orders" 
                   style="display: inline-block; background: #007AFF; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px;">
                  Voir dans l'admin →
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #F8F9FA; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #8E8E93;">
                IWASP Admin • ${new Date().toLocaleString('fr-FR')}
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

function generateWebStudioAlertHtml(data: WebStudioOrderAlert): string {
  const formuleBadge = data.isExpress 
    ? '<span style="background: #FED7AA; color: #7B341E; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">⚡ Express 48h</span>'
    : '<span style="background: #DBEAFE; color: #1E40AF; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">📅 Standard 7-10j</span>';

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F5F5F7;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 30px 40px; background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #FFFFFF;">
                🌐 Nouvelle commande Web Studio !
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <div style="text-align: center; margin-bottom: 30px;">
                ${formuleBadge}
              </div>
              
              <!-- Project Info -->
              <table role="presentation" style="width: 100%; background-color: #F8F9FA; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 8px; font-size: 12px; color: #8E8E93; text-transform: uppercase; letter-spacing: 1px;">Nom du site</p>
                    <p style="margin: 0; font-size: 20px; font-weight: 700; color: #8B5CF6;">${data.siteName}</p>
                  </td>
                </tr>
              </table>

              <!-- Details -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #E5E7EB;">
                    <span style="color: #8E8E93; font-size: 14px;">Email client</span>
                    <span style="float: right; color: #007AFF; font-weight: 500;">${data.customerEmail}</span>
                  </td>
                </tr>
                ${data.businessType ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #E5E7EB;">
                    <span style="color: #8E8E93; font-size: 14px;">Type d'activité</span>
                    <span style="float: right; color: #1D1D1F; font-weight: 500;">${data.businessType}</span>
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #E5E7EB;">
                    <span style="color: #8E8E93; font-size: 14px;">ID Proposition</span>
                    <span style="float: right; color: #1D1D1F; font-weight: 500; font-size: 12px;">${data.orderId.substring(0, 8)}...</span>
                  </td>
                </tr>
              </table>

              <!-- Prices -->
              <table role="presentation" style="width: 100%; background: linear-gradient(135deg, #1D1D1F 0%, #2D2D2F 100%); border-radius: 12px; margin-top: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="margin-bottom: 12px;">
                      <span style="color: #8E8E93; font-size: 14px;">Prix EUR</span>
                      <span style="float: right; color: #FFFFFF; font-size: 18px; font-weight: 600;">${data.priceEur}€</span>
                    </div>
                    <div>
                      <span style="color: #8E8E93; font-size: 14px;">Prix MAD</span>
                      <span style="float: right; color: #D4AF37; font-size: 18px; font-weight: 600;">${data.priceMad} DH</span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <div style="text-align: center; margin-top: 32px;">
                <a href="https://i-wasp.lovable.app/admin/webstudio" 
                   style="display: inline-block; background: #8B5CF6; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px;">
                  Voir dans l'admin →
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #F8F9FA; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #8E8E93;">
                IWASP Web Studio Admin • ${new Date().toLocaleString('fr-FR')}
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
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: AdminAlertRequest = await req.json();
    console.log("[send-admin-alert] Received request:", data.type);

    let subject: string;
    let html: string;

    if (data.type === "express") {
      subject = `🛒 Nouvelle commande Express #${data.orderNumber} - ${data.customerName}`;
      html = generateExpressAlertHtml(data);
    } else if (data.type === "webstudio") {
      const expressLabel = data.isExpress ? "[EXPRESS]" : "";
      subject = `🌐 ${expressLabel} Nouvelle commande Web Studio - ${data.siteName}`;
      html = generateWebStudioAlertHtml(data);
    } else {
      throw new Error("Unknown alert type");
    }

    console.log("[send-admin-alert] Sending email to:", adminEmail);

    const emailResult = await resend.emails.send({
      from: "IWASP Alertes <alerts@i-wasp.com>",
      to: [adminEmail],
      subject: subject,
      html: html,
    });

    console.log("[send-admin-alert] Email sent successfully:", emailResult);

    return new Response(
      JSON.stringify({ success: true, emailId: emailResult.data?.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[send-admin-alert] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
