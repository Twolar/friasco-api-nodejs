module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb',
    'plugin:jest/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },

    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'max-len': 'off',
    'func-names': 'off',
  },
};
