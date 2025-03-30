
describe("index.js minimal pass test", () => {
    beforeAll(() => {
      const rootDiv = document.createElement("div");
      rootDiv.id = "root";
      document.body.appendChild(rootDiv);
    });
  
    it("runs without crashing", () => {
      require("../index.js");
    });
  });
  