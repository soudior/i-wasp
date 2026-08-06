import { describe, it, expect } from "vitest";
import {
  calculateB2CPrice,
  calculateB2BPrice,
  getUnitPrice,
  formatPrice,
  formatPriceShort,
  isB2BQuantity,
  getPricingTier,
  PRICING,
} from "./pricing";

describe("pricing — B2C", () => {
  it("facture le tarif unitaire pour 1 carte", () => {
    expect(calculateB2CPrice(1)).toBe(PRICING.b2c.single);
  });

  it("applique le tarif duo pour 2 cartes", () => {
    expect(calculateB2CPrice(2)).toBe(PRICING.b2c.double);
  });

  it("multiplie le tarif unitaire au-delà de 2 cartes", () => {
    expect(calculateB2CPrice(3)).toBe(PRICING.b2c.single * 3);
  });

  it("applique le tarif Premium+ quand demandé", () => {
    expect(calculateB2CPrice(2, true)).toBe(PRICING.b2c.premiumPlus * 2);
  });
});

describe("pricing — B2B", () => {
  it("retombe sur le B2C en dessous de 10 cartes", () => {
    expect(calculateB2BPrice(5)).toBe(calculateB2CPrice(5));
  });

  it("applique le palier 1 (10-24)", () => {
    expect(calculateB2BPrice(10)).toBe(PRICING.b2b.tier1.unitPrice * 10);
  });

  it("applique le palier 2 (25-99)", () => {
    expect(calculateB2BPrice(25)).toBe(PRICING.b2b.tier2.unitPrice * 25);
  });

  it("applique le palier 3 (100+)", () => {
    expect(calculateB2BPrice(100)).toBe(PRICING.b2b.tier3.unitPrice * 100);
  });

  it("ajoute les frais de personnalisation par carte", () => {
    const base = PRICING.b2b.tier1.unitPrice;
    const withPerso = base + PRICING.b2b.personalizationFee;
    expect(calculateB2BPrice(10, true)).toBe(withPerso * 10);
  });
});

describe("pricing — helpers", () => {
  it("getUnitPrice renvoie le prix unitaire duo", () => {
    expect(getUnitPrice(2)).toBe(Math.round(PRICING.b2c.double / 2));
  });

  it("isB2BQuantity détecte le seuil B2B", () => {
    expect(isB2BQuantity(9)).toBe(false);
    expect(isB2BQuantity(10)).toBe(true);
  });

  it("getPricingTier nomme correctement les paliers", () => {
    expect(getPricingTier(1)).toBe("Particulier");
    expect(getPricingTier(10)).toContain("Starter");
    expect(getPricingTier(25)).toContain("Business");
    expect(getPricingTier(100)).toContain("Entreprise");
  });

  it("formatPrice formate en euros avec virgule", () => {
    expect(formatPrice(4900)).toBe("49,00 €");
  });

  it("formatPrice formate en MAD sans décimale", () => {
    expect(formatPrice(4900, "MAD")).toBe("49 MAD");
  });

  it("formatPriceShort masque les décimales pour un entier", () => {
    expect(formatPriceShort(4900)).toBe("49 €");
  });
});
