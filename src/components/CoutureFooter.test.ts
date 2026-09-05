/**
 * Aucun lien mort en pied de page.
 *
 * Le pied de page est présent sur toutes les pages publiques : un lien cassé
 * s'y voit partout. « Guide » pointait vers `/user-guide` alors que la route
 * déclarée est `/guide` — le visiteur tombait sur la page 404.
 *
 * Ce test lit les deux fichiers (table de liens + table de routes) et vérifie
 * que chaque destination interne existe réellement.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";

const SRC_ROOT = join(__dirname, "..");

function declaredRoutes(): Set<string> {
  const app = readFileSync(join(SRC_ROOT, "App.tsx"), "utf8");
  const routes = new Set<string>();
  for (const match of app.matchAll(/path="([^"]+)"/g)) routes.add(match[1]);
  return routes;
}

function footerHrefs(): string[] {
  const footer = readFileSync(join(__dirname, "CoutureFooter.tsx"), "utf8");
  // On ne garde que la table `footerLinks`, pas les réseaux sociaux (externes).
  const table = footer.slice(
    footer.indexOf("const footerLinks"),
    footer.indexOf("const socialLinks"),
  );
  return [...table.matchAll(/href: "([^"]+)"/g)].map((m) => m[1]);
}

describe("pied de page — aucun lien mort", () => {
  it("chaque destination interne correspond à une route déclarée", () => {
    const routes = declaredRoutes();
    const hrefs = footerHrefs();

    expect(hrefs.length).toBeGreaterThan(6);

    const broken = hrefs.filter((href) => {
      if (!href.startsWith("/")) return false; // lien externe
      if (routes.has(href)) return false;
      // Route paramétrée équivalente, ex. /card/:slug pour /card/x
      return ![...routes].some((r) => {
        if (!r.includes(":") && !r.includes("*")) return false;
        const pattern = new RegExp(
          "^" + r.replace(/:[^/]+/g, "[^/]+").replace(/\*/g, ".*") + "$",
        );
        return pattern.test(href);
      });
    });

    expect(broken).toEqual([]);
  });
});
