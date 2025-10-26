import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});


export default defineConfig([
    ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],    
    rules: {
      "@typescript-eslint/semi": ["error", "always"],
      "@typescript-eslint/quotes": ["error", "double", "single"],
      "no-console": "off", 
    },
  },
  ...eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
]);

