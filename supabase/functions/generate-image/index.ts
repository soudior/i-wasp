import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { AI_GATEWAY_API_KEY, AI_GATEWAY_URL } from "../_shared/aiGateway.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, aspectRatio = "16:9" } = await req.json();
    
    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "Un prompt est requis" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!AI_GATEWAY_API_KEY || !AI_GATEWAY_URL) {
      console.error("AI_GATEWAY_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Configuration manquante" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Generating image with prompt:", prompt);

    // Passerelle IA configurée (AI_GATEWAY_URL), modèle de génération d'image
    const response = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_GATEWAY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: `Generate a professional, high-quality image for a business website. The image should be:
- Aspect ratio: ${aspectRatio}
- Style: Professional, modern, suitable for commercial use
- Clean and visually appealing

Description: ${prompt}

Make the image photorealistic and suitable for a professional website.`
          }
        ],
        modalities: ["image", "text"]
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
        JSON.stringify({ error: "Erreur lors de la génération de l'image" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log("AI response received");

    // Extract the generated image
    const imageData = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageData) {
      console.error("No image in response:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "Aucune image générée" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        image: imageData,
        message: data.choices?.[0]?.message?.content || "Image générée avec succès"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error generating image:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erreur inattendue" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
