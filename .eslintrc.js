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
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-non-null-assertion": "warn",
        "@typescript-eslint/ban-ts-comment": "warn",
        "@typescript-eslint/no-empty-function": "warn",
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
        "react/jsx-no-useless-fragment": "warn",
        "react/no-array-index-key": "warn",
        "import/extensions": [
            "error",
            "ignorePackages",
            {
                js: "never",
                jsx: "never",
                ts: "never",
                tsx: "never",
            },
        ],
        "import/prefer-default-export": "off",
        "import/no-unresolved": "warn",
        "import/no-extraneous-dependencies": "warn",
        "jsx-a11y/anchor-is-valid": [
            "error",
            {
                components: ["Link"],
                specialLink: ["hrefLeft", "hrefRight"],
                aspects: ["invalidHref", "preferButton"],
            },
        ],
        "jsx-a11y/click-events-have-key-events": "warn",
        "jsx-a11y/no-static-element-interactions": "warn",
        "jsx-a11y/no-noninteractive-element-interactions": "warn",
        "no-console": "warn",
        "no-debugger": "warn",
        "no-unused-vars": "warn",
        "no-undef": "error",
        "prefer-const": "warn",
        "no-var": "error",
        "sonarjs/no-duplicate-string": "warn",
        "sonarjs/cognitive-complexity": "warn",
        "sonarjs/no-all-duplicated-branches": "warn",
        "security/detect-object-injection": "warn",
        "security/detect-non-literal-regexp": "warn",
    },
};
