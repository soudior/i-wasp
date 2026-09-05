import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const iosApp = resolve(root, "ios/App/App");
const projectFile = resolve(root, "ios/App/App.xcodeproj/project.pbxproj");
const infoTemplate = resolve(root, "ios-config/Info.plist.template");
const entitlementsTemplate = resolve(root, "ios-config/App.entitlements");

for (const required of [iosApp, projectFile, infoTemplate, entitlementsTemplate]) {
  if (!existsSync(required)) throw new Error(`Configuration iOS introuvable: ${required}`);
}

copyFileSync(infoTemplate, resolve(iosApp, "Info.plist"));
copyFileSync(entitlementsTemplate, resolve(iosApp, "App.entitlements"));

let project = readFileSync(projectFile, "utf8");
if (!project.includes("CODE_SIGN_ENTITLEMENTS = App/App.entitlements;")) {
  project = project.replaceAll(
    "INFOPLIST_FILE = App/Info.plist;",
    "CODE_SIGN_ENTITLEMENTS = App/App.entitlements;\n\t\t\t\tINFOPLIST_FILE = App/Info.plist;",
  );
  writeFileSync(projectFile, project);
}

const info = readFileSync(resolve(iosApp, "Info.plist"), "utf8");
const entitlements = readFileSync(resolve(iosApp, "App.entitlements"), "utf8");
if (!info.includes("NFCReaderUsageDescription")) throw new Error("NFCReaderUsageDescription absent");
if (!entitlements.includes("com.apple.developer.nfc.readersession.formats")) throw new Error("Entitlement NFC absent");
if (!project.includes("CODE_SIGN_ENTITLEMENTS = App/App.entitlements;")) throw new Error("Entitlements non reliés à la cible iOS");

console.log("Configuration iOS native appliquée: Info.plist, NFC et Universal Links.");
