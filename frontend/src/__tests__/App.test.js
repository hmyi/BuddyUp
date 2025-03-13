
jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(() => ({
    username: "Farhan Hossein",
    email: "farhan.hossein@gmail.com",
    user_id: 1,
    avatar_url: "/avatar.png",
  })),
}));

const mockEvent = {
  id: 1,
  title: "Sample Event",
  category: "Food",
  start_time: "2025-03-19T11:00:00Z",
  end_time: "2025-03-19T16:00:00Z",
  status: "active",
  description: "Event description",
  location: "Sample Location",
  city: "Toronto",
  capacity: 100,
  attendance: 10,
  participants: [],
  creator: 2, 
};
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ access: "testJwtaccessToken", refresh: "testRefreshToken" }),
    })
  );
  localStorage.clear();
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

import React from "react";
import { MemoryRouter } from "react-router-dom";
import { EventProvider } from "../EventContext";
import { jwtDecode } from "jwt-decode";
import App, { handleFacebookSuccess } from "../App";
import SearchPage from "../components/SearchPage";

import "@testing-library/jest-dom"; 
import { render, waitFor, act, screen } from "@testing-library/react";

test("MemoryRouter import test", () => {
  expect(MemoryRouter).toBeDefined();
});

test("EventProvider import test", () => {
  expect(EventProvider).toBeDefined();
});

test("jwtDecode import test", () => {
  expect(jwtDecode).toBeDefined();
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
  await act(async () => {
    render(
      <MemoryRouter>
        <EventProvider>
          <App />
        </EventProvider>
      </MemoryRouter>
    );
  });

 await act(async () => {
    handleFacebookSuccess({ accessToken: "testFacebookAccessToken" }, {
      setIsSignedIn: () => {},
      setAccessToken: () => {},
      setUserProfile: () => {},
      setOpenLoginDialog: () => {}
    });
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