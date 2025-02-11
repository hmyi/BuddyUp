import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

test("handles successful Facebook login API call", async () => {
  // Render the App wrapped with a MemoryRouter so that routing works properly.
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  // 1. Click the "Login" button to open the login dialog.
  fireEvent.click(screen.getByText(/login/i));

  // Optionally, you can debug the DOM here:
  // screen.debug();

  // 2. Now that the dialog is open, click the "Sign in with Facebook" button.
screen.getByText(/sign in with facebook/i);

  // 3. Wait for the expected result (e.g., "mock-jwt-token" appears) after login.
  await waitFor(() => {
    expect(screen.getByText("mock-jwt-token")).toBeInTheDocument();
  });
});
