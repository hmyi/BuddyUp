import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchEventCard from "../components/SearchEventCard";
import { AuthContext } from "../AuthContext";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
  };
});

const now = new Date();
const thirtyMinutesLater = new Date(now.getTime() + 30 * 60 * 1000).toISOString();
const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString();

const baseEvent = {
  id: 1,
  title: "Test Event",
  start_time: thirtyMinutesLater,
  end_time: twoHoursLater,
  capacity: 100,
  participants: [],
  event_image_url: "http://example.com/event.jpg",
  category: "sports",
  city: "Test City",
  description: "This is a test event description that is long enough to be truncated.",
};

const renderCard = (event, userProfile = { userID: 42 }) => {
  render(
    <AuthContext.Provider value={{ userProfile }}>
      <MemoryRouter>
        <SearchEventCard event={event} />
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

test("renders event details", () => {
  renderCard(baseEvent);
  expect(screen.getByText("Test Event")).toBeInTheDocument();
  expect(screen.getByText(/going/i)).toBeInTheDocument();
  expect(screen.getByText(/spots left/i)).toBeInTheDocument();
  expect(screen.getByText("Test City")).toBeInTheDocument();
  expect(screen.getByText("sports")).toBeInTheDocument();
});

test("displays Attending badge when user is attending", () => {
  const event = { ...baseEvent, participants: [42, 50] };
  renderCard(event);
  expect(screen.getByText("Attending")).toBeInTheDocument();
});

test("displays Event Full badge when no spots left", () => {
  const event = { ...baseEvent, capacity: 2, participants: [10, 20] };
  renderCard(event);
  expect(screen.getByText("Event Full")).toBeInTheDocument();
});

test("displays Starting Soon badge when applicable", () => {
  const event = { ...baseEvent, capacity: 100, participants: [] };
  renderCard(event);
  expect(screen.getByText("Starting Soon")).toBeInTheDocument();
});

test("navigates to event details on card click", () => {
  renderCard(baseEvent);
  fireEvent.click(screen.getByText("Test Event"));
  expect(mockNavigate).toHaveBeenCalledWith(`/events/${baseEvent.id}`, { state: { event: baseEvent } });
});
