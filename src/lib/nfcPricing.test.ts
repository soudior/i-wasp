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
    expect(getNfcCardById("essentielle")?.priceMad).toBe(329);
    expect(getNfcCardById("essentielle")?.priceEur).toBe(29.9);
    expect(getNfcCardById("prestige")?.priceMad).toBe(989);
    expect(getNfcCardById("prestige")?.priceEur).toBe(89.9);
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
  it("formatPriceEur suit la typographie française (virgule, espace insécable)", () => {
    expect(formatPriceEur(29.9)).toBe("29,90\u00A0€");
    expect(formatPriceEur(89.9)).toBe("89,90\u00A0€");
  });

  it("formatPriceEur n'ajoute pas de décimales à un montant rond", () => {
    expect(formatPriceEur(199)).toBe("199\u00A0€");
  });

  it("formatPriceBoth combine EUR et MAD (conversion x11)", () => {
    expect(formatPriceBoth(29.9)).toBe("29,90\u00A0€ (329 DH)");
  });
});
