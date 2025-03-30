import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TermsOfService from "../pages/TermsOfService";

describe("TermsOfService page", () => {
  test("renders heading and some section text", () => {
    render(<TermsOfService />);

    expect(
      screen.getByRole("heading", { name: /terms of service/i })
    ).toBeInTheDocument();

  });
});
