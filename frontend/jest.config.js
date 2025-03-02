module.exports = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleDirectories: ["node_modules", "src"],
  transformIgnorePatterns: ["/node_modules/(?!(react-router-dom|@mui|@emotion|@remix-run|dayjs)/)"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  moduleNameMapper: {
    "^@mui/(.*)$": "<rootDir>/node_modules/@mui/$1"
  },
  // Mock all MUI modules to avoid issues with ES modules
  moduleNameMapper: {
    "^@mui/x-date-pickers/(.*)$": "<rootDir>/src/__mocks__/emptyMock.js",
    "^@mui/material/(.*)$": "<rootDir>/src/__mocks__/emptyMock.js",
    "^@mui/icons-material/(.*)$": "<rootDir>/src/__mocks__/emptyMock.js"
  }
};
