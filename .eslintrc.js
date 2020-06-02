module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    'jest/globals': true,
  },
  extends: ['airbnb-base'],
  plugins: ['jest'],
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
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
  },
};
