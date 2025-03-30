import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import InterestsTab from "../components/InterestsTab";
import { MemoryRouter } from "react-router-dom";

const userProfile = { userID: 123 };
const accessToken = "dummyToken";

beforeEach(() => {
  global.fetch = jest.fn();
  jest.clearAllMocks();
});

test("shows error when userProfile or accessToken are missing", async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <InterestsTab />
      </MemoryRouter>
    );
  });
  expect(screen.getByText("Failed to load user profile")).toBeInTheDocument();
});

test("renders interests after fetching user data", async () => {
  const fakeData = { interests: ["Social", "Food"] };
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(fakeData),
  });
  await act(async () => {
    render(
      <MemoryRouter>
        <InterestsTab userProfile={userProfile} accessToken={accessToken} />
      </MemoryRouter>
    );
  });
  expect(screen.queryByText("Loading user interests...")).not.toBeInTheDocument();
  fakeData.interests.forEach((interest) => {
    expect(screen.getByText(interest)).toBeInTheDocument();
  });
});

test("toggles chip selection when clicked", async () => {
  const fakeData = { interests: ["Social"] };
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(fakeData),
  });
  await act(async () => {
    render(
      <MemoryRouter>
        <InterestsTab userProfile={userProfile} accessToken={accessToken} />
      </MemoryRouter>
    );
  });
  const chip = screen.getByText("Social");
  fireEvent.click(chip);
  fireEvent.click(chip);
  expect(chip).toBeInTheDocument();
});

test("saves interests and shows success snackbar", async () => {
  const fakeData = { interests: ["Social"] };
  global.fetch
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(fakeData),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });
  await act(async () => {
    render(
      <MemoryRouter>
        <InterestsTab userProfile={userProfile} accessToken={accessToken} />
      </MemoryRouter>
    );
  });
  const saveButton = screen.getByRole("button", { name: /Save Interests/i });
  fireEvent.click(saveButton);
  await waitFor(() => {
    expect(screen.getByText("Interests saved successfully")).toBeInTheDocument();
  });
});

test("handles error when saving interests and shows error snackbar", async () => {
  const fakeData = { interests: ["Social"] };
  global.fetch
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(fakeData),
    })
    .mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({}),
    });
  await act(async () => {
    render(
      <MemoryRouter>
        <InterestsTab userProfile={userProfile} accessToken={accessToken} />
      </MemoryRouter>
    );
  });
  const saveButton = screen.getByRole("button", { name: /Save Interests/i });
  fireEvent.click(saveButton);
  await waitFor(() => {
    expect(screen.getByText("Error updating interests")).toBeInTheDocument();
  });
});
