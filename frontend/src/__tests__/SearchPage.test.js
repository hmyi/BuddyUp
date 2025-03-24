
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; 
import { MemoryRouter, Routes, Route } from "react-router-dom";
import SearchPage from "../components/SearchPage"; 
import { EventContext } from "../EventContext";

const dummyEventContextValue = {
  events: [], 
  setEvents: jest.fn(),
  city: "Waterloo",
  setCity: jest.fn(),
  category: "Social",
  setCategory: jest.fn(),
};

test('renders search results heading when query parameter is present', () => {
  render(
    <EventContext.Provider value={dummyEventContextValue}>
      <MemoryRouter initialEntries={["/search?query=music"]}>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>
    </EventContext.Provider>
  );

  expect(screen.getByText(/Search results for "music"/i)).toBeInTheDocument();
});
