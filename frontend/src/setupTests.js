import '@testing-library/jest-dom';


beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes("/api/auth/facebook/")) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({
          access: "testJwtaccessToken",
          refresh: "testRefreshToken",
        }),
      });
    }
    if (url.includes("/api/events/joined/")) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => [],
      });
    }
    if (url.includes("/api/events/created")) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => [],
      });
    }
    if (url.includes("/api/events/fetch/random/")) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => [],
      });
    }
    if (url.includes("/api/events/")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            category: "Food",
            start_time: "2025-03-19T11:00:00Z",
            end_time: "2025-03-19T16:00:00Z",
            status: "active",
            title: "Sample Event",
            description: "Event description",
            location: "Sample Location",
            city: "Toronto",
            capacity: 100,
            attendance: 10,
            participants: [],
          }),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });
});
