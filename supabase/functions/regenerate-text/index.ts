import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { originalText, type, instruction, businessContext } = await req.json();
    
    if (!originalText || typeof originalText !== "string") {
      return new Response(
        JSON.stringify({ error: "Le texte original est requis" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Configuration manquante" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Regenerating text, type:", type, "instruction:", instruction);

    // Build the prompt based on text type
    let systemPrompt = `Tu es un copywriter expert en création de contenu pour sites web professionnels.
Tu dois réécrire le texte fourni de manière plus engageante et professionnelle.
Garde le même sens et la même longueur approximative.
Réponds UNIQUEMENT avec le nouveau texte, sans guillemets, sans explication.`;

    let userPrompt = "";

    if (type === "heading" || type === "h1" || type === "h2" || type === "h3") {
      systemPrompt = `Tu es un copywriter expert en création de titres accrocheurs pour sites web.
Réécris le titre fourni pour le rendre plus percutant et professionnel.
Le titre doit être court, impactant et mémorable.
Réponds UNIQUEMENT avec le nouveau titre, sans guillemets, sans explication.`;
    } else if (type === "button" || type === "btn") {
      systemPrompt = `Tu es un expert en UX/UI et en call-to-action.
Réécris le texte du bouton pour le rendre plus engageant et inciter à l'action.
Le texte doit rester court (2-4 mots maximum).
Réponds UNIQUEMENT avec le nouveau texte, sans guillemets, sans explication.`;
    } else if (type === "paragraph" || type === "p") {
      systemPrompt = `Tu es un copywriter expert en rédaction web.
Réécris le paragraphe fourni pour le rendre plus clair, engageant et professionnel.
Garde approximativement la même longueur.
Réponds UNIQUEMENT avec le nouveau paragraphe, sans guillemets, sans explication.`;
    }

    // Add business context if provided
    if (businessContext) {
      systemPrompt += `\n\nContexte de l'entreprise : ${businessContext}`;
    }

    // Add specific instruction if provided
    if (instruction) {
      userPrompt = `Texte original : "${originalText}"\n\nInstruction spécifique : ${instruction}`;
    } else {
      userPrompt = `Texte original : "${originalText}"`;
    }

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
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes atteinte, veuillez réessayer plus tard" }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits épuisés, veuillez recharger votre compte" }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Erreur lors de la régénération du texte" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const newText = data.choices?.[0]?.message?.content?.trim();
    
    if (!newText) {
      console.error("No text in response:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "Aucun texte généré" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean up the text (remove quotes if present)
    const cleanedText = newText.replace(/^["']|["']$/g, '');

    return new Response(
      JSON.stringify({ 
        success: true,
        text: cleanedText
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error regenerating text:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erreur inattendue" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
