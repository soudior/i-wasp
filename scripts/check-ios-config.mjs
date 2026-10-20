import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const defaultRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function requiredMatch(source, pattern, label) {
  const match = source.match(pattern);
  if (!match) throw new Error(`${label}: expected configuration was not found`);
  return match[1];
}

function plistString(source, key, label) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = [...source.matchAll(new RegExp(`<key>${escapedKey}<\\/key>\\s*<string>([^<]*)<\\/string>`, "g"))];
  if (matches.length !== 1) throw new Error(`${label}: expected exactly one plist string for ${key}`);
  return matches[0][1];
}

function plistArray(source, key, label) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = [...source.matchAll(new RegExp(`<key>${escapedKey}<\\/key>\\s*<array>([\\s\\S]*?)<\\/array>`, "g"))];
  if (matches.length !== 1) throw new Error(`${label}: expected exactly one plist array for ${key}`);
  return [...matches[0][1].matchAll(/<string>([^<]*)<\/string>/g)].map((match) => match[1]);
}

function sameArray(actual, expected, label) {
  if (actual.length !== expected.length || expected.some((entry, index) => actual[index] !== entry)) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
  }
}

/**
 * Check repository-owned iOS return/auth configuration only. This is a static
 * configuration check; it does not compile, sign, install, or run an iOS app.
 */
export function checkIosConfig(root = defaultRoot) {
  const read = (relative) => readFileSync(resolve(root, relative), "utf8");
  const capacitor = read("capacitor.config.ts");
  const nativeOAuth = read("src/lib/nativeOAuth.ts");
  const infoTemplate = read("ios-config/Info.plist.template");
  const entitlements = read("ios-config/App.entitlements");
  const aasaRoot = JSON.parse(read("public/apple-app-site-association"));
  const aasaWellKnown = JSON.parse(read("public/.well-known/apple-app-site-association"));

  const appId = requiredMatch(capacitor, /\bappId\s*:\s*['"]([^'"]+)['"]/, "Capacitor appId");
  if (!/^[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(appId)) {
    throw new Error(`Capacitor appId: invalid bundle identifier ${appId}`);
  }
  requiredMatch(capacitor, /\bwebDir\s*:\s*['"]dist['"]/, "Capacitor webDir");
  if (/^\s*server\s*:\s*\{/m.test(capacitor)) {
    throw new Error("Capacitor production config must not define server.url / a remote server block");
  }

  const redirect = requiredMatch(nativeOAuth, /NATIVE_OAUTH_REDIRECT\s*=\s*['"]([^'"]+)['"]/, "Native OAuth redirect");
  let callback;
  try {
    callback = new URL(redirect);
  } catch {
    throw new Error(`Native OAuth redirect is not a valid URL: ${redirect}`);
  }
  if (callback.protocol !== "iwasp:" || callback.hostname !== "auth" || callback.pathname !== "/callback" || callback.search || callback.hash) {
    throw new Error(`Native OAuth deep link must remain iwasp://auth/callback, received ${redirect}`);
  }

  const callbackSchemes = [...infoTemplate.matchAll(/<key>CFBundleURLSchemes<\/key>\s*<array>([\s\S]*?)<\/array>/g)]
    .flatMap((match) => [...match[1].matchAll(/<string>([^<]*)<\/string>/g)].map((scheme) => scheme[1]));
  if (!callbackSchemes.includes(callback.protocol.slice(0, -1))) {
    throw new Error(`Info.plist does not register the native OAuth callback scheme ${callback.protocol.slice(0, -1)}`);
  }

  const domains = ["applinks:i-wasp.com", "applinks:www.i-wasp.com"];
  sameArray(plistArray(infoTemplate, "com.apple.developer.associated-domains", "Info.plist"), domains, "Info.plist associated domains");
  sameArray(plistArray(entitlements, "com.apple.developer.associated-domains", "App.entitlements"), domains, "App.entitlements associated domains");
  sameArray(plistArray(entitlements, "com.apple.developer.nfc.readersession.formats", "App.entitlements"), ["TAG"], "App.entitlements NFC formats");

  const teamId = requiredMatch(entitlements, /Team ID\s*:\s*([A-Z0-9]{10})/, "App.entitlements Team ID");
  const expectedAppId = `${teamId}.${appId}`;
  if (aasaRoot.applinks?.details?.length !== 1 || aasaRoot.applinks.details[0]?.appID !== expectedAppId) {
    throw new Error(`Root AASA appID must be ${expectedAppId}`);
  }
  if (aasaWellKnown.applinks?.details?.length !== 1 || aasaWellKnown.applinks.details[0]?.appID !== expectedAppId) {
    throw new Error(`.well-known AASA appID must be ${expectedAppId}`);
  }
  const requiredPaths = ["/c/*", "/card/*"];
  sameArray(aasaRoot.applinks.details[0].paths ?? [], requiredPaths, "Root AASA paths");
  sameArray(aasaWellKnown.applinks.details[0].paths ?? [], requiredPaths, ".well-known AASA paths");
  if (JSON.stringify(aasaRoot) !== JSON.stringify(aasaWellKnown)) {
    throw new Error("Root and .well-known apple-app-site-association files differ");
  }
  if (JSON.stringify(aasaRoot.webcredentials?.apps ?? []) !== JSON.stringify([expectedAppId])) {
    throw new Error(`AASA webcredentials apps must contain ${expectedAppId}`);
  }

  return {
    appId,
    callback: redirect,
    associatedDomains: domains,
    aasaAppId: expectedAppId,
  };
}

/** Validate generated Capacitor files after cap add/sync and configure-ios-native. */
export function checkGeneratedIos(root = defaultRoot, staticConfig = checkIosConfig(root)) {
  const read = (relative) => readFileSync(resolve(root, relative), "utf8");
  const info = read("ios/App/App/Info.plist");
  const entitlements = read("ios/App/App/App.entitlements");
  const project = read("ios/App/App.xcodeproj/project.pbxproj");
  const generatedConfig = JSON.parse(read("ios/App/App/capacitor.config.json"));
  if (generatedConfig.appId !== staticConfig.appId) {
    throw new Error(`Generated Capacitor appId must be ${staticConfig.appId}, received ${generatedConfig.appId}`);
  }
  const schemes = [...info.matchAll(/<key>CFBundleURLSchemes<\/key>\s*<array>([\s\S]*?)<\/array>/g)]
    .flatMap((match) => [...match[1].matchAll(/<string>([^<]*)<\/string>/g)].map((scheme) => scheme[1]));
  const callbackScheme = new URL(staticConfig.callback).protocol.slice(0, -1);
  if (!schemes.includes(callbackScheme)) {
    throw new Error(`Generated Info.plist does not register OAuth callback scheme ${callbackScheme}`);
  }
  sameArray(plistArray(info, "com.apple.developer.associated-domains", "Generated Info.plist"), staticConfig.associatedDomains, "Generated Info.plist associated domains");
  sameArray(plistArray(entitlements, "com.apple.developer.associated-domains", "Generated App.entitlements"), staticConfig.associatedDomains, "Generated App.entitlements associated domains");
  sameArray(plistArray(entitlements, "com.apple.developer.nfc.readersession.formats", "Generated App.entitlements"), ["TAG"], "Generated App.entitlements NFC formats");
  if (!project.includes("CODE_SIGN_ENTITLEMENTS = App/App.entitlements;")) {
    throw new Error("Generated Xcode project does not bind App/App.entitlements to the target");
  }
  return { appId: generatedConfig.appId, callbackScheme, associatedDomains: staticConfig.associatedDomains };
}

function runCli() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    console.log("Usage: node scripts/check-ios-config.mjs [--root <repository-root>] [--generated]");
    console.log("Validates static config; --generated also checks generated iOS project files. Neither mode compiles, signs, or runs Xcode.");
    return;
  }
  let root = defaultRoot;
  const rootIndex = args.indexOf("--root");
  if (rootIndex !== -1) {
    if (!args[rootIndex + 1]) throw new Error("--root requires a path");
    root = resolve(args[rootIndex + 1]);
  }
  const result = checkIosConfig(root);
  console.log(`PASS: iOS config is consistent (bundle ${result.appId}, callback ${result.callback}, ${result.associatedDomains.length} associated domains, AASA ${result.aasaAppId}).`);
  if (args.includes("--generated")) {
    const generated = checkGeneratedIos(root, result);
    console.log(`PASS: generated iOS project matches (${generated.appId}, ${generated.callbackScheme}, entitlements linked).`);
  }
  console.log("Configuration checks only: no Xcode compilation, signing, device installation, or runtime verification was performed.");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    runCli();
  } catch (error) {
    console.error(`FAIL: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}
