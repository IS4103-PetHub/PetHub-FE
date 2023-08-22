module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  plugins: ["prettier", "@typescript-eslint", "autofix", "react"],
  extends: ["next", "turbo", "prettier"],
  ignorePatterns: ["_document.tsx"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "react/react-in-jsx-scope": "off",
    "arrow-body-style": "off",
    "react/no-unescaped-entities": "off",
    "prefer-arrow-callback": "off",
    "react/self-closing-comp": [
      "error",
      {
        component: true,
        html: true,
      },
    ],
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "parent",
          "sibling",
          "index",
          "object",
          "type",
        ],
        pathGroups: [
          {
            pattern: "@/**/**",
            group: "parent",
            position: "before",
          },
        ],
        alphabetize: { order: "asc" },
      },
    ],
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
  },
};
