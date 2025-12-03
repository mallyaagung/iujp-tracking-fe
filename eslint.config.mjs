export default [
  { ignores: ['eslint.config.mjs'] },

  {
    ...eslintPluginReact.configs.flat.recommended,
    ...eslintPluginReact.configs.flat['jsx-runtime'],
    files: ['src/**/*.{js,jsx}'],
    plugins: {
      eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
      'linebreak-style': 0,
    },
  },

  eslintPluginPrettierRecommended,

  // Force Prettier to stop complaining about CRLF
  {
    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
    },
  },
]
