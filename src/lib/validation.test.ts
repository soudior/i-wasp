import { describe, it, expect } from "vitest";
import { sanitizeString, sanitizePhone, sanitizeUrl } from "./validation";

describe("validation — sanitize", () => {
  it("sanitizeString retire les chevrons et trim", () => {
    expect(sanitizeString("  a<b>c  ")).toBe("abc");
    expect(sanitizeString("hello")).toBe("hello");
  });

  it("sanitizePhone garde + initial et chiffres", () => {
    expect(sanitizePhone("+33 6 12 34")).toBe("+3361234"); // + puis chiffres restants
    expect(sanitizePhone("06 12 34 56")).toBe("06123456");
  });

  it("sanitizeUrl préfixe https pour LinkedIn et retire les caractères dangereux", () => {
    expect(sanitizeUrl("linkedin.com/in/jean")).toBe("https://linkedin.com/in/jean");
    expect(sanitizeUrl("")).toBe("");
    expect(sanitizeUrl('a<b>"c')).toBe("abc");
  });
});
