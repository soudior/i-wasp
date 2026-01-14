/**
 * Edge Function: generate-website-code
 * Génère automatiquement le code HTML/CSS/JS d'un site web basé sur une proposition Web Studio
 * Utilise Lovable AI pour la génération
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

interface WebsiteProposal {
  id: string;
  form_data: {
    businessType?: string;
    businessName?: string;
    description?: string;
    style?: string;
    colors?: string;
    contactEmail?: string;
    contactPhone?: string;
    products?: string;
    websiteUrl?: string;
    socialLinks?: string;
  };
  proposal: {
    siteName?: string;
    tagline?: string;
    colorPalette?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      background?: string;
      text?: string;
    };
    typography?: {
      headingFont?: string;
      bodyFont?: string;
    };
    pages?: Array<{
      name: string;
      slug: string;
      sections: Array<{
        type: string;
        title: string;
        content?: string;
        items?: string[];
      }>;
    }>;
    features?: string[];
  };
}

function generateSystemPrompt(): string {
  return `Tu es un expert développeur web. Tu génères du code HTML/CSS/JS moderne, responsive et professionnel.

RÈGLES STRICTES:
1. Le code DOIT être complet et fonctionnel
2. Utilise UNIQUEMENT du CSS moderne (flexbox, grid, variables CSS)
3. Le design doit être responsive (mobile-first)
4. Inclus des animations subtiles pour un effet premium
5. N'utilise PAS de frameworks externes (pas de Bootstrap, Tailwind en CDN)
6. Le HTML doit être sémantique et accessible
7. Ajoute des placeholders réalistes pour les images (via picsum.photos ou placehold.co)
8. Inclus Font Awesome via CDN pour les icônes
9. Ajoute Google Fonts pour la typographie

TRÈS IMPORTANT - FORMAT DE RÉPONSE:
Tu DOIS répondre UNIQUEMENT avec un objet JSON valide, RIEN D'AUTRE.
Pas de texte avant, pas de texte après. Juste le JSON.
Pas de \`\`\`json, pas de markdown, juste le JSON brut.

{
  "html": "<!DOCTYPE html>...",
  "css": "/* CSS complet */",
  "js": "// JavaScript si nécessaire",
  "fullPage": "<!-- Version complète avec CSS et JS inline -->"
}

STRUCTURE HTML REQUISE:
- Header avec navigation sticky
- Sections pour chaque page/bloc
- Footer avec informations de contact
- Formulaire de contact fonctionnel (front-end)

STYLE REQUIS:
- Palette de couleurs cohérente
- Typographie claire et lisible
- Espacement généreux
- Boutons avec hover effects
- Cards avec ombres subtiles
- Transitions fluides (300ms)`;
}

function generateUserPrompt(proposal: WebsiteProposal): string {
  const p = proposal.proposal;
  const fd = proposal.form_data;
  
  const pages = p.pages?.map(page => {
    const sectionsDesc = page.sections.map(s => 
      `    - ${s.type}: "${s.title}" ${s.items?.length ? `(${s.items.join(", ")})` : ""}`
    ).join("\n");
    return `  ${page.name} (/${page.slug}):\n${sectionsDesc}`;
  }).join("\n\n") || "Pages à définir";

  return `Génère un site web complet pour:

📌 INFORMATIONS PRINCIPALES:
- Nom du site: ${p.siteName || fd.businessName || "Mon Site"}
- Slogan: ${p.tagline || ""}
- Type d'activité: ${fd.businessType || "Entreprise"}
- Description: ${fd.description || ""}

🎨 DESIGN:
- Style souhaité: ${fd.style || "Moderne et professionnel"}
- Couleurs: 
  - Primaire: ${p.colorPalette?.primary || "#007AFF"}
  - Secondaire: ${p.colorPalette?.secondary || "#F5F5F7"}
  - Accent: ${p.colorPalette?.accent || "#D4AF37"}
  - Background: ${p.colorPalette?.background || "#FFFFFF"}
  - Texte: ${p.colorPalette?.text || "#1D1D1F"}
- Police titres: ${p.typography?.headingFont || "Playfair Display"}
- Police corps: ${p.typography?.bodyFont || "Montserrat"}

📄 PAGES ET SECTIONS:
${pages}

✨ FONCTIONNALITÉS:
${p.features?.map(f => `- ${f}`).join("\n") || "- Site vitrine standard"}

📞 CONTACT:
- Email: ${fd.contactEmail || "contact@example.com"}
- Téléphone: ${fd.contactPhone || ""}
${fd.socialLinks ? `- Réseaux: ${fd.socialLinks}` : ""}

${fd.products ? `\n🛍️ PRODUITS/SERVICES:\n${fd.products}` : ""}

Génère le code HTML/CSS/JS complet en JSON.`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Configuration manquante");
    }

    const { proposalId } = await req.json();

    if (!proposalId) {
      return new Response(
        JSON.stringify({ error: "proposalId requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Fetch the proposal
    const { data: proposal, error: fetchError } = await admin
      .from("website_proposals")
      .select("*")
      .eq("id", proposalId)
      .single();

    if (fetchError || !proposal) {
      console.error("Proposal fetch error:", fetchError);
      return new Response(
        JSON.stringify({ error: "Proposition introuvable" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if already generating or completed
    const { data: existingWebsite } = await admin
      .from("generated_websites")
      .select("id, status")
      .eq("proposal_id", proposalId)
      .single();

    let websiteId: string;

    if (existingWebsite) {
      if (existingWebsite.status === "generating") {
        return new Response(
          JSON.stringify({ error: "Génération déjà en cours", websiteId: existingWebsite.id }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      websiteId = existingWebsite.id;
      // Update to generating status
      await admin
        .from("generated_websites")
        .update({ status: "generating", generation_log: "Démarrage de la génération...", updated_at: new Date().toISOString() })
        .eq("id", websiteId);
    } else {
      // Create new record
      const { data: newWebsite, error: insertError } = await admin
        .from("generated_websites")
        .insert({
          proposal_id: proposalId,
          status: "generating",
          generation_log: "Démarrage de la génération...",
        })
        .select("id")
        .single();

      if (insertError || !newWebsite) {
        console.error("Insert error:", insertError);
        throw new Error("Erreur lors de la création de l'enregistrement");
      }
      websiteId = newWebsite.id;
    }

    console.log(`Generating website for proposal ${proposalId}, website record: ${websiteId}`);

    // Update proposal status
    await admin
      .from("website_proposals")
      .update({ 
        status: "generating",
        updated_at: new Date().toISOString()
      })
      .eq("id", proposalId);

    // Call Lovable AI
    const systemPrompt = generateSystemPrompt();
    const userPrompt = generateUserPrompt(proposal as WebsiteProposal);

    console.log("Calling Lovable AI for website generation...");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 16000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);

      const errorMessage = aiResponse.status === 429 
        ? "Rate limit atteint. Réessayez dans quelques minutes."
        : aiResponse.status === 402
        ? "Crédits IA insuffisants."
        : `Erreur IA: ${aiResponse.status}`;

      await admin
        .from("generated_websites")
        .update({ 
          status: "failed", 
          generation_log: errorMessage,
          updated_at: new Date().toISOString()
        })
        .eq("id", websiteId);

      await admin
        .from("website_proposals")
        .update({ status: "generation_failed", updated_at: new Date().toISOString() })
        .eq("id", proposalId);

      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: aiResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await aiResponse.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Pas de réponse de l'IA");
    }

    // Parse the JSON response with robust extraction
    let generatedCode;
    try {
      // First, try direct JSON parse
      generatedCode = JSON.parse(content.trim());
    } catch (firstError) {
      console.log("Direct parse failed, trying extraction methods...");
      console.log("Raw content preview:", content.substring(0, 300));
      
      try {
        // Clean markdown code blocks if present
        let cleanedContent = content
          .replace(/```json\s*/gi, "")
          .replace(/```\s*/g, "")
          .trim();
        
        // Try to find JSON object in the response
        const jsonMatch = cleanedContent.match(/\{[\s\S]*"html"[\s\S]*"fullPage"[\s\S]*\}/);
        if (jsonMatch) {
          cleanedContent = jsonMatch[0];
        } else {
          // Try finding any JSON object with "html" key
          const simpleMatch = cleanedContent.match(/\{[\s\S]*"html"\s*:\s*"[\s\S]*\}/);
          if (simpleMatch) {
            cleanedContent = simpleMatch[0];
          }
        }
        
        generatedCode = JSON.parse(cleanedContent);
      } catch (secondError) {
        console.error("JSON extraction failed:", secondError);
        
        // Last resort: extract HTML directly from the response
        const htmlMatch = content.match(/<!DOCTYPE html>[\s\S]*<\/html>/i);
        if (htmlMatch) {
          console.log("Found raw HTML, using it directly");
          generatedCode = {
            html: htmlMatch[0],
            css: "",
            js: "",
            fullPage: htmlMatch[0]
          };
        } else {
          console.error("No valid HTML found in response");
          await admin
            .from("generated_websites")
            .update({ 
              status: "failed", 
              generation_log: "Erreur de parsing de la réponse IA - format invalide",
              updated_at: new Date().toISOString()
            })
            .eq("id", websiteId);

          throw new Error("Erreur lors de l'analyse du code généré");
        }
      }
    }

    // Save the generated code
    const nowIso = new Date().toISOString();
    
    // Generate a unique slug for hosting
    const businessName = proposal.form_data?.businessName || proposal.proposal?.siteName || `site-${Date.now()}`;
    const { data: slugData } = await admin.rpc("generate_website_slug", { 
      p_business_name: businessName 
    });
    const websiteSlug = slugData || `site-${websiteId.substring(0, 8)}`;
    
    // Build the public preview URL
    const previewUrl = `${SUPABASE_URL}/functions/v1/serve-website?slug=${websiteSlug}`;
    
    await admin
      .from("generated_websites")
      .update({
        status: "completed",
        slug: websiteSlug,
        html_content: generatedCode.html || "",
        css_content: generatedCode.css || "",
        js_content: generatedCode.js || "",
        full_page_html: generatedCode.fullPage || generatedCode.html || "",
        preview_url: previewUrl,
        generation_log: "Génération terminée avec succès",
        generated_at: nowIso,
        updated_at: nowIso,
      })
      .eq("id", websiteId);

    // Update proposal status
    await admin
      .from("website_proposals")
      .update({ 
        status: "site_generated",
        updated_at: nowIso
      })
      .eq("id", proposalId);

    console.log(`Website generated successfully for proposal ${proposalId}, hosted at: ${previewUrl}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        websiteId,
        message: "Site web généré avec succès"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("generate-website-code error:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
