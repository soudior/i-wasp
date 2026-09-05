/**
 * CONTRAT D'AUTONOMIE — i-wasp n'appartient à aucun éditeur tiers.
 *
 * Le projet est né dans un générateur externe. Tout ce qui le rattachait encore
 * à cet éditeur a été retiré : script d'édition dans `index.html`, module qui
 * transmettait la session d'authentification à l'éditeur par postMessage,
 * URL de passerelle IA écrite en dur, origine tierce autorisée sur les pass
 * Google Wallet, verrous de dépendances épinglés sur un registre npm privé.
 *
 * Plusieurs agents écrivent dans ce dépôt. Ce test échoue si l'une de ces
 * traces revient — dans le code applicatif, dans les fonctions serveur ou dans
 * la page HTML livrée au navigateur.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, it, expect } from "vitest";

const SRC_ROOT = join(__dirname, "..");
const REPO_ROOT = join(SRC_ROOT, "..");

/** Marques de l'éditeur d'origine, sous toutes leurs formes rencontrées. */
const VENDOR_MARKERS = [
  "lovable",
  "gptengineer",
  "gpt-engineer",
  "gpteng.co",
  "gpt-eng.com",
] as const;

const SCANNED_DIRS = ["src", "supabase/functions", "functions"];
const SCANNED_FILES = ["index.html", "package.json", "vite.config.ts", "capacitor.config.ts"];

const CODE_EXTENSIONS = /\.(tsx?|jsx?|html|css|json)$/;

function collectFiles(dir: string, acc: string[] = []): string[] {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === "dist") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) collectFiles(full, acc);
    // Ce fichier de test cite forcément les marques qu'il interdit.
    else if (CODE_EXTENSIONS.test(entry) && !full.endsWith("autonomyContract.test.ts")) {
      acc.push(full);
    }
  }
  return acc;
}

describe("contrat d'autonomie — aucune trace de l'éditeur d'origine", () => {
  it("ne référence l'éditeur ni dans le code, ni dans les fonctions, ni dans index.html", () => {
    const files = [
      ...SCANNED_DIRS.flatMap((d) => collectFiles(join(REPO_ROOT, d))),
      ...SCANNED_FILES.map((f) => join(REPO_ROOT, f)).filter((f) => existsSync(f)),
    ];

    const offenders: string[] = [];
    for (const file of files) {
      const content = readFileSync(file, "utf8").toLowerCase();
      for (const marker of VENDOR_MARKERS) {
        if (content.includes(marker)) {
          offenders.push(`${relative(REPO_ROOT, file).replace(/\\/g, "/")} → « ${marker} »`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  it("n'embarque plus de verrou de dépendances épinglé sur un registre privé tiers", () => {
    for (const lockfile of ["bun.lock", "bun.lockb"]) {
      expect(existsSync(join(REPO_ROOT, lockfile))).toBe(false);
    }
    // package-lock.json fait foi : il doit rester sur le registre npm public.
    const npmLock = join(REPO_ROOT, "package-lock.json");
    if (existsSync(npmLock)) {
      expect(readFileSync(npmLock, "utf8")).not.toContain("pkg.dev");
    }
  });

  it("ne transmet plus la session d'authentification à un éditeur externe", () => {
    expect(existsSync(join(SRC_ROOT, "integrations/supabase/previewAuthStorage.ts"))).toBe(false);
    const client = readFileSync(join(SRC_ROOT, "integrations/supabase/client.ts"), "utf8");
    expect(client).not.toContain("postMessage");
    expect(client).not.toContain("brokeredPreviewStorage");
  });

  it("ne code en dur aucune URL de passerelle IA : elle vient des secrets", () => {
    const gateway = readFileSync(
      join(REPO_ROOT, "supabase/functions/_shared/aiGateway.ts"),
      "utf8",
    );
    expect(gateway).toContain('Deno.env.get("AI_GATEWAY_URL")');
    // Aucune URL de fournisseur écrite dans le fichier.
    expect(gateway).not.toMatch(/https:\/\/[a-z0-9.-]*\/v1\/chat\/completions/i);
  });
});
