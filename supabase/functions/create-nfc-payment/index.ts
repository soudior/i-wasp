/**
 * Edge Function: create-nfc-payment
 * Crée une session Stripe Checkout pour une commande de carte NFC.
 * Invité autorisé (pas d'authentification requise).
 *
 * SÉCURITÉ — le MONTANT est fixé exclusivement CÔTÉ SERVEUR :
 * - le tier vient du catalogue `NFC_TIERS` ci-dessous (grille canonique alignée
 *   sur src/lib/nfcPricing.ts : 329 / 549 / 989 DH, pack TEAM 2189 DH) ;
 * - les extras sont validés contre l'allow-list `NFC_EXTRAS` (id → prix serveur) ;
 * - tout `priceInCents`/prix envoyé par le client est IGNORÉ.
 *
 * RÉCONCILIATION — `orderId` (commande créée en `pending` par le tunnel) est
 * propagé dans `metadata.order_id`, ce qui permet à `verify-payment` et au
 * webhook Stripe de passer la commande en `paid`.
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Grille canonique — centimes de MAD (Stripe: devise à 2 décimales).
// Équivalents EUR affichés côté client (taux 11) : 29,90 / 49,90 / 89,90 / 199 €.
const NFC_TIERS: Record<string, { name: string; amountMadCents: number; quantity: number }> = {
  essentielle:    { name: "Carte NFC Essentielle",    amountMadCents: 32900,  quantity: 1 },
  professionnelle:{ name: "Carte NFC Professionnelle", amountMadCents: 54900,  quantity: 1 },
  prestige:       { name: "Carte NFC Prestige",        amountMadCents: 98900,  quantity: 1 },
  pack_team:      { name: "Pack TEAM (5 cartes)",      amountMadCents: 218900, quantity: 5 },
};

// Alias acceptés (ids historiques des tunnels /order et /express).
const TIER_ALIASES: Record<string, string> = {
  essentiel: "essentielle",
  signature: "professionnelle",
  alliance: "prestige",
  single: "essentielle",
};

// Options — prix serveur uniquement (alignés sur nfcPricing.extras).
const NFC_EXTRAS: Record<string, { name: string; amountMadCents: number }> = {
  laser_engraving:   { name: "Gravure laser",      amountMadCents: 16500 },
  express_production:{ name: "Production express", amountMadCents: 22000 },
  custom_packaging:  { name: "Packaging premium",  amountMadCents: 11000 },
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CREATE-NFC-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Backend configuration missing");

    const body = await req.json() as {
      tierId?: string;
      offerId?: string;
      orderId?: string;
      email?: string;
      customerEmail?: string;
      extras?: Array<string | { id?: string }>;
    };

    // tierId prioritaire, offerId accepté pour les tunnels existants.
    const requestedTier = (body.tierId || body.offerId || "").trim();
    const canonicalTierId = NFC_TIERS[requestedTier] ? requestedTier : TIER_ALIASES[requestedTier];
    const tier = canonicalTierId ? NFC_TIERS[canonicalTierId] : undefined;

    logStep("Request received", { requestedTier, canonicalTierId, orderId: body.orderId });

    if (!tier) {
      return new Response(
        JSON.stringify({ error: "Pack NFC invalide" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Extras : uniquement des ids connus — le prix vient TOUJOURS du serveur.
    const extraIds = (body.extras ?? [])
      .map((e) => (typeof e === "string" ? e : e?.id ?? ""))
      .filter((id): id is string => !!id && !!NFC_EXTRAS[id]);

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Identifier l'email : session authentifiée > body.
    const authHeader = req.headers.get("Authorization");
    let userEmail = body.email || body.customerEmail;
    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const { data: userData } = await supabaseClient.auth.getUser(token);
        if (userData?.user?.email) {
          userEmail = userData.user.email;
          logStep("User authenticated", { userId: userData.user.id });
        }
      } catch {
        logStep("No auth or invalid token - proceeding as guest");
      }
    }

    let customerId: string | undefined;
    if (userEmail) {
      const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Existing customer found", { customerId });
      }
    }

    const origin = req.headers.get("origin") || "https://i-wasp.com";

    // Montants 100 % serveur (price_data, devise MAD).
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "mad",
          product_data: { name: tier.name },
          unit_amount: tier.amountMadCents,
        },
        quantity: 1,
      },
      ...extraIds.map((id) => ({
        price_data: {
          currency: "mad" as const,
          product_data: { name: NFC_EXTRAS[id].name },
          unit_amount: NFC_EXTRAS[id].amountMadCents,
        },
        quantity: 1,
      })),
    ];

    logStep("Line items prepared", { count: lineItems.length, tier: canonicalTierId, extras: extraIds });

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/nfc-success?session_id={CHECKOUT_SESSION_ID}&tier=${canonicalTierId}`,
      cancel_url: `${origin}/order/recapitulatif?cancelled=true`,
      metadata: {
        type: "nfc_order",
        tier_id: canonicalTierId,
        quantity: String(tier.quantity),
        extras: JSON.stringify(extraIds),
        ...(body.orderId ? { order_id: body.orderId } : {}),
      },
      payment_intent_data: {
        metadata: {
          type: "nfc_order",
          tier_id: canonicalTierId,
          ...(body.orderId ? { order_id: body.orderId } : {}),
        },
      },
      ...(userEmail ? {} : { customer_creation: "always" }),
    });

    logStep("Checkout session created", { sessionId: session.id });

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
