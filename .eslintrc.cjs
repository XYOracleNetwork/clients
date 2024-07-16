const finalConfig = {
  'extends': ['@xylabs'],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', project: './tsconfig-eslint.json', sourceType: 'module', tsconfigRootDir: null },
  'root': true,
  'ignorePatterns': [
    'dist',
    'node_modules',
    '**/node_modules',
    '**/dist',
    'docs',
    'build',
    'coverage',
    'public',
    'scripts',
    '.yarn',
    '.*'
  ],
  'rules': {
    'id-denylist': ['warn', 'module'],
    'no-restricted-imports': [
      'warn',
      {
        'paths': [
          '@mui/system',
          'react-player',
          'filepond',
          'aos',
          'react-icons',
          '.',
          '..',
          '../..',
          '../../..',
          '../../../..',
          '../../../../..',
          '../../../../../..',
          '../../../../../../..'
        ]
      }
    ],
    'import/no-internal-modules': [
      'warn', {
        'allow': [
          '**/index.js', // Allow imports to any index.js file
          '**/index.ts',
          '**/index.jsx',
          '**/index.tsx'
        ]
      }
    ]
  }
}

module.exports = finalConfig
