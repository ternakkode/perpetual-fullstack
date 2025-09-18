module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  projects: [
    // Unit tests
    {
      displayName: 'unit',
      rootDir: 'src',
      testRegex: '.*\\.spec\\.ts$',
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
      },
      collectCoverageFrom: [
        '**/*.(t|j)s',
      ],
      coverageDirectory: '../coverage',
      testEnvironment: 'node',
      moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/$1',
      },
    },
    // E2E tests
    {
      displayName: 'e2e',
      rootDir: 'test',
      testEnvironment: 'node',
      testRegex: '.e2e-spec.ts$',
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest'
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/../src/$1'
      },
      setupFilesAfterEnv: ['<rootDir>/setup-tests.ts'],
      maxWorkers: 1
    }
  ]
};