module.exports = {
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-router-dom|@mui/x-date-pickers|@babel/runtime|axios)/)'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy'
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
    '!src/**/reportWebVitals.{js,jsx,ts,tsx}',
    '!src/**/test-utils.{js,jsx,ts,tsx}',
    '!src/**/__dummyData__/**'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/__dummyData__/'
  ]
};
