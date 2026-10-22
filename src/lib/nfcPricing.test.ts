import { describe, it, expect } from "vitest";
import {
  getNfcCardById,
  getNfcPackById,
  formatPriceEur,
  formatMadCents,
  formatCatalogAmount,
  packTeamSavingsPercent,
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

  it("formatMadCents affiche la devise du marché, jamais les deux", () => {
    expect(formatMadCents(19900, "EUR")).toBe("29 €");
    expect(formatMadCents(19900, "MAD")).toBe("199 DH");
    expect(formatMadCents(24900, "EUR")).toBe("35 €");
    expect(formatMadCents(54900, "MAD")).toBe("549 DH");
    expect(formatMadCents(12345, "EUR")).not.toContain("DH");
    expect(formatMadCents(12345, "EUR")).toBe("");
  });

  it("formatCatalogAmount n'affiche qu'une devise", () => {
    expect(formatCatalogAmount(49, 349, "EUR")).toBe("49 €");
    expect(formatCatalogAmount(49, 349, "MAD")).toBe("349 DH");
    expect(formatCatalogAmount(4.99, 39, "EUR")).toBe("4,99 €");
  });

  it("calcule l'économie réelle du Pack TEAM, sans pourcentage inventé", () => {
    const during = new Date("2026-10-22T12:00:00+01:00");
    const after = new Date("2026-12-01T00:00:00+01:00");
    expect(packTeamSavingsPercent("EUR", during)).toBe(32);
    expect(packTeamSavingsPercent("MAD", during)).toBe(20);
    expect(formatMadCents(99900, "EUR")).toBe("119 €");
    expect(formatMadCents(99900, "MAD")).toBe("999 DH");
    expect(packTeamSavingsPercent("EUR", after)).toBe(51);
    expect(packTeamSavingsPercent("MAD", after)).toBe(26);
  });
});
