import { describe, expect, it, vi } from "vitest";
import { confirmedSession, createConfirmedNfcCheckout, quotedTierAmount } from "./nfcPayment";

const during = new Date("2026-10-22T12:00:00+01:00");

describe("paiement NFC confirmé", () => {
  it("n'accepte un devis que s'il porte la version et le montant du marché", () => {
    const quote = {
      version: 2,
      tiers: { professionnelle: { EUR: 3500, MAD: 24900 }, pack_duo: { EUR: 7900, MAD: 54900 } },
    };
    expect(quotedTierAmount(quote, "signature", "EUR")).toBe(3500);
    expect(quotedTierAmount(quote, "duo", "MAD")).toBe(54900);
    expect(quotedTierAmount({ version: 1, tiers: quote.tiers }, "signature", "EUR")).toBeNull();
    expect(quotedTierAmount({ success: true }, "signature", "MAD")).toBeNull();
  });

  it("redirige seulement si la session Stripe répète le montant affiché", async () => {
    const invoke = vi.fn(async (_name: string, options: { body: { action?: string } }) => {
      if (options.body.action === "quote") {
        return {
          data: { version: 2, tiers: { professionnelle: { EUR: 3500, MAD: 24900 } } },
          error: null,
        };
      }
      return { data: { url: "https://checkout.stripe.test/session", version: 2, currency: "EUR", amount: 3500 }, error: null };
    });
    const result = await createConfirmedNfcCheckout(invoke, {
      tierId: "signature",
      currency: "EUR",
      orderId: "order-1",
      email: "qa@example.invalid",
      now: during,
    });
    expect(result).toEqual({ ok: true, url: "https://checkout.stripe.test/session" });
    expect(invoke).toHaveBeenLastCalledWith("create-nfc-payment", {
      body: { tierId: "signature", currency: "EUR", orderId: "order-1", email: "qa@example.invalid" },
    });
  });

  it("refuse une session dont le montant ou la devise diffère", async () => {
    const invoke = vi.fn(async (_name: string, options: { body: { action?: string } }) => {
      if (options.body.action === "quote") {
        return { data: { version: 2, tiers: { professionnelle: { MAD: 24900, EUR: 3500 } } }, error: null };
      }
      return { data: { url: "https://checkout.stripe.test/session", version: 2, currency: "MAD", amount: 24900 }, error: null };
    });
    const result = await createConfirmedNfcCheckout(invoke, {
      tierId: "professionnelle",
      currency: "EUR",
      orderId: "order-1",
      now: during,
    });
    expect(result).toEqual({ ok: false, reason: "mismatch" });
    expect(confirmedSession({ url: "https://checkout.stripe.test/session", version: 2, currency: "EUR", amount: 3500 })?.amount).toBe(3500);
  });
});
