// @ts-check

import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default defineConfig(
  // Eslint recommended
  eslint.configs.recommended,

  // Typescript recommended
  tseslint.configs.recommended,

  // Astro recommended
  eslintPluginAstro.configs.recommended,

  // JSX-a11y recommended
  jsxA11y.flatConfigs.recommended,

  // Global ignore
  {
    ignores: [
      "dist/**",
      ".astro/**",
      "node_modules/**",
      ".yarn/**",
      ".pnp.cjs",
      ".pnp.loader.mjs",
    ],
  },
);
