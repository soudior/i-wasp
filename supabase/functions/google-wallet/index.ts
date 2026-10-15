import { googleWalletIds } from "../_shared/walletEncoding.ts";
import { createGoogleWalletSaveUrl, googleWalletServiceAccount, type GoogleWalletObject } from "../_shared/googleWalletApi.ts";
import { authorizeWallet, WalletAccessError } from "../_shared/walletAccess.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') return new Response(null, { status: 405, headers: corsHeaders });
  try {
    const body = await req.json();
    const { cardData, walletStyles } = await authorizeWallet(req, body, (key) => Deno.env.get(key));
    const serviceAccountJson = Deno.env.get('GOOGLE_WALLET_SERVICE_ACCOUNT_JSON');

    if (!serviceAccountJson) {

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


    const styles = walletStyles || {};



    const configuredAccount = googleWalletServiceAccount(serviceAccount);
    const issuerId = configuredAccount.issuerId;

    // Construct the public URL for the card
    const publicUrl = `https://i-wasp.com/card/${encodeURIComponent(cardData.slug)}`;

    // Stable per verified card: retries do not create a new object identifier.
    const { classId, objectId } = googleWalletIds(issuerId, cardData.id);

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
    const genericObject: GoogleWalletObject = {
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

    // Upload the visible profile through the authenticated server API, then
    // issue an ID-only save JWT so photos and full contact data cannot inflate it.
    const saveUrl = await createGoogleWalletSaveUrl(configuredAccount, genericObject);

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

    const status = error instanceof WalletAccessError ? error.status : error instanceof SyntaxError ? 400 : 502;
    const errorMessage = error instanceof WalletAccessError ? error.message : 'Impossible de préparer le pass. Réessayez plus tard.';
    return new Response(
      JSON.stringify({
        error: 'Erreur serveur',
        message: errorMessage,
        fallback: true
      }),
      {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
