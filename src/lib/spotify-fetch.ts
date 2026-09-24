import "server-only";
import { spotifyPollDelay } from "@/lib/spotify-polling";

import { getSpotifyAccessToken, invalidateSpotifyAccessToken } from "@/lib/spotify-token";

/** Share requests and cooldowns across visitors handled by this server process. */
export function createSpotifyFetch() {
  const cache = new Map<string, { response: Response; expiresAt: number }>();
  const pending = new Map<string, Promise<Response>>();
  const failures = new Map<string, { response: Response; retryAt: number }>();
  let retryAt = 0;

  return async function spotifyFetch(url: string): Promise<Response> {
    const artists = new URL(url).pathname === "/v1/me/top/artists";
    const ttl = artists ? 3600000 : url.includes("recently-played") ? 60000 : 15000;
    const cached = cache.get(url);
    if (cached && Date.now() < cached.expiresAt) return cached.response.clone();
    const fallback = (response: Response, until: number) => {
      const headers = new Headers(cached?.response.headers ?? response.headers);
      headers.set("Retry-After", String(Math.max(1, Math.ceil((until - Date.now()) / 1000))));
      if (cached) headers.set("X-Spotify-Stale", "true");
      const source = (cached?.response ?? response).clone();
      return new Response(source.body, { status: source.status, headers });
    };
    if (Date.now() < retryAt) return fallback(new Response(null, { status: 429 }), retryAt);
    const failure = failures.get(url);
    if (failure && Date.now() < failure.retryAt) return fallback(failure.response, failure.retryAt);
    const existing = pending.get(url);
    if (existing) return (await existing).clone();

    const request = async () => {
      let token = await getSpotifyAccessToken();
      if (Date.now() < retryAt) return fallback(new Response(null, { status: 429 }), retryAt);
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
        if (Date.now() < retryAt) return fallback(new Response(null, { status: 429 }), retryAt);
        response = await send();
      }
      if (response.status === 429) {
        const seconds = Number(response.headers.get("Retry-After"));
        const delay = Number.isFinite(seconds) && seconds > 0 ? seconds : 60;
        retryAt = Math.max(retryAt, Date.now() + delay * 1000);
        console.warn(`[Spotify] Rate limited; pausing API requests for ${delay} seconds.`);
        return fallback(response, retryAt);
      }
      if (response.ok) {
        // Preserve the observation time when several visitors reuse a response.
        const headers = new Headers(response.headers);
        headers.set("X-Spotify-Observed-At", String(Date.now()));
        response = new Response(response.body, { status: response.status, headers });
        let lifetime = ttl;
        if (
          new URL(url).pathname === "/v1/me/player/currently-playing" &&
          response.status === 200
        ) {
          const playback = await response
            .clone()
            .json()
            .catch(() => null);
          // Expire the shared cache at track end too, so the client's early poll
          // actually reaches Spotify instead of returning the finished song.
          lifetime = spotifyPollDelay({
            isPlaying: playback?.is_playing === true,
            durationMs: playback?.item?.duration_ms,
            progressMs: playback?.progress_ms,
          });
        }
        cache.set(url, { response: response.clone(), expiresAt: Date.now() + lifetime });
        failures.delete(url);
        return response;
      }
      const until =
        Date.now() + (response.status === 401 || response.status === 403 ? 60000 : 15000);
      failures.set(url, { response: response.clone(), retryAt: until });
      return fallback(response, until);
    };
    const work = request()
      .catch(() => {
        const response = new Response(null, { status: 503 });
        const until = Date.now() + 15000;
        failures.set(url, { response, retryAt: until });
        return fallback(response, until);
      })
      .finally(() => pending.delete(url));
    pending.set(url, work);
    return (await work).clone();
  };
}

const spotifyGlobal = globalThis as typeof globalThis & {
  spotifyFetch?: ReturnType<typeof createSpotifyFetch>;
};
export const spotifyFetch = (spotifyGlobal.spotifyFetch ??= createSpotifyFetch());
