/**
 * Runs the deployed edge-function handlers against rows produced by
 * scripts/test-prepare-nfc-order.sh. Skipped in the normal vitest run.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createNfcPaymentHandler } from "../../supabase/functions/create-nfc-payment/handler.ts";
import type { NfcOrderRecord } from "../../supabase/functions/create-nfc-payment/contract.ts";
import { reconcileNfcPayment, type NfcFulfillmentOrder } from "../../supabase/functions/stripe-webhook/handler.ts";
import { readStoredOfferId } from "../../supabase/functions/_shared/nfcCatalog.ts";

const ordersPath = process.env.PREPARE_NFC_ORDERS_JSON;
const nowIso = process.env.PREPARE_NFC_NOW;

describe.skipIf(!ordersPath || !nowIso)("prepare_nfc_order rows against edge handlers", () => {
  const load = () => JSON.parse(readFileSync(ordersPath!, "utf8")) as NfcOrderRecord[];

  it("loads the rows the SQL test stored", () => {
    const orders = load();
    expect(orders.length === 10 || orders.length === 8).toBe(true);
    expect(Number.isNaN(new Date(nowIso!).getTime())).toBe(false);
  });

  it("opens a mocked Stripe Checkout for each stored order and fulfills the same amount", async () => {
    const now = new Date(nowIso!);
    for (const order of load()) {
      let charged = 0;
      let chargedCurrency = "";
      const handler = createNfcPaymentHandler({
        now: () => now,
        verifyUser: async () => ({ id: order.user_id, email: "buyer@example.invalid" }),
        findOrder: async (orderId) => (orderId === order.id ? order : null),
        findCustomer: async () => undefined,
        createCheckoutSession: async (params) => {
          charged = params.line_items[0].price_data.unit_amount;
          chargedCurrency = params.line_items[0].price_data.currency;
          return { id: `cs_${order.id}`, url: `https://checkout.stripe.test/c/${order.id}` };
        },
        recordCheckoutSession: async () => undefined,
        allowedOrigins: "https://www.i-wasp.com",
        defaultOrigin: "https://www.i-wasp.com",
      });

      const response = await handler(new Request("https://www.i-wasp.com/functions/v1/create-nfc-payment", {
        method: "POST",
        headers: { Authorization: "Bearer user-jwt", origin: "https://www.i-wasp.com" },
        body: JSON.stringify({ orderId: order.id }),
      }));
      expect(response.status, `${order.currency} ${order.unit_price_cents}`).toBe(200);
      const body = await response.json() as { url: string };
      expect(body.url.startsWith("https://")).toBe(true);
      expect(charged).toBe(order.unit_price_cents);
      expect(chargedCurrency).toBe(order.currency.toLowerCase());

      const stored = readStoredOfferId(order.order_items);
      expect(stored.offerId).toBeTruthy();
      const fulfillment: NfcFulfillmentOrder = { ...order, stripe_session_id: null };
      const activated: string[] = [];
      const result = await reconcileNfcPayment({
        id: `cs_${order.id}`,
        payment_status: "paid",
        status: "complete",
        amount_total: order.total_price_cents,
        currency: order.currency.toLowerCase(),
        payment_intent: `pi_${order.id}`,
        metadata: {
          type: "nfc_order",
          order_id: order.id,
          offer: stored.offerId!,
          quantity: "1",
          checkout_revision: String(order.checkout_revision),
        },
      }, {
        verifyEvent: async () => { throw new Error("unused"); },
        findNfcOrder: async () => fulfillment,
        markNfcOrderPaid: async () => { activated.push("paid"); return true; },
        activateDigitalCard: async (cardId) => {
          activated.push(`card:${cardId}`);
          return true;
        },
        activateSubscription: async (_id, _user, input) => {
          activated.push(`${input.currency}:${input.priceCents}`);
          return true;
        },
        markFulfillmentActivated: async () => { activated.push("fulfilled"); return true; },
        processWebstudioSession: async () => ({ received: true }),
        now: () => now,
      });
      expect(result.fulfilled).toBe(true);
      expect(activated).toEqual([
        "paid",
        `card:${order.digital_card_id}`,
        `${order.currency}:${order.unit_price_cents}`,
        "fulfilled",
      ]);
    }
  });
});
