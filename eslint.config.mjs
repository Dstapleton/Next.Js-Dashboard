// eslint.config.mjs
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default [
  {
    ignores: [
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/test*.ts',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // Tailwind config exceptions
  {
    files: ['**/tailwind.config.ts'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // Project-wide rules
  {
    rules: {
      // Disable JS version, use TS version instead
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],

      // Disable noisy new ESLint 10 rule
      'preserve-caught-error': 'off',

      'no-console': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
]
