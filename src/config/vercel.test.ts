import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

describe("Vercel SPA fallback", () => {
  it("rewrites unknown routes to index.html", () => {
    const vercelConfigPath = path.resolve(process.cwd(), "vercel.json");
    const vercelConfig = JSON.parse(readFileSync(vercelConfigPath, "utf8")) as {
      rewrites?: Array<{ source?: string; destination?: string }>;
    };

    expect(vercelConfig.rewrites).toEqual([
      {
        source: "/(.*)",
        destination: "/index.html",
      },
    ]);
  });
  it("serves the Apple App Site Association as application/json", () => {
    // Universal Links : Apple EXIGE Content-Type: application/json sur un fichier
    // sans extension. Vercel ignore `public/_headers` (convention Netlify/
    // Cloudflare) → sans cette règle, les liens i-wasp.com/card/... ouvrent
    // Safari au lieu de l'app. Ne pas retirer.
    const vercelConfigPath = path.resolve(process.cwd(), "vercel.json");
    const vercelConfig = JSON.parse(readFileSync(vercelConfigPath, "utf8")) as {
      headers?: Array<{ source?: string; headers?: Array<{ key?: string; value?: string }> }>;
    };

    for (const source of [
      "/.well-known/apple-app-site-association",
      "/apple-app-site-association",
    ]) {
      const rule = vercelConfig.headers?.find((h) => h.source === source);
      expect(rule, `règle d'en-tête manquante pour ${source}`).toBeDefined();
      expect(rule?.headers).toContainEqual({
        key: "Content-Type",
        value: "application/json",
      });
    }
  });
});
