module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },

    env: {
        browser: true,
        node: true,
        es6: true,
    },

    settings: {
        react: {
            version: "detect",
        },
        "import/resolver": {
            node: {
                extensions: [".ts", ".tsx"],
            },
        },
    },

    plugins: ["@typescript-eslint"],
    extends: [
        "next/core-web-vitals",
        "plugin:@typescript-eslint/recommended",
        "airbnb",
        "prettier",
        "plugin:jsx-a11y/recommended",
        "plugin:prettier/recommended",
        "plugin:sonarjs/recommended",
        "plugin:security/recommended",
    ],

    rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/ban-types": "off",
        "react/react-in-jsx-scope": "off",
        "react/jsx-filename-extension": [
            1,
            {
                extensions: [".ts", ".tsx", ".js", ".jsx"],
            },
        ],
        "react/jsx-props-no-spreading": "off",
        "react/require-default-props": "off",
        "react/no-unescaped-entities": "off",
        "react/function-component-definition": "off",
        "react/jsx-no-useless-fragment": "off",
        "react/no-array-index-key": "off",
        "import/extensions": [
            "warn",
            "ignorePackages",
            {
                js: "never",
                jsx: "never",
                ts: "never",
                tsx: "never",
            },
        ],
        "import/prefer-default-export": "off",
        "import/no-unresolved": "off",
        "import/no-extraneous-dependencies": "off",
        "jsx-a11y/anchor-is-valid": [
            "warn",
            {
                components: ["Link"],
                specialLink: ["hrefLeft", "hrefRight"],
                aspects: ["invalidHref", "preferButton"],
            },
        ],
        "jsx-a11y/click-events-have-key-events": "off",
        "jsx-a11y/no-static-element-interactions": "off",
        "jsx-a11y/no-noninteractive-element-interactions": "off",
        "no-console": "off",
        "no-debugger": "off",
        "no-unused-vars": "off",
        "no-undef": "warn",
        "prefer-const": "off",
        "no-var": "warn",
        "sonarjs/no-duplicate-string": "off",
        "sonarjs/cognitive-complexity": "off",
        "sonarjs/no-all-duplicated-branches": "off",
        "security/detect-object-injection": "off",
        "security/detect-non-literal-regexp": "off",
    },
};
