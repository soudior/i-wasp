/**
 * CONTRAT DE PRIX — grille canonique unique.
 *
 * La grille officielle i-wasp est : Essentielle 329 DH / 29,90 € ·
 * Professionnelle 549 DH / 49,90 € · Prestige 989 DH / 89,90 € ·
 * Pack TEAM 2189 DH / 199 € (taux unique 1 € = 11 DH).
 *
 * Ces tests échouent si une source de prix (catalogue, tunnel /order,
 * tunnel /express) diverge. Le catalogue serveur
 * (supabase/functions/create-nfc-payment) doit refléter les mêmes centimes
 * MAD : 32900 / 54900 / 98900 / 218900 — toute modification doit être faite
 * DES DEUX CÔTÉS.
 */
import { describe, it, expect } from "vitest";
import { NFC_PRICING } from "./nfcPricing";
import { OFFERS } from "@/contexts/OrderFunnelContext";
import { EXPRESS_OFFERS } from "@/contexts/ExpressCheckoutContext";

// Centimes MAD canoniques (miroir du catalogue serveur create-nfc-payment).
const CANONICAL_MAD_CENTS = {
  essentielle: 32900,
  professionnelle: 54900,
  prestige: 98900,
  pack_team: 218900,
} as const;

describe("grille canonique — catalogue nfcPricing", () => {
  it("expose les prix officiels EUR", () => {
    expect(NFC_PRICING.cards.ESSENTIELLE.priceEur).toBe(29.9);
    expect(NFC_PRICING.cards.PROFESSIONNELLE.priceEur).toBe(49.9);
    expect(NFC_PRICING.cards.PRESTIGE.priceEur).toBe(89.9);
    expect(NFC_PRICING.cards.PACK_TEAM.priceEur).toBe(199);
  });

  it("expose les prix officiels MAD (cohérents avec le serveur)", () => {
    expect(NFC_PRICING.cards.ESSENTIELLE.priceMad * 100).toBe(CANONICAL_MAD_CENTS.essentielle);
    expect(NFC_PRICING.cards.PROFESSIONNELLE.priceMad * 100).toBe(CANONICAL_MAD_CENTS.professionnelle);
    expect(NFC_PRICING.cards.PRESTIGE.priceMad * 100).toBe(CANONICAL_MAD_CENTS.prestige);
    expect(NFC_PRICING.cards.PACK_TEAM.priceMad * 100).toBe(CANONICAL_MAD_CENTS.pack_team);
  });

  it("utilise le taux unique 1 EUR = 11 MAD", () => {
    expect(NFC_PRICING.currency.eurToMad).toBe(11);
    for (const card of [
      NFC_PRICING.cards.ESSENTIELLE,
      NFC_PRICING.cards.PROFESSIONNELLE,
      NFC_PRICING.cards.PRESTIGE,
      NFC_PRICING.cards.PACK_TEAM,
    ]) {
      // arrondi commercial : écart max 1 DH entre priceMad et priceEur*11
      expect(Math.abs(card.priceMad - card.priceEur * 11)).toBeLessThanOrEqual(1);
    }
  });
});

describe("grille canonique — tunnel /order (OrderFunnelContext)", () => {
  it("est aligné sur la grille canonique (centimes MAD)", () => {
    const byId = Object.fromEntries(OFFERS.map((o) => [o.id, o.price]));
    expect(byId.essentiel).toBe(CANONICAL_MAD_CENTS.essentielle);
    expect(byId.signature).toBe(CANONICAL_MAD_CENTS.professionnelle);
    expect(byId.alliance).toBe(CANONICAL_MAD_CENTS.prestige);
  });
});

describe("grille canonique — tunnel /express (ExpressCheckoutContext)", () => {
  it("est aligné sur la grille canonique (centimes MAD)", () => {
    const byId = Object.fromEntries(EXPRESS_OFFERS.map((o) => [o.id, o.price]));
    expect(byId.essentiel).toBe(CANONICAL_MAD_CENTS.essentielle);
    expect(byId.signature).toBe(CANONICAL_MAD_CENTS.professionnelle);
    expect(byId.alliance).toBe(CANONICAL_MAD_CENTS.prestige);
  });
});
