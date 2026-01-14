import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email address required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Resend API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resend = new Resend(resendApiKey);
    
    console.log(`Sending test email to: ${email}`);

    const { data, error } = await resend.emails.send({
      from: "IWASP <onboarding@resend.dev>",
      to: [email],
      subject: "✅ Test Email - IWASP",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
            .container { max-width: 500px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #000000 0%, #1a1a2e 100%); padding: 40px 30px; text-align: center; }
            .header h1 { color: #d4af37; margin: 0; font-size: 28px; }
            .content { padding: 40px 30px; text-align: center; }
            .success-icon { font-size: 64px; margin-bottom: 20px; }
            .message { color: #4a5568; font-size: 16px; line-height: 1.7; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; }
            .footer p { color: #718096; font-size: 12px; margin: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🐝 IWASP</h1>
            </div>
            <div class="content">
              <div class="success-icon">✅</div>
              <p class="message">
                <strong>Félicitations !</strong><br><br>
                Votre configuration email fonctionne parfaitement.<br>
                Resend + IWASP sont prêts à envoyer des emails.
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} IWASP - Test email</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Email sent successfully:", data);

    return new Response(
      JSON.stringify({ success: true, messageId: data?.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
