import { expect, mock, setSystemTime, test } from "bun:test";
mock.module("server-only", () => ({}));
const { getCurrentlyPlaying } = await import("../src/lib/music");

test("playback refreshes after two seconds and does not present stale playback as live after an error", async () => {
  const originalFetch = globalThis.fetch;
  const keys = ["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET", "SPOTIFY_REFRESH_TOKEN"];
  const original = keys.map((key) => process.env[key]);
  keys.forEach((key) => {
    process.env[key] = "test";
  });
  let playbackRequests = 0;
  let fail = false;
  setSystemTime(new Date("2040-01-01T00:00:00Z"));
  globalThis.fetch = mock(async (url) => {
    if (String(url).includes("/api/token"))
      return Response.json({ access_token: "test", expires_in: 3600 });
    playbackRequests++;
    if (fail) return new Response(null, { status: 503 });
    return Response.json({
      is_playing: true,
      progress_ms: 1000,
      item: {
        type: "track",
        name: playbackRequests === 1 ? "First" : "Second",
        artists: [{ name: "Artist" }],
      },
    });
  });
  try {
    expect((await getCurrentlyPlaying()).track.name).toBe("First");
    expect((await getCurrentlyPlaying()).track.name).toBe("First");
    expect(playbackRequests).toBe(1);
    setSystemTime(new Date("2040-01-01T00:00:02.100Z"));
    expect((await getCurrentlyPlaying()).track.name).toBe("Second");
    expect(playbackRequests).toBe(2);
    fail = true;
    setSystemTime(new Date("2040-01-01T00:00:04.200Z"));
    await expect(getCurrentlyPlaying()).rejects.toThrow("Spotify playback failed (503)");
  } finally {
    globalThis.fetch = originalFetch;
    keys.forEach((key, i) => {
      if (original[i] === undefined) delete process.env[key];
      else process.env[key] = original[i];
    });
    setSystemTime();
  }
});
