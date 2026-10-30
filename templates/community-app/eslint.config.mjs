// Based on the official dt-app default template (Apache-2.0), plus community rules:
//  - banned UI/state libraries (tech radar: Hold)
//  - warn on literal strings in JSX (use react-intl)
import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import noSecrets from "eslint-plugin-no-secrets";
import react from "eslint-plugin-react";
import security from "eslint-plugin-security";
import n from "eslint-plugin-n";
import nounsanitized from "eslint-plugin-no-unsanitized";
import pluginMicrosoftSdl from "@microsoft/eslint-plugin-sdl";

const restrictedImports = [
  "error",
  {
    paths: [
      {
        name: "@dynatrace/strato-components",
        message: "Import from a sub package, e.g. '@dynatrace/strato-components/buttons'.",
      },
      {
        name: "@dynatrace/strato-design-tokens",
        message: "Import from a sub package, e.g. '@dynatrace/strato-design-tokens/colors'.",
      },
      { name: "redux", message: "Community standard: use a lighter state library (e.g. Zustand, Jotai)." },
      { name: "styled-components", message: "Community standard: use Strato components, CSS modules or design tokens." },
    ],
    patterns: [
      { group: ["@emotion/*"], message: "Community standard: use Strato components, CSS modules or design tokens." },
    ],
  },
];

export default defineConfig([
  globalIgnores(["**/node_modules", "**/dist", "**/.dt-app", "**/app.config.*", "**/*.config.*", "scripts/**"]),
  { settings: { react: { version: "18" } } },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { projectService: true },
    },
    plugins: {
      eslint,
      "@typescript-eslint": tseslint.plugin,
      react,
      "react-hooks": reactHooks,
      noSecrets,
      security,
      n,
      nounsanitized,
      "@microsoft/sdl": pluginMicrosoftSdl,
    },
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      react.configs.flat.recommended,
      nounsanitized.configs.recommended,
    ],
    rules: {
      "no-eval": "error",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-deprecated": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/no-unescaped-entities": "off",
      "react/prop-types": "off",
      "react/no-danger": "warn",
      "react/jsx-no-script-url": "warn",
      "react/jsx-no-literals": ["warn", { noStrings: false, allowedStrings: ["/", "-", "|"] }],
      "nounsanitized/method": "warn",
      "nounsanitized/property": "warn",
      "@microsoft/sdl/no-inner-html": "warn",
      "@microsoft/sdl/no-document-write": "warn",
      "noSecrets/no-secrets": [
        "error",
        { additionalRegexes: { "Dynatrace Token": "dt0[a-zA-Z]{1}[0-9]{2}\\.[A-Z0-9]{8,24}\\.[A-Z0-9]{64}" } },
      ],
      "no-restricted-imports": restrictedImports,
    },
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: { "react/jsx-no-literals": "off", "@typescript-eslint/no-unsafe-assignment": "off" },
  },
]);
