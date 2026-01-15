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
  
  // Validate required fields
  if (!serviceAccount.private_key) {
    throw new Error('Service account missing private_key');
  }
  if (!serviceAccount.client_email) {
    throw new Error('Service account missing client_email');
  }
  
  const header = {
    alg: 'RS256',
    typ: 'JWT',
    kid: serviceAccount.private_key_id || undefined
  };

  const now = Math.floor(Date.now() / 1000);
  const claims = {
    iss: serviceAccount.client_email,
    aud: 'google',
    origins: ['https://i-wasp.lovable.app', 'https://lovable.dev'],
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
          message: 'Le compte de service Google Wallet n\'est pas configuré.',
          fallback: true
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse and validate service account JSON
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountJson);
    } catch (parseError) {
      console.error('Failed to parse service account JSON:', parseError);
      return new Response(
        JSON.stringify({ 
          error: 'Configuration invalide',
          message: 'Le JSON du compte de service est invalide.',
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
    console.log('Generating Google Wallet pass for:', cardData.firstName, cardData.lastName);
    console.log('Using wallet styles:', styles);

    // Get issuer ID from service account or use default
    const issuerId = serviceAccount.issuer_id || serviceAccount.issuerId || '3388000000022319245';

    // Construct the public URL for the card
    const publicUrl = `https://i-wasp.lovable.app/c/${cardData.slug}`;

    // Create safe ID by removing special characters
    const safeCardId = cardData.id.replace(/[^a-zA-Z0-9_]/g, '_');
    
    // Create unique IDs for class and object
    const classId = `${issuerId}.iwasp_business_card`;
    const objectId = `${issuerId}.${safeCardId}_${Date.now()}`;

    // Apply custom background color (ensure it's a valid hex)
    let backgroundColor = styles.backgroundColor || "#121212";
    if (!backgroundColor.startsWith('#')) {
      backgroundColor = '#' + backgroundColor;
    }

    // Build text modules based on visibility settings
    const textModulesData: Array<{ id: string; header: string; body: string }> = [];

    if (styles.showCompany !== false && cardData.company) {
      textModulesData.push({
        id: "company",
        header: "Entreprise",
        body: cardData.company
      });
    }

    if (styles.showTitle !== false && cardData.title) {
      textModulesData.push({
        id: "title",
        header: "Fonction",
        body: cardData.title
      });
    }

    if (styles.showPhone !== false && cardData.phone) {
      textModulesData.push({
        id: "phone",
        header: "Téléphone",
        body: cardData.phone
      });
    }

    if (styles.showEmail !== false && cardData.email) {
      textModulesData.push({
        id: "email",
        header: "Email",
        body: cardData.email
      });
    }

    if (styles.showLocation !== false && cardData.location) {
      textModulesData.push({
        id: "location",
        header: "Adresse",
        body: cardData.location
      });
    }

    // Build links module
    const uris: Array<{ uri: string; description: string; id: string }> = [
      {
        uri: publicUrl,
        description: "Voir la carte numérique",
        id: "digital_card"
      }
    ];

    if (styles.showWebsite !== false && cardData.website) {
      const websiteUrl = cardData.website.startsWith('http') ? cardData.website : `https://${cardData.website}`;
      uris.push({
        uri: websiteUrl,
        description: "Site web",
        id: "website"
      });
    }

    if (cardData.linkedin) {
      const linkedinUrl = cardData.linkedin.startsWith('http') ? cardData.linkedin : `https://linkedin.com/in/${cardData.linkedin}`;
      uris.push({
        uri: linkedinUrl,
        description: "LinkedIn",
        id: "linkedin"
      });
    }

    if (cardData.instagram) {
      const instagramHandle = cardData.instagram.replace('@', '');
      uris.push({
        uri: `https://instagram.com/${instagramHandle}`,
        description: "Instagram",
        id: "instagram"
      });
    }

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

    const genericObject: Record<string, unknown> = {
      id: objectId,
      classId: classId,
      state: "ACTIVE",
      cardTitle: {
        defaultValue: {
          language: "fr-FR",
          value: "Carte de visite"
        }
      },
      subheader: {
        defaultValue: {
          language: "fr-FR",
          value: cardData.tagline || cardData.company || "IWASP"
        }
      },
      header: {
        defaultValue: {
          language: "fr-FR",
          value: `${cardData.firstName} ${cardData.lastName}`
        }
      },
      textModulesData,
      linksModuleData: {
        uris
      },
      barcode: {
        type: "QR_CODE",
        value: publicUrl,
        alternateText: cardData.slug
      },
      hexBackgroundColor: backgroundColor
    };

    // Add hero image if available
    if (cardData.photoUrl) {
      genericObject.heroImage = {
        sourceUri: {
          uri: cardData.photoUrl
        },
        contentDescription: {
          defaultValue: {
            language: "fr-FR",
            value: `Photo de ${cardData.firstName} ${cardData.lastName}`
          }
        }
      };
    }

    // Create the JWT payload
    const jwtPayload = {
      genericClasses: [genericClass],
      genericObjects: [genericObject]
    };

    console.log('JWT payload:', JSON.stringify(jwtPayload, null, 2));

    // Generate the signed JWT
    const jwt = await createGoogleWalletJWT(serviceAccountJson, jwtPayload);
    
    // Google Wallet "Save to Wallet" URL
    const saveUrl = `https://pay.google.com/gp/v/save/${jwt}`;

    console.log('Google Wallet pass URL generated successfully');
    console.log('Save URL length:', saveUrl.length);

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
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
