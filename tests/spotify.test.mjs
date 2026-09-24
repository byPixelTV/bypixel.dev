import { afterEach, beforeEach, expect, mock, setSystemTime, test } from "bun:test";

mock.module("server-only", () => ({}));
const { getSpotifyAccessToken, invalidateSpotifyAccessToken } =
  await import("../src/lib/spotify-token");
const { getNowPlaying } = await import("../src/lib/actions/spotify");
const originalFetch = globalThis.fetch;
const credentialNames = ["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET", "SPOTIFY_REFRESH_TOKEN"];
const originalCredentials = credentialNames.map((name) => process.env[name]);
const tokenResponse = () => Response.json({ access_token: "test-token", expires_in: 3600 });

beforeEach(() => {
  credentialNames.forEach((name) => {
    process.env[name] = "test-credential";
  });
  invalidateSpotifyAccessToken("test-token");
});
afterEach(() => {
  credentialNames.forEach((name, index) => {
    if (originalCredentials[index] === undefined) delete process.env[name];
    else process.env[name] = originalCredentials[index];
  });
  globalThis.fetch = originalFetch;
  setSystemTime();
});

test("missing credentials fail before contacting Spotify", async () => {
  delete process.env.SPOTIFY_REFRESH_TOKEN;
  globalThis.fetch = mock();
  await expect(getSpotifyAccessToken()).rejects.toThrow(
    "Spotify configuration missing: SPOTIFY_REFRESH_TOKEN",
  );
  expect(globalThis.fetch).not.toHaveBeenCalled();
});

test("refresh rejection reports actionable errors without leaking response details", async () => {
  for (const code of ["invalid_grant", "invalid_client", "invalid_request", "unknown-secret"]) {
    globalThis.fetch = mock(async () =>
      Response.json({ error: code, error_description: "private-secret" }, { status: 400 }),
    );
    const error = await getSpotifyAccessToken().catch((error) => error);
    expect(error.message).toContain("Spotify token request failed: 400");
    if (code !== "unknown-secret") expect(error.message).toContain(code);
    expect(error.message).not.toContain("private-secret");
    expect(error.message).not.toContain("unknown-secret");
  }
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
  setSystemTime(new Date("2026-09-05T12:00:00Z"));
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
  setSystemTime(new Date("2026-10-01T12:00:00Z"));
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

const { latestSpotifyActivity } = await import("../src/lib/spotify-activity");
const track = {
  id: "recent-song",
  name: "Recent song",
  artists: [{ name: "Artist" }],
  album: { name: "Album" },
  external_urls: { spotify: "https://open.spotify.com/track/recent-song" },
};

test("paused track survives missing history and long listening breaks", async () => {
  const pausedAt = new Date("2027-01-01T12:00:00Z");
  setSystemTime(new Date("2027-01-01T14:00:00Z"));
  globalThis.fetch = mock()
    .mockResolvedValueOnce(tokenResponse())
    .mockResolvedValueOnce(
      Response.json({
        currently_playing_type: "track",
        is_playing: false,
        timestamp: pausedAt.getTime(),
        item: track,
      }),
    )
    .mockResolvedValueOnce(Response.json({ items: [] }));
  expect(await getNowPlaying()).toMatchObject({
    title: "Recent song",
    isPlaying: false,
    isRecent: true,
    playedAt: pausedAt.toISOString(),
  });

  for (const hours of [3, 23, 24]) {
    setSystemTime(new Date(pausedAt.getTime() + hours * 3600000));
    globalThis.fetch = mock()
      .mockResolvedValueOnce(tokenResponse())
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(new Response(null, { status: 503 }));
    const result = await getNowPlaying();
    expect(result).toMatchObject({ title: "Recent song", isPlaying: false });
  }
});

test("history from hours ago displays without an active player", async () => {
  setSystemTime(new Date("2027-02-01T12:00:00Z"));
  globalThis.fetch = mock()
    .mockResolvedValueOnce(tokenResponse())
    .mockResolvedValueOnce(new Response(null, { status: 204 }))
    .mockResolvedValueOnce(
      Response.json({
        items: [
          {
            played_at: "2027-02-01T01:00:00Z",
            track,
          },
        ],
      }),
    );
  expect(await getNowPlaying()).toMatchObject({ title: "Recent song", isRecent: true });
});

test("a live track remains last played when history is empty or older", () => {
  const now = Date.parse("2027-03-01T12:00:00Z");
  const live = { title: "Latest song", isPlaying: true, playedAt: new Date(now).toISOString() };
  for (const incoming of [
    { isPlaying: false },
    { title: "Older song", isPlaying: false, playedAt: new Date(now - 3600000).toISOString() },
  ]) {
    expect(latestSpotifyActivity(live, incoming, now + 3600000)).toMatchObject({
      title: "Latest song",
      isPlaying: false,
      isRecent: true,
      playedAt: live.playedAt,
    });
  }
  expect(latestSpotifyActivity(live, { isPlaying: false }, now + 86400000)).toMatchObject({
    title: "Latest song",
    isPlaying: false,
  });
});

test("newer history replaces the fallback and invalid timestamps are ignored", () => {
  const now = Date.parse("2027-03-01T12:00:00Z");
  const incoming = {
    title: "Newest song",
    isPlaying: false,
    playedAt: new Date(now).toISOString(),
  };
  expect(
    latestSpotifyActivity(
      { ...incoming, title: "Old song", playedAt: new Date(now - 1).toISOString() },
      incoming,
      now,
    ).title,
  ).toBe("Newest song");
  for (const playedAt of [undefined, "invalid", new Date(now + 3600000).toISOString()]) {
    expect(latestSpotifyActivity(null, { ...incoming, playedAt }, now)).toEqual({
      isPlaying: false,
    });
  }
});

const { createSpotifyFetch } = await import("../src/lib/spotify-fetch");
const api = "https://api.spotify.com/v1/me/";

test("rate limit pauses all endpoints and resumes after Retry-After", async () => {
  setSystemTime(new Date("2028-01-01T12:00:00Z"));
  const request = createSpotifyFetch();
  globalThis.fetch = mock()
    .mockResolvedValueOnce(tokenResponse())
    .mockResolvedValueOnce(new Response(null, { status: 429, headers: { "Retry-After": "120" } }))
    .mockImplementation(async () => Response.json({ items: [] }));
  expect((await request(api + "player/currently-playing")).status).toBe(429);
  expect((await request(api + "player/recently-played")).status).toBe(429);
  expect((await request(api + "top/artists")).status).toBe(429);
  expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  setSystemTime(new Date("2028-01-01T12:01:59Z"));
  expect((await request(api + "top/artists")).status).toBe(429);
  expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  setSystemTime(new Date("2028-01-01T12:02:00Z"));
  expect((await request(api + "top/artists")).status).toBe(200);
  expect(globalThis.fetch).toHaveBeenCalledTimes(3);
});

test("parallel visitors share requests and can each read the cached response", async () => {
  const request = createSpotifyFetch();
  globalThis.fetch = mock()
    .mockResolvedValueOnce(tokenResponse())
    .mockImplementation(async () => Response.json({ items: [{ name: "Artist" }] }));
  const responses = await Promise.all(
    Array.from({ length: 10 }, () => request(api + "top/artists")),
  );
  for (const response of responses)
    expect(await response.json()).toEqual({ items: [{ name: "Artist" }] });
  expect(await (await request(api + "top/artists")).json()).toEqual({
    items: [{ name: "Artist" }],
  });
  expect(globalThis.fetch).toHaveBeenCalledTimes(2);
});

test("artist images remain available from expired cache during a rate limit", async () => {
  setSystemTime(new Date("2028-02-01T12:00:00Z"));
  const request = createSpotifyFetch();
  const data = { items: [{ name: "Artist", images: [{ url: "https://i.scdn.co/image/test" }] }] };
  globalThis.fetch = mock()
    .mockResolvedValueOnce(tokenResponse())
    .mockResolvedValueOnce(Response.json(data));
  await request(api + "top/artists");
  setSystemTime(new Date("2028-02-01T13:00:01Z"));
  globalThis.fetch = mock()
    .mockResolvedValueOnce(tokenResponse())
    .mockResolvedValueOnce(new Response(null, { status: 429 }));
  expect(await (await request(api + "top/artists")).json()).toEqual(data);
  expect(await (await request(api + "top/artists")).json()).toEqual(data);
  expect((await request(api + "player/currently-playing")).status).toBe(429);
  expect(globalThis.fetch).toHaveBeenCalledTimes(2);
});

test("playback cache expires quickly while artist data stays cached", async () => {
  setSystemTime(new Date("2028-03-01T12:00:00Z"));
  const request = createSpotifyFetch();
  globalThis.fetch = mock()
    .mockResolvedValueOnce(tokenResponse())
    .mockImplementation(async () => Response.json({ items: [] }));
  await request(api + "player/currently-playing");
  await request(api + "top/artists");
  await request(api + "player/currently-playing");
  expect(globalThis.fetch).toHaveBeenCalledTimes(3);
  setSystemTime(new Date("2028-03-01T12:00:16Z"));
  await request(api + "player/currently-playing");
  await request(api + "top/artists");
  expect(globalThis.fetch).toHaveBeenCalledTimes(4);
});

test("artist cache survives network failures and later refreshes recover", async () => {
  const request = createSpotifyFetch();
  setSystemTime(new Date("2028-04-01T12:00:00Z"));
  globalThis.fetch = mock()
    .mockResolvedValueOnce(tokenResponse())
    .mockResolvedValueOnce(Response.json({ items: [{ name: "Cached artist" }] }));
  await request(api + "top/artists");
  setSystemTime(new Date("2028-04-01T13:00:01Z"));
  globalThis.fetch = mock()
    .mockResolvedValueOnce(tokenResponse())
    .mockRejectedValueOnce(new Error("Network unavailable"))
    .mockResolvedValueOnce(Response.json({ items: [{ name: "Updated artist" }] }));
  expect(await (await request(api + "top/artists")).json()).toEqual({
    items: [{ name: "Cached artist" }],
  });
  setSystemTime(new Date("2028-04-01T13:00:17Z"));
  expect(await (await request(api + "top/artists")).json()).toEqual({
    items: [{ name: "Updated artist" }],
  });
  expect(globalThis.fetch).toHaveBeenCalledTimes(3);
  expect(globalThis.fetch.mock.calls[1][1].signal).toBeInstanceOf(AbortSignal);
});

test("API history older than a day remains visible", async () => {
  setSystemTime(new Date("2029-01-10T12:00:00Z"));
  globalThis.fetch = mock()
    .mockResolvedValueOnce(tokenResponse())
    .mockResolvedValueOnce(new Response(null, { status: 204 }))
    .mockResolvedValueOnce(
      Response.json({ items: [{ played_at: "2029-01-01T12:00:00Z", track }] }),
    );
  expect(await getNowPlaying()).toMatchObject({
    title: "Recent song",
    isRecent: true,
    isPlaying: false,
  });
});

test("live playback survives a rate limit as unconfirmed and recovers to live", async () => {
  setSystemTime(new Date("2029-02-01T12:00:00Z"));
  const live = {
    currently_playing_type: "track",
    is_playing: true,
    item: track,
    progress_ms: 1000,
  };
  globalThis.fetch = mock()
    .mockResolvedValueOnce(tokenResponse())
    .mockResolvedValueOnce(Response.json(live))
    .mockResolvedValueOnce(new Response(null, { status: 429, headers: { "Retry-After": "120" } }))
    .mockResolvedValueOnce(Response.json(live));
  expect(await getNowPlaying()).toMatchObject({ isPlaying: true, title: "Recent song" });
  setSystemTime(new Date("2029-02-01T12:00:16Z"));
  expect(await getNowPlaying()).toMatchObject({
    isPlaying: false,
    stale: true,
    title: "Recent song",
    retryAfterMs: 120000,
  });
  setSystemTime(new Date("2029-02-01T12:01:00Z"));
  expect(await getNowPlaying()).toMatchObject({ stale: true, title: "Recent song" });
  expect(globalThis.fetch).toHaveBeenCalledTimes(3);
  setSystemTime(new Date("2029-02-01T12:02:16Z"));
  expect(await getNowPlaying()).toMatchObject({ isPlaying: true, title: "Recent song" });
  expect(globalThis.fetch).toHaveBeenCalledTimes(4);
});

test("history stays readable during outages and retries are shared", async () => {
  setSystemTime(new Date("2029-03-01T12:00:00Z"));
  const request = createSpotifyFetch();
  const url = api + "player/recently-played";
  const data = { items: [{ played_at: "2029-03-01T11:00:00Z", track }] };
  globalThis.fetch = mock()
    .mockResolvedValueOnce(tokenResponse())
    .mockResolvedValueOnce(Response.json(data))
    .mockRejectedValueOnce(new Error("Offline"))
    .mockResolvedValueOnce(Response.json(data));
  await request(url);
  setSystemTime(new Date("2029-03-01T12:01:01Z"));
  const responses = await Promise.all(Array.from({ length: 10 }, () => request(url)));
  for (const response of responses) {
    expect(response.headers.get("X-Spotify-Stale")).toBe("true");
    expect(await response.json()).toEqual(data);
  }
  await request(url);
  expect(globalThis.fetch).toHaveBeenCalledTimes(3);
  setSystemTime(new Date("2029-03-01T12:01:16Z"));
  expect((await request(url)).headers.get("X-Spotify-Stale")).toBeNull();
  expect(globalThis.fetch).toHaveBeenCalledTimes(4);
});

test("OAuth rate limits respect Retry-After", async () => {
  setSystemTime(new Date("2029-04-01T12:00:00Z"));
  globalThis.fetch = mock()
    .mockResolvedValueOnce(new Response(null, { status: 429, headers: { "Retry-After": "90" } }))
    .mockResolvedValueOnce(tokenResponse());
  await expect(getSpotifyAccessToken()).rejects.toThrow("429");
  await expect(getSpotifyAccessToken()).rejects.toThrow("cooling down");
  expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  setSystemTime(new Date("2029-04-01T12:01:30Z"));
  expect(await getSpotifyAccessToken()).toBe("test-token");
  expect(globalThis.fetch).toHaveBeenCalledTimes(2);
});

const { spotifyPollDelay } = await import("../src/lib/spotify-polling");

test("polling uses track end or 15 seconds and always honors cooldowns", () => {
  expect(spotifyPollDelay({ isPlaying: true, durationMs: 180000, progressMs: 175000 })).toBe(5500);
  expect(spotifyPollDelay({ isPlaying: true, durationMs: 180000, progressMs: 1000 })).toBe(15000);
  for (const state of [
    { isPlaying: false, durationMs: 10000, progressMs: 9000 },
    { isPlaying: true, durationMs: 10000, progressMs: 10000 },
    { isPlaying: true, durationMs: 10000, progressMs: 11000 },
    { isPlaying: true, durationMs: 10000 },
    { isPlaying: true, durationMs: 10000, progressMs: NaN },
    { isPlaying: true, stale: true, durationMs: 10000, progressMs: 9000 },
  ])
    expect(spotifyPollDelay(state)).toBe(15000);
  expect(
    spotifyPollDelay({
      isPlaying: true,
      durationMs: 10000,
      progressMs: 9000,
      retryAfterMs: 120000,
    }),
  ).toBe(120000);
});

test("track end expires the cache early and simultaneous visitors share the next fetch", async () => {
  setSystemTime(new Date("2030-01-01T12:00:00Z"));
  const request = createSpotifyFetch();
  const url = api + "player/currently-playing";
  globalThis.fetch = mock()
    .mockResolvedValueOnce(tokenResponse())
    .mockResolvedValueOnce(
      Response.json({
        is_playing: true,
        progress_ms: 175000,
        item: { ...track, duration_ms: 180000 },
      }),
    )
    .mockResolvedValueOnce(
      Response.json({
        is_playing: true,
        progress_ms: 0,
        item: { ...track, id: "next", duration_ms: 180000 },
      }),
    );
  await request(url);
  setSystemTime(new Date("2030-01-01T12:00:05Z"));
  expect((await (await request(url)).json()).item.id).toBe(track.id);
  expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  setSystemTime(new Date("2030-01-01T12:00:05.500Z"));
  const responses = await Promise.all(Array.from({ length: 10 }, () => request(url)));
  for (const response of responses) expect((await response.json()).item.id).toBe("next");
  expect(globalThis.fetch).toHaveBeenCalledTimes(3);
});

test("cached playback advances progress so track end is not postponed for new visitors", async () => {
  setSystemTime(new Date("2030-02-01T12:00:00Z"));
  globalThis.fetch = mock()
    .mockResolvedValueOnce(tokenResponse())
    .mockResolvedValueOnce(
      Response.json({
        currently_playing_type: "track",
        is_playing: true,
        progress_ms: 170000,
        item: { ...track, duration_ms: 180000 },
      }),
    );
  expect(await getNowPlaying()).toMatchObject({ progressMs: 170000 });
  setSystemTime(new Date("2030-02-01T12:00:04Z"));
  const result = await getNowPlaying();
  expect(result.progressMs).toBe(174000);
  expect(spotifyPollDelay(result)).toBe(6500);
  expect(globalThis.fetch).toHaveBeenCalledTimes(2);
});

test("history quota blocks all history query variants but leaves playback working", async () => {
  setSystemTime(new Date("2031-01-01T12:00:00Z"));
  const request = createSpotifyFetch();
  globalThis.fetch = mock()
    .mockResolvedValueOnce(tokenResponse())
    .mockResolvedValueOnce(
      Response.json(
        { error: { reason: "QUOTA_EXCEEDED" } },
        { status: 429, headers: { "Retry-After": "120" } },
      ),
    )
    .mockResolvedValueOnce(Response.json({ is_playing: true, item: track }))
    .mockResolvedValueOnce(Response.json({ items: [] }));
  expect((await request(api + "player/recently-played?limit=1")).status).toBe(429);
  expect((await request(api + "player/recently-played?limit=5")).status).toBe(429);
  expect((await request(api + "player/currently-playing")).status).toBe(200);
  expect(globalThis.fetch).toHaveBeenCalledTimes(3);
  setSystemTime(new Date("2031-01-01T12:01:59Z"));
  expect((await request(api + "player/recently-played?limit=1")).status).toBe(429);
  expect(globalThis.fetch).toHaveBeenCalledTimes(3);
  setSystemTime(new Date("2031-01-01T12:02:00Z"));
  expect((await request(api + "player/recently-played?limit=1")).status).toBe(200);
  expect(globalThis.fetch).toHaveBeenCalledTimes(4);
});

test("history quota does not put the widget to sleep when playback starts", async () => {
  setSystemTime(new Date("2031-02-01T12:00:00Z"));
  globalThis.fetch = mock()
    .mockResolvedValueOnce(tokenResponse())
    .mockResolvedValueOnce(new Response(null, { status: 204 }))
    .mockResolvedValueOnce(
      Response.json(
        { error: { reason: "QUOTA_EXCEEDED" } },
        { status: 429, headers: { "Retry-After": "6587" } },
      ),
    )
    .mockResolvedValueOnce(
      Response.json({
        currently_playing_type: "track",
        is_playing: true,
        item: { ...track, name: "New live track", duration_ms: 180000 },
        progress_ms: 1000,
      }),
    );
  const idle = await getNowPlaying();
  expect(spotifyPollDelay(idle)).toBe(15000);
  setSystemTime(new Date("2031-02-01T12:00:15Z"));
  expect(await getNowPlaying()).toMatchObject({ isPlaying: true, title: "New live track" });
  expect(globalThis.fetch).toHaveBeenCalledTimes(4);
});
