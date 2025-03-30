import React from "react";
import { render, screen, fireEvent, within, waitForElementToBeRemoved } from "@testing-library/react";
import Footer from "../components/Footer";
import { MemoryRouter } from "react-router-dom";

test("opens dialog with correct title when 'Terms of Service' link is clicked and then closes it", async () => {
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );
  const tosLink = screen.getAllByText("Terms of Service")[0];
  fireEvent.click(tosLink);
  const dialog = screen.getByRole("dialog");
  expect(dialog).toBeInTheDocument();
  
  const closeButton = screen.getByText("Close");
  fireEvent.click(closeButton);
  await waitForElementToBeRemoved(() => screen.queryByRole("dialog"));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
