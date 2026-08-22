// @vitest-environment node

import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

describe("order photo storage policy", () => {
  it("removes the legacy anonymous upload policy", () => {
    const migration = fs.readFileSync(
      path.resolve("supabase/migrations/20260822000000_secure_order_photo_uploads.sql"),
      "utf8",
    );

    expect(migration).toContain(
      'DROP POLICY IF EXISTS "Anyone can upload order photos" ON storage.objects',
    );
  });
});
