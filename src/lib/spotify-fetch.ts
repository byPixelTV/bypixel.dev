import "server-only";

import { getSpotifyAccessToken, invalidateSpotifyAccessToken } from "@/lib/spotify-token";

/** One request per endpoint at a time, with an app-wide rate-limit cooldown. */
export function createSpotifyFetch() {
  const cache = new Map<string, { response: Response; expiresAt: number }>();
  const pending = new Map<string, Promise<Response>>();
  let retryAt = 0;

  return async function spotifyFetch(url: string): Promise<Response> {
    const artists = new URL(url).pathname === "/v1/me/top/artists";
    const ttl = artists ? 3600000 : url.includes("recently-played") ? 60000 : 5000;
    const cached = cache.get(url);
    if (cached && Date.now() < cached.expiresAt) return cached.response.clone();
    const limited = () =>
      new Response(null, {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((retryAt - Date.now()) / 1000)) },
      });
    if (Date.now() < retryAt) {
      return artists && cached ? cached.response.clone() : limited();
    }
    const existing = pending.get(url);
    if (existing) return (await existing).clone();

    const request = async () => {
      let token = await getSpotifyAccessToken();
      // Another endpoint may have received a 429 while the token was refreshing.
      if (Date.now() < retryAt) return limited();
      const send = () =>
        fetch(url, {
          headers: { Authorization: "Bearer " + token },
          cache: "no-store",
          signal: AbortSignal.timeout(10000),
        });
      let response = await send();
      if (response.status === 401) {
        invalidateSpotifyAccessToken(token);
        token = await getSpotifyAccessToken();
        if (Date.now() < retryAt) return limited();
        response = await send();
      }
      if (response.status === 429) {
        const seconds = Number(response.headers.get("Retry-After"));
        const delay = Number.isFinite(seconds) && seconds > 0 ? seconds : 60;
        retryAt = Math.max(retryAt, Date.now() + delay * 1000);
        console.warn(`[Spotify] Rate limited; pausing API requests for ${delay} seconds.`);
      }
      if (response.ok) {
        cache.set(url, { response: response.clone(), expiresAt: Date.now() + ttl });
      } else if (artists && cached) {
        return cached.response.clone();
      }
      return response;
    };
    const work = request()
      .catch((error) => {
        if (artists && cached) return cached.response.clone();
        throw error;
      })
      .finally(() => pending.delete(url));
    pending.set(url, work);
    return (await work).clone();
  };
}

// Preserve the cooldown and cache across development hot reloads.
const spotifyGlobal = globalThis as typeof globalThis & {
  spotifyFetch?: ReturnType<typeof createSpotifyFetch>;
};
export const spotifyFetch = (spotifyGlobal.spotifyFetch ??= createSpotifyFetch());
