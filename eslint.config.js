import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Deno edge functions ont leur propre runtime/typage — hors périmètre du lint front.
  { ignores: ["dist", "supabase/functions/**"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      // `any` reste toléré (warn) pour l'instant ; sera resserré avec la réactivation
      // progressive de TypeScript strict (voir ROADMAP phase 7 / TS strict).
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-object-type": "warn",
      // Échappements redondants et regex de contrôle : non-bloquants (nettoyage progressif).
      "no-useless-escape": "warn",
      "no-control-regex": "warn",
    },
  },
);
