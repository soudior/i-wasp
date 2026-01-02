import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UserProfile {
  firstName: string;
  lastName: string;
  title?: string;
  company?: string;
  location?: string;
  email?: string;
  phone?: string;
}

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

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user, error: authError } = await verifyAuth(req);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: authError || 'Unauthorized', code: 'UNAUTHORIZED' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Authenticated user:', user.id);

    const { profile, language = 'fr' } = await req.json() as { profile: UserProfile; language?: string };

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build context from user profile
    const profileContext = `
Profil utilisateur:
- Nom: ${profile.firstName} ${profile.lastName}
- Titre: ${profile.title || 'Non spécifié'}
- Entreprise: ${profile.company || 'Non spécifiée'}
- Localisation: ${profile.location || 'Non spécifiée'}
- Email: ${profile.email || 'Non fourni'}
- Téléphone: ${profile.phone || 'Non fourni'}
`;

    const systemPrompt = `Tu es un assistant expert en marketing digital et cartes de visite NFC pour IWASP, une entreprise premium.

Analyse le profil fourni et génère des suggestions intelligentes de modules à ajouter sur la carte NFC.

Pour chaque suggestion, fournis:
1. Un ID unique (snake_case)
2. Un titre court
3. Une icône (parmi: MapPin, Star, MessageCircle, Instagram, Globe, Phone, Mail, FileUser, Calendar, Wifi)
4. Une courte explication de pourquoi c'est recommandé (max 15 mots)
5. Une priorité (high, medium, low)
6. Le type de module (google_reviews, geolocation, address, whatsapp, instagram, website, vcard, wifi, booking)

Réponds UNIQUEMENT en JSON valide avec cette structure exacte:
{
  "businessType": "hotel|restaurant|commerce|freelance|corporate|tourism|other",
  "country": "code ISO 2 lettres détecté ou 'unknown'",
  "suggestions": [
    {
      "id": "suggestion_id",
      "title": "Titre court",
      "icon": "NomIcone",
      "reason": "Courte explication...",
      "priority": "high|medium|low",
      "type": "type_module",
      "defaultValue": null
    }
  ]
}

Génère entre 4 et 7 suggestions pertinentes, triées par priorité.
Pour un hôtel/restaurant: priorise avis Google, localisation, WhatsApp
Pour un freelance: priorise vCard, Instagram, site web
Pour une entreprise: priorise LinkedIn, site web, adresse`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: profileContext }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.',
          code: 'RATE_LIMITED'
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ 
          error: 'AI credits exhausted. Please add credits.',
          code: 'PAYMENT_REQUIRED'
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    // Parse JSON from response (handle markdown code blocks)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    const suggestions = JSON.parse(jsonStr.trim());

    return new Response(JSON.stringify(suggestions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Smart suggestions error:', error);
    const isUnauthorized = error instanceof Error && /unauthorized|auth/i.test(error.message);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      code: isUnauthorized ? 'UNAUTHORIZED' : 'INTERNAL_ERROR'
    }), {
      status: isUnauthorized ? 401 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
