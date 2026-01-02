/**
 * IWASP AI Template Generator
 * Generates card template structure based on user description
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TemplateRequest {
  type: "hotel" | "business" | "tourism";
  description: string;
  language?: string;
}

// Authentication helper
async function verifyAuth(req: Request): Promise<{ user: any; error?: string }> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return { user: null, error: 'Authorization header required' };
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
  if (authError || !user) {
    return { user: null, error: 'Unauthorized - valid authentication required' };
  }

  return { user };
}

const SYSTEM_PROMPTS = {
  hotel: `Tu es un expert en conception de cartes NFC pour hôtels de luxe. 
Génère une structure de carte NFC complète pour un établissement hôtelier basée sur la description fournie.
Retourne UNIQUEMENT un objet JSON valide avec la structure suivante:
{
  "hotelName": "Nom de l'hôtel",
  "hotelCategory": "5★ Hotel | 4★ Hotel | Riad | Boutique Hotel",
  "hotelTagline": "Slogan court et élégant",
  "conciergeName": "Prénom du concierge",
  "conciergeRole": "Chef Concierge | Réceptionniste | Manager",
  "receptionPhone": "+XXX X XX XX XX XX",
  "wifiSsid": "NomDuReseau",
  "wifiPassword": "MotDePasse",
  "address": "Adresse complète",
  "dailyOffer": {
    "title": "Titre de l'offre",
    "description": "Description courte",
    "validUntil": "Date"
  },
  "placesToVisit": [
    { "name": "Lieu 1", "distance": "X min" },
    { "name": "Lieu 2", "distance": "X min" }
  ],
  "language": "fr"
}
Ne génère PAS de texte explicatif, UNIQUEMENT le JSON.`,

  business: `Tu es un expert en conception de cartes de visite NFC professionnelles.
Génère une structure de carte NFC complète pour un professionnel basée sur la description fournie.
Retourne UNIQUEMENT un objet JSON valide avec la structure suivante:
{
  "firstName": "Prénom",
  "lastName": "Nom",
  "title": "Titre professionnel",
  "company": "Nom de l'entreprise",
  "tagline": "Slogan ou spécialité",
  "phone": "+XXX X XX XX XX XX",
  "email": "email@exemple.com",
  "website": "https://...",
  "location": "Ville, Pays",
  "linkedin": "URL LinkedIn",
  "actions": [
    { "type": "call", "label": "Appeler", "value": "téléphone" },
    { "type": "email", "label": "Email", "value": "email" },
    { "type": "website", "label": "Site web", "value": "url" }
  ],
  "template": "signature"
}
Ne génère PAS de texte explicatif, UNIQUEMENT le JSON.`,

  tourism: `Tu es un expert en conception de cartes NFC pour guides touristiques et agences.
Génère une structure de carte NFC complète pour une activité touristique basée sur la description fournie.
Retourne UNIQUEMENT un objet JSON valide avec la structure suivante:
{
  "businessName": "Nom de l'activité",
  "category": "Guide | Agence | Tours | Excursions",
  "tagline": "Slogan accrocheur",
  "guideName": "Nom du guide principal",
  "phone": "+XXX X XX XX XX XX",
  "whatsapp": "+XXX X XX XX XX XX",
  "email": "email@exemple.com",
  "website": "https://...",
  "location": "Ville, Région",
  "tours": [
    { "name": "Nom du tour", "duration": "Durée", "price": "Prix" }
  ],
  "languages": ["Français", "Anglais", "Arabe"],
  "googleReviewsUrl": "URL",
  "tripAdvisorUrl": "URL"
}
Ne génère PAS de texte explicatif, UNIQUEMENT le JSON.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(req);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: authError || 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('Authenticated user:', user.id);

    const { type, description, language = "fr" } = await req.json() as TemplateRequest;

    if (!type || !description) {
      return new Response(
        JSON.stringify({ error: "Type et description requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = SYSTEM_PROMPTS[type];
    if (!systemPrompt) {
      return new Response(
        JSON.stringify({ error: "Type de template invalide" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Génère une carte NFC pour: ${description}\nLangue: ${language}` 
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes atteinte. Réessayez dans quelques instants." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty AI response");
    }

    // Parse the JSON from the response
    let templateData;
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        templateData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Content:", content);
      throw new Error("Failed to parse AI response as JSON");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        type, 
        template: templateData 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Template generation error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Erreur de génération" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
