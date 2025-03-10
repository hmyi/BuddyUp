test("Can Jest resolve react-router-dom?", () => {
  expect(() => require("react-router-dom")).not.toThrow();
});
