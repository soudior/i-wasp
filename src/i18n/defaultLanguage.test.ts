import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("default language", () => {
  it("does not follow the browser language", () => {
    const source = readFileSync(path.resolve(process.cwd(), "src/i18n/index.ts"), "utf8");
    expect(source).toContain("explicitLanguage() ?? 'fr'");
    expect(source).toContain("fallbackLng: 'fr'");
    expect(source).toContain("function explicitLanguage");
    expect(source).toContain("lookupLocalStorage: 'iwasp-lang'");
    expect(source).not.toMatch(/order:\s*\[[^\]]*navigator/);
  });
});
