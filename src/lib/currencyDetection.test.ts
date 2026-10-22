import { describe, expect, it } from "vitest";
import { detectMarketCurrency, isMoroccoLocale, isMoroccoTimeZone } from "./currencyDetection";

describe("detectMarketCurrency", () => {
  it("uses MAD for Morocco time zones even without a network lookup", () => {
    expect(detectMarketCurrency({ timeZone: "Africa/Casablanca", languages: ["en-US"] })).toBe("MAD");
    expect(detectMarketCurrency({ timeZone: "Africa/El_Aaiun", languages: ["fr-FR"] })).toBe("MAD");
  });

  it("uses MAD for a Morocco locale", () => {
    expect(isMoroccoLocale(["fr-MA"])).toBe(true);
    expect(detectMarketCurrency({ timeZone: "Europe/Paris", languages: ["ar-MA", "fr"] })).toBe("MAD");
  });

  it("uses MAD when the hosting country hint is MA", () => {
    expect(detectMarketCurrency({ timeZone: "UTC", languages: ["en-US"], countryCode: "MA" })).toBe("MAD");
  });

  it("uses EUR otherwise, including en-US browsers outside Morocco", () => {
    expect(isMoroccoTimeZone("America/New_York")).toBe(false);
    expect(detectMarketCurrency({ timeZone: "America/New_York", languages: ["en-US"], countryCode: "US" })).toBe("EUR");
    expect(detectMarketCurrency({ timeZone: "Europe/Paris", languages: ["fr-FR"] })).toBe("EUR");
  });
});
