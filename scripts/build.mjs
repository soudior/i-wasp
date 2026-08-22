import { build } from "vite";

const modeIndex = process.argv.indexOf("--mode");
const mode = modeIndex >= 0 ? process.argv[modeIndex + 1] : undefined;

const configModule = await import(new URL("../vite.config.cjs", import.meta.url));
const configFactory = configModule.default ?? configModule;
const config = typeof configFactory === "function" ? configFactory() : configFactory;

await build({
  ...config,
  ...(mode ? { mode } : {}),
  configFile: false,
});
