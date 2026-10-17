import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const PRODUCTION_REF = "fyxiyevbbvidckzaequx";
const RETIRED_REF = "vwlngxifajsziexhkafe";

describe("Supabase production target", () => {
  it("keeps the native fallback and CLI target on the public production project", () => {
    const client = readFileSync(
      path.resolve(process.cwd(), "src/integrations/supabase/client.ts"),
      "utf8",
    );
    const config = readFileSync(
      path.resolve(process.cwd(), "supabase/config.toml"),
      "utf8",
    );

    expect(client).toContain(`https://${PRODUCTION_REF}.supabase.co`);
    expect(config).toContain(`project_id = "${PRODUCTION_REF}"`);
    expect(client).not.toContain(RETIRED_REF);
    expect(config).not.toContain(RETIRED_REF);
  });

  it("embeds only an anon JWT for the production ref", () => {
    const client = readFileSync(
      path.resolve(process.cwd(), "src/integrations/supabase/client.ts"),
      "utf8",
    );
    const token = client.match(/"(eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)"/)?.[1];
    expect(token).toBeDefined();

    const payload = JSON.parse(
      Buffer.from(token!.split(".")[1], "base64url").toString("utf8"),
    ) as { ref?: string; role?: string };

    expect(payload).toMatchObject({ ref: PRODUCTION_REF, role: "anon" });
  });
});
