localStorage.setItem("accessToken", "testToken");

import { render, waitFor, act } from "@testing-library/react";
import { jwtDecode } from "jwt-decode";
import App, { handleFacebookSuccess } from "./App";

jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

beforeEach(() => {
  jwtDecode.mockClear();
  jwtDecode.mockImplementation((token) => ({
    username: "Farhan Hossein",
    email: "farhan.hossein@gmail.com",
    user_id: 1,
    avatar_url: "/avatar.png",
  }));
});
jest.mock("react-router-dom");

// Global fetch mock for all tests:
global.fetch = jest.fn((url) => {
    if (url.includes("/api/auth/facebook/")) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({
          access: "testJwtaccessToken",
          refresh: "testRefreshToken",
        }),
      });
    } else if (url.includes("/api/events/joined/")) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => [], 
      });
    } else if (url.includes("/api/events/created")) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => [], 
      });
    } else if (url.includes("/api/events/fetch/random/")) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => [], // Random events as an array
      });
    } else {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => [],
      });
    }
  });
  

  global.fetch = jest.fn((url) => {
    if (url.includes("/api/events/")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            category: "Food",
            start_time: "2025-03-19T11:00:00Z",
            end_time: "2025-03-19T16:00:00Z",
            status: "active",
            title: "Sample Event",
            description: "Event description",
            location: "Sample Location",
            city: "Toronto",
            capacity: 100,
            attendance: 10,
            participants: [],
          }),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });