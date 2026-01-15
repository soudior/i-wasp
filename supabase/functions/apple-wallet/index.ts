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
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  tagline?: string;
}

interface WalletStyles {
  backgroundColor?: string;
  labelColor?: string;
  foregroundColor?: string;
  showTitle?: boolean;
  showCompany?: boolean;
  showPhone?: boolean;
  showEmail?: boolean;
  showWebsite?: boolean;
  showLocation?: boolean;
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
          message: 'Les clés PassKit ne sont pas configurées.',
          fallback: true
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { cardData, walletStyles } = await req.json() as { 
      cardData: CardData; 
      walletStyles?: WalletStyles;
    };
    
    const styles = walletStyles || {};
    console.log('Generating Apple Wallet pass for:', cardData.firstName, cardData.lastName);
    console.log('Using wallet styles:', styles);

    // Construct the public URL for the card
    const publicUrl = `https://i-wasp.lovable.app/c/${cardData.slug}`;

    // Build secondary fields based on visibility settings
    const secondaryFields: Array<{ key: string; value: string; label: string }> = [];
    
    if (styles.showTitle !== false && cardData.title) {
      secondaryFields.push({
        key: "title",
        value: cardData.title,
        label: "Fonction"
      });
    }

    // Build auxiliary fields based on visibility settings
    const auxiliaryFields: Array<{ key: string; value: string; label: string }> = [];
    
    if (styles.showPhone !== false && cardData.phone) {
      auxiliaryFields.push({
        key: "phone",
        value: cardData.phone,
        label: "Téléphone"
      });
    }
    
    if (styles.showEmail !== false && cardData.email) {
      auxiliaryFields.push({
        key: "email",
        value: cardData.email,
        label: "Email"
      });
    }

    // Build back fields based on visibility settings
    const backFields: Array<{ key: string; value: string; label: string }> = [];
    
    if (styles.showWebsite !== false && cardData.website) {
      backFields.push({
        key: "website",
        value: cardData.website,
        label: "Site web"
      });
    }
    
    if (styles.showLocation !== false && cardData.location) {
      backFields.push({
        key: "location",
        value: cardData.location,
        label: "Adresse"
      });
    }

    // Always add digital card link
    backFields.push({
      key: "digitalCard",
      value: publicUrl,
      label: "Carte numérique"
    });

    // Add social links to back fields
    if (cardData.linkedin) {
      backFields.push({
        key: "linkedin",
        value: cardData.linkedin,
        label: "LinkedIn"
      });
    }

    if (cardData.instagram) {
      backFields.push({
        key: "instagram",
        value: `@${cardData.instagram.replace('@', '')}`,
        label: "Instagram"
      });
    }

    if (cardData.twitter) {
      backFields.push({
        key: "twitter",
        value: `@${cardData.twitter.replace('@', '')}`,
        label: "X (Twitter)"
      });
    }

    if (cardData.tagline) {
      backFields.push({
        key: "tagline",
        value: cardData.tagline,
        label: "À propos"
      });
    }

    // PassKit.io API - Using /members/member endpoint for generic passes
    // The programId should match the template ID from PassKit.io dashboard
    const passKitPayload = {
      programId: "i-wasp-vcard", // Program/Template ID in PassKit.io dashboard
      externalId: cardData.id || cardData.slug, // Unique identifier for the pass
      person: {
        forename: cardData.firstName,
        surname: cardData.lastName,
        emailAddress: cardData.email || "",
        mobileNumber: cardData.phone || ""
      },
      // Custom fields for the pass template
      metaData: {
        jobTitle: cardData.title || "",
        company: (styles.showCompany !== false && cardData.company) ? cardData.company : "IWASP",
        website: cardData.website || "",
        location: cardData.location || "",
        linkedin: cardData.linkedin || "",
        instagram: cardData.instagram || "",
        twitter: cardData.twitter || "",
        tagline: cardData.tagline || "",
        digitalCardUrl: publicUrl
      }
    };

    console.log('PassKit payload:', JSON.stringify(passKitPayload, null, 2));

    // Create Basic Auth token: Base64(apiKey:apiSecret)
    const basicAuthToken = btoa(`${passKitApiKey}:${passKitApiSecret}`);
    console.log('Using Basic Auth for PassKit API');

    // Call PassKit.io API - /members/member endpoint for generic passes
    // Using Basic Auth as per PassKit REST API documentation
    const passKitResponse = await fetch('https://api.pub1.passkit.io/members/member', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuthToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(passKitPayload)
    });

    const responseText = await passKitResponse.text();
    console.log('PassKit response status:', passKitResponse.status);
    console.log('PassKit response:', responseText);

    if (!passKitResponse.ok) {
      console.error('PassKit API error:', passKitResponse.status, responseText);
      
      return new Response(
        JSON.stringify({
          error: 'Erreur PassKit',
          message: 'Impossible de générer le pass Apple Wallet.',
          fallback: true,
          details: { status: passKitResponse.status, error: responseText }
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    let passKitData;
    try {
      passKitData = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse PassKit response as JSON');
      return new Response(
        JSON.stringify({
          error: 'Erreur de parsing',
          message: 'Réponse invalide de PassKit.',
          fallback: true
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Extract pass URL from response
    const passUrl = passKitData.url || 
                    passKitData.passUrl || 
                    passKitData.downloadUrl || 
                    passKitData.pass?.url ||
                    passKitData.data?.url;

    if (passUrl) {
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

    // If we got a pass ID but no URL, construct it
    if (passKitData.id || passKitData.passId) {
      const passId = passKitData.id || passKitData.passId;
      const constructedUrl = `https://pub1.pskt.io/${passId}`;
      
      return new Response(
        JSON.stringify({
          success: true,
          passUrl: constructedUrl,
          message: 'Pass Apple Wallet généré avec succès'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Return the raw data if we can't extract a URL
    return new Response(
      JSON.stringify({
        success: true,
        data: passKitData,
        message: 'Pass généré - vérifiez la réponse pour le lien'
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
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
