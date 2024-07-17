const generateJestConfig = ({ esModules }) => {
  const esModulesList = Array.isArray(esModules) ? esModules.join('|') : esModules
  return {
    coveragePathIgnorePatterns: ['<rootDir>/(.*)/dist'],
    extensionsToTreatAsEsm: ['.ts'],
    maxWorkers: '100%',
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    preset: 'ts-jest',
    runner: 'groups',
    setupFiles: ['dotenv/config'],
    setupFilesAfterEnv: ['jest-sorted', 'jest-extended/all', './packages/node/packages/express/packages/test/src/setupFiles.ts'],
    testRegex: String.raw`(/__tests__/.*|(\.|/)perf\.(test|spec))\.tsx?$`,
    testTimeout: 20_000,
    transform: {
      [`(${esModulesList}).+\\.js$`]: 'babel-jest',
      '^.+\\.tsx?$': [
        'ts-jest',
        {
          tsconfig: 'tsconfig.test.json',
          useESM: true,
        },
      ],
    },
    transformIgnorePatterns: [`./node_modules/(?!${esModulesList})`],
    workerThreads: true,
  }
}

module.exports = generateJestConfig({ esModules: ['is-ip', 'ip-regex', 'lodash-es', 'uuid'] })
