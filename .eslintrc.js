// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true
  },
  globals: {
    'graphql': true
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: [
    'airbnb',
    'prettier',
    'prettier/@typescript-eslint'
  ],
  // required to lint *.vue files
  rules: {
    // allow debugger during development
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
  parser: '@typescript-eslint/parser'
}
