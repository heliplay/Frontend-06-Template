module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    semi: ['error', 'always'],
    indent: ['warn', 4],
    'prefer-const': ['off', {
      // destructuring: 'any',
      // ignoreReadBeforeAssign: false
    }],
    'no-unused-vars': ['warn']
  },
  plugins: [
    'html'
  ]
};
