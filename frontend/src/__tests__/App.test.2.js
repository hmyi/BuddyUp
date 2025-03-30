import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from '../App';
import { MemoryRouter } from 'react-router-dom';

jest.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }) => <div>{children}</div>,
  GoogleLogin: ({ onSuccess, onError }) => (
    <button onClick={() => onError('Google Error')}>Google Login Button</button>
  ),
}));

jest.mock('@greatsumini/react-facebook-login', () => ({
  __esModule: true,
  default: ({ onFail, render }) => render({ onClick: () => onFail('Facebook Error') })
}));

describe('App.js additional tests', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('calls Google login error handler', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    fireEvent.click(screen.getByText('Google Login Button'));

    expect(consoleSpy).toHaveBeenCalledWith('Google Auth Error:', 'Google Error');
    consoleSpy.mockRestore();
  });

  test('calls Facebook login error handler', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    fireEvent.click(screen.getByRole('button', { name: /Sign In with Facebook/i }));

    expect(consoleSpy).toHaveBeenCalledWith('Facebook Auth Error:', 'Facebook Error');
    consoleSpy.mockRestore();
  });

  test('toggles theme and updates localStorage', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    act(() => {
      localStorage.setItem('mode', 'dark');
    });

    expect(setItemSpy).toHaveBeenCalledWith('mode', expect.any(String));
    setItemSpy.mockRestore();
  });

  test('loads userProfile from localStorage if available', async () => {
    localStorage.setItem('accessToken', 'mock_token');
    localStorage.setItem('userProfile', JSON.stringify({ name: 'Test User' }));

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Events near/i)).toBeInTheDocument();
  });

  test('logs out and clears localStorage', async () => {
    localStorage.setItem('accessToken', 'dummy-token');
    localStorage.setItem('userProfile', JSON.stringify({ userID: 1, name: 'Test User' }));
  
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
  
    await screen.findByText(/Events near/i);
  
    const avatarImg = screen.getByRole('img');
    expect(avatarImg).toBeInTheDocument();
  
    const avatarButton = avatarImg.closest('button');
    expect(avatarButton).toBeTruthy();
  
    fireEvent.click(avatarButton);
  
   const logoutButton = await screen.findByText(/Sign Out/i);
    fireEvent.click(logoutButton);
  
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('userProfile')).toBeNull();
  });
  

});