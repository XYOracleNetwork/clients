const finalConfig = {
  'extends': ['@xylabs'],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', project: './tsconfig-eslint.json', sourceType: 'module', tsconfigRootDir: null },
  'root': true,
  'rules': {
    'id-denylist': ['warn', 'module']
  }
}

module.exports = finalConfig
