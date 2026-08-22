import path from "path";

import { startVitest } from "vitest/node";

const root = process.cwd();
const filters = process.argv.slice(2);

process.env.VITE_SUPABASE_URL ||= "https://example.supabase.co";
process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||= "test-publishable-key";

await startVitest(
  "test",
  filters,
  {
    root,
    config: false,
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  {
    resolve: {
      alias: {
        "@": path.resolve(root, "./src"),
      },
    },
  }
);

if (process.exitCode && process.exitCode !== 0) {
  process.exit(process.exitCode);
}
