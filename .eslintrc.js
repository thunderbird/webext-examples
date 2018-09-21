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
  },
};
