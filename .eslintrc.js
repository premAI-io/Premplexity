module.exports = {
  "env": {
    "node": true,
    "commonjs": true
  },
	"root": true,
	"parser": "@typescript-eslint/parser",
	"plugins": ["@typescript-eslint"],
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended"
	],
  "rules": {
    "@typescript-eslint/no-unused-vars": "warn",
    "semi": ["error", "never"],
    "quotes": ["error", "double"],
  },
  ignorePatterns: [
    ".eslintrc.js",
    "tailwind.config.js",
  ]
}
