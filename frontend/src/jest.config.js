module.exports = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
  moduleDirectories: ["node_modules", "<rootDir>/node_modules", "src"], // ✅ Explicitly add node_modules
  transformIgnorePatterns: ["/node_modules/(?!react-router-dom)"],
};
