// @vitest-environment node

import path from "node:path";

import { build } from "esbuild";
import { describe, expect, it } from "vitest";

describe("delete-account Edge Function bundle", () => {
  it("resolves every local import without relying on Vite aliases", async () => {
    const result = await build({
      entryPoints: [path.resolve("supabase/functions/delete-account/index.ts")],
      bundle: true,
      write: false,
      format: "esm",
      platform: "neutral",
      logLevel: "silent",
      external: ["https://*"],
      tsconfigRaw: { compilerOptions: {} },
    });

    expect(result.outputFiles).toHaveLength(1);
  });
});
