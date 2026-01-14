import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendWebsiteEmailRequest {
  proposalId: string;
  customEmail?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-website-email: Request received");

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { proposalId, customEmail }: SendWebsiteEmailRequest = await req.json();
    console.log("send-website-email: Processing proposal", proposalId);

    // Get proposal and website data
    const { data: proposal, error: proposalError } = await supabase
      .from("website_proposals")
      .select("form_data, status")
      .eq("id", proposalId)
      .single();

    if (proposalError || !proposal) {
      console.error("send-website-email: Proposal not found", proposalError);
      return new Response(
        JSON.stringify({ error: "Proposition non trouvée" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: website, error: websiteError } = await supabase
      .from("generated_websites")
      .select("slug, preview_url, status")
      .eq("proposal_id", proposalId)
      .single();

    if (websiteError || !website) {
      console.error("send-website-email: Website not found", websiteError);
      return new Response(
        JSON.stringify({ error: "Site web non généré" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (website.status !== "completed") {
      console.error("send-website-email: Website not completed", website.status);
      return new Response(
        JSON.stringify({ error: "Le site n'est pas encore prêt" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const businessName = proposal.form_data?.businessName || "Votre entreprise";
    const recipientEmail = customEmail || proposal.form_data?.contactEmail;
    const siteUrl = website.preview_url || `https://i-wasp.lovable.app/s/${website.slug}`;

    if (!recipientEmail) {
      console.error("send-website-email: No email address");
      return new Response(
        JSON.stringify({ error: "Aucune adresse email trouvée" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("send-website-email: Sending to", recipientEmail);

    // Send email using Resend API directly
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "IWASP Web Studio <contact@i-wasp.com>",
        to: [recipientEmail],
        subject: `🎉 Votre site ${businessName} est prêt !`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f7;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f7; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #1D1D1F 0%, #2D2D2F 100%); padding: 40px 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                          🎉 Félicitations !
                        </h1>
                        <p style="margin: 16px 0 0; color: rgba(255,255,255,0.8); font-size: 16px;">
                          Votre site web est maintenant en ligne
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="margin: 0 0 16px; color: #1D1D1F; font-size: 22px; font-weight: 600;">
                          ${businessName}
                        </h2>
                        <p style="margin: 0 0 24px; color: #6B7280; font-size: 16px; line-height: 1.6;">
                          Nous sommes ravis de vous annoncer que votre site web a été créé avec succès par notre équipe IWASP Web Studio.
                        </p>
                        
                        <!-- CTA Button -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" style="padding: 20px 0;">
                              <a href="${siteUrl}" style="display: inline-block; background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
                                Voir mon site →
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 24px 0 0; color: #9CA3AF; font-size: 14px; text-align: center;">
                          Lien direct : <a href="${siteUrl}" style="color: #F59E0B;">${siteUrl}</a>
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #F9FAFB; padding: 24px 40px; text-align: center; border-top: 1px solid #E5E7EB;">
                        <p style="margin: 0; color: #6B7280; font-size: 14px;">
                          Une question ? Contactez-nous sur WhatsApp
                        </p>
                        <p style="margin: 8px 0 0; color: #9CA3AF; font-size: 12px;">
                          © 2026 IWASP · Tap. Connect. Empower.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("send-website-email: Resend error", emailData);
      return new Response(
        JSON.stringify({ error: emailData.message || "Erreur d'envoi" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("send-website-email: Email sent successfully", emailData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email envoyé à ${recipientEmail}`,
        emailId: emailData.id 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("send-website-email: Error", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
