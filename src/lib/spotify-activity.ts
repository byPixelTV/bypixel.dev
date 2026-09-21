import type { NowPlayingResult } from "@/lib/actions/spotify";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Keep the newest actual playback time; polling must not extend its lifetime. */
export function latestSpotifyActivity(
  previous: NowPlayingResult | null,
  incoming: NowPlayingResult,
  now = Date.now(),
): NowPlayingResult {
  if (incoming.isPlaying && incoming.title) return incoming;

  const recent = [previous, incoming]
    .filter((track): track is NowPlayingResult => {
      const playedAt = Date.parse(track?.playedAt ?? "");
      return Boolean(track?.title) && playedAt <= now && now - playedAt < DAY_MS;
    })
    .sort((a, b) => Date.parse(b.playedAt!) - Date.parse(a.playedAt!))[0];

  if (!recent) return { isPlaying: false };
  return { ...recent, isPlaying: false, isRecent: true, progressMs: undefined };
}
