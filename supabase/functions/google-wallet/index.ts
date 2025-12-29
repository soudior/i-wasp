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

// Base64URL encode for JWT
function base64urlEncode(data: Uint8Array | string): string {
  const base64 = typeof data === 'string' 
    ? btoa(data)
    : btoa(String.fromCharCode(...data));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Create JWT for Google Wallet
async function createGoogleWalletJWT(
  serviceAccountJson: string,
  payload: object
): Promise<string> {
  const serviceAccount = JSON.parse(serviceAccountJson);
  
  const header = {
    alg: 'RS256',
    typ: 'JWT',
    kid: serviceAccount.private_key_id
  };

  const now = Math.floor(Date.now() / 1000);
  const claims = {
    iss: serviceAccount.client_email,
    aud: 'google',
    origins: ['https://fyxiyevbbvidckzaequx.lovableproject.com'],
    typ: 'savetowallet',
    iat: now,
    payload: payload
  };

  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedClaims = base64urlEncode(JSON.stringify(claims));
  const signatureInput = `${encodedHeader}.${encodedClaims}`;

  // Import the private key for signing
  const privateKeyPem = serviceAccount.private_key;
  const pemContents = privateKeyPem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');
  
  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
  
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signatureInput)
  );

  const encodedSignature = base64urlEncode(new Uint8Array(signature));
  return `${signatureInput}.${encodedSignature}`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const serviceAccountJson = Deno.env.get('GOOGLE_WALLET_SERVICE_ACCOUNT_JSON');

    if (!serviceAccountJson) {
      console.error('Google Wallet service account not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Service non configuré',
          message: 'Le compte de service Google Wallet n\'est pas configuré. Veuillez contacter l\'administrateur.',
          fallback: true
        }),
        { 
          status: 503, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { cardData } = await req.json() as { cardData: CardData };
    console.log('Generating Google Wallet pass for:', cardData.firstName, cardData.lastName);

    // Parse service account to get issuer ID
    const serviceAccount = JSON.parse(serviceAccountJson);
    const issuerId = serviceAccount.issuer_id || '3388000000022319245';

    // Construct the public URL for the card
    const publicUrl = `https://fyxiyevbbvidckzaequx.lovableproject.com/c/${cardData.slug}`;

    // Create unique IDs for class and object
    const classId = `${issuerId}.iwasp_business_card`;
    const objectId = `${issuerId}.${cardData.id.replace(/-/g, '_')}`;

    // Google Wallet Generic Pass structure
    const genericClass = {
      id: classId,
      classTemplateInfo: {
        cardTemplateOverride: {
          cardRowTemplateInfos: [
            {
              twoItems: {
                startItem: {
                  firstValue: {
                    fields: [
                      {
                        fieldPath: "object.textModulesData['company']"
                      }
                    ]
                  }
                },
                endItem: {
                  firstValue: {
                    fields: [
                      {
                        fieldPath: "object.textModulesData['title']"
                      }
                    ]
                  }
                }
              }
            },
            {
              twoItems: {
                startItem: {
                  firstValue: {
                    fields: [
                      {
                        fieldPath: "object.textModulesData['phone']"
                      }
                    ]
                  }
                },
                endItem: {
                  firstValue: {
                    fields: [
                      {
                        fieldPath: "object.textModulesData['email']"
                      }
                    ]
                  }
                }
              }
            }
          ]
        }
      }
    };

    const genericObject = {
      id: objectId,
      classId: classId,
      state: "ACTIVE",
      heroImage: cardData.photoUrl ? {
        sourceUri: {
          uri: cardData.photoUrl
        },
        contentDescription: {
          defaultValue: {
            language: "fr-FR",
            value: `Photo de ${cardData.firstName} ${cardData.lastName}`
          }
        }
      } : undefined,
      cardTitle: {
        defaultValue: {
          language: "fr-FR",
          value: "Carte de visite"
        }
      },
      subheader: {
        defaultValue: {
          language: "fr-FR",
          value: cardData.company || "IWASP"
        }
      },
      header: {
        defaultValue: {
          language: "fr-FR",
          value: `${cardData.firstName} ${cardData.lastName}`
        }
      },
      textModulesData: [
        {
          id: "company",
          header: "Entreprise",
          body: cardData.company || ""
        },
        {
          id: "title",
          header: "Fonction",
          body: cardData.title || ""
        },
        {
          id: "phone",
          header: "Téléphone",
          body: cardData.phone || ""
        },
        {
          id: "email",
          header: "Email",
          body: cardData.email || ""
        },
        {
          id: "location",
          header: "Adresse",
          body: cardData.location || ""
        }
      ],
      linksModuleData: {
        uris: [
          {
            uri: publicUrl,
            description: "Voir la carte numérique",
            id: "digital_card"
          },
          ...(cardData.website ? [{
            uri: cardData.website.startsWith('http') ? cardData.website : `https://${cardData.website}`,
            description: "Site web",
            id: "website"
          }] : [])
        ]
      },
      barcode: {
        type: "QR_CODE",
        value: publicUrl,
        alternateText: cardData.slug
      },
      hexBackgroundColor: "#121212"
    };

    // Create the JWT payload
    const jwtPayload = {
      genericClasses: [genericClass],
      genericObjects: [genericObject]
    };

    // Generate the signed JWT
    const jwt = await createGoogleWalletJWT(serviceAccountJson, jwtPayload);
    
    // Google Wallet "Save to Wallet" URL
    const saveUrl = `https://pay.google.com/gp/v/save/${jwt}`;

    console.log('Google Wallet pass URL generated successfully');

    return new Response(
      JSON.stringify({
        success: true,
        saveUrl: saveUrl,
        message: 'Pass Google Wallet généré avec succès'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: unknown) {
    console.error('Error generating Google Wallet pass:', error);
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
