module.exports = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleDirectories: ["node_modules", "src"],
  transformIgnorePatterns: ["/node_modules/(?!react-router-dom)"],
  testEnvironment: "jsdom",
};
