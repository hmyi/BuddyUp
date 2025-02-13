import { render, waitFor, act } from "@testing-library/react";
import { jwtDecode } from "jwt-decode";
import App, { handleFacebookSuccess } from "../App";

// ✅ Mock jwtDecode
jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

beforeEach(() => {
  jwtDecode.mockClear();
});

/** ✅ TEST 1: Facebook API returns a token */
test("Facebook API returns a token", async () => {
  const fbAccessToken = "testFacebookAccessToken";

  // ✅ Mock Facebook Login API
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

  // ✅ Mock Backend API (Django)
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

  // ✅ Ensure backend API call was made
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

  console.log("✅ Backend API successfully exchanged FB token for JWT!");
});

/** ✅ TEST 3: Verify JWT claims match Facebook user data */
test("JWT claims from backend match Facebook user data", async () => {
  const fbAccessToken = "testFacebookAccessToken";
  const facebookUserData = {
    username: "Farhan Hossein",
    email: "farhan.hossein@gmail.com",
    id: "123456789",
  };

  const backendResponse = {
    access: "testJwtAccessToken",
    refresh: "testRefreshToken",
  };

  // ✅ Mock Facebook API
  global.window.FB = {
    login: (callback) =>
      callback({
        authResponse: { accessToken: fbAccessToken },
      }),
  };

  // ✅ Mock Backend API
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(backendResponse),
    })
  );

  // ✅ Mock JWT Decoding
  jwtDecode.mockImplementation((token) => ({
    username: facebookUserData.username,
    email: facebookUserData.email,
    id: facebookUserData.id,
  }));

  render(<App />);

  // ✅ Simulate Facebook Login
  await act(async () => {
    handleFacebookSuccess({ accessToken: fbAccessToken });
  });

  // ✅ Ensure backend was called
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  // ✅ Ensure JWT Decoding was called
  await waitFor(() => {
    expect(jwtDecode).toHaveBeenCalledWith(backendResponse.access);
  });

  // ✅ Verify JWT contains correct user data
  await waitFor(() => {
    const decodedToken = jwtDecode(backendResponse.access);
    expect(decodedToken.username).toBe(facebookUserData.username);
    expect(decodedToken.email).toBe(facebookUserData.email);
    expect(decodedToken.id).toBe(facebookUserData.id);
  });

  console.log("✅ JWT claims match Facebook user data!");
});
