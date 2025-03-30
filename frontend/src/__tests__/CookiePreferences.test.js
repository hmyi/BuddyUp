import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CookiePreferences from "../pages/CookiePreferences";

describe("CookiePreferences page", () => {
  test("renders heading and text", () => {
    render(<CookiePreferences />);
    expect(screen.getByRole("heading", { name: /cookie preferences/i })).toBeInTheDocument();
    expect(screen.getByText(/this site does not use analytics or marketing cookies/i)).toBeInTheDocument();
  });
});
