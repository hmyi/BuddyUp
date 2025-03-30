import { render, waitFor, act } from "@testing-library/react";
import { jwtDecode } from "jwt-decode";
import { handleFacebookSuccess } from "../auth/handleFacebook";


test("Facebook API returns a token and backend exchanges it for JWT", async () => {
  const fbAccessToken = "testFacebookAccessToken";
  const response = { accessToken: fbAccessToken };
  const backendResponse = {
    access: "testJwtaccessToken",
    refresh: "testRefreshToken",
  };

  const originalFetch = global.fetch;
  global.fetch = jest.fn((url) => {
    if (url === "https://18.226.163.235:8000/api/auth/facebook/") {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(backendResponse),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    });
  });

  const setIsSignedIn = jest.fn();
  const setAccessToken = jest.fn();
  const setUserProfile = jest.fn();
  const setOpenLoginDialog = jest.fn();

  await act(async () => {
    handleFacebookSuccess(response, {
      setIsSignedIn,
      setAccessToken,
      setUserProfile,
      setOpenLoginDialog,
    });
  });

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });


  global.fetch = originalFetch;
});
