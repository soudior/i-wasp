/**
 * Edge Function: webstudio-chat
 * Assistant IA conversationnel pour la création de sites web
 * Guide l'utilisateur étape par étape de façon naturelle
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ConversationState {
  step: "greeting" | "business_type" | "business_name" | "description" | "services" | "style" | "contact" | "summary" | "generating";
  collectedData: {
    businessType?: string;
    businessName?: string;
    description?: string;
    products?: string;
    services?: string;
    style?: string;
    colors?: string;
    contactEmail?: string;
    contactName?: string;
    contactPhone?: string;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversationState } = await req.json();

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Tu es un assistant IA amical et professionnel qui aide les utilisateurs à créer leur site web. Tu travailles pour une agence web premium.

PERSONNALITÉ:
- Chaleureux, professionnel et encourageant
- Pose UNE question à la fois, jamais plus
- Utilise des emojis avec parcimonie (1-2 par message max)
- Réponds de façon concise (2-4 phrases max)
- Valorise chaque réponse de l'utilisateur

PROCESSUS DE COLLECTE (dans l'ordre):
1. Salutation + demander le TYPE D'ACTIVITÉ
2. Demander le NOM DE L'ENTREPRISE
3. Demander une BRÈVE DESCRIPTION de l'activité
4. Demander les PRODUITS/SERVICES principaux
5. Demander le STYLE SOUHAITÉ (moderne, élégant, coloré, etc.)
6. Demander l'EMAIL DE CONTACT (+ nom et téléphone optionnels)
7. RÉCAPITULATIF et confirmation

ÉTAT ACTUEL DE LA CONVERSATION:
${JSON.stringify(conversationState, null, 2)}

RÈGLES CRITIQUES:
- Quand tu as assez d'infos pour passer à l'étape suivante, indique le dans ta réponse avec [NEXT_STEP:nom_étape]
- Quand tu extrais une donnée, indique-la avec [DATA:champ=valeur]
- À l'étape summary, génère un récapitulatif formaté et demande confirmation
- Si l'utilisateur confirme le récapitulatif, réponds avec [READY_TO_GENERATE]
- Ne mentionne JAMAIS "Lovable", "AI", "intelligence artificielle" - tu es juste "l'assistant"

FORMAT DES RÉPONSES:
Réponds naturellement, puis ajoute les métadonnées à la fin entre crochets si nécessaire.

Exemples:
"Super ! [DATA:businessType=Restaurant] Et comment s'appelle votre restaurant ? [NEXT_STEP:business_name]"
"Parfait, je note tout ça ! [DATA:contactEmail=test@email.com] [READY_TO_GENERATE]"`;

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
          ...messages,
        ],
        max_tokens: 500,
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
          JSON.stringify({ error: "Service temporairement indisponible. Veuillez réessayer plus tard." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse metadata from response
    const dataMatches = content.matchAll(/\[DATA:(\w+)=([^\]]+)\]/g);
    const extractedData: Record<string, string> = {};
    for (const match of dataMatches) {
      extractedData[match[1]] = match[2];
    }

    const nextStepMatch = content.match(/\[NEXT_STEP:(\w+)\]/);
    const nextStep = nextStepMatch ? nextStepMatch[1] : null;

    const isReadyToGenerate = content.includes("[READY_TO_GENERATE]");

    // Clean the response (remove metadata)
    const cleanedContent = content
      .replace(/\[DATA:\w+=[^\]]+\]/g, "")
      .replace(/\[NEXT_STEP:\w+\]/g, "")
      .replace(/\[READY_TO_GENERATE\]/g, "")
      .trim();

    return new Response(
      JSON.stringify({
        message: cleanedContent,
        extractedData,
        nextStep,
        isReadyToGenerate,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("webstudio-chat error:", error);
    const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
