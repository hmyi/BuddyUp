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

test("Facebook API returns a token and backend exchanges it for JWT", async () => {
  const fbAccessToken = "testFacebookAccessToken";

  // ✅ Fake Backend Response
  const backendResponse = {
    access: "testJwtaccessToken",
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

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

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


  await waitFor(() => {
    expect(jwtDecode).toHaveBeenCalledWith(backendResponse.access);
  });

  console.log("Facebook login Test Completed Successfully!");
});
