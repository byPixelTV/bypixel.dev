import { afterEach, beforeEach, expect, mock, setSystemTime, test } from "bun:test";

mock.module("server-only", () => ({}));
const { getSpotifyAccessToken, invalidateSpotifyAccessToken } =
  await import("../src/lib/spotify-token");
const { getNowPlaying } = await import("../src/lib/actions/spotify");
const originalFetch = globalThis.fetch;
const tokenResponse = () => Response.json({ access_token: "test-token", expires_in: 3600 });

beforeEach(() => {
  invalidateSpotifyAccessToken("test-token");
});
afterEach(() => {
  globalThis.fetch = originalFetch;
  setSystemTime();
});

test("concurrent and subsequent requests share one token refresh", async () => {
  const fetch = mock(async () => tokenResponse());
  globalThis.fetch = fetch;
  expect(await Promise.all(Array.from({ length: 10 }, () => getSpotifyAccessToken()))).toEqual(
    Array(10).fill("test-token"),
  );
  expect(await getSpotifyAccessToken()).toBe("test-token");
  expect(fetch).toHaveBeenCalledTimes(1);
});

test("tokens refresh before expiry", async () => {
  setSystemTime(new Date("2026-09-05T12:00:00Z"));
  const fetch = mock(async () => tokenResponse());
  globalThis.fetch = fetch;
  await getSpotifyAccessToken();
  setSystemTime(new Date("2026-09-05T12:58:00Z"));
  await getSpotifyAccessToken();
  expect(fetch).toHaveBeenCalledTimes(1);
  setSystemTime(new Date("2026-09-05T12:59:00Z"));
  await getSpotifyAccessToken();
  expect(fetch).toHaveBeenCalledTimes(2);
});

test("a failed refresh can recover on the next request", async () => {
  const fetch = mock()
    .mockResolvedValueOnce(new Response(null, { status: 503 }))
    .mockImplementation(async () => tokenResponse());
  globalThis.fetch = fetch;
  await expect(getSpotifyAccessToken()).rejects.toThrow("503");
  expect(await getSpotifyAccessToken()).toBe("test-token");
  expect(fetch).toHaveBeenCalledTimes(2);
});

test("invalid token responses are never cached", async () => {
  const fetch = mock()
    .mockResolvedValueOnce(Response.json({ expires_in: 3600 }))
    .mockImplementation(async () => tokenResponse());
  globalThis.fetch = fetch;
  await expect(getSpotifyAccessToken()).rejects.toThrow("no access token");
  expect(await getSpotifyAccessToken()).toBe("test-token");
});

test("recently played fallback reuses the current token", async () => {
  const fetch = mock()
    .mockResolvedValueOnce(tokenResponse())
    .mockResolvedValueOnce(new Response(null, { status: 204 }))
    .mockResolvedValueOnce(
      Response.json({
        items: [
          {
            played_at: "2026-09-05",
            track: {
              id: "song",
              name: "Test song",
              artists: [{ name: "Artist" }],
              album: { name: "Album", images: [] },
              external_urls: { spotify: "https://open.spotify.com/track/song" },
            },
          },
        ],
      }),
    );
  globalThis.fetch = fetch;
  expect(await getNowPlaying()).toMatchObject({
    title: "Test song",
    isRecent: true,
    isPlaying: false,
  });
  expect(fetch).toHaveBeenCalledTimes(3);
  expect(fetch.mock.calls[2][1].headers.Authorization).toBe("Bearer test-token");
});

test("a rejected access token is refreshed and the read retried", async () => {
  const fetch = mock()
    .mockResolvedValueOnce(tokenResponse())
    .mockResolvedValueOnce(new Response(null, { status: 401 }))
    .mockResolvedValueOnce(tokenResponse())
    .mockResolvedValueOnce(
      Response.json({
        currently_playing_type: "track",
        is_playing: true,
        progress_ms: 1234,
        item: {
          id: "song",
          name: "Live song",
          artists: [{ name: "Artist" }],
          album: { name: "Album" },
          external_urls: { spotify: "https://open.spotify.com/track/song" },
        },
      }),
    );
  globalThis.fetch = fetch;
  expect(await getNowPlaying()).toMatchObject({
    title: "Live song",
    isPlaying: true,
    progressMs: 1234,
  });
  expect(fetch).toHaveBeenCalledTimes(4);
});
