import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { getBackendConfiguration, verifyIosBackend } from "./verify-ios-backend.mjs";

const EXPECTED_PROJECT_ID = "abcdefghijklmnopqrst"; // test fixture, not a production choice
const OTHER_PROJECT = "zyxwvutsrqponmlkjihg";
const goodEnv = () => ({
  IWASP_IOS_APPROVED_PROJECT_ID: EXPECTED_PROJECT_ID,
  VITE_SUPABASE_URL: `https://${EXPECTED_PROJECT_ID}.supabase.co`,
  VITE_SUPABASE_PROJECT_ID: EXPECTED_PROJECT_ID,
  VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test_only_not_a_real_key",
});
const jwt = (extra = {}) => [
  Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url"),
  Buffer.from(JSON.stringify({ iss: "supabase", role: "anon", ref: EXPECTED_PROJECT_ID,
    exp: 4_000_000_000, ...extra })).toString("base64url"),
  "test_signature_not_valid",
].join(".");
const json = (body = { external: { email: true } }, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8" } });

test("accepts a complete publishable-key configuration", () => {
  assert.equal(getBackendConfiguration(goodEnv()).keyKind, "publishable");
});
test("accepts a consistent unexpired legacy anon configuration", () => {
  assert.equal(getBackendConfiguration({ ...goodEnv(), VITE_SUPABASE_PUBLISHABLE_KEY: jwt() }).keyKind, "legacy-anon");
});
test("accepts a different target only when explicitly approved and consistently configured", () => {
  const env = { ...goodEnv(), IWASP_IOS_APPROVED_PROJECT_ID: OTHER_PROJECT, VITE_SUPABASE_PROJECT_ID: OTHER_PROJECT,
    VITE_SUPABASE_URL: `https://${OTHER_PROJECT}.supabase.co` };
  assert.equal(getBackendConfiguration(env).projectId, OTHER_PROJECT);
});
test("rejects an invalid approved project reference", () => {
  assert.throws(() => getBackendConfiguration({ ...goodEnv(), IWASP_IOS_APPROVED_PROJECT_ID: "not-a-project" }), /reviewed Supabase/);
});
test("normalizes an optional root slash only", () => {
  assert.equal(getBackendConfiguration({ ...goodEnv(), VITE_SUPABASE_URL: goodEnv().VITE_SUPABASE_URL + "/" }).url,
    goodEnv().VITE_SUPABASE_URL);
});

for (const name of Object.keys(goodEnv())) {
  for (const value of [undefined, "", " "]) {
    test(`rejects missing/empty ${name}: ${String(value)}`, () => {
      assert.throws(() => getBackendConfiguration({ ...goodEnv(), [name]: value }), /must be explicitly set/);
    });
  }
  test(`rejects surrounding whitespace in ${name}`, () => {
    assert.throws(() => getBackendConfiguration({ ...goodEnv(), [name]: ` ${goodEnv()[name]} ` }), /whitespace/);
  });
}
test("rejects an unapproved project even when URL and ID agree", () => {
  assert.throws(() => getBackendConfiguration({ ...goodEnv(), VITE_SUPABASE_PROJECT_ID: OTHER_PROJECT,
    VITE_SUPABASE_URL: `https://${OTHER_PROJECT}.supabase.co` }), /release target/);
});
for (const url of [
  "not-a-url", "http://abcdefghijklmnopqrst.supabase.co", "https://zyxwvutsrqponmlkjihg.supabase.co",
  "https://abcdefghijklmnopqrst.supabase.co.evil.invalid", "https://user:pass@abcdefghijklmnopqrst.supabase.co",
  "https://abcdefghijklmnopqrst.supabase.co:444", "https://abcdefghijklmnopqrst.supabase.co/auth/v1",
  "https://abcdefghijklmnopqrst.supabase.co?key=test", "https://abcdefghijklmnopqrst.supabase.co#test",
  "https://abcdefghijklmnopqrst.supabase.co?", "https://abcdefghijklmnopqrst.supabase.co#",
  "https://abcdefghijklmnopqrst.supabase.co/a/..", "https://abcdefghijklmnopqrst.supabase.co:443",
]) {
  test(`rejects an unexpected backend URL: ${url}`, () => {
    assert.throws(() => getBackendConfiguration({ ...goodEnv(), VITE_SUPABASE_URL: url }), /valid URL|release target/);
  });
}
for (const [label, key] of [
  ["secret key", "sb_secret_never_send_this"], ["unknown key", "some-api-key"],
  ["empty publishable key", "sb_publishable_"], ["malformed JWT", "header.payload.signature"],
  ["service-role JWT", jwt({ role: "service_role" })], ["user JWT", jwt({ role: "authenticated" })],
  ["foreign issuer", jwt({ iss: "other" })], ["other project", jwt({ ref: OTHER_PROJECT })],
  ["missing ref", jwt({ ref: undefined })], ["expired JWT", jwt({ exp: 1 })],
  ["missing expiry", jwt({ exp: undefined })], ["string expiry", jwt({ exp: "4000000000" })],
]) {
  test(`rejects ${label}`, () => {
    assert.throws(() => getBackendConfiguration({ ...goodEnv(), VITE_SUPABASE_PUBLISHABLE_KEY: key }));
  });
}
test("rejects an expiry equal to the current time", () => {
  assert.throws(() => getBackendConfiguration({ ...goodEnv(), VITE_SUPABASE_PUBLISHABLE_KEY: jwt({ exp: 100 }) }, 100), /expired/);
});
test("a partial config fails before any network call", async () => {
  let called = false;
  await assert.rejects(verifyIosBackend({ ...goodEnv(), VITE_SUPABASE_URL: "" }, async () => {
    called = true;
    return json();
  }), /explicitly set/);
  assert.equal(called, false);
});
test("checks the exact URL/key pair with a read-only nonredirecting request", async () => {
  const result = await verifyIosBackend(goodEnv(), async (url, options) => {
    assert.equal(url, `${goodEnv().VITE_SUPABASE_URL}/auth/v1/settings`);
    assert.equal(options.method, "GET");
    assert.deepEqual(options.headers, { apikey: goodEnv().VITE_SUPABASE_PUBLISHABLE_KEY, Accept: "application/json" });
    assert.equal(options.redirect, "error");
    assert.equal(options.credentials, "omit");
    assert.equal(options.cache, "no-store");
    assert.ok(options.signal instanceof AbortSignal);
    return json();
  });
  assert.deepEqual(result, { projectId: EXPECTED_PROJECT_ID, keyKind: "publishable", emailEnabled: true });
  assert.equal(JSON.stringify(result).includes(goodEnv().VITE_SUPABASE_PUBLISHABLE_KEY), false);
});
for (const status of [401, 403, 404, 429, 500, 503]) {
  test(`fails closed on HTTP ${status} without echoing response bodies`, async () => {
    await assert.rejects(verifyIosBackend(goodEnv(), async () => json({ error: goodEnv().VITE_SUPABASE_PUBLISHABLE_KEY }, status)),
      (error) => error.message.includes(`HTTP ${status}`) && !error.message.includes(goodEnv().VITE_SUPABASE_PUBLISHABLE_KEY));
  });
}
for (const reason of ["timeout", "DNS failure", "redirect", "connection reset"]) {
  test(`fails closed on ${reason} without echoing upstream errors`, async () => {
    await assert.rejects(verifyIosBackend(goodEnv(), async () => { throw new Error(goodEnv().VITE_SUPABASE_PUBLISHABLE_KEY); }),
      (error) => /could not be reached/.test(error.message) && !error.message.includes(goodEnv().VITE_SUPABASE_PUBLISHABLE_KEY));
  });
}
test("rejects a successful HTML page", async () => {
  await assert.rejects(verifyIosBackend(goodEnv(), async () => new Response("<html>proxy</html>", {
    headers: { "content-type": "text/html" },
  })), /content type/);
});
test("rejects malformed settings JSON", async () => {
  await assert.rejects(verifyIosBackend(goodEnv(), async () => new Response("broken", {
    headers: { "content-type": "application/json" },
  })), /invalid settings JSON/);
});
for (const body of [null, {}, { external: {} }, { external: { email: false } }, { external: { email: "true" } }]) {
  test(`requires enabled email auth: ${JSON.stringify(body)}`, async () => {
    await assert.rejects(verifyIosBackend(goodEnv(), async () => json(body)), /Email authentication/);
  });
}
test("server rejection is still checked for structurally valid legacy JWTs", async () => {
  await assert.rejects(verifyIosBackend({ ...goodEnv(), VITE_SUPABASE_PUBLISHABLE_KEY: jwt() }, async () => json({}, 401)), /HTTP 401/);
});
test("CLI exits nonzero when release configuration is absent", () => {
  const result = spawnSync(process.execPath, ["scripts/verify-ios-backend.mjs"], { encoding: "utf8", env: {} });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /IWASP_IOS_APPROVED_PROJECT_ID/);
});
for (const workflow of ["ios-testflight.yml", "ios-build-unsigned.yml"]) {
  test(`${workflow} checks the backend before dependencies, assets, signing or upload`, () => {
    const source = readFileSync(new URL(`../.github/workflows/${workflow}`, import.meta.url), "utf8");
    const guard = source.indexOf("run: node scripts/verify-ios-backend.mjs");
    assert.ok(guard > source.indexOf("- name: Setup Node"));
    assert.ok(guard < source.indexOf("run: npm ci"));
    assert.ok(guard < source.indexOf("run: npm run build"));
    assert.match(source, /workflow_dispatch:/);
    if (workflow === "ios-testflight.yml") {
      assert.ok(guard < source.indexOf("- name: Import signing certificate"));
      assert.match(source, /if: \$\{\{ inputs\.confirm_upload == 'UPLOAD-TO-TESTFLIGHT' \}\}/);
    }
  });
}

test("unsigned validation is limited to the free public standard runner", () => {
  const source = readFileSync(new URL("../.github/workflows/ios-build-unsigned.yml", import.meta.url), "utf8");
  assert.match(source, /if: \$\{\{ github\.event\.repository\.private == false \}\}/);
  assert.match(source, /runs-on: macos-26\n/);
  assert.doesNotMatch(source, /cache: npm|macos-26-(?:large|xlarge)/);
  assert.match(source, /save_artifact:[\s\S]*?type: boolean\n\s+default: false/);
  for (const name of ["Package the unsigned .app", "Upload unsigned build artifact"]) {
    const step = source.slice(source.indexOf(`- name: ${name}`));
    assert.match(step.split(/\n      - name:/)[0], /if: \$\{\{ inputs\.save_artifact \}\}/);
  }
});
test("the iOS validation branch cannot auto-deploy a Vercel preview", () => {
  const config = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
  assert.equal(config.git.deploymentEnabled["codex/ios-login-backend-guard"], false);
  assert.equal(config.git.deploymentEnabled.main, undefined);
});
