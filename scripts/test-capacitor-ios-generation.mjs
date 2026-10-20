import assert from "node:assert/strict";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const cli = join(repoRoot, "node_modules/@capacitor/cli/bin/capacitor");
const tempRoot = mkdtempSync(join(tmpdir(), "capacitor-ios-linux-smoke-"));

function fail(message) {
  throw new Error(message);
}

try {
  if (process.platform !== "linux") fail("This smoke test is intended to validate Linux project generation.");
  if (!existsSync(cli) || !existsSync(join(repoRoot, "node_modules/@capacitor/ios"))) {
    fail("Capacitor CLI/iOS package is unavailable in node_modules; no dependency installation was attempted.");
  }

  mkdirSync(join(tempRoot, "dist"), { recursive: true });
  writeFileSync(join(tempRoot, "dist/index.html"), "<!doctype html><html><body>local smoke test</body></html>\n");
  cpSync(join(repoRoot, "capacitor.config.ts"), join(tempRoot, "capacitor.config.ts"));
  cpSync(join(repoRoot, "ios-config"), join(tempRoot, "ios-config"), { recursive: true });
  mkdirSync(join(tempRoot, "src/lib"), { recursive: true });
  cpSync(join(repoRoot, "src/lib/nativeOAuth.ts"), join(tempRoot, "src/lib/nativeOAuth.ts"));
  cpSync(join(repoRoot, "public"), join(tempRoot, "public"), { recursive: true });
  writeFileSync(join(tempRoot, "package.json"), JSON.stringify({
    name: "capacitor-ios-generation-smoke",
    private: true,
    type: "module",
    dependencies: { "@capacitor/core": "8.5.0", "@capacitor/ios": "8.5.0" },
  }, null, 2) + "\n");
  symlinkSync(join(repoRoot, "node_modules"), join(tempRoot, "node_modules"), "dir");

  // Keep CLI settings isolated and explicitly opt out of usage telemetry. No
  // npm install, Xcode invocation, account access, or remote service is needed.
  const home = join(tempRoot, "home");
  const configHome = join(home, ".config");
  const capacitorConfigHome = join(configHome, "capacitor");
  mkdirSync(capacitorConfigHome, { recursive: true });
  writeFileSync(join(capacitorConfigHome, "sysconfig.json"), JSON.stringify({ machine: "local-smoke-test", telemetry: false }));
  const env = { ...process.env, HOME: home, XDG_CONFIG_HOME: configHome, CI: "true", TERM: "dumb" };

  const generated = spawnSync(process.execPath, [cli, "add", "ios", "--packagemanager", "SPM"], {
    cwd: tempRoot,
    encoding: "utf8",
    env,
  });
  if (generated.error) fail(`Capacitor generation could not start: ${generated.error.message}`);
  if (generated.status !== 0) fail(`Capacitor iOS generation failed (exit ${generated.status}):\n${generated.stdout}\n${generated.stderr}`);

  const configScript = join(repoRoot, "scripts/configure-ios-native.mjs");
  const configured = spawnSync(process.execPath, [configScript], { cwd: tempRoot, encoding: "utf8", env });
  if (configured.error) fail(`Native config generator could not start: ${configured.error.message}`);
  if (configured.status !== 0) fail(`Native config generator failed (exit ${configured.status}):\n${configured.stdout}\n${configured.stderr}`);

  const checker = join(repoRoot, "scripts/check-ios-config.mjs");
  const checked = spawnSync(process.execPath, [checker, "--root", tempRoot, "--generated"], { cwd: tempRoot, encoding: "utf8", env });
  if (checked.error) fail(`Generated config checker could not start: ${checked.error.message}`);
  if (checked.status !== 0) fail(`Generated config checker failed (exit ${checked.status}):\n${checked.stdout}\n${checked.stderr}`);

  const app = join(tempRoot, "ios/App/App");
  const info = readFileSync(join(app, "Info.plist"), "utf8");
  const entitlements = readFileSync(join(app, "App.entitlements"), "utf8");
  const project = readFileSync(join(tempRoot, "ios/App/App.xcodeproj/project.pbxproj"), "utf8");
  const generatedConfig = JSON.parse(readFileSync(join(app, "capacitor.config.json"), "utf8"));
  assert.equal(generatedConfig.appId, "app.iwasp.digital");
  assert.ok(existsSync(join(app, "public/index.html")), "generated app should contain local web assets");
  assert.match(info, /<string>iwasp<\/string>/, "generated Info.plist should register iwasp URL scheme");
  assert.match(entitlements, /com\.apple\.developer\.associated-domains/);
  assert.match(entitlements, /applinks:i-wasp\.com/);
  assert.match(project, /CODE_SIGN_ENTITLEMENTS = App\/App\.entitlements;/);

  console.log("PASS: Capacitor generated an iOS project on Linux and the repository config generator applied callback, associated-domain, and entitlement settings.");
  console.log("Smoke test only: no Xcode compilation/signing/device test was run; no dependencies were installed.");
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
