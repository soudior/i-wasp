import { authorizeWallet, WalletAccessError } from "../_shared/walletAccess.ts";
import { passKitAuthorization, readPassKitAuth } from "./passkitAuth.ts";
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
    const passKitAuth = readPassKitAuth((key) => Deno.env.get(key));

    if (!passKitAuth) {

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


    const styles = walletStyles || {};



    // Construct the public URL for the card
    const publicUrl = `https://i-wasp.com/card/${encodeURIComponent(cardData.slug)}`;

    // PassKit.io API - Using /members/member endpoint for generic passes
    // IDs from PassKit dashboard
    const programId = Deno.env.get('PASSKIT_PROGRAM_ID');
    const tierId = Deno.env.get('PASSKIT_TIER_ID');
    if (!programId || !tierId) throw new WalletAccessError(503, 'Configuration du modèle PassKit requise');
    const passKitPayload = {
      programId,
      tierId,
      externalId: cardData.id || cardData.slug,
      person: {
        forename: cardData.firstName,
        surname: cardData.lastName,
        emailAddress: cardData.email || "",
        mobileNumber: cardData.phone || ""
      },
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


    const authorization = await passKitAuthorization(passKitAuth);

    const passKitResponse = await fetch('https://api.pub1.passkit.io/members/member', {
      method: 'POST',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(passKitPayload)
    });

    const responseText = await passKitResponse.text();



    if (!passKitResponse.ok) {


      return new Response(
        JSON.stringify({
          error: 'Erreur PassKit',
          message: 'Impossible de générer le pass Apple Wallet.',
          fallback: true,
          status: "provider_error"
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
        success: false,
        error: 'Lien Wallet indisponible',
        message: 'Le fournisseur n’a pas retourné de lien utilisable'
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
