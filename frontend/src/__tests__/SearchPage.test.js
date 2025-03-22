import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { EventProvider } from "../EventContext";
import SearchPage from "../components/SearchPage";
import '@testing-library/jest-dom';


test("SearchPage reads query parameters", async () => {
  render(
    <MemoryRouter initialEntries={["/search?query=test"]}>
      <EventProvider>
        <SearchPage />
      </EventProvider>
    </MemoryRouter>
  );

  const heading = await screen.findByText(/Search results for "test"/i);
  expect(heading).toBeInTheDocument();
});
