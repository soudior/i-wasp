import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: string;
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - valid authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Authenticated user:', user.id);

    const { logoUrl, style } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Generating palette for logo:', logoUrl, 'style:', style);

    // Build the prompt for color palette generation
    const systemPrompt = `Tu es un expert en design graphique et en théorie des couleurs. 
Tu génères des palettes de couleurs premium et harmonieuses pour des cartes de visite NFC haut de gamme.

RÈGLES STRICTES:
- Génère EXACTEMENT 3 variations de palettes différentes
- Chaque palette doit avoir: backgroundColor (fond), accentColor (texte/éléments)
- Les couleurs doivent être en format hexadécimal (#RRGGBB)
- Le contraste entre fond et accent doit être excellent (ratio > 4.5:1)
- Style premium, élégant, minimal

Réponds UNIQUEMENT en JSON valide, sans markdown, sans explication:
{
  "palettes": [
    {"name": "Nom court", "backgroundColor": "#XXXXXX", "accentColor": "#XXXXXX"},
    {"name": "Nom court", "backgroundColor": "#XXXXXX", "accentColor": "#XXXXXX"},
    {"name": "Nom court", "backgroundColor": "#XXXXXX", "accentColor": "#XXXXXX"}
  ]
}`;

    const userPrompt = logoUrl 
      ? `Analyse ce logo et génère 3 palettes de couleurs harmonieuses qui s'accordent avec ses couleurs. Style demandé: ${style || 'premium élégant'}.`
      : `Génère 3 palettes de couleurs premium pour une carte de visite NFC haut de gamme. Style: ${style || 'premium élégant minimal'}.`;

    const messages: Message[] = [
      { role: "system", content: systemPrompt }
    ];

    // If we have a logo URL, add it as an image for vision analysis
    if (logoUrl && logoUrl.startsWith('http')) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: userPrompt },
          { type: "image_url", image_url: { url: logoUrl } }
        ]
      });
    } else {
      messages.push({ role: "user", content: userPrompt });
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log('AI response:', content);

    if (!content) {
      throw new Error('No content in AI response');
    }

    // Parse the JSON response
    let palettes;
    try {
      // Clean up potential markdown formatting
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      palettes = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      // Return fallback palettes
      palettes = {
        palettes: [
          { name: "Noir Élégant", backgroundColor: "#0B0B0C", accentColor: "#F4F2EF" },
          { name: "Ivoire Premium", backgroundColor: "#F4F2EF", accentColor: "#0B0B0C" },
          { name: "Marine Doré", backgroundColor: "#1a1f3c", accentColor: "#c9a962" }
        ]
      };
    }

    console.log('Generated palettes:', palettes);

    return new Response(
      JSON.stringify(palettes),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    console.error('Error in generate-palette:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        // Fallback palettes
        palettes: [
          { name: "Noir Élégant", backgroundColor: "#0B0B0C", accentColor: "#F4F2EF" },
          { name: "Ivoire Premium", backgroundColor: "#F4F2EF", accentColor: "#0B0B0C" },
          { name: "Gris Profond", backgroundColor: "#1C1C1E", accentColor: "#F4F2EF" }
        ]
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
