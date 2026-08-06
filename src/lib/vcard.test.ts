import { describe, it, expect } from "vitest";
import { generateVCard } from "./vcard";

describe("generateVCard", () => {
  it("produit un vCard 4.0 valide avec les champs de base", () => {
    const vcf = generateVCard({ firstName: "Jean", lastName: "Dupont" });
    expect(vcf).toContain("BEGIN:VCARD");
    expect(vcf).toContain("VERSION:4.0");
    expect(vcf).toContain("FN:Jean Dupont");
    expect(vcf).toContain("N:Dupont;Jean;;;");
    expect(vcf.trim().endsWith("END:VCARD")).toBe(true);
  });

  it("échappe les caractères spéciaux (; , \\) — évite un vCard corrompu", () => {
    const vcf = generateVCard({
      firstName: "A;B",
      lastName: "C,D",
      company: "X;Y, Z",
    });
    expect(vcf).toContain("FN:A\\;B C\\,D");
    expect(vcf).toContain("ORG:X\\;Y\\, Z");
  });

  it("inclut téléphone et email quand fournis", () => {
    const vcf = generateVCard({
      firstName: "Jean",
      lastName: "Dupont",
      phone: "+212 6 12 34 56 78",
      email: "jean@example.com",
    });
    expect(vcf).toContain("tel:+212612345678");
    expect(vcf).toContain("EMAIL;TYPE=work:jean@example.com");
  });

  it("préfixe https:// à un site web sans schéma", () => {
    const vcf = generateVCard({
      firstName: "Jean",
      lastName: "Dupont",
      website: "example.com",
    });
    expect(vcf).toContain("URL;TYPE=work:https://example.com");
  });

  it("construit l'URL LinkedIn à partir d'un identifiant", () => {
    const vcf = generateVCard({
      firstName: "Jean",
      lastName: "Dupont",
      linkedin: "jdupont",
    });
    expect(vcf).toContain("X-SOCIALPROFILE;TYPE=linkedin:https://linkedin.com/in/jdupont");
  });

  it("n'ajoute pas de champ optionnel absent", () => {
    const vcf = generateVCard({ firstName: "Jean", lastName: "Dupont" });
    expect(vcf).not.toContain("ORG:");
    expect(vcf).not.toContain("TEL");
    expect(vcf).not.toContain("EMAIL");
  });
});
