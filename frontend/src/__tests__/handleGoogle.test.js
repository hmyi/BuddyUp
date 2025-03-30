import { act } from '@testing-library/react';
import { handleGoogleSuccess, handleGoogleFailure } from '../auth/handleGoogle';
import decodeToken from '../utils/decodeToken';

jest.mock('../utils/decodeToken');

describe('handleGoogle', () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('stores the token in localStorage and calls provided functions when backend returns an access token', async () => {
    const fakeResponse = { credential: 'testGoogleIdToken' };
    const fakeBackendResponse = { access: 'testAccessToken', refresh: 'testRefreshToken' };

   global.fetch.mockResolvedValue({
      json: () => Promise.resolve(fakeBackendResponse),
    });

    const setIsSignedIn = jest.fn();
    const setUserProfile = jest.fn();
    const setOpenLoginDialog = jest.fn();
    const navigate = jest.fn();

    decodeToken.mockReturnValue({
      username: 'testUser',
      email: 'test@example.com',
      user_id: 123,
      profile_image_url: 'http://example.com/pic.jpg',
    });

    await act(async () => {
      await handleGoogleSuccess(fakeResponse, {
        setIsSignedIn,
        setUserProfile,
        setOpenLoginDialog,
        navigate,
      });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(localStorage.getItem('accessToken')).toBe('testAccessToken');
    expect(setIsSignedIn).toHaveBeenCalledWith(true);
    expect(setOpenLoginDialog).toHaveBeenCalledWith(false);
    expect(decodeToken).toHaveBeenCalledWith('testAccessToken');
    expect(navigate).toHaveBeenCalledWith('/');

    expect(localStorage.getItem('userProfile')).toEqual(
      JSON.stringify({
        name: 'testUser',
        email: 'test@example.com',
        userID: 123,
        picture: { data: { url: 'http://example.com/pic.jpg' } },
      })
    );
  });

  test('logs an error if backend returns no access token', async () => {
    const fakeResponse = { credential: 'testGoogleIdToken' };
    const fakeBackendResponse = { noAccess: true };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(fakeBackendResponse),
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      await handleGoogleSuccess(fakeResponse, {});
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'No access token received from backend',
      fakeBackendResponse
    );
    consoleSpy.mockRestore();
  });

  test('handles a fetch error', async () => {
    const fakeResponse = { credential: 'testGoogleIdToken' };

    global.fetch.mockRejectedValue(new Error('Network Error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      await handleGoogleSuccess(fakeResponse, {});
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error during Google login:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });

  test('handleGoogleFailure logs the error', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Google Error');
    handleGoogleFailure(error);
    expect(consoleSpy).toHaveBeenCalledWith('Google Auth Error:', error);
    consoleSpy.mockRestore();
  });
});
