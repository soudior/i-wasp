import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CardData {
  id: string;
  firstName: string;
  lastName: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  location?: string;
  slug: string;
  photoUrl?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const passKitApiKey = Deno.env.get('PASSKIT_API_KEY');
    const passKitApiSecret = Deno.env.get('PASSKIT_API_SECRET');

    if (!passKitApiKey || !passKitApiSecret) {
      console.error('PassKit credentials not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Service non configuré',
          message: 'Les clés PassKit ne sont pas configurées. Veuillez contacter l\'administrateur.',
          fallback: true
        }),
        { 
          status: 503, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { cardData } = await req.json() as { cardData: CardData };
    console.log('Generating Apple Wallet pass for:', cardData.firstName, cardData.lastName);

    // Construct the public URL for the card
    const publicUrl = `https://fyxiyevbbvidckzaequx.lovableproject.com/c/${cardData.slug}`;

    // PassKit.io API call to create a pass
    // Using their Generic Pass template
    const passKitPayload = {
      // Pass template identifier from PassKit.io
      templateId: "iwasp-business-card",
      // Dynamic pass data
      passData: {
        // Unique identifier for this pass
        serialNumber: cardData.id,
        // Pass content
        headerFields: [
          {
            key: "company",
            value: cardData.company || "IWASP",
            label: "Entreprise"
          }
        ],
        primaryFields: [
          {
            key: "name",
            value: `${cardData.firstName} ${cardData.lastName}`,
            label: "Nom"
          }
        ],
        secondaryFields: [
          {
            key: "title",
            value: cardData.title || "",
            label: "Fonction"
          }
        ],
        auxiliaryFields: [
          {
            key: "phone",
            value: cardData.phone || "",
            label: "Téléphone"
          },
          {
            key: "email", 
            value: cardData.email || "",
            label: "Email"
          }
        ],
        backFields: [
          {
            key: "website",
            value: cardData.website || "",
            label: "Site web"
          },
          {
            key: "location",
            value: cardData.location || "",
            label: "Adresse"
          },
          {
            key: "digitalCard",
            value: publicUrl,
            label: "Carte numérique"
          }
        ],
        // QR code that links to the digital card
        barcode: {
          format: "PKBarcodeFormatQR",
          message: publicUrl,
          messageEncoding: "iso-8859-1",
          altText: cardData.slug
        }
      },
      // User push token for updates (optional)
      pushToken: null,
      // Expiration date (optional, set to 1 year from now)
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    };

    // Call PassKit.io API
    const authHeader = btoa(`${passKitApiKey}:${passKitApiSecret}`);
    
    const passKitResponse = await fetch('https://api.passkit.io/v1/passes', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(passKitPayload)
    });

    if (!passKitResponse.ok) {
      const errorText = await passKitResponse.text();
      console.error('PassKit API error:', passKitResponse.status, errorText);
      
      // Return a fallback response with instructions
      return new Response(
        JSON.stringify({
          error: 'Erreur PassKit',
          message: 'Impossible de générer le pass Apple Wallet. Le service est temporairement indisponible.',
          fallback: true,
          status: passKitResponse.status
        }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const passKitData = await passKitResponse.json();
    console.log('PassKit response:', JSON.stringify(passKitData));

    // PassKit returns a URL to download the .pkpass file
    // or the pass data directly depending on the endpoint used
    if (passKitData.url || passKitData.passUrl || passKitData.downloadUrl) {
      const passUrl = passKitData.url || passKitData.passUrl || passKitData.downloadUrl;
      
      return new Response(
        JSON.stringify({
          success: true,
          passUrl: passUrl,
          message: 'Pass Apple Wallet généré avec succès'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // If PassKit returns the .pkpass binary directly
    if (passKitData.pass) {
      return new Response(
        JSON.stringify({
          success: true,
          passData: passKitData.pass,
          contentType: 'application/vnd.apple.pkpass',
          message: 'Pass Apple Wallet généré avec succès'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Return whatever PassKit gave us
    return new Response(
      JSON.stringify({
        success: true,
        data: passKitData,
        message: 'Pass Apple Wallet généré avec succès'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: unknown) {
    console.error('Error generating Apple Wallet pass:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return new Response(
      JSON.stringify({ 
        error: 'Erreur serveur',
        message: errorMessage,
        fallback: true
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
