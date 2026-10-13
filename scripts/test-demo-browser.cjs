const { chromium } = require(require.resolve("playwright", {
  paths: [process.env.IWASP_BROWSER_PACKAGES || process.cwd()],
}));
const { default: AxeBuilder } = require(require.resolve(
  "@axe-core/playwright",
  { paths: [process.env.IWASP_BROWSER_PACKAGES || process.cwd()] }
));
const fs = require("fs");
const assert = require("assert");
(async () => {
  const b = await chromium.launch({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
  const results = [];
  try {
    for (const width of [360, 390, 768, 1440]) {
      const context = await b.newContext({
        viewport: { width, height: 1000 },
        reducedMotion: "reduce",
      });
      const p = await context.newPage();
      const external = [];
      await p.route("**/*", (r) => {
        if (r.request().url().startsWith("http://127.0.0.1:8080"))
          return r.continue();
        external.push(r.request().method());
        return r.fulfill({ body: "[]", contentType: "application/json" });
      });
      await p.goto("http://127.0.0.1:8080/demo");
      await p.getByRole("heading", { level: 1 }).first().waitFor();
      const introAxe = await new AxeBuilder({ page: p })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      assert.deepEqual(
        introAxe.violations,
        [],
        "creation preview accessibility"
      );
      await p.getByRole("button", { name: "Essayer la création" }).click();
      const editorAxe = await new AxeBuilder({ page: p })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      assert.deepEqual(
        editorAxe.violations,
        [],
        "identity editor accessibility"
      );
      await p.getByLabel("Prénom *", { exact: true }).fill("Camille Test");
      await p
        .getByRole("button", { name: "Voir le profil sur téléphone" })
        .click();
      await p
        .locator(".demo-phone")
        .getByRole("heading", { name: "Camille Test Exemple", exact: true })
        .waitFor();
      await p.getByRole("button", { name: "Modifier la fiche" }).click();
      await p.getByLabel("Prénom *", { exact: true }).fill("Camille");
      await p
        .getByRole("button", { name: "Voir le profil sur téléphone" })
        .click();
      await p.locator(".demo-phone img").first().waitFor();
      await p.evaluate(() => document.fonts.ready);
      assert.equal(
        await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1
        ),
        false
      );
      const axe = await new AxeBuilder({ page: p })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      results.push({
        width,
        violations: axe.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            html: n.html,
            summary: n.failureSummary,
          })),
        })),
        external,
      });
      if (width === 1440 && process.env.IWASP_CAPTURE_ASSET === "1")
        await p.locator(".demo-phone>.animate-card-enter").screenshot({
          path: "src/assets/demo-profile-capture.jpg",
          type: "jpeg",
          quality: 88,
          animations: "disabled",
        });
      if (
        [390, 1440].includes(width) &&
        process.env.IWASP_CAPTURE_REVIEW === "1"
      ) {
        await p.locator(".demo-stage").screenshot({
          path: `docs/site-wallet-draft/${
            width === 390 ? "mobile" : "desktop"
          }-demo.jpg`,
          type: "jpeg",
          quality: 82,
          animations: "disabled",
        });
      }
      const action = p.locator(".demo-phone button").first();
      if (await action.count()) {
        await action.click();
        await p
          .getByRole("status")
          .filter({ hasText: "Action de démonstration" })
          .waitFor();
      }
      assert.ok(!external.includes("POST"));
      await p.goto("http://127.0.0.1:8080");
      await p.getByRole("heading", { level: 1 }).first().waitFor();
      assert.equal(
        await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1
        ),
        false
      );
      if (
        [390, 1440].includes(width) &&
        process.env.IWASP_CAPTURE_REVIEW === "1"
      )
        await p.locator(".iw-hero").screenshot({
          path: `docs/site-wallet-draft/${
            width === 390 ? "mobile" : "desktop"
          }-hero.jpg`,
          type: "jpeg",
          quality: 75,
          animations: "disabled",
        });
      await context.close();
    }
  } finally {
    fs.writeFileSync(
      "docs/site-wallet-draft/demo-browser-results.json",
      JSON.stringify(results, null, 2)
    );
    await b.close();
  }
  console.log(JSON.stringify(results));
  assert.ok(results.every((r) => !r.violations.length));
})();
