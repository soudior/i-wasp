import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Netlify redirects", () => {
  const redirects = readFileSync(path.resolve(process.cwd(), "public/_redirects"), "utf8");
  const app = readFileSync(path.resolve(process.cwd(), "src/App.tsx"), "utf8");

  it("sends dead order and guide paths to a live page with 301", () => {
    for (const rule of [
      "/express/pack   /order/offre   301",
      "/commander      /order/offre   301",
      "/user-guide     /guide         301",
    ]) {
      expect(redirects).toContain(rule);
    }
    expect(redirects).not.toContain("/* /index.html 200");
    expect(redirects).not.toContain("/geo-hint");
  });

  it("rewrites every absolute app route and leaves unknown paths to 404.html", () => {
    const rewritten = new Set(
      redirects
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.endsWith("/index.html    200") || line.endsWith("/index.html 200"))
        .map((line) => line.split(/\s+/)[0]),
    );
    const routes = [...app.matchAll(/path="(\/[^"]*)"/g)].map((match) => match[1].replace(/:[A-Za-z0-9_]+/g, "*"));
    const redirected = new Set(["/express/pack", "/commander", "/user-guide"]);
    for (const route of routes) {
      if (redirected.has(route)) continue;
      expect(rewritten.has(route), route).toBe(true);
    }
  });
});
