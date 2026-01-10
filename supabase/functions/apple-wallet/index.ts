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
    const publicUrl = `https://i-wasp.com/c/${cardData.slug}`;

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

    // PassKit.io API call to create a pass
    const passKitPayload = {
      templateId: "iwasp-business-card",
      passData: {
        serialNumber: cardData.id,
        // Apply custom colors if provided
        backgroundColor: styles.backgroundColor || "#1a1a1a",
        labelColor: styles.labelColor || "#ffffff",
        foregroundColor: styles.foregroundColor || "#ffffff",
        headerFields: [
          {
            key: "company",
            value: (styles.showCompany !== false && cardData.company) ? cardData.company : "IWASP",
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
        secondaryFields,
        auxiliaryFields,
        backFields,
        barcode: {
          format: "PKBarcodeFormatQR",
          message: publicUrl,
          messageEncoding: "iso-8859-1",
          altText: cardData.slug
        }
      },
      pushToken: null,
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    };

    console.log('PassKit payload:', JSON.stringify(passKitPayload, null, 2));

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
      
      return new Response(
        JSON.stringify({
          error: 'Erreur PassKit',
          message: 'Impossible de générer le pass Apple Wallet.',
          fallback: true,
          status: passKitResponse.status
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const passKitData = await passKitResponse.json();
    console.log('PassKit response:', JSON.stringify(passKitData));

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
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
