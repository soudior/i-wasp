import { describe, expect, it, vi } from "vitest";
import { nfcCheckoutSessionUrl, openNfcCheckout } from "./nfcPayment";

const orderId = "00000000-0000-4000-8000-000000000003";

describe("paiement NFC par identifiant de commande", () => {
  it("n'envoie que l'identifiant et ouvre l'URL https renvoyée", async () => {
    const invoke = vi.fn(async () => ({ data: { url: "https://checkout.stripe.test/session" }, error: null }));
    const result = await openNfcCheckout(invoke, orderId);
    expect(result).toEqual({ ok: true, url: "https://checkout.stripe.test/session" });
    expect(invoke).toHaveBeenCalledWith("create-nfc-payment", { body: { orderId } });
  });

  it("refuse une réponse sans URL https", async () => {
    const invoke = vi.fn(async () => ({ data: { url: "http://checkout.stripe.test/session" }, error: null }));
    expect(await openNfcCheckout(invoke, orderId)).toEqual({ ok: false });
    expect(nfcCheckoutSessionUrl({ url: "https://checkout.stripe.test/session" })).toBe("https://checkout.stripe.test/session");
    expect(nfcCheckoutSessionUrl({ sessionId: "cs_test" })).toBeNull();
  });
});
