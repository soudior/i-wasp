import { describe, it, expect } from "vitest";
import {
  getNfcCardById,
  getNfcPackById,
  formatPriceEur,
  formatPriceBoth,
  getNfcCardsList,
  NFC_PRICING,
} from "./nfcPricing";

describe("nfcPricing — accès catalogue", () => {
  it("getNfcCardById renvoie la carte ou null", () => {
    expect(getNfcCardById("essentielle")?.priceMad).toBe(199);
    expect(getNfcCardById("prestige")?.priceMad).toBe(599);
    expect(getNfcCardById("inconnu")).toBeNull();
  });

  it("getNfcPackById renvoie le pack ou null", () => {
    expect(getNfcPackById("pack_10")).not.toBeNull();
    expect(getNfcPackById("inconnu")).toBeNull();
  });

  it("getNfcCardsList renvoie les 4 offres", () => {
    expect(getNfcCardsList().length).toBe(Object.keys(NFC_PRICING.cards).length);
  });
});

describe("nfcPricing — formatage", () => {
  it("formatPriceEur formate en euros avec 2 décimales", () => {
    expect(formatPriceEur(29.9)).toBe("29.90€");
    expect(formatPriceEur(89.9)).toBe("89.90€");
  });

  it("formatPriceBoth combine EUR et MAD (conversion x11)", () => {
    expect(formatPriceBoth(29.9)).toBe("29.90€ (329 DH)");
  });
});
