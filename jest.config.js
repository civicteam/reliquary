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
      branches: 55,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ['lcov'],
  coverageDirectory: 'reports/coverage',
  testResultsProcessor: './node_modules/jest-stare',
  verbose: true,
};
