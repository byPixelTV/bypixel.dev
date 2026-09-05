import "server-only";

let cached: { token: string; expiresAt: number } | undefined;
let pending: Promise<string> | undefined;

/** Share a token refresh across simultaneous visitors; never expose it to clients. */
export function getSpotifyAccessToken(): Promise<string> {
  if (cached && Date.now() < cached.expiresAt) return Promise.resolve(cached.token);
  if (pending) return pending;
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
  });
  if (!res.ok) throw new Error("Spotify token request failed: " + res.status);
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
