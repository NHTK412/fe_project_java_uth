import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  {
    ignores: ["dist/**"],
  },

  js.configs.recommended,

  {
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    settings: { react: { version: "detect" } },

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
      },
    },

    rules: {
      // react
      "react-refresh/only-export-components": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/prop-types": "off",
      "react/display-name": "off",

      // general style rules
      "no-console": "warn",
      "no-unused-vars": "warn",
      "no-trailing-spaces": "warn",
      "no-multi-spaces": "warn",
      "no-multiple-empty-lines": "warn",
      "space-before-blocks": ["error", "always"],
      "object-curly-spacing": ["warn", "always"],
      indent: ["warn", 2],
      // semi: ["warn", "never"],
      // quotes: ["error", "single"],
      "array-bracket-spacing": "warn",
      "keyword-spacing": "warn",
      // "comma-dangle": "warn",
      "comma-spacing": "warn",
      "arrow-spacing": "warn",
    },
  },
];
