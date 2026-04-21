// eslint.config.mjs
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import { configs as tseslintConfigs } from 'typescript-eslint'
import globals from 'globals'
import { defineConfig, globalIgnores } from 'eslint/config'
import pluginJs from '@eslint/js'
import pluginNode from 'eslint-plugin-n'
import eslintPlugin from 'eslint-plugin-eslint-plugin'
import nextPlugin from '@next/eslint-plugin-next'
import reactDom from 'eslint-plugin-react-dom'
import nextTs from 'eslint-config-next/typescript'
import eslintReact from '@eslint-react/eslint-plugin'
import reactPlugin from 'eslint-plugin-react'
import jsxA11y from 'eslint-plugin-jsx-a11y'

// ESLint configuration for a Next.js project with TypeScript, React, and Tailwind CSS
const ignoresConfig = defineConfig([
  // Ignore patterns for build artifacts, dependencies, and test files
  globalIgnores([
    '**/.next/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    '**/node_modules/**',
    '**/test*.ts',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

// React DOM-specific rules and settings for Next.js projects
const reactDomConfig = defineConfig({
  name: 'eslint/react-dom',
  plugins: { '@eslint-react/dom': reactDom },
  rules: {
    '@eslint-react/dom/no-missing-button-type': 'warn', // Disable this rule for Next.js projects
    '@eslint-react/dom/no-dangerously-set-innerhtml': 'warn', // Disable this rule for Next.js projects
    '@eslint-react/dom/no-namespace': 'warn', // Disable this rule for Next.js projects
  },
})

// React-specific rules and settings for Next.js projects
const reactConfig = defineConfig({
  name: 'eslint/react-props',
  plugins: { '@eslint-react': eslintReact },
  rules: {
    '@eslint-react/no-missing-component-display-name': 'warn', // Disable this rule for Next.js projects
  },
})

// Recommended ESLint rules for JavaScript and TypeScript
const recommendedConfig = defineConfig([js.configs.recommended, tseslint.configs.recommended])

// Tailwind CSS configuration rules and settings
const tailwindConfig = defineConfig({
  // Tailwind config exceptions
  name: 'tailwind-config',
  files: ['**/tailwind.config.ts'],
  rules: {
    '@typescript-eslint/no-require-imports': 'off',
  },
})

// JavaScript-specific rules and settings
const jsConfig = defineConfig({
  // JavaScript rules
  name: 'eslint/js',
  plugins: {
    js: pluginJs,
  },
  extends: ['js/recommended'], // Use ESLint's recommended rules for JavaScript
  rules: {
    'no-console': 'off', // Warn on console statements
    'no-undef': 'off', // Disallow undefined variables
  },
})

// Next.js-specific rules and settings
const nextConfig = defineConfig({
  // Next.js-specific rules
  name: 'eslint/next',
  plugins: {
    '@next/next': nextPlugin,
  },
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs['core-web-vitals'].rules,
  },
})

// Custom ESLint rules and settings for the project
const eslintConfig = defineConfig([
  {
    name: 'custom-next-rules',
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
    },
  },
  // Node.js environment rules
  {
    name: 'eslint/node',
    plugins: {
      n: pluginNode,
    },
    extends: ['n/mixed-esm-and-cjs'], // Node.js-specific rules for mixed ESM and CommonJS
  },
  // Define global variables for browser and Node.js environments
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  // ESLint plugin development rules
  {
    name: 'eslint/eslint-plugin',
    plugins: {
      'eslint-plugin': eslintPlugin,
    },
    extends: ['eslint-plugin/recommended'], // Recommended rules for ESLint plugin development
  },
  // Custom rules for specific files or patterns
  {
    name: 'custom-rules',
    rules: {
      'no-console': 'off', // Warn on console statements
      semi: ['off', 'always'], // Enforce semicolons
    },
  },
])

// PropTypes rules and settings for React components
const proptypeConfig = defineConfig({
  name: 'react/prop-types',
  files: ['**/*.{jsx,tsx,js,ts,cjs,mjs}'],
  plugins: { react: reactPlugin },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
    globals: {
      ...globals.browser,
    },
  },
  rules: {
    // Set to "error" to fail the build, or "warn" to just see it in the console
    ...reactPlugin.configs.recommended.rules,
    ...reactPlugin.configs['jsx-runtime'].rules,
    'react/prop-types': 'error',
  },
})

//  Accessibility rules and settings for JSX elements
const accessibilityConfig = defineConfig({
  name: 'jsx-a11y/accessibility',
  files: ['**/*.{jsx,tsx}'],
  plugins: { 'jsx-a11y': jsxA11y },
  rules: {
    ...jsxA11y.configs.strict.rules,
    'jsx-a11y/alt-text': ['warn', { elements: ['img'], img: ['Image'] }],
    'jsx-a11y/media-has-caption': 'warn',
    'jsx-a11y/label-has-associated-control': 'off',
  },
})

const typescriptConfig = defineConfig([
  {
    name: 'project/typescript-strict',
    files: ['**/*.{ts,tsx,mjs}'],
    extends: [...tseslintConfigs.strictTypeChecked, ...tseslintConfigs.stylisticTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        //tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
        warnOnUnsupportedTypeScriptVersion: true,
      },
    },
    rules: {
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
  {
    name: 'project/javascript-disable-type-check',
    files: ['**/*.{js,mjs,cjs}'],
    ...tseslintConfigs.disableTypeChecked,
  },
])

// Project-wide rules and settings
const projectwideConfig = defineConfig({
  // Project-wide rules and settings
  name: 'project-wide',
  plugins: {},

  rules: {
    //'react/display-name': 'error', // Disable this rule for Next.js projects

    // Disable JS version, use TS version instead
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['off'],

    // Disable noisy new ESLint 10 rule
    'preserve-caught-error': 'off',

    'no-console': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
  },
})

// Export the combined ESLint configuration
export default defineConfig([
  ...nextTs,
  ...ignoresConfig,
  ...reactDomConfig,
  ...reactConfig,
  ...recommendedConfig,
  ...tailwindConfig,
  ...eslintConfig,
  ...jsConfig,
  ...nextConfig,
  ...proptypeConfig,
  ...accessibilityConfig,
  ...typescriptConfig,
  ...projectwideConfig,
])
