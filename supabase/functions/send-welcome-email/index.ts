import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function verifyAuth(req: Request): Promise<{ user: any; error?: string }> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return { user: null, error: 'Authorization header required' };

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
  if (authError || !user) return { user: null, error: 'Unauthorized - valid authentication required' };

  return { user };
}

interface WelcomeEmailRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  dashboardUrl: string;
}

const generateWelcomeHtml = (firstName: string, dashboardUrl: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f7; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #000000 0%, #1a1a2e 100%); padding: 50px 30px; text-align: center; }
        .header h1 { color: #d4af37; margin: 0; font-size: 36px; font-weight: 700; letter-spacing: -0.5px; }
        .header .bee-icon { font-size: 56px; margin-bottom: 15px; }
        .header p { color: #ffffff; opacity: 0.9; font-size: 16px; margin-top: 10px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 22px; color: #1d1d1f; margin-bottom: 20px; font-weight: 600; }
        .message { color: #6e6e73; line-height: 1.7; margin-bottom: 25px; font-size: 16px; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8942e 100%); color: #000000 !important; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .cta-button:hover { opacity: 0.9; }
        .pwa-section { background: #f5f5f7; padding: 30px; border-radius: 16px; margin: 30px 0; }
        .pwa-section h3 { color: #1d1d1f; margin: 0 0 20px; font-size: 18px; font-weight: 600; }
        .pwa-step { display: flex; align-items: flex-start; margin: 15px 0; }
        .pwa-step-num { background: #d4af37; color: #000; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; margin-right: 15px; flex-shrink: 0; }
        .pwa-step-text { color: #6e6e73; font-size: 15px; line-height: 1.6; }
        .pwa-step-text strong { color: #1d1d1f; }
        .device-tabs { display: flex; gap: 10px; margin-bottom: 20px; }
        .device-tab { background: #e8e8ed; padding: 8px 16px; border-radius: 8px; font-size: 13px; color: #6e6e73; }
        .device-tab.active { background: #1d1d1f; color: #ffffff; }
        .features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 25px 0; }
        .feature-card { background: #f5f5f7; padding: 20px; border-radius: 12px; text-align: center; }
        .feature-icon { font-size: 32px; margin-bottom: 10px; }
        .feature-title { color: #1d1d1f; font-weight: 600; font-size: 14px; margin: 0; }
        .feature-desc { color: #8e8e93; font-size: 12px; margin-top: 5px; }
        .gold-badge { background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%); color: #000; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; display: inline-block; margin-left: 5px; }
        .divider { height: 1px; background: #e8e8ed; margin: 30px 0; }
        .footer { background: #f5f5f7; padding: 30px; text-align: center; }
        .footer p { color: #8e8e93; font-size: 13px; margin: 5px 0; }
        .footer a { color: #d4af37; text-decoration: none; }
        .social-links { margin: 20px 0; }
        .social-links a { display: inline-block; margin: 0 10px; color: #6e6e73; text-decoration: none; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="bee-icon">🐝</div>
          <h1>Bienvenue chez IWASP</h1>
          <p>Votre identité digitale premium vous attend</p>
        </div>
        
        <div class="content">
          <p class="greeting">Bonjour ${firstName || 'là'} 👋</p>
          <p class="message">
            Félicitations pour votre inscription ! Vous venez de rejoindre la nouvelle génération du networking professionnel.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${dashboardUrl}" class="cta-button">🚀 Accéder à mon Dashboard</a>
          </div>
          
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">📇</div>
              <p class="feature-title">Profil Digital</p>
              <p class="feature-desc">Créez votre carte virtuelle</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <p class="feature-title">NFC Ready</p>
              <p class="feature-desc">Un tap, une connexion</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🔗</div>
              <p class="feature-title">Liens illimités</p>
              <p class="feature-desc">Tous vos réseaux</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <p class="feature-title">Analytics</p>
              <p class="feature-desc">Suivez vos vues</p>
            </div>
          </div>
          
          <div class="divider"></div>
          
          <!-- PWA Installation Section -->
          <div class="pwa-section">
            <h3>📲 Installez l'app sur votre téléphone</h3>
            <p style="color: #8e8e93; font-size: 14px; margin-bottom: 20px;">
              IWASP fonctionne comme une vraie application. Installez-la pour un accès rapide !
            </p>
            
            <p style="color: #1d1d1f; font-weight: 600; margin-bottom: 15px;">Sur iPhone :</p>
            <div class="pwa-step">
              <span class="pwa-step-num">1</span>
              <span class="pwa-step-text">Ouvrez <strong>Safari</strong> et allez sur <a href="https://i-wasp.com" style="color: #d4af37;">i-wasp.com</a></span>
            </div>
            <div class="pwa-step">
              <span class="pwa-step-num">2</span>
              <span class="pwa-step-text">Appuyez sur <strong>Partager</strong> (l'icône ⬆️ en bas)</span>
            </div>
            <div class="pwa-step">
              <span class="pwa-step-num">3</span>
              <span class="pwa-step-text">Sélectionnez <strong>"Sur l'écran d'accueil"</strong></span>
            </div>
            
            <p style="color: #1d1d1f; font-weight: 600; margin: 25px 0 15px;">Sur Android :</p>
            <div class="pwa-step">
              <span class="pwa-step-num">1</span>
              <span class="pwa-step-text">Ouvrez <strong>Chrome</strong> et allez sur <a href="https://i-wasp.com" style="color: #d4af37;">i-wasp.com</a></span>
            </div>
            <div class="pwa-step">
              <span class="pwa-step-num">2</span>
              <span class="pwa-step-text">Appuyez sur le menu <strong>⋮</strong> en haut à droite</span>
            </div>
            <div class="pwa-step">
              <span class="pwa-step-num">3</span>
              <span class="pwa-step-text">Choisissez <strong>"Ajouter à l'écran d'accueil"</strong></span>
            </div>
          </div>
          
          <div class="divider"></div>
          
          <p class="message" style="text-align: center;">
            <strong>Prochaine étape :</strong> Personnalisez votre profil et commandez votre carte NFC physique pour impressionner à chaque rencontre ! ✨
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${dashboardUrl}" class="cta-button" style="background: #1d1d1f; color: #ffffff !important;">👉 Compléter mon profil</a>
          </div>
        </div>
        
        <div class="footer">
          <div class="social-links">
            <a href="https://instagram.com/iwasp.ma">Instagram</a>
            <a href="https://linkedin.com/company/iwasp">LinkedIn</a>
            <a href="https://wa.me/212600000000">WhatsApp</a>
          </div>
          <p>Une question ? Répondez directement à cet email.</p>
          <p><a href="https://i-wasp.com">www.i-wasp.com</a></p>
          <p style="margin-top: 15px; font-size: 11px; color: #c7c7cc;">
            © ${new Date().getFullYear()} IWASP - Tap. Connect. Empower.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Welcome email function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user, error: authError } = await verifyAuth(req);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: authError || 'Unauthorized' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log('Authenticated user:', user.id);

    const { email, firstName, lastName, dashboardUrl }: WelcomeEmailRequest = await req.json();
    
    console.log(`Sending welcome email to: ${email}`);
    
    if (!email) {
      throw new Error("Email is required");
    }

    const displayName = firstName || email.split('@')[0];
    const html = generateWelcomeHtml(displayName, dashboardUrl || 'https://i-wasp.com/dashboard');

    const emailResponse = await resend.emails.send({
      from: "IWASP <contact@i-wasp.com>",
      to: [email],
      subject: "🐝 Bienvenue chez IWASP ! Votre identité digitale vous attend",
      html,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
