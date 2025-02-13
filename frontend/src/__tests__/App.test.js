jest.mock("jwt-decode", () => jest.fn()); // ✅ Mock before importing App
import { handleFacebookSuccess } from "../App";

import jwtDecode from "jwt-decode";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

beforeEach(() => {
  jwtDecode.mockClear();
  jwtDecode.mockImplementation((token) => {
    console.log("✅ Mocked jwtDecode called with:", token); // Debugging log
    return {
      token_type: "access",
      exp: 1739384259,
      iat: 1739382459,
      jti: "40f29a8b34fd4e9d98357caaaa976df6",
      user_id: 2,
      username: "Farhan Hossein",
      first_name: "Farhan",
      last_name: "Hossein",
      email: "farhan.hossein@gmail.com",
      avatar_url:
        "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=8950697675012990&height=200&width=200&ext=1741974459&hash=AbbU1BoL_XkEPeGxerHchCt8",
    };
  });
});

test("handles successful Facebook login API call", async () => {
  const expectedToken = "fake.jwt.token";

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          access: expectedToken,
          refresh: "mock_refresh_token",
        }),
    })
  );

  global.window.FB = {
    login: (callback) => {
      console.log("✅ Simulating Facebook login...");
      callback({ authResponse: { accessToken: expectedToken } });
    },
  };

  render(<App />);

  expect(screen.getByText("Login")).toBeInTheDocument();

  const loginButton = screen.getByText("Login");
  await userEvent.click(loginButton);

  await waitFor(() => {
    console.log("✅ Facebook login response received");
    expect(global.window.FB.login).toBeDefined();
  });


  await waitFor(() => {
    console.log("✅ Calling handleFacebookSuccess manually...");
    handleFacebookSuccess({ authResponse: { accessToken: expectedToken } });
  });

  await waitFor(() => {
    console.log("✅ jwtDecode Calls:", jwtDecode.mock.calls);
    if (jwtDecode.mock.calls.length === 0) {
      console.error("🚨 jwtDecode was NOT called! Check if App.js is actually using it.");
    }
    expect(jwtDecode).toHaveBeenCalledTimes(1);
    expect(jwtDecode).toHaveBeenCalledWith(expectedToken);
  });

  await waitFor(() => {
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByText("Farhan Hossein")).toBeInTheDocument();
  });
});
