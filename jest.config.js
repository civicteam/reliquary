// jest.config.js
module.exports = {
  testURL: 'http://localhost/',
  collectCoverageFrom: [
    '**/src/**/*.js',
    '!**/node_modules/**',
    '!**/src/index.js',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  coverageReporters: ['lcov'],
  coverageDirectory: 'reports/coverage',
  testResultsProcessor: './node_modules/jest-stare',
  verbose: true,
};
