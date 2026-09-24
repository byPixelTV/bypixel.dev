import type { NowPlayingResult } from "@/lib/actions/spotify";

export const SPOTIFY_POLL_INTERVAL_MS = 15000;

/** Leave a small margin for Spotify to publish the next track; never spin at 0. */
export function spotifyPollDelay(activity: NowPlayingResult): number {
  if (activity.retryAfterMs && activity.retryAfterMs > 0) {
    return Math.max(SPOTIFY_POLL_INTERVAL_MS, activity.retryAfterMs);
  }
  if (
    activity.isPlaying &&
    !activity.stale &&
    Number.isFinite(activity.durationMs) &&
    Number.isFinite(activity.progressMs) &&
    activity.progressMs! >= 0
  ) {
    const remaining = activity.durationMs! - activity.progressMs!;
    if (remaining > 0) return Math.min(SPOTIFY_POLL_INTERVAL_MS, remaining + 500);
  }
  return SPOTIFY_POLL_INTERVAL_MS;
}
