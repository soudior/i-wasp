/**
 * IWASP Adaptive Templates Engine - Edge Function
 * 
 * Deterministic business template generation:
 * - Sector-specific modules (hotel, restaurant, boutique, etc.)
 * - No manual configuration
 * - System deduces, system generates
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type BusinessSector = 
  | "hotel"
  | "restaurant" 
  | "boutique"
  | "immobilier"
  | "evenement"
  | "tourisme"
  | "business";

interface TemplateRequest {
  sector: BusinessSector;
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

// Sector-specific prompts - deterministic output
const SECTOR_PROMPTS: Record<BusinessSector, string> = {
  hotel: `Tu génères une carte NFC pour un établissement hôtelier.
Retourne UNIQUEMENT un JSON avec:
{
  "name": "Nom de l'hôtel",
  "category": "5★ | 4★ | Riad | Boutique",
  "tagline": "Slogan court",
  "reception": { "phone": "+XXX", "name": "Nom concierge" },
  "wifi": { "ssid": "NomReseau", "password": "MotDePasse", "security": "WPA2" },
  "address": "Adresse complète",
  "services": ["Service 1", "Service 2"],
  "dailyOffer": { "title": "Offre", "description": "Description" },
  "places": [{ "name": "Lieu", "distance": "X min" }]
}`,

  restaurant: `Tu génères une carte NFC pour un restaurant.
Retourne UNIQUEMENT un JSON avec:
{
  "name": "Nom du restaurant",
  "cuisine": "Type de cuisine",
  "tagline": "Slogan",
  "phone": "+XXX",
  "menuUrl": "https://menu.example.com",
  "reservationUrl": "https://reservation.example.com",
  "wifi": { "ssid": "NomReseau", "password": "MotDePasse", "security": "WPA2" },
  "address": "Adresse complète",
  "hours": "Horaires",
  "specialties": ["Spécialité 1", "Spécialité 2"]
}`,

  boutique: `Tu génères une carte NFC pour une boutique.
Retourne UNIQUEMENT un JSON avec:
{
  "name": "Nom de la boutique",
  "category": "Type de boutique",
  "tagline": "Slogan",
  "phone": "+XXX",
  "email": "email@example.com",
  "catalogUrl": "https://catalogue.example.com",
  "address": "Adresse complète",
  "hours": "Horaires",
  "promotions": [{ "title": "Promo", "description": "Description", "validUntil": "Date" }]
}`,

  immobilier: `Tu génères une carte NFC pour un agent immobilier.
Retourne UNIQUEMENT un JSON avec:
{
  "agentName": "Nom de l'agent",
  "agency": "Nom de l'agence",
  "title": "Titre professionnel",
  "phone": "+XXX",
  "email": "email@example.com",
  "website": "https://example.com",
  "specialties": ["Luxe", "Commercial"],
  "currentListings": [{ "type": "Type", "location": "Lieu", "price": "Prix" }],
  "virtualTourUrl": "https://tour.example.com"
}`,

  evenement: `Tu génères une carte NFC pour un événement.
Retourne UNIQUEMENT un JSON avec:
{
  "eventName": "Nom de l'événement",
  "date": "Date",
  "venue": "Lieu",
  "tagline": "Slogan",
  "programUrl": "https://programme.example.com",
  "mapUrl": "https://plan.example.com",
  "wifi": { "ssid": "NomReseau", "password": "MotDePasse", "security": "WPA2" },
  "contacts": [{ "name": "Contact", "role": "Rôle", "phone": "+XXX" }],
  "networkingUrl": "https://networking.example.com"
}`,

  tourisme: `Tu génères une carte NFC pour un guide ou agence touristique.
Retourne UNIQUEMENT un JSON avec:
{
  "name": "Nom de l'activité",
  "guideName": "Nom du guide",
  "tagline": "Slogan",
  "phone": "+XXX",
  "whatsapp": "+XXX",
  "email": "email@example.com",
  "website": "https://example.com",
  "location": "Ville, Région",
  "languages": ["Français", "Anglais"],
  "tours": [{ "name": "Tour", "duration": "Durée", "price": "Prix" }],
  "reviewsUrl": "https://reviews.example.com"
}`,

  business: `Tu génères une carte NFC professionnelle.
Retourne UNIQUEMENT un JSON avec:
{
  "firstName": "Prénom",
  "lastName": "Nom",
  "title": "Titre",
  "company": "Entreprise",
  "tagline": "Spécialité",
  "phone": "+XXX",
  "email": "email@example.com",
  "website": "https://example.com",
  "linkedin": "https://linkedin.com/in/xxx",
  "location": "Ville, Pays"
}`,
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

    const { sector, description, language = "fr" } = await req.json() as TemplateRequest;

    if (!sector || !description) {
      return new Response(
        JSON.stringify({ error: "Secteur et description requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = SECTOR_PROMPTS[sector];
    if (!systemPrompt) {
      return new Response(
        JSON.stringify({ error: "Secteur invalide" }),
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
          { 
            role: "system", 
            content: `${systemPrompt}\nNe génère AUCUN texte explicatif, UNIQUEMENT le JSON valide.` 
          },
          { 
            role: "user", 
            content: `Génère pour: ${description}\nLangue: ${language}` 
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes atteinte" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits insuffisants" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

    // Parse JSON from response
    let templateData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        templateData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Content:", content);
      throw new Error("Failed to parse AI response");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        sector, 
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
