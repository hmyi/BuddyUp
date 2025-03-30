import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import EventCreation from "../components/EventCreation";
import { AuthContext } from "../AuthContext";
import dayjs from "dayjs";
import "dayjs/locale/en";
import axios from "axios";

dayjs.locale("en");
jest.mock("axios");

const mockOnClose = jest.fn();
const mockSetOpenSnackBar = jest.fn();
const mockAuthContextValue = { accessToken: "mock-access-token" };

jest.mock("../components/CityLocationAutoComplete.js", () => {
  return function MockAutoComplete({ location, setLocation, locationError }) {
    return (
      <div>
        <label htmlFor="mocked-location">Location</label>
        <input
          id="mocked-location"
          data-testid="mock-location-input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        {locationError && <span>{locationError}</span>}
      </div>
    );
  };
});

describe("EventCreation component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders and shows initial fields when open = true", () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <EventCreation
          open
          onClose={mockOnClose}
          setOpenSnackBar={mockSetOpenSnackBar}
        />
      </AuthContext.Provider>
    );
    expect(screen.getAllByText(/Event Name/i).length).toBeGreaterThan(0);
    const previousButton = screen.getByRole("button", { name: /Previous/i });
    expect(previousButton).toBeDisabled();
    const nextButton = screen.getByRole("button", { name: /Next/i });
    expect(nextButton).not.toBeDisabled();
  });

  test("transitions to step 1 when valid event name is provided", async () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <EventCreation
          open
          onClose={mockOnClose}
          setOpenSnackBar={mockSetOpenSnackBar}
        />
      </AuthContext.Provider>
    );
    const eventNameInput = screen.getByLabelText(/Event Name/i);
    fireEvent.change(eventNameInput, { target: { value: "Test Event" } });
    const nextButton = screen.getByRole("button", { name: /Next/i });
    await act(async () => {
      fireEvent.click(nextButton);
    });
    await waitFor(() => {
      const allStartTimeEls = screen.getAllByText(/Start Time/i);
      expect(allStartTimeEls.length).toBeGreaterThan(0);
    });
  });
});

test("does not transition to step 1 if event name is empty", async () => {
  render(
    <AuthContext.Provider value={mockAuthContextValue}>
      <EventCreation
        open
        onClose={mockOnClose}
        setOpenSnackBar={mockSetOpenSnackBar}
      />
    </AuthContext.Provider>
  );
  const nextButton = screen.getByRole("button", { name: /Next/i });
  await act(async () => {
    fireEvent.click(nextButton);
  });
  expect(screen.getByText(/Event name cannot be empty/i)).toBeInTheDocument();
  expect(screen.queryByText(/Start Time/i)).not.toBeInTheDocument();
});

test("goes from step 1 to step 2 when location is provided", async () => {
  render(
    <AuthContext.Provider value={mockAuthContextValue}>
      <EventCreation open onClose={mockOnClose} setOpenSnackBar={mockSetOpenSnackBar} />
    </AuthContext.Provider>
  );
  fireEvent.change(screen.getByLabelText(/Event Name/i), {
    target: { value: "Some Event" },
  });
  fireEvent.click(screen.getByRole("button", { name: /Next/i }));
  fireEvent.change(screen.getByTestId("mock-location-input"), {
    target: { value: "Toronto" },
  });
  fireEvent.click(screen.getByRole("button", { name: /Next/i }));
  await waitFor(() => {
    expect(
      screen.getByText(/Generate event description with GPT-4o mini/i)
    ).toBeInTheDocument();
  });
});

test("submits form and shows success message", async () => {
  axios.post.mockResolvedValueOnce({ data: { id: 999, title: "Test Title" } });
  render(
    <AuthContext.Provider value={mockAuthContextValue}>
      <EventCreation open onClose={mockOnClose} setOpenSnackBar={mockSetOpenSnackBar} />
    </AuthContext.Provider>
  );
  fireEvent.change(screen.getByLabelText(/Event Name/i), {
    target: { value: "My Final Test Event" },
  });
  fireEvent.click(screen.getByRole("button", { name: /Next/i }));
  fireEvent.change(screen.getByTestId("mock-location-input"), {
    target: { value: "Toronto" },
  });
  fireEvent.click(screen.getByRole("button", { name: /Next/i }));
  fireEvent.change(screen.getByLabelText(/Event Description/i), {
    target: { value: "Some Description" },
  });
  fireEvent.click(screen.getByRole("button", { name: /Create/i }));
  await waitFor(() => {
    expect(mockSetOpenSnackBar).toHaveBeenCalledWith({
      open: true,
      msg: "Event created successfully!",
    });
  });
  expect(axios.post).toHaveBeenCalledWith(
    "https://18.226.163.235:8000/api/events/new/",
    expect.any(FormData),
    expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: "Bearer mock-access-token",
      }),
    })
  );
  expect(mockOnClose).toHaveBeenCalled();
});
