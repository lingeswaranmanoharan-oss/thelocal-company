import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-plugin-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),

  // Base JS rules
  js.configs.recommended,

  // React (for JSX files)
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier,
    },
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Prettier
      'prettier/prettier': 'error',

      // React
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': ['warn', { extensions: ['.jsx'] }],

      // Hooks
      ...reactHooks.configs.recommended.rules,

      // Vite Fast Refresh
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // JavaScript best practices
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
]);
