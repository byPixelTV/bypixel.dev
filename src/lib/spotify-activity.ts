import type { NowPlayingResult } from "@/lib/actions/spotify";

/** Keep the newest API-observed activity, even after a long listening break. */
export function latestSpotifyActivity(
  previous: NowPlayingResult | null,
  incoming: NowPlayingResult,
  now = Date.now(),
): NowPlayingResult {
  if (incoming.isPlaying && incoming.title) return incoming;
  const recent = [previous, incoming]
    .filter((track): track is NowPlayingResult => {
      const playedAt = Date.parse(track?.playedAt ?? "");
      return Boolean(track?.title) && playedAt <= now;
    })
    .sort((a, b) => Date.parse(b.playedAt!) - Date.parse(a.playedAt!))[0];
  if (!recent)
    return {
      isPlaying: false,
      ...(incoming.stale ? { stale: true, retryAfterMs: incoming.retryAfterMs } : {}),
    };
  return {
    ...recent,
    isPlaying: false,
    isRecent: true,
    progressMs: undefined,
    stale: incoming.stale,
    retryAfterMs: incoming.retryAfterMs,
  };
}
