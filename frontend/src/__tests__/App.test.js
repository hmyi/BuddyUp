import React from "react";
import { MemoryRouter } from "react-router-dom";
import { EventProvider } from "../EventContext";
import { jwtDecode } from "jwt-decode"
import App, { handleFacebookSuccess } from "../App";
import SearchPage from "../components/SearchPage";
import "@testing-library/jest-dom"; 
import { render, waitFor, act, screen } from "@testing-library/react";
import { AuthProvider } from "../AuthContext";

jest.mock("jwt-decode", () => ({
  __esModule: true,
  jwtDecode: jest.fn(() => ({
    username: "Farhan Hossein",
    email: "farhan.hossein@gmail.com",
    user_id: 1,
    profile_image_url: "/avatar.png" 
  }))
}));

beforeEach(() => {

  jest.restoreAllMocks();
  
  global.fetch = jest.fn((url) => {
    if (url.includes("/api/auth/facebook/")) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          access: "testJwtaccessToken",
          refresh: "testRefreshToken",
        }),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    });
  });
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

test("jwtDecode mock returns expected data", () => {
  const result = jwtDecode("testJwtaccessToken");
  expect(result).toEqual({
    username: "Farhan Hossein",
    email: "farhan.hossein@gmail.com",
    user_id: 1,
    avatar_url: "/avatar.png",
  });
});

test("jwtDecode mock returns expected data", () => {
  const result = jwtDecode("testJwtaccessToken");
  expect(result).toEqual({
    username: "Farhan Hossein",
    email: "farhan.hossein@gmail.com",
    user_id: 1,
    avatar_url: "/avatar.png",
  });
});

test("MemoryRouter import test", () => {
  expect(MemoryRouter).toBeDefined();
});

test("EventProvider import test", () => {
  expect(EventProvider).toBeDefined();
});

test("jwtDecode import test", () => {
  expect(jwtDecode).toBeDefined();
  expect(typeof jwtDecode).toBe("function");
  expect(jwtDecode).toHaveBeenCalled();
});

test("handleFacebookSuccess import test", () => {
  expect(handleFacebookSuccess).toBeDefined();
});

test("SearchPage import test", () => {
  expect(SearchPage).toBeDefined();
});

test("App import test", () => {
  expect(App).toBeDefined();
});

test("Facebook API returns a token and backend exchanges it for JWT", async () => {
  const response = { accessToken: "testFacebookAccessToken" };
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

  expect(global.fetch).toHaveBeenCalledTimes(1);
});

test("handles Facebook API failure gracefully", async () => {
  global.fetch.mockImplementationOnce(() =>
    Promise.resolve({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ detail: "Invalid token" }),
    })
  );

  const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

  await act(async () => {
    handleFacebookSuccess({ accessToken: "invalidToken" });
  });

  await waitFor(() => {
    expect(consoleError).toHaveBeenCalledWith(
      "API Response does not contain 'access' token:",
      expect.objectContaining({ detail: "Invalid token" })
    );
  });

  consoleError.mockRestore();
});

test("decodes JWT token and sets userProfile correctly", async () => {
  localStorage.setItem("accessToken", "testJwtaccessToken");
  
  await act(async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <EventProvider>
            <App />
          </EventProvider>
        </AuthProvider>
      </MemoryRouter>
    );
  });

  await waitFor(() => {
    expect(jwtDecode).toHaveBeenCalledWith("testJwtaccessToken");
  });
});
test("renders login button when user is not signed in", async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
  });

  expect(await screen.findByText(/Login/i)).toBeInTheDocument();
});