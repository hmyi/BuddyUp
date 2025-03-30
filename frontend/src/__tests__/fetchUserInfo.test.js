import { fetchUserInfo } from '../components/fetchUserInfo';

describe('fetchUserInfo', () => {
  const mockUserID = 42;
  const mockToken = 'test-token';

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('returns user data when request succeeds', async () => {
    const mockData = { id: mockUserID, username: 'testuser' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchUserInfo(mockUserID, mockToken);
    expect(fetch).toHaveBeenCalledWith(
      `https://18.226.163.235:8000/api/users/${mockUserID}/`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      }
    );
    expect(result).toEqual(mockData);
  });

  test('throws an error when response is not ok', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(fetchUserInfo(mockUserID, mockToken)).rejects.toThrow(
      `Failed to fetch user ${mockUserID} info: 404`
    );
  });
});
