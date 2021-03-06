module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true
    },
    globals: {
        it: true,
        describe: true
    },
    extends: [
        'standard'
    ],
    parserOptions: {
        ecmaVersion: 12
    },
    rules: {
        indent: ['warn', 4]
    }
}
