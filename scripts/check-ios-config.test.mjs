import assert from "node:assert/strict";
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import { checkGeneratedIos, checkIosConfig } from "./check-ios-config.mjs";

const repoRoot = resolve(new URL("..", import.meta.url).pathname);
const fixtureFiles = [
  "capacitor.config.ts",
  "src/lib/nativeOAuth.ts",
  "ios-config/Info.plist.template",
  "ios-config/App.entitlements",
  "public/apple-app-site-association",
  "public/.well-known/apple-app-site-association",
];

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "ios-config-check-"));
  for (const relative of fixtureFiles) {
    const destination = join(root, relative);
    mkdirSync(join(destination, ".."), { recursive: true });
    cpSync(join(repoRoot, relative), destination);
  }
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return {
    root,
    edit(relative, transform) {
      const file = join(root, relative);
      writeFileSync(file, transform(readFileSync(file, "utf8")));
    },
  };
}

test("repository iOS auth/configuration sources are internally consistent", () => {
  const result = checkIosConfig(repoRoot);
  assert.equal(result.appId, "app.iwasp.digital");
  assert.equal(result.callback, "iwasp://auth/callback");
  assert.equal(result.aasaAppId, "Y4JV4X2DJ6.app.iwasp.digital");
});

test("fails if native OAuth return URL drifts from the declared callback", (t) => {
  const f = fixture(t);
  f.edit("src/lib/nativeOAuth.ts", (text) => text.replace('NATIVE_OAUTH_REDIRECT = "iwasp://auth/callback"', 'NATIVE_OAUTH_REDIRECT = "iwasp://auth/other"'));
  assert.throws(() => checkIosConfig(f.root), /Native OAuth deep link must remain/);
});

test("fails if Info.plist no longer registers the OAuth callback URL scheme", (t) => {
  const f = fixture(t);
  f.edit("ios-config/Info.plist.template", (text) => text.replace("<string>iwasp</string>", "<string>different</string>"));
  assert.throws(() => checkIosConfig(f.root), /does not register the native OAuth callback scheme/);
});

test("fails if iOS associated-domain entitlements drift", (t) => {
  const f = fixture(t);
  f.edit("ios-config/App.entitlements", (text) => text.replace("<string>applinks:www.i-wasp.com</string>\n", ""));
  assert.throws(() => checkIosConfig(f.root), /App.entitlements associated domains/);
});

test("fails if an AASA appID is inconsistent with the configured team and bundle", (t) => {
  const f = fixture(t);
  f.edit("public/.well-known/apple-app-site-association", (text) => text.replace("Y4JV4X2DJ6.app.iwasp.digital", "AAAAAAAAAA.app.iwasp.digital"));
  assert.throws(() => checkIosConfig(f.root), /\.well-known AASA appID/);
});

test("fails if the production Capacitor config adds a remote server block", (t) => {
  const f = fixture(t);
  f.edit("capacitor.config.ts", (text) => text.replace("  ios: {", "  server: { url: 'https://example.invalid' },\n  ios: {"));
  assert.throws(() => checkIosConfig(f.root), /must not define server.url/);
});

test("validates generated Capacitor config, callback, domains, and linked entitlements", (t) => {
  const f = fixture(t);
  const app = join(f.root, "ios/App/App");
  const projectDir = join(f.root, "ios/App/App.xcodeproj");
  mkdirSync(app, { recursive: true });
  mkdirSync(projectDir, { recursive: true });
  cpSync(join(f.root, "ios-config/Info.plist.template"), join(app, "Info.plist"));
  cpSync(join(f.root, "ios-config/App.entitlements"), join(app, "App.entitlements"));
  writeFileSync(join(app, "capacitor.config.json"), JSON.stringify({ appId: "app.iwasp.digital" }));
  writeFileSync(join(projectDir, "project.pbxproj"), "CODE_SIGN_ENTITLEMENTS = App/App.entitlements;\n");
  assert.equal(checkGeneratedIos(f.root).appId, "app.iwasp.digital");
});

test("fails when generated Xcode project does not link App.entitlements", (t) => {
  const f = fixture(t);
  const app = join(f.root, "ios/App/App");
  const projectDir = join(f.root, "ios/App/App.xcodeproj");
  mkdirSync(app, { recursive: true });
  mkdirSync(projectDir, { recursive: true });
  cpSync(join(f.root, "ios-config/Info.plist.template"), join(app, "Info.plist"));
  cpSync(join(f.root, "ios-config/App.entitlements"), join(app, "App.entitlements"));
  writeFileSync(join(app, "capacitor.config.json"), JSON.stringify({ appId: "app.iwasp.digital" }));
  writeFileSync(join(projectDir, "project.pbxproj"), "");
  assert.throws(() => checkGeneratedIos(f.root), /does not bind App\/App.entitlements/);
});
