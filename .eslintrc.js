module.exports = {
    parser: "@typescript-eslint/parser",
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    // plugins: ["react", "prettier", "@typescript-eslint"],
    plugins: ["react", "@typescript-eslint"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:prettier/recommended",
    ],
    overrides: [],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    ignorePatterns: ["node_modules/", "cypress/"],
    // Cherry of the Cake
    rules: {
        "prettier/prettier": 0,
        "nonblock-statement-body-position": "off",
        // "no-console": "error",
        "react/no-unknown-property": ["error", { ignore: ["jsx", "global"] }],
    },
};
