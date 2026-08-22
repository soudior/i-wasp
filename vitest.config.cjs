const { defineConfig } = require("vitest/config");
const path = require("path");

const rootDir = process.cwd();

module.exports = defineConfig({
  root: rootDir,
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "./src"),
    },
  },
});
