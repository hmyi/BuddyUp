import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PrivacyPolicy from "../pages/PrivacyPolicy";

describe("PrivacyPolicy page", () => {
  test("renders heading and text", () => {
    render(<PrivacyPolicy />);
    expect(
        screen.getByRole("heading", { name: /^privacy policy$/i })
      ).toBeInTheDocument();
        });
});
