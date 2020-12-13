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
        'no-useless-escape': 'off',
        'prefer-const': ['off', {
            // destructuring: 'any',
            // ignoreReadBeforeAssign: false
        }],
        'no-unused-vars': ['warn'],
        'no-lone-blocks': 'off',
        'no-eval': 'off'
    },
    plugins: [
        'html'
    ]
};
