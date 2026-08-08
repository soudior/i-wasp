#!/usr/bin/env node
/**
 * Patch postinstall : @capacitor/browser@8.0.4 contient UNE ligne Swift
 * incompatible avec le core `capacitor-swift-pm` 8.5.0 (épinglé exact) :
 * `UIColor.capacitor.color(fromHex:)` a été remplacé par `color(argb: UInt32)`
 * dans le core. Cette ligne ne sert qu'à l'option `toolbarColor`, que nous
 * n'utilisons pas (le navigateur système garde sa barre par défaut).
 *
 * On neutralise donc uniquement ce bloc optionnel — aucun autre comportement
 * du plugin n'est modifié. À supprimer quand @capacitor/browser publiera une
 * version compatible core 8.5 (vérifier son CHANGELOG avant tout bump).
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const FILE = "node_modules/@capacitor/browser/ios/Sources/BrowserPlugin/BrowserPlugin.swift";

if (!existsSync(FILE)) {
  console.log("[patch-capacitor-browser] plugin absent — rien à faire.");
  process.exit(0);
}

const src = readFileSync(FILE, "utf8");
const BROKEN = `        if let toolbarColor = call.getString("toolbarColor") {
            color = UIColor.capacitor.color(fromHex: toolbarColor)
        }`;
const FIXED = `        // [i-wasp patch] toolbarColor désactivé : color(fromHex:) n'existe plus
        // dans capacitor-swift-pm 8.5 (remplacé par color(argb:)). Option inutilisée ici.
        _ = call.getString("toolbarColor")`;

if (src.includes(FIXED)) {
  console.log("[patch-capacitor-browser] déjà patché.");
} else if (src.includes(BROKEN)) {
  writeFileSync(FILE, src.replace(BROKEN, FIXED));
  console.log("[patch-capacitor-browser] patch appliqué (toolbarColor neutralisé).");
} else {
  // Version différente de celle attendue : ne pas patcher à l'aveugle.
  console.error(
    "[patch-capacitor-browser] ATTENTION : source inattendue (version changée ?). " +
    "Vérifier la compatibilité avec capacitor-swift-pm 8.5 avant de builder iOS.",
  );
  process.exit(1);
}
