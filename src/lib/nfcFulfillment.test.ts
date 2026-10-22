import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  checkoutPriceAccepted,
  currentPriceCents,
  fulfillmentPriceAccepted,
  inferLegacyOffer,
  LAUNCH_OFFER_ENABLED,
  LAUNCH_OFFER_ENDS_AT,
} from "../../supabase/functions/_shared/nfcCatalog.ts";
import { ContractError, parseCheckoutRequest, resolveCheckoutContract, type NfcOrderRecord } from "../../supabase/functions/create-nfc-payment/contract.ts";
import { createNfcPaymentHandler } from "../../supabase/functions/create-nfc-payment/handler.ts";
import { createStripeWebhookHandler, reconcileNfcPayment, type NfcFulfillmentOrder, type StripeCheckoutSessionLike } from "../../supabase/functions/stripe-webhook/handler.ts";
import { serverChargeCents } from "./nfcChargeCatalog";

const during = new Date("2026-10-22T12:00:00+01:00");
const after = new Date("2026-12-01T00:00:00+01:00");
const userId = "00000000-0000-4000-8000-000000000001";
const orderId = "00000000-0000-4000-8000-000000000003";
const cardId = "00000000-0000-4000-8000-000000000004";
const subscriptionId = "00000000-0000-4000-8000-000000000005";
const checkoutKey = "00000000-0000-4000-8000-000000000006";

const clientOffer = {
  essentiel: "essentielle",
  signature: "professionnelle",
  alliance: "prestige",
  duo: "pack_duo",
  team: "pack_team",
} as const;

function order(overrides: Partial<NfcOrderRecord> = {}): NfcOrderRecord {
  return {
    id: orderId,
    user_id: userId,
    status: "pending",
    paid_at: null,
    payment_method: "stripe",
    quantity: 1,
    unit_price_cents: 24900,
    total_price_cents: 24900,
    currency: "MAD",
    checkout_key: checkoutKey,
    checkout_revision: 1,
    digital_card_id: cardId,
    subscription_id: subscriptionId,
    order_items: [{
      offerId: "signature",
      quantity: 1,
      unitPriceCents: 24900,
      templateName: "Carte NFC i-Wasp Professionnelle",
    }],
    ...overrides,
  };
}

describe("table de prix serveur", () => {
  it("aligne le client, le catalogue et la migration sur les mêmes centimes", () => {
    expect(LAUNCH_OFFER_ENABLED).toBe(true);
    expect(LAUNCH_OFFER_ENDS_AT).toBe("2026-11-30T23:59:59+01:00");
    for (const [offerId, clientId] of Object.entries(clientOffer)) {
      for (const currency of ["MAD", "EUR"] as const) {
        expect(currentPriceCents(offerId as keyof typeof clientOffer, currency, during))
          .toBe(serverChargeCents(clientId, currency, during));
        expect(currentPriceCents(offerId as keyof typeof clientOffer, currency, after))
          .toBe(serverChargeCents(clientId, currency, after));
      }
    }
    const migration = readFileSync(
      path.resolve(process.cwd(), "supabase/migrations/20261022180000_prepare_nfc_order_launch_grid.sql"),
      "utf8",
    );
    for (const amount of ["2900", "3500", "4900", "7900", "11900", "19900", "24900", "34900", "54900", "59900", "99900", "129900"]) {
      expect(migration, amount).toContain(amount);
    }
    expect(migration).toContain("2026-11-30 23:59:59+01");
    expect(migration).not.toMatch(/\bDROP TABLE\b/i);
  });

  it("garde les commandes v7 329 / 549 / 989 DH payables, y compris après l'offre", () => {
    expect(inferLegacyOffer("MAD", 32900)).toBe("essentiel");
    expect(inferLegacyOffer("MAD", 54900)).toBe("signature");
    expect(inferLegacyOffer("MAD", 98900)).toBe("alliance");
    expect(inferLegacyOffer("EUR", 54900)).toBeNull();
    expect(checkoutPriceAccepted("essentiel", "MAD", 32900, after)).toBe(true);
    expect(checkoutPriceAccepted("signature", "MAD", 54900, during)).toBe(true);
    expect(checkoutPriceAccepted("alliance", "MAD", 98900, during)).toBe(true);
    expect(fulfillmentPriceAccepted("duo", "MAD", 54900)).toBe(true);
    expect(checkoutPriceAccepted("duo", "MAD", 54900, after)).toBe(false);
    expect(checkoutPriceAccepted("signature", "MAD", 24900, after)).toBe(false);
    expect(fulfillmentPriceAccepted("signature", "MAD", 24900)).toBe(true);
    expect(currentPriceCents("team", "MAD", during)).toBe(99900);
    expect(currentPriceCents("team", "MAD", after)).toBe(129900);
    expect(currentPriceCents("team", "EUR", during)).toBe(11900);
    expect(currentPriceCents("team", "EUR", after)).toBe(11900);
  });
});

describe("contrat create-nfc-payment", () => {
  it("n'accepte qu'un corps {orderId}", () => {
    expect(parseCheckoutRequest({ orderId }).orderId).toBe(orderId);
    expect(() => parseCheckoutRequest({ orderId, currency: "EUR" })).toThrow(ContractError);
    expect(() => parseCheckoutRequest({ tierId: "signature" })).toThrow(ContractError);
  });

  it("facture le prix de lancement marocain et refuse un montant client", () => {
    const checkout = resolveCheckoutContract(order(), userId, during);
    expect(checkout.currency).toBe("mad");
    expect(checkout.amountCents).toBe(24900);
    expect(checkout.metadata.offer).toBe("signature");
    expect(checkout.metadata.checkout_revision).toBe("1");
    expect(() => resolveCheckoutContract(order({ unit_price_cents: 100, total_price_cents: 100, order_items: [{
      offerId: "signature", quantity: 1, unitPriceCents: 100, templateName: "Carte NFC i-Wasp Professionnelle",
    }] }), userId, during)).toThrow(/non prise en charge/);
  });

  it("ouvre le duo et le team en euro pendant l'offre, puis la grille officielle", () => {
    const duo = resolveCheckoutContract(order({
      currency: "EUR",
      unit_price_cents: 7900,
      total_price_cents: 7900,
      order_items: [{ offerId: "duo", quantity: 1, unitPriceCents: 7900, templateName: "Carte NFC i-Wasp DUO" }],
    }), userId, during);
    expect(duo.currency).toBe("eur");
    expect(duo.amountCents).toBe(7900);
    expect(() => resolveCheckoutContract(order({
      currency: "EUR",
      unit_price_cents: 7900,
      total_price_cents: 7900,
      order_items: [{ offerId: "duo", quantity: 1, unitPriceCents: 7900, templateName: "Carte NFC i-Wasp DUO" }],
    }), userId, after)).toThrow(ContractError);

    const team = resolveCheckoutContract(order({
      currency: "MAD",
      unit_price_cents: 129900,
      total_price_cents: 129900,
      order_items: [{ offerId: "team", quantity: 1, unitPriceCents: 129900, templateName: "Carte NFC i-Wasp TEAM" }],
    }), userId, after);
    expect(team.amountCents).toBe(129900);
    expect(team.metadata.offer).toBe("team");
  });

  it("reconnaît une commande v7 sans offerId", () => {
    const legacy = resolveCheckoutContract(order({
      unit_price_cents: 32900,
      total_price_cents: 32900,
      order_items: [{ quantity: 1, unitPriceCents: 32900, templateName: "Carte NFC i-Wasp Essentielle" }],
    }), userId, after);
    expect(legacy.offer).toBe("essentiel");
    expect(legacy.amountCents).toBe(32900);
  });
});

describe("handlers avec Stripe et base simulés", () => {
  const paidOrder = (): NfcFulfillmentOrder => ({
    ...order({
      currency: "EUR",
      unit_price_cents: 3500,
      total_price_cents: 3500,
      order_items: [{ offerId: "signature", quantity: 1, unitPriceCents: 3500, templateName: "Carte NFC i-Wasp Professionnelle" }],
    }),
    stripe_session_id: null,
  });

  function session(overrides: Partial<StripeCheckoutSessionLike> = {}): StripeCheckoutSessionLike {
    return {
      id: "cs_test_1",
      payment_status: "paid",
      status: "complete",
      amount_total: 3500,
      currency: "eur",
      payment_intent: "pi_test_1",
      metadata: { type: "nfc_order", order_id: orderId, offer: "signature", quantity: "1", checkout_revision: "1" },
      ...overrides,
    };
  }

  it("crée une session au montant du catalogue, pas au montant du corps", async () => {
    let charged = 0;
    let chargedCurrency = "";
    const handler = createNfcPaymentHandler({
      now: () => during,
      verifyUser: async () => ({ id: userId, email: "qa@example.invalid" }),
      findOrder: async () => order(),
      findCustomer: async () => undefined,
      createCheckoutSession: async (params) => {
        charged = params.line_items[0].price_data.unit_amount;
        chargedCurrency = params.line_items[0].price_data.currency;
        return { id: "cs_test_1", url: "https://checkout.stripe.test/session" };
      },
      recordCheckoutSession: async () => undefined,
    });
    const response = await handler(new Request("https://i-wasp.com/functions/v1/create-nfc-payment", {
      method: "POST",
      headers: { Authorization: "Bearer user-jwt", origin: "https://i-wasp.com" },
      body: JSON.stringify({ orderId }),
    }));
    expect(response.status).toBe(200);
    expect(charged).toBe(24900);
    expect(chargedCurrency).toBe("mad");
    const rejected = await handler(new Request("https://i-wasp.com/functions/v1/create-nfc-payment", {
      method: "POST",
      headers: { Authorization: "Bearer user-jwt" },
      body: JSON.stringify({ orderId, amount: 100 }),
    }));
    expect(rejected.status).toBe(400);
  });

  it("accepte le webhook quand la session correspond et refuse les écarts", async () => {
    const calls: string[] = [];
    const dependencies = {
      verifyEvent: async () => { throw new Error("unused"); },
      findNfcOrder: async () => paidOrder(),
      markNfcOrderPaid: async () => { calls.push("paid"); return true; },
      activateDigitalCard: async () => { calls.push("card"); return true; },
      activateSubscription: async (_id: string, _user: string, input: { currency: string; priceCents: number }) => {
        calls.push(`${input.currency}:${input.priceCents}`);
        return true;
      },
      markFulfillmentActivated: async () => { calls.push("fulfilled"); return true; },
      processWebstudioSession: async () => ({ received: true }),
      now: () => during,
    };
    const accepted = await reconcileNfcPayment(session(), dependencies);
    expect(accepted.fulfilled).toBe(true);
    expect(calls).toEqual(["paid", "card", "EUR:3500", "fulfilled"]);

    await expect(reconcileNfcPayment(session({ amount_total: 4900 }), dependencies)).rejects.toThrow(/does not match/);
    await expect(reconcileNfcPayment(session({ currency: "mad", amount_total: 24900 }), dependencies)).rejects.toThrow(/does not match/);
    await expect(reconcileNfcPayment(session({
      metadata: { type: "nfc_order", order_id: orderId, offer: "duo", quantity: "1", checkout_revision: "1" },
    }), dependencies)).rejects.toThrow(/does not match/);

    const handler = createStripeWebhookHandler({
      ...dependencies,
      verifyEvent: async () => ({ id: "evt_1", type: "checkout.session.completed", data: { object: session({ amount_total: 1 }) } }),
    });
    const response = await handler(new Request("https://i-wasp.com/functions/v1/stripe-webhook", {
      method: "POST",
      headers: { "stripe-signature": "test" },
      body: "{}",
    }));
    expect(response.status).toBe(500);
  });
});
