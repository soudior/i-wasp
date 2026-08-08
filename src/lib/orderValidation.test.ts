import { describe, it, expect } from "vitest";
import {
  normalizePhone,
  normalizeUrl,
  normalizeEmail,
  normalizeName,
  normalizeWhatsApp,
  validateEmailField,
  validatePhoneField,
  validateUrlField,
  hasValidContact,
  canProceedFromPersonalInfo,
} from "./orderValidation";

describe("orderValidation — normalisation", () => {
  it("normalizePhone garde le + et ne conserve que les chiffres", () => {
    expect(normalizePhone("+33 6 12 34 56 78")).toBe("+33612345678");
    expect(normalizePhone("")).toBe("");
  });

  it("normalizePhone préfixe + si indicatif pays sans 0 initial", () => {
    expect(normalizePhone("33612345678")).toBe("+33612345678");
    expect(normalizePhone("0612345678")).toBe("0612345678");
  });

  it("normalizeUrl force https et retire les caractères dangereux", () => {
    expect(normalizeUrl("example.com")).toBe("https://example.com");
    expect(normalizeUrl("http://x.com")).toBe("https://x.com");
    expect(normalizeUrl("HTTPS://X.COM")).toBe("https://x.com");
    expect(normalizeUrl("")).toBe("");
  });

  it("normalizeEmail met en minuscules et trim", () => {
    expect(normalizeEmail("  JEAN@X.COM ")).toBe("jean@x.com");
  });

  it("normalizeName capitalise et retire les chevrons", () => {
    expect(normalizeName("  jean<>  ")).toBe("Jean");
  });

  it("normalizeWhatsApp retire + et 00 en tête", () => {
    expect(normalizeWhatsApp("+212 6 12 34 56 78")).toBe("212612345678");
    expect(normalizeWhatsApp("0033612345678")).toBe("33612345678");
  });
});

describe("orderValidation — champs temps réel", () => {
  it("validateEmailField", () => {
    expect(validateEmailField("").isValid).toBe(false);
    expect(validateEmailField("pas-un-email").isValid).toBe(false);
    expect(validateEmailField("jean@example.com").isValid).toBe(true);
  });

  it("validatePhoneField", () => {
    expect(validatePhoneField("+33612345678").isValid).toBe(true);
    expect(validatePhoneField("123").isValid).toBe(false);
  });

  it("validateUrlField (champ optionnel : vide = valide)", () => {
    expect(validateUrlField("").isValid).toBe(true);
    expect(validateUrlField("example.com").isValid).toBe(true);
    expect(validateUrlField("pas une url").isValid).toBe(false);
  });
});

describe("orderValidation — contact & progression", () => {
  it("hasValidContact exige au moins un moyen de contact valide", () => {
    expect(hasValidContact(undefined, undefined, undefined)).toBe(false);
    expect(hasValidContact("+33612345678")).toBe(true);
    expect(hasValidContact(undefined, undefined, "jean@example.com")).toBe(true);
    expect(hasValidContact("123", undefined, "invalide")).toBe(false);
  });

  it("canProceedFromPersonalInfo bloque sur des données invalides", () => {
    const res = canProceedFromPersonalInfo({}, null);
    expect(res.canProceed).toBe(false);
    expect(typeof res.message).toBe("string");
  });
});
