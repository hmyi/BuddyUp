module.exports = {
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  // Tell Jest to transform these packages even though they're in node_modules:
  transformIgnorePatterns: [
    "/node_modules/(?!(react-router-dom|@mui/x-date-pickers|@babel/runtime)/)"
  ],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy"
  },
  moduleFileExtensions: ["js", "jsx", "json"]
};
