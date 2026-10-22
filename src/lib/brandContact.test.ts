import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { IWASP_WHATSAPP_DISPLAY, IWASP_WHATSAPP_E164, IWASP_WHATSAPP_WA } from "./brandContact";

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return full.endsWith(".ts") || full.endsWith(".tsx") ? [full] : [];
  });
}

describe("official WhatsApp number", () => {
  it("keeps the order-funnel number as the only branded digits", () => {
    expect(IWASP_WHATSAPP_E164).toBe("+33626424394");
    expect(IWASP_WHATSAPP_WA).toBe("33626424394");
    expect(IWASP_WHATSAPP_DISPLAY).toBe("+33 6 26 42 43 94");
    const offenders = walk(path.resolve(process.cwd(), "src"))
      .filter((file) => !file.endsWith(`${path.sep}brandContact.ts`) && !file.endsWith(`${path.sep}brandContact.test.ts`))
      .filter((file) => readFileSync(file, "utf8").includes("33626424394"));
    expect(offenders).toEqual([]);
  });
});
