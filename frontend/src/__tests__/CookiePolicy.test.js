import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CookiePolicy from "../pages/CookiePolicy";

describe("CookiePolicy page", () => {
  test("renders headings and key content", () => {
    render(<CookiePolicy openCookiePreferencesDialog={jest.fn()} />);

    expect(screen.getByText(/What Are Cookies\?/i)).toBeInTheDocument();
    expect(screen.getByText(/We store your login tokens/i)).toBeInTheDocument();

    const contactUs = screen.getAllByText(/Contact Us/i);
    expect(contactUs.length).toBeGreaterThan(0);

    const prefs = screen.getAllByText(/Manage Your Cookie Preferences/i);
    expect(prefs.length).toBeGreaterThan(0);

    expect(screen.getByText(/click here/i)).toBeInTheDocument();
  });

  test("clicking 'click here' triggers dialog callback", () => {
    const mockDialog = jest.fn();
    render(<CookiePolicy openCookiePreferencesDialog={mockDialog} />);
    fireEvent.click(screen.getByText(/click here/i));
    expect(mockDialog).toHaveBeenCalled();
  });
});
