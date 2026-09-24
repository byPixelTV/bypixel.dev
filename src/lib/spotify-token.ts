import "server-only";

let cached: { token: string; expiresAt: number } | undefined;
let pending: Promise<string> | undefined;
let retryAt = 0;

/** Share a token refresh across simultaneous visitors; never expose it to clients. */
export function getSpotifyAccessToken(): Promise<string> {
  if (cached && Date.now() < cached.expiresAt) return Promise.resolve(cached.token);
  if (pending) return pending;
  if (Date.now() < retryAt)
    return Promise.reject(new Error("Spotify token refresh is cooling down."));
  pending = refreshToken().finally(() => {
    pending = undefined;
  });
  return pending;
}

export function invalidateSpotifyAccessToken(token: string) {
  if (cached?.token === token) cached = undefined;
}

async function refreshToken(): Promise<string> {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;
  const missing = Object.entries({
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REFRESH_TOKEN,
  })
    .filter(([, value]) => !value?.trim())
    .map(([name]) => name);
  if (missing.length) {
    throw new Error("Spotify configuration missing: " + missing.join(", "));
  }
  const started = Date.now();
  const basic = Buffer.from(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + basic,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN ?? "",
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    if (res.status === 429) {
      const seconds = Number(res.headers.get("Retry-After"));
      retryAt = Date.now() + (Number.isFinite(seconds) && seconds > 0 ? seconds : 60) * 1000;
      console.warn(`[Spotify] OAuth HTTP 429; retry at ${new Date(retryAt).toISOString()}.`);
    }
    const details = await res.json().catch(() => null);
    // Only report known error codes and our own hints, never raw OAuth responses.
    let hint = "";
    switch (details?.error) {
      case "invalid_grant":
        hint =
          " (invalid_grant): Reauthorize Spotify and replace SPOTIFY_REFRESH_TOKEN using the same Spotify app.";
        break;
      case "invalid_client":
        hint =
          " (invalid_client): Check SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET belong to the same Spotify app.";
        break;
      case "invalid_request":
        hint = " (invalid_request): Check the Spotify refresh-token configuration.";
        break;
    }
    throw new Error("Spotify token request failed: " + res.status + hint);
  }
  const data = await res.json();
  if (typeof data.access_token !== "string" || !data.access_token) {
    throw new Error("Spotify returned no access token");
  }
  // Refresh early and include network time in the token's lifetime.
  const lifetime = Number(data.expires_in);
  cached = {
    token: data.access_token,
    expiresAt: started + (Number.isFinite(lifetime) ? Math.max(0, lifetime - 60) * 1000 : 0),
  };
  return cached.token;
}
