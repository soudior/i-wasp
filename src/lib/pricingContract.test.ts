/**
 * CONTRAT DE PRIX — grille canonique unique, validée par le dirigeant.
 *
 * Essentielle 329 DH / 29,90 € · Professionnelle 549 DH / 49,90 € ·
 * Prestige 989 DH / 89,90 € · Pack TEAM 2 189 DH / 199 € (taux 1 € = 11 DH).
 *
 * Ce fichier est un GARDE-FOU, pas une simple suite de tests : plusieurs agents
 * écrivent dans ce dépôt et la grille a déjà été réécrite silencieusement en
 * 199/349/599 DH. Toute divergence entre le catalogue, les tunnels /order et
 * /express, le catalogue serveur ou les textes du site fait échouer le build.
 *
 * Pour changer un prix, il faut le changer ICI **et** dans
 * `supabase/functions/create-nfc-payment/index.ts` — le test lit réellement le
 * source de la fonction serveur, donc un seul des deux côtés ne suffit pas.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
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

const SRC_ROOT = join(__dirname, "..");
const REPO_ROOT = join(SRC_ROOT, "..");

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

  /**
   * Test remis après avoir été supprimé : c'est son absence qui a laissé passer
   * un tarif à 29 € / 199 DH, soit deux prix incompatibles pour le même produit
   * (29 € = 319 DH). Un client européen et un client marocain doivent payer le
   * même prix.
   */
  it("utilise le taux unique 1 EUR = 11 MAD", () => {
    expect(NFC_PRICING.currency.eurToMad).toBe(11);
    for (const card of [
      NFC_PRICING.cards.ESSENTIELLE,
      NFC_PRICING.cards.PROFESSIONNELLE,
      NFC_PRICING.cards.PRESTIGE,
      NFC_PRICING.cards.PACK_TEAM,
    ]) {
      // arrondi commercial : écart max 1 DH entre priceMad et priceEur × 11
      expect(Math.abs(card.priceMad - card.priceEur * 11)).toBeLessThanOrEqual(1);
    }
  });

  it("conserve les 3 mois Pro offerts sur chaque carte individuelle", () => {
    expect(NFC_PRICING.cards.ESSENTIELLE.proTrialMonths).toBe(3);
    expect(NFC_PRICING.cards.PROFESSIONNELLE.proTrialMonths).toBe(3);
    expect(NFC_PRICING.cards.PRESTIGE.proTrialMonths).toBe(3);
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

  it("affiche le même montant que celui débité", () => {
    for (const offer of EXPRESS_OFFERS) {
      const displayed = Number(offer.priceDisplay.replace(/[^0-9]/g, ""));
      expect(displayed * 100).toBe(offer.price);
    }
  });
});

/**
 * L'écran de choix d'offre a déjà porté sa PROPRE liste de prix, divergente du
 * catalogue et du serveur : le client voyait 199 DH et était débité 329 DH.
 * Il lit désormais le catalogue ; ce test l'interdit de repartir en roue libre.
 */
describe("grille canonique — écran /order/offre", () => {
  it("affiche exactement les montants du catalogue", async () => {
    const { offers } = await import("@/pages/order/OrderOffre");
    const byId = Object.fromEntries(offers.map((o) => [o.id, o]));

    expect(byId.essentiel.priceMAD * 100).toBe(CANONICAL_MAD_CENTS.essentielle);
    expect(byId.signature.priceMAD * 100).toBe(CANONICAL_MAD_CENTS.professionnelle);
    expect(byId.alliance.priceMAD * 100).toBe(CANONICAL_MAD_CENTS.prestige);

    expect(byId.essentiel.priceEUR).toBe(29.9);
    expect(byId.signature.priceEUR).toBe(49.9);
    expect(byId.alliance.priceEUR).toBe(89.9);
  });
});

/**
 * Le montant réellement débité est décidé par la fonction serveur, jamais par
 * le client. Ce test lit son source pour garantir que le catalogue serveur et
 * le catalogue client ne peuvent pas diverger.
 */
describe("grille canonique — catalogue SERVEUR (create-nfc-payment)", () => {
  const serverSource = readFileSync(
    join(REPO_ROOT, "supabase/functions/create-nfc-payment/index.ts"),
    "utf8",
  );

  const amountFor = (tierId: string): number | null => {
    const line = serverSource
      .split("\n")
      .find((l) => new RegExp(`^\\s*${tierId}\\s*:`).test(l));
    const match = line?.match(/amountMadCents:\s*(\d+)/);
    return match ? Number(match[1]) : null;
  };

  it("débite exactement la grille canonique", () => {
    expect(amountFor("essentielle")).toBe(CANONICAL_MAD_CENTS.essentielle);
    expect(amountFor("professionnelle")).toBe(CANONICAL_MAD_CENTS.professionnelle);
    expect(amountFor("prestige")).toBe(CANONICAL_MAD_CENTS.prestige);
    expect(amountFor("pack_team")).toBe(CANONICAL_MAD_CENTS.pack_team);
  });
});

/**
 * Garde-fou publicité mensongère : le site a déjà affiché « 149 DH au lieu de
 * 249 DH » alors que le paiement débitait 329 DH, puis une grille 199/349/599
 * jamais validée. Ce test relit le code source des pages pour empêcher le
 * retour d'un ancien tarif carte.
 *
 * Exception : `DevenirPartenaire.tsx` vend la gamme « puce ongle » (salons),
 * une ligne produit distincte à 149 DH — le fichier est explicitement exclu.
 * `Nails.tsx` relève de la même gamme.
 */
const STALE_CARD_PRICES = [149, 249, 277, 290, 199, 349, 599, 1299] as const;
const COPY_GUARD_EXEMPT = new Set([
  "pages/DevenirPartenaire.tsx",
  "pages/Nails.tsx",
]);

function collectSourceFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) collectSourceFiles(full, acc);
    else if (/\.(tsx?|json)$/.test(entry) && !/\.test\.tsx?$/.test(entry)) acc.push(full);
  }
  return acc;
}

describe("garde-fou copy — aucun ancien tarif carte dans les textes du site", () => {
  it("ne mentionne aucun tarif carte hors grille validée", () => {
    const offenders: string[] = [];

    for (const file of collectSourceFiles(SRC_ROOT)) {
      const rel = relative(SRC_ROOT, file).replace(/\\/g, "/");
      if (COPY_GUARD_EXEMPT.has(rel)) continue;

      const content = readFileSync(file, "utf8");
      for (const price of STALE_CARD_PRICES) {
        // « 149 DH », « 149DH », « 149 MAD », « 149 dirhams ».
        // Exclu : les montants d'ABONNEMENT, reconnaissables à leur périodicité
        // (« 349 DH/an », « 39 DH par mois ») — ce sont des prix légitimes.
        const pattern = new RegExp(
          `\\b${price}\\s?(DH|MAD|dirhams?)\\b(?!\\s*(/|par)\\s*(an|mois))`,
          "i",
        );
        if (pattern.test(content)) offenders.push(`${rel} → ${price} DH`);
      }
    }

    expect(offenders).toEqual([]);
  });
});
