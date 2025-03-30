import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Profile from "../components/Profile";
import { AuthContext } from "../AuthContext";

const fakeUserData = {
  username: "John Doe",
  email: "john@example.com",
  profile_image: "http://example.com/image.jpg",
  location: "New York",
  bio: "Hello, world!",
  interests: ["Sports", "Music"]
};

beforeEach(() => {
  global.fetch = jest.fn();
});

test("shows loading message initially", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: () => new Promise(() => {})
  });
  await act(async () => {
    render(
      <AuthContext.Provider value={{ accessToken: "dummyToken" }}>
        <MemoryRouter initialEntries={["/profile/123"]}>
          <Routes>
            <Route path="/profile/:id" element={<Profile />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
  });
  expect(screen.getByText("Loading user profile...")).toBeInTheDocument();
});

test("shows error message when fetch fails", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: false,
    status: 400,
    json: () => Promise.resolve({})
  });
  await act(async () => {
    render(
      <AuthContext.Provider value={{ accessToken: "dummyToken" }}>
        <MemoryRouter initialEntries={["/profile/123"]}>
          <Routes>
            <Route path="/profile/:id" element={<Profile />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
  });
  await waitFor(() => {
    expect(screen.getByText("No user data found!")).toBeInTheDocument();
  });
});

test("renders profile correctly when fetch succeeds", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(fakeUserData)
  });
  await act(async () => {
    render(
      <AuthContext.Provider value={{ accessToken: "dummyToken" }}>
        <MemoryRouter initialEntries={["/profile/123"]}>
          <Routes>
            <Route path="/profile/:id" element={<Profile />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
  });
  await waitFor(() => {
    expect(screen.getByText(fakeUserData.username)).toBeInTheDocument();
  });
  expect(screen.getByText(fakeUserData.email)).toBeInTheDocument();
  expect(screen.getByText(fakeUserData.location)).toBeInTheDocument();
  expect(screen.getByText(fakeUserData.bio)).toBeInTheDocument();
  fakeUserData.interests.forEach((interest) => {
    expect(screen.getByText(interest)).toBeInTheDocument();
  });
  const img = screen.getByAltText("User Profile");
  expect(img).toHaveAttribute("src", fakeUserData.profile_image);
});
