import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { cardDisplayPrice, formatCatalogAmount, NFC_PRICING } from "./nfcPricing";

const DURING = new Date("2026-10-23T12:00:00+01:00");
const AFTER = new Date("2026-12-01T00:00:00+01:00");

function shown(id: string, eur: number, mad: number, now: Date) {
  const p = cardDisplayPrice(id, eur, mad, now);
  return {
    EUR: formatCatalogAmount(p.priceEur, p.priceMad, "EUR"),
    MAD: formatCatalogAmount(p.priceEur, p.priceMad, "MAD"),
  };
}

describe("/produits : prix des cartes cohérents EUR/DH", () => {
  const c = NFC_PRICING.cards;

  it("affiche la grille de lancement pendant l'offre", () => {
    expect(shown("carte-signature", c.ESSENTIELLE.priceEur, c.ESSENTIELLE.priceMad, DURING)).toEqual({ EUR: "29 €", MAD: "199 DH" });
    expect(shown("carte-executive", c.PROFESSIONNELLE.priceEur, c.PROFESSIONNELLE.priceMad, DURING)).toEqual({ EUR: "35 €", MAD: "249 DH" });
    expect(shown("carte-luxury", c.PRESTIGE.priceEur, c.PRESTIGE.priceMad, DURING)).toEqual({ EUR: "79 €", MAD: "599 DH" });
    expect(shown("pack-team", c.PACK_TEAM.priceEur, c.PACK_TEAM.priceMad, DURING)).toEqual({ EUR: "119 €", MAD: "999 DH" });
  });

  it("revient à la grille officielle après l'offre", () => {
    expect(shown("carte-executive", c.PROFESSIONNELLE.priceEur, c.PROFESSIONNELLE.priceMad, AFTER)).toEqual({ EUR: "49 €", MAD: "349 DH" });
    expect(shown("pack-team", c.PACK_TEAM.priceEur, c.PACK_TEAM.priceMad, AFTER)).toEqual({ EUR: "119 €", MAD: "1\u202f299 DH" });
  });

  it("n'affiche jamais MAD comme libellé", () => {
    expect(formatCatalogAmount(29, 199, "MAD")).not.toContain("MAD");
  });

  it("n'affiche aucun prix accessoire en euros seul", () => {
    const src = readFileSync(path.resolve(__dirname, "../pages/ProduitsNFC.tsx"), "utf8");
    expect(src).not.toMatch(/À partir de \d+\s?€/);
    expect(src).not.toContain("Tarif sur demande");
  });
});
