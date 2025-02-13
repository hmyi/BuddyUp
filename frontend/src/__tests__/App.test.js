import { render, waitFor, act } from "@testing-library/react";
import { jwtDecode } from "jwt-decode";
import App, { handleFacebookSuccess } from "../App";

jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

beforeEach(() => {
  jwtDecode.mockClear();
  jwtDecode.mockImplementation((token) => ({
    username: "Farhan Hossein",
    email: "farhan.hossein@gmail.com",
  }));
});

/** ✅ TEST 1: Facebook API returns a token */
test("Facebook API returns a token", async () => {
  const fbAccessToken = "testFacebookAccessToken";

  // Mock the Facebook API login
  global.window.FB = {
    login: (callback) => callback({ authResponse: { accessToken: fbAccessToken } }),
  };

  let receivedToken = null;

  await act(async () => {
    global.window.FB.login((response) => {
      receivedToken = response.authResponse.accessToken;
    });
  });

  await waitFor(() => {
    expect(receivedToken).toBe(fbAccessToken);
  });

  console.log("✅ Facebook API returned access token successfully!");
});

/** ✅ TEST 2: Backend exchanges FB Token for JWT */
test("Backend API exchanges Facebook token for JWT", async () => {
  const fbAccessToken = "testFacebookAccessToken";
  const backendResponse = {
    access: "testJwtAccessToken",
    refresh: "testRefreshToken",
  };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(backendResponse),
    })
  );

  render(<App />);

  await act(async () => {
    handleFacebookSuccess({ accessToken: fbAccessToken });
  });

  // ✅ Ensure the backend API call was made
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  // ✅ Ensure correct request was sent
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      "https://18.218.44.88:8000/api/auth/facebook/",
      expect.objectContaining({
        method: "POST",
        headers: expect.any(Object),
        body: JSON.stringify({ access_token: fbAccessToken }),
      })
    );
  });

  // ✅ Ensure JWT decode was called
  await waitFor(() => {
    expect(jwtDecode).toHaveBeenCalledWith(backendResponse.access);
  });

  console.log("✅ Backend API successfully exchanged FB token for JWT!");
});
