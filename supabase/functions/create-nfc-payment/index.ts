/**
 * Edge Function: create-nfc-payment
 * Crée une session Stripe Checkout pour une commande de carte NFC.
 * Invité autorisé (pas d'authentification requise).
 *
 * SÉCURITÉ — le MONTANT est fixé exclusivement CÔTÉ SERVEUR :
 * - le tier vient du catalogue `NFC_TIERS` ci-dessous (grille canonique alignée
 *   sur src/lib/nfcPricing.ts : 199 / 349 / 599 DH, pack TEAM 1299 DH) ;
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

// Grille officielle + offre de lancement. Les montants viennent d'ICI.
// Tout montant envoyé par le client (priceInCents, amount, unit_amount) est ignoré.
// Garder ces chiffres alignés sur src/lib/launchOffer.ts et src/lib/nfcPricing.ts.
const LAUNCH_OFFER_ENABLED = true;
const LAUNCH_OFFER_ENDS_AT = "2026-11-30T23:59:59+01:00";
const PRICING_VERSION = 2;

type MoneyTier = {
  name: string;
  amountMadCents: number;
  amountEurCents: number;
  quantity: number;
  proMonths: number;
};

function launchOfferActive(now = Date.now()): boolean {
  return LAUNCH_OFFER_ENABLED && now <= Date.parse(LAUNCH_OFFER_ENDS_AT);
}

function nfcTiers(now = Date.now()): Record<string, MoneyTier> {
  const launch = launchOfferActive(now);
  const table: Record<string, MoneyTier> = {
    essentielle: {
      name: "Carte NFC Essentielle + 3 mois Pro",
      amountMadCents: 19900,
      amountEurCents: 2900,
      quantity: 1,
      proMonths: 3,
    },
    professionnelle: launch
      ? {
        name: "Carte NFC Professionnelle + 1 an Pro",
        amountMadCents: 24900,
        amountEurCents: 3500,
        quantity: 1,
        proMonths: 12,
      }
      : {
        name: "Carte NFC Professionnelle + 3 mois Pro",
        amountMadCents: 34900,
        amountEurCents: 4900,
        quantity: 1,
        proMonths: 3,
      },
    prestige: {
      name: "Carte NFC Prestige + 3 mois Pro",
      amountMadCents: 59900,
      amountEurCents: 7900,
      quantity: 1,
      proMonths: 3,
    },
    pack_team: launch
      ? {
        name: "Pack TEAM (5 cartes) + 3 mois Pro",
        amountMadCents: 99900,
        amountEurCents: 11900,
        quantity: 5,
        proMonths: 3,
      }
      : {
        name: "Pack TEAM (5 cartes) + 3 mois Pro",
        amountMadCents: 129900,
        amountEurCents: 11900,
        quantity: 5,
        proMonths: 3,
      },
  };
  if (launch) {
    table.pack_duo = {
      name: "Pack DUO (2 cartes Professionnelle)",
      amountMadCents: 54900,
      amountEurCents: 7900,
      quantity: 2,
      proMonths: 3,
    };
  }
  return table;
}

const TIER_ALIASES: Record<string, string> = {
  essentiel: "essentielle",
  signature: "professionnelle",
  alliance: "prestige",
  single: "essentielle",
  duo: "pack_duo",
  team: "pack_team",
};

const NFC_EXTRAS: Record<string, { name: string; amountMadCents: number; amountEurCents: number }> = {
  laser_engraving: { name: "Gravure laser", amountMadCents: 16500, amountEurCents: 1500 },
  express_production: { name: "Production express", amountMadCents: 22000, amountEurCents: 2000 },
  custom_packaging: { name: "Packaging premium", amountMadCents: 11000, amountEurCents: 1000 },
};

function quotePayload(now = Date.now()) {
  const tiers = nfcTiers(now);
  const tierQuotes: Record<string, { EUR: number; MAD: number }> = {};
  for (const [id, tier] of Object.entries(tiers)) {
    tierQuotes[id] = { EUR: tier.amountEurCents, MAD: tier.amountMadCents };
  }
  const extraQuotes: Record<string, { EUR: number; MAD: number }> = {};
  for (const [id, extra] of Object.entries(NFC_EXTRAS)) {
    extraQuotes[id] = { EUR: extra.amountEurCents, MAD: extra.amountMadCents };
  }
  return {
    version: PRICING_VERSION,
    launchActive: launchOfferActive(now),
    tiers: tierQuotes,
    extras: extraQuotes,
  };
}

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

    const body = await req.json() as {
      action?: string;
      tierId?: string;
      offerId?: string;
      orderId?: string;
      email?: string;
      customerEmail?: string;
      currency?: string;
      extras?: Array<string | { id?: string }>;
    };

    // Devis sans Stripe. L'ancienne fonction n'a pas cette action : elle refuse
    // un corps sans tier (400) avant de créer une session.
    if (body.action === "quote") {
      return new Response(JSON.stringify(quotePayload()), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Backend configuration missing");

    const tiers = nfcTiers();
    const requestedTier = (body.tierId || body.offerId || "").trim();
    const canonicalTierId = tiers[requestedTier] ? requestedTier : TIER_ALIASES[requestedTier];
    const tier = canonicalTierId ? tiers[canonicalTierId] : undefined;
    const requestedCurrency = (body.currency || "").trim().toUpperCase();
    const currency: "EUR" | "MAD" | null = requestedCurrency === "EUR" || requestedCurrency === "MAD"
      ? requestedCurrency
      : requestedCurrency === ""
        ? "MAD"
        : null;

    logStep("Request received", { requestedTier, canonicalTierId, orderId: body.orderId, currency });

    if (!tier || !currency) {
      return new Response(
        JSON.stringify({ error: !tier ? "Pack NFC invalide" : "Devise invalide" }),
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

    const origin = req.headers.get("origin") || "https://www.i-wasp.com";
    const stripeCurrency = currency === "EUR" ? "eur" : "mad";
    const tierAmount = currency === "EUR" ? tier.amountEurCents : tier.amountMadCents;
    const extraAmount = (id: string) => currency === "EUR" ? NFC_EXTRAS[id].amountEurCents : NFC_EXTRAS[id].amountMadCents;
    const amount = tierAmount + extraIds.reduce((sum, id) => sum + extraAmount(id), 0);

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: stripeCurrency,
          product_data: { name: tier.name },
          unit_amount: tierAmount,
        },
        quantity: 1,
      },
      ...extraIds.map((id) => ({
        price_data: {
          currency: stripeCurrency,
          product_data: { name: NFC_EXTRAS[id].name },
          unit_amount: extraAmount(id),
        },
        quantity: 1,
      })),
    ];

    logStep("Line items prepared", { count: lineItems.length, tier: canonicalTierId, currency, amount, extras: extraIds });

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/nfc-success?session_id={CHECKOUT_SESSION_ID}&tier=${canonicalTierId}`,
      cancel_url: `${origin}/order/recap?cancelled=true`,
      metadata: {
        type: "nfc_order",
        pro_trial_months: String(tier.proMonths),
        tier_id: canonicalTierId,
        quantity: String(tier.quantity),
        currency,
        amount: String(amount),
        extras: JSON.stringify(extraIds),
        ...(body.orderId ? { order_id: body.orderId } : {}),
      },
      payment_intent_data: {
        metadata: {
          type: "nfc_order",
          pro_trial_months: String(tier.proMonths),
          tier_id: canonicalTierId,
          currency,
          ...(body.orderId ? { order_id: body.orderId } : {}),
        },
      },
      ...(userEmail ? {} : { customer_creation: "always" }),
    });

    logStep("Checkout session created", { sessionId: session.id, currency, amount });

    return new Response(
      JSON.stringify({
        url: session.url,
        sessionId: session.id,
        version: PRICING_VERSION,
        currency,
        amount,
      }),
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
