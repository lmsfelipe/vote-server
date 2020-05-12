module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: ['airbnb-base'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'object-curly-newline': 'off',
    'newline-per-chained-call': 'off',
    'no-underscore-dangle': 'off',
  },
};
