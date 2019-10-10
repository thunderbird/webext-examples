/* eslint-env node */

module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "plugin:mozilla/recommended",
  ],
  plugins: ["mozilla"],
  parserOptions: {
    ecmaVersion: 9,
  },
  globals: {
    browser: true,
  },
  rules: {
    "curly": 2,
    "indent": [2, 2, { SwitchCase: 1, }],
    "object-curly-newline": [2, { multiline: true }],
    "padded-blocks": [2, "never"],
    "prettier/prettier": 0,

    "arrow-spacing": "error",
    "block-spacing": "error",
    "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
    "comma-dangle": ["error", "always-multiline"],
    "comma-spacing": ["error", {"after": true, "before": false}],
    "comma-style": "error",
    "computed-property-spacing": ["error", "never"],
    "curly": "off",
    "eol-last": "error",
    "func-call-spacing": "error",
    "generator-star-spacing": ["error", {"after": true, "before": false}],
    "key-spacing": ["error", {
      "afterColon": true,
      "beforeColon": false,
      "mode": "minimum",
    }],
    "keyword-spacing": "error",
    "linebreak-style": ["error", "unix"],
    "no-tabs": "error",
    "no-trailing-spaces": "error",
    "no-whitespace-before-property": "error",
    "padded-blocks": ["error", "never"],
    "quotes": ["error", "double", {
      "allowTemplateLiterals": true,
      "avoidEscape": true,
    }],
    "rest-spread-spacing": "error",
    "semi": ["error", "always"],
    "space-before-blocks": "error",
    "space-before-function-paren": ["error", {
      "anonymous": "never",
      "asyncArrow": "always",
      "named": "never",
    }],
    "space-infix-ops": ["error", { "int32Hint": true }],
    "space-unary-ops": ["error", {
      "nonwords": false,
      "overrides": {
        "typeof": false, // We tend to use typeof as a function call
      },
      "words": true,
    }],
    "spaced-comment": ["error", "always", { "markers": ["#"] }],
  },
};
