// HomePage.test.js
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import HomePage from "../components/HomePage";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return { ...original, useNavigate: () => mockNavigate };
});

jest.mock("../components/EventCard", () => (props) => <div data-testid="event-card">{props.event.name}</div>);

beforeEach(() => {
  global.fetch = jest.fn();
  jest.clearAllMocks();
});

test("fetches events and renders event cards", async () => {
  const fakeEvents = [{ id: 1, name: "Event 1" }, { id: 2, name: "Event 2" }];
  global.fetch.mockResolvedValue({ json: () => Promise.resolve(fakeEvents) });
  await act(async () => {
    render(
      <MemoryRouter>
        <HomePage userProfile={{}} accessToken="dummy" openSnackBar={false} setOpenSnackBar={jest.fn()} />
      </MemoryRouter>
    );
  });
  const cards = await screen.findAllByTestId("event-card");
  expect(cards).toHaveLength(fakeEvents.length);
  expect(screen.getByText("Events near Waterloo")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /View All Events/i })).toBeInTheDocument();
});

test("navigates to /search when 'View All Events' is clicked", async () => {
  global.fetch.mockResolvedValue({ json: () => Promise.resolve([]) });
  await act(async () => {
    render(
      <MemoryRouter>
        <HomePage userProfile={{}} accessToken="dummy" openSnackBar={false} setOpenSnackBar={jest.fn()} />
      </MemoryRouter>
    );
  });
  const button = screen.getByRole("button", { name: /View All Events/i });
  fireEvent.click(button);
  expect(mockNavigate).toHaveBeenCalledWith("/search");
});



