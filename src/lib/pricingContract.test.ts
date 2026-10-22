/**
 * CONTRAT DE PRIX — grille canonique unique.
 *
 * La grille officielle i-wasp est : Essentielle 199 DH / 29 € ·
 * Professionnelle 349 DH / 49 € · Prestige 599 DH / 79 € ·
 * Pack TEAM 1299 DH / 119 €. Les montants ne sont pas dérivés d'un taux.
 *
 * Ces tests échouent si une source de prix (catalogue, tunnel /order,
 * tunnel /express) diverge. Le catalogue serveur
 * (supabase/functions/create-nfc-payment) doit refléter les mêmes centimes
 * MAD : 19900 / 34900 / 59900 / 129900 — toute modification doit être faite
 * DES DEUX CÔTÉS.
 */
import { describe, it, expect } from "vitest";
import { NFC_PRICING, PRO_SUBSCRIPTION } from "./nfcPricing";
import { OFFERS } from "@/contexts/OrderFunnelContext";
import { EXPRESS_OFFERS } from "@/contexts/ExpressCheckoutContext";
import { serverChargeCents, proTrialMonths } from "./nfcChargeCatalog";

// Centimes MAD canoniques (miroir du catalogue serveur create-nfc-payment).
const CANONICAL_MAD_CENTS = {
  essentielle: 19900,
  professionnelle: 34900,
  prestige: 59900,
  pack_team: 129900,
} as const;

describe("grille canonique — catalogue nfcPricing", () => {
  it("expose les prix officiels EUR", () => {
    expect(NFC_PRICING.cards.ESSENTIELLE.priceEur).toBe(29);
    expect(NFC_PRICING.cards.PROFESSIONNELLE.priceEur).toBe(49);
    expect(NFC_PRICING.cards.PRESTIGE.priceEur).toBe(79);
    expect(NFC_PRICING.cards.PACK_TEAM.priceEur).toBe(119);
  });

  it("expose les prix officiels MAD (cohérents avec le serveur)", () => {
    expect(NFC_PRICING.cards.ESSENTIELLE.priceMad * 100).toBe(CANONICAL_MAD_CENTS.essentielle);
    expect(NFC_PRICING.cards.PROFESSIONNELLE.priceMad * 100).toBe(CANONICAL_MAD_CENTS.professionnelle);
    expect(NFC_PRICING.cards.PRESTIGE.priceMad * 100).toBe(CANONICAL_MAD_CENTS.prestige);
    expect(NFC_PRICING.cards.PACK_TEAM.priceMad * 100).toBe(CANONICAL_MAD_CENTS.pack_team);
  });

  it("inclut trois mois Pro sur chaque carte individuelle", () => {
    expect(NFC_PRICING.cards.ESSENTIELLE.proTrialMonths).toBe(3);
    expect(NFC_PRICING.cards.PROFESSIONNELLE.proTrialMonths).toBe(3);
    expect(NFC_PRICING.cards.PRESTIGE.proTrialMonths).toBe(3);
  });
});

describe("abonnement Pro — une seule grille", () => {
  it("aligne le mensuel et l'annuel", () => {
    expect(PRO_SUBSCRIPTION.yearlyEur).toBe(49);
    expect(PRO_SUBSCRIPTION.monthlyEur).toBe(4.99);
    expect(PRO_SUBSCRIPTION.yearlyMad).toBe(349);
    expect(PRO_SUBSCRIPTION.monthlyMad).toBe(39);
  });
});

describe("montants facturés — date de l'offre de lancement", () => {
  const during = new Date("2026-10-22T12:00:00+01:00");
  const after = new Date("2026-12-01T00:00:00+01:00");

  it("applique les prix de lancement pendant la fenêtre", () => {
    expect(serverChargeCents("essentiel", "EUR", during)).toBe(2900);
    expect(serverChargeCents("essentiel", "MAD", during)).toBe(19900);
    expect(serverChargeCents("signature", "EUR", during)).toBe(3500);
    expect(serverChargeCents("signature", "MAD", during)).toBe(24900);
    expect(serverChargeCents("duo", "EUR", during)).toBe(7900);
    expect(serverChargeCents("duo", "MAD", during)).toBe(54900);
    expect(serverChargeCents("alliance", "EUR", during)).toBe(7900);
    expect(serverChargeCents("alliance", "MAD", during)).toBe(59900);
    expect(serverChargeCents("pack_team", "EUR", during)).toBe(11900);
    expect(serverChargeCents("pack_team", "MAD", during)).toBe(129900);
    expect(proTrialMonths("signature", during)).toBe(12);
    expect(proTrialMonths("essentiel", during)).toBe(3);
  });

  it("revient à la grille officielle après le 30 novembre 2026", () => {
    expect(serverChargeCents("signature", "EUR", after)).toBe(4900);
    expect(serverChargeCents("signature", "MAD", after)).toBe(34900);
    expect(serverChargeCents("duo", "EUR", after)).toBeNull();
    expect(serverChargeCents("duo", "MAD", after)).toBeNull();
    expect(proTrialMonths("signature", after)).toBe(3);
    expect(serverChargeCents("pack_team", "EUR", after)).toBe(11900);
  });
});

describe("grille canonique — tunnel /order (OrderFunnelContext)", () => {
  it("facture le montant serveur du moment, pas un montant client", () => {
    const byId = Object.fromEntries(OFFERS.map((o) => [o.id, o.price]));
    expect(byId.essentiel).toBe(serverChargeCents("essentiel", "MAD"));
    expect(byId.signature).toBe(serverChargeCents("signature", "MAD"));
    expect(byId.alliance).toBe(serverChargeCents("alliance", "MAD"));
    const duo = serverChargeCents("duo", "MAD");
    if (duo == null) expect(byId.duo).toBeUndefined();
    else expect(byId.duo).toBe(duo);
  });
});

describe("grille canonique — tunnel /express (ExpressCheckoutContext)", () => {
  it("facture le montant serveur du moment, pas un montant client", () => {
    const byId = Object.fromEntries(EXPRESS_OFFERS.map((o) => [o.id, o.price]));
    expect(byId.essentiel).toBe(serverChargeCents("essentiel", "MAD"));
    expect(byId.signature).toBe(serverChargeCents("signature", "MAD"));
    expect(byId.alliance).toBe(serverChargeCents("alliance", "MAD"));
    expect(byId.duo).toBeUndefined();
  });
});
