import { expect, mock, setSystemTime, test } from "bun:test";
mock.module("server-only", () => ({}));
const { getMusicSnapshot } = await import("../src/lib/actions/music");
const { invalidateSpotifyAccessToken } = await import("../src/lib/spotify-token");

test("cold visits use the previous Last.fm track when the first item is still marked playing", async () => {
  const keys = [
    "SPOTIFY_CLIENT_ID",
    "SPOTIFY_CLIENT_SECRET",
    "SPOTIFY_REFRESH_TOKEN",
    "LASTFM_USERNAME",
    "LASTFM_API_KEY",
  ];
  const saved = keys.map((key) => process.env[key]);
  const originalFetch = globalThis.fetch;
  keys.forEach((key) => {
    process.env[key] = "test";
  });
  setSystemTime(new Date("2020-01-01T00:00:00Z"));
  let playbackFailed = false;
  let lastfmFailed = false;
  let spotifyHistoryFailed = false;
  globalThis.fetch = mock(async (url) => {
    const value = String(url);
    if (value.includes("/api/token"))
      return Response.json({ access_token: "test", expires_in: 3600 });
    if (value.includes("currently-playing"))
      return new Response(null, { status: playbackFailed ? 503 : 204 });
    if (value.includes("audioscrobbler")) {
      if (lastfmFailed) return new Response(null, { status: 503 });
      expect(new URL(value).searchParams.get("limit")).toBe("5");
      return Response.json({
        recenttracks: {
          track: [
            {
              name: "Still marked playing",
              artist: { "#text": "Artist" },
              "@attr": { nowplaying: "true" },
            },
            { name: "Last played", artist: { "#text": "Artist" }, date: { uts: "1577836700" } },
          ],
        },
      });
    }
    if (value.includes("recently-played")) {
      if (spotifyHistoryFailed) return new Response(null, { status: 403 });
      return Response.json({
        items: [
          {
            played_at: "2019-12-31T23:59:00Z",
            track: {
              id: "song",
              name: "Spotify fallback",
              artists: [{ name: "Artist" }],
              album: { name: "Album" },
              external_urls: { spotify: "https://open.spotify.com/track/song" },
            },
          },
        ],
      });
    }
    throw new Error("Unexpected request");
  });
  try {
    const snapshot = await getMusicSnapshot();
    expect(snapshot.isPlaying).toBe(false);
    expect(snapshot.track?.name).toBe("Last played");
    playbackFailed = true;
    setSystemTime(new Date("2020-01-01T00:00:31Z"));
    const fallback = await getMusicSnapshot();
    expect(fallback.track?.name).toBe("Last played");
    expect(fallback.stale).toBe(true);
    setSystemTime(new Date("2020-01-01T00:01:02Z"));
    process.env.LASTFM_USERNAME = "another-test-user";
    lastfmFailed = true;
    spotifyHistoryFailed = true;
    playbackFailed = false;
    await expect(getMusicSnapshot()).rejects.toThrow("Music activity unavailable");
    setSystemTime(new Date("2020-01-01T00:02:03Z"));
    spotifyHistoryFailed = false;
    playbackFailed = true;
    const spotifyFallback = await getMusicSnapshot();
    expect(spotifyFallback.track?.name).toBe("Spotify fallback");
    expect(spotifyFallback.stale).toBe(true);
  } finally {
    invalidateSpotifyAccessToken("test");
    globalThis.fetch = originalFetch;
    keys.forEach((key, index) => {
      if (saved[index] === undefined) delete process.env[key];
      else process.env[key] = saved[index];
    });
    setSystemTime();
  }
});
