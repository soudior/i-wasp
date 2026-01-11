import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateAccountRequest {
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  cardSlug?: string;
}

// Generate a secure temporary password
function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    // Create admin client
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Verify caller is admin
    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !caller) {
      return new Response(JSON.stringify({ error: "Token invalide" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if caller is admin
    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .single();

    if (!roles) {
      return new Response(JSON.stringify({ error: "Accès admin requis" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { email, firstName, lastName, company, cardSlug }: CreateAccountRequest = await req.json();

    if (!email || !firstName || !lastName) {
      return new Response(JSON.stringify({ error: "Email, prénom et nom requis" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate temporary password
    const tempPassword = generateTempPassword();

    // Create user account
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        company: company || null,
      }
    });

    if (createError) {
      console.error("Error creating user:", createError);
      return new Response(JSON.stringify({ error: createError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a digital card for the user if cardSlug is provided
    if (cardSlug && newUser.user) {
      const { error: cardError } = await supabaseAdmin
        .from("digital_cards")
        .insert({
          user_id: newUser.user.id,
          slug: cardSlug,
          first_name: firstName,
          last_name: lastName,
          company: company || null,
          is_active: true,
          template: "default"
        });

      if (cardError) {
        console.error("Error creating card:", cardError);
      }
    }

    // Send welcome email with credentials
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      
      try {
        await resend.emails.send({
          from: "IWASP <no-reply@i-wasp.com>",
          to: [email],
          subject: "🎉 Votre carte digitale IWASP est prête !",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1D1D1F; }
                .container { max-width: 500px; margin: 0 auto; padding: 40px 20px; }
                .logo { text-align: center; margin-bottom: 30px; }
                .card { background: #F5F5F7; border-radius: 16px; padding: 30px; margin: 20px 0; }
                .credentials { background: white; border-radius: 12px; padding: 20px; margin-top: 20px; }
                .label { font-size: 12px; color: #8E8E93; text-transform: uppercase; margin-bottom: 5px; }
                .value { font-size: 16px; font-weight: 600; color: #1D1D1F; font-family: monospace; }
                .button { display: inline-block; background: #007AFF; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; margin-top: 20px; }
                .footer { text-align: center; margin-top: 40px; color: #8E8E93; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="logo">
                  <h1 style="color: #1D1D1F; margin: 0;">IWASP</h1>
                  <p style="color: #8E8E93; margin: 5px 0;">Tap. Connect. Empower.</p>
                </div>
                
                <h2>Bienvenue ${firstName} ! 👋</h2>
                
                <p>Votre carte digitale professionnelle est maintenant active. Voici vos identifiants de connexion :</p>
                
                <div class="card">
                  <div class="credentials">
                    <div style="margin-bottom: 15px;">
                      <div class="label">Email</div>
                      <div class="value">${email}</div>
                    </div>
                    <div>
                      <div class="label">Mot de passe temporaire</div>
                      <div class="value">${tempPassword}</div>
                    </div>
                  </div>
                  
                  <p style="font-size: 14px; color: #8E8E93; margin-top: 15px;">
                    ⚠️ Changez votre mot de passe après votre première connexion
                  </p>
                </div>
                
                <div style="text-align: center;">
                  <a href="https://i-wasp.com/login" class="button">Accéder à mon dashboard</a>
                </div>
                
                <div class="footer">
                  <p>Powered by IWASP</p>
                  <p><a href="https://i-wasp.com" style="color: #007AFF;">i-wasp.com</a></p>
                </div>
              </div>
            </body>
            </html>
          `,
        });
        console.log("Welcome email sent to:", email);
      } catch (emailError) {
        console.error("Error sending email:", emailError);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      user: {
        id: newUser.user?.id,
        email: newUser.user?.email,
        firstName,
        lastName,
      },
      tempPassword, // Return to admin for manual sharing if email fails
      message: `Compte créé pour ${firstName} ${lastName}. Email envoyé à ${email}.`
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Error in create-client-account:", error);
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
