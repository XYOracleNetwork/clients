// eslint.config.mjs

import {
  typescriptConfig,
  unicornConfig,
  workspacesConfig,
  rulesConfig,
  importConfig,
} from '@xylabs/eslint-config-flat'

import sonarjs from 'eslint-plugin-sonarjs'

export default [
  { ignores: ['.yarn/**', '**/dist/**', 'dist', 'build/**', 'node_modules/**', 'public', '.storybook', 'storybook-static', 'eslint.config.mjs', '**/*.js', '**/*.cjs', '*.mjs'] },
  unicornConfig,
  workspacesConfig,
  rulesConfig,
  {
    ...typescriptConfig,
    rules: {
      ...typescriptConfig.rules,
      '@typescript-eslint/consistent-type-imports': ['warn'],
    },
  },
  {
    rules: {
      'no-restricted-imports': [
        'warn',
        {
          paths: [
            ...rulesConfig.rules['no-restricted-imports'][1].paths,
            '@types/node',
            '@xyo-network/archivist',
            '@xyo-network/bridge',
            '@xyo-network/core',
            '@xyo-network/diviner',
            '@xyo-network/module',
            '@xyo-network/modules',
            '@xyo-network/node',
            '@xyo-network/sdk',
            '@xyo-network/plugins',
            '@xyo-network/protocol',
            '@xyo-network/sentinel',
            '@xyo-network/witness',
            '@xyo-network/core-payload-plugins',
          ],
        },
      ],
    },
  },
  {
    ...importConfig,
    rules: {
      ...importConfig.rules,
      'import-x/no-cycle': ['warn', { maxDepth: 5 }],
    },
  },
  {
    plugins: { sonarjs },
    rules: { 'sonarjs/deprecation': ['warn'] },
  },
]
