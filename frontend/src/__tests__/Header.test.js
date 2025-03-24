


import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../components/Header";
import { AuthContext } from "../AuthContext";
import { useEventContext } from "../EventContext";
import { MemoryRouter } from "react-router-dom";

import { useNavigate } from "react-router-dom";
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../EventContext", () => ({
  useEventContext: () => ({
    city: "",
    setCity: jest.fn(),
  }),
}));

describe("Header component", () => {
  const mockNavigate = jest.fn();
  const mockSetCity = jest.fn();
  const dummyHandleLogout = jest.fn();
  const dummyHandleMenuOpen = jest.fn();
  const dummyHandleMenuClose = jest.fn();
  const dummySetOpenSnackBar = jest.fn();
  const dummyOpenLoginDialog = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  const renderHeader = (authValue) => {
    return render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter>
          <Header
            handleLogout={dummyHandleLogout}
            anchorEl={null}
            handleMenuOpen={dummyHandleMenuOpen}
            handleMenuClose={dummyHandleMenuClose}
            setOpenSnackBar={dummySetOpenSnackBar}
            openLoginDialog={dummyOpenLoginDialog}
          />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  test("renders login button when not signed in", () => {
    renderHeader({ isSignedIn: false, userProfile: null });
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("renders avatar when signed in", () => {
    const userProfile = {
      userID: 1,
      picture: { data: { url: "https://example.com/avatar.jpg" } },
    };
    renderHeader({ isSignedIn: true, userProfile });
    const avatarImg = screen.getByRole("img");
    expect(avatarImg).toHaveAttribute("src", "https://example.com/avatar.jpg");
  });

  test("navigates to home when logo is clicked", () => {
    renderHeader({ isSignedIn: false, userProfile: null });
    const logoElement = screen.getByText("BuddyUp");
    fireEvent.click(logoElement);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("performs search when pressing Enter", () => {

    const setCityMock = jest.fn();
    jest.spyOn(require("../EventContext"), "useEventContext").mockReturnValue({
      city: "",
      setCity: setCityMock,
    });

    renderHeader({ isSignedIn: false, userProfile: null });
    const searchInput = screen.getByPlaceholderText("Search for groups or events");
    
    fireEvent.change(searchInput, { target: { value: "Toronto meeting" } });
    fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter" });
    
    expect(setCityMock).toHaveBeenCalledWith("Toronto");
    expect(mockNavigate).toHaveBeenCalledWith("/search?query=meeting");
  });
});
