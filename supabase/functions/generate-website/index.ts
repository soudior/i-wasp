/**
 * Edge Function: generate-website
 * Génère une proposition de site web via Lovable AI
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

interface FormData {
  businessType: string;
  businessName?: string;
  description?: string;
  style?: string;
  colors?: string;
  websiteUrl?: string;
  socialLinks?: string;
  products?: string; // liste libre: produits/services principaux
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: FormData = await req.json();

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Tu es un expert en conception de sites web. Tu génères des propositions de sites web professionnelles et détaillées en JSON.

Réponds UNIQUEMENT avec un objet JSON valide (sans markdown, sans backticks) contenant:
{
  "siteName": "Nom du site suggéré",
  "tagline": "Slogan accrocheur",
  "colorPalette": {
    "primary": "#couleur",
    "secondary": "#couleur",
    "accent": "#couleur",
    "background": "#couleur",
    "text": "#couleur"
  },
  "typography": {
    "headingFont": "Police pour les titres",
    "bodyFont": "Police pour le corps"
  },
  "pages": [
    {
      "name": "Nom de la page",
      "slug": "slug-url",
      "sections": [
        {
          "type": "hero|features|about|services|gallery|testimonials|contact|cta|pricing|team|faq|products",
          "title": "Titre de la section",
          "content": "Description courte",
          "items": ["élément 1", "élément 2"]
        }
      ]
    }
  ],
  "features": ["Fonctionnalité 1", "Fonctionnalité 2"],
  "estimatedPages": nombre,
  "complexity": "simple|standard|premium"
}

Règles:
- Génère 4-8 pages pertinentes
- Inclus au minimum: Accueil, À propos, Services/Produits, Contact
- Choisis des couleurs harmonieuses et professionnelles
- La complexité dépend du nombre de pages et fonctionnalités
- Adapte le design au secteur d'activité
- Si une liste de produits/services est fournie, ajoute une page ou section "Produits" ou "Services" et remplis "items" avec des éléments concrets (noms courts) basés sur la liste.`;

    const userPrompt = `Génère une proposition de site web pour:

Type d'entreprise: ${formData.businessType}
${formData.businessName ? `Nom: ${formData.businessName}` : ""}
${formData.description ? `Description: ${formData.description}` : ""}
${formData.style ? `Style souhaité: ${formData.style}` : ""}
${formData.colors ? `Couleurs préférées: ${formData.colors}` : ""}
${formData.products ? `Produits/Services (liste): ${formData.products}` : ""}
${formData.websiteUrl ? `Site existant à analyser: ${formData.websiteUrl}` : ""}
${formData.socialLinks ? `Réseaux sociaux: ${formData.socialLinks}` : ""}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Trop de requêtes. Veuillez réessayer dans quelques secondes." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits IA épuisés. Veuillez contacter le support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Pas de réponse de l'IA");
    }

    // Parse le JSON de la réponse
    let proposal;
    try {
      // Nettoie la réponse (enlève les backticks markdown si présents)
      const cleanedContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      proposal = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Content:", content);
      throw new Error("Erreur lors de l'analyse de la proposition");
    }

    return new Response(
      JSON.stringify({ proposal }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("generate-website error:", error);
    const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
