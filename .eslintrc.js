module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  globals: {
    $nuxt: true,
  },
  parserOptions: {
    parser: "babel-eslint",
  },
  extends: [
    "@nuxtjs",
    // "prettier",
    "plugin:prettier/recommended",
    // "plugin:vue/recommended",
    // "plugin:nuxt/recommended",
  ],
  plugins: [
    "prettier",
  ],
  // add your custom rules here
  rules: {
    "max-len": ["error", { "code": 140, "ignoreUrls": true }],
    "vue/max-attributes-per-line": [
      "error", {
        "singleline": 10,
        "multiline": {
          "max": 1,
          "allowFirstLine": true,
        },
      }],
    "prefer-promise-reject-errors": [
      "error",
      { "allowEmptyReject": true },
    ],
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
  },
};
