module.exports = {
  extends: [
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "next",
  ],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/no-empty-function": "off"
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
};