import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  LAUNCH_OFFER,
  formatLaunchCountdown,
  isLaunchOfferActive,
  launchOfferEndsAt,
} from "./launchOffer";
import { serverChargeCents } from "./nfcChargeCatalog";

const DURING = new Date("2026-10-22T12:00:00+01:00");
const LAST_SECOND = new Date("2026-11-30T22:59:59.000Z");
const AFTER = new Date("2026-11-30T23:00:00.000Z");

describe("offre de lancement", () => {
  it("reste ouverte jusqu'au 30 novembre 2026 23:59 heure de Casablanca", () => {
    expect(LAUNCH_OFFER.enabled).toBe(true);
    expect(LAUNCH_OFFER.endsAt).toBe("2026-11-30T23:59:59+01:00");
    expect(launchOfferEndsAt()).toBe(Date.parse("2026-11-30T22:59:59.000Z"));
    expect(isLaunchOfferActive(DURING)).toBe(true);
    expect(isLaunchOfferActive(LAST_SECOND)).toBe(true);
    expect(isLaunchOfferActive(AFTER)).toBe(false);
  });

  it("affiche un compte à rebours réel, puis plus rien", () => {
    const countdown = formatLaunchCountdown(new Date("2026-11-30T21:59:59.000Z"));
    expect(countdown).toBe("0j 01:00:00");
    expect(formatLaunchCountdown(AFTER)).toBeNull();
  });

  it("porte les prix Professionnelle et Pack DUO dans les deux devises", () => {
    expect(serverChargeCents("professionnelle", "MAD", DURING)).toBe(24900);
    expect(serverChargeCents("professionnelle", "EUR", DURING)).toBe(3500);
    expect(serverChargeCents("pack_duo", "MAD", DURING)).toBe(54900);
    expect(serverChargeCents("pack_duo", "EUR", DURING)).toBe(7900);
    expect(LAUNCH_OFFER.professionnelle.compareMad).toBe(349);
    expect(LAUNCH_OFFER.professionnelle.compareEur).toBe(49);
    expect(LAUNCH_OFFER.duo.compareMad).toBe(698);
    expect(LAUNCH_OFFER.duo.compareEur).toBe(98);
    expect(LAUNCH_OFFER.duo.quantity).toBe(2);
    expect(LAUNCH_OFFER.professionnelle.proMonths).toBe(12);
    expect(serverChargeCents("team", "MAD", DURING)).toBe(99900);
    expect(serverChargeCents("team", "EUR", DURING)).toBe(11900);
    expect(LAUNCH_OFFER.team.compareMad).toBe(1299);
    expect(LAUNCH_OFFER.team.compareEur).toBe(175);
    expect(LAUNCH_OFFER.team.priceMad).toBeLessThan(LAUNCH_OFFER.professionnelle.priceMad * 5);
  });

  it("verrouille les mêmes montants dans create-nfc-payment, sans montant client", () => {
    const source = readFileSync(
      path.resolve(process.cwd(), "supabase/functions/create-nfc-payment/index.ts"),
      "utf8",
    );
    expect(source).toContain('const LAUNCH_OFFER_ENDS_AT = "2026-11-30T23:59:59+01:00"');
    expect(source).toContain("const LAUNCH_OFFER_ENABLED = true");
    for (const amount of ["2900", "4900", "7900", "11900", "19900", "34900", "59900", "129900", "24900", "3500", "54900", "99900"]) {
      expect(source, amount).toContain(amount);
    }
    expect(source).toContain('body.action === "quote"');
    expect(source).toContain("unit_amount: tierAmount");
    expect(source).not.toMatch(/unit_amount:\s*body\./);
    expect(source).not.toMatch(/body\.priceInCents|body\.amount|body\.unit_amount/);
  });
});
