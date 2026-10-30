"use server";

import { getCurrentlyPlaying, getRecentlyPlayed, type NowPlaying, type Track } from "@/lib/music";
import { getRecentlyPlayed as getSpotifyHistory } from "@/lib/actions/spotify";

export type MusicSnapshot = {
  isPlaying: boolean;
  track: Track | null;
  progressMs: number;
  fetchedAt: number;
  stale?: boolean;
};

export async function getMusicSnapshot(): Promise<MusicSnapshot> {
  let live: NowPlaying | undefined;
  let playbackFailed = false;
  try {
    live = await getCurrentlyPlaying();
    if (live.track) return live;
  } catch {
    playbackFailed = true;
  }

  let historyFailed = false;
  try {
    // Last.fm may still list the current track first after Spotify has stopped.
    const recent = await getRecentlyPlayed(5);
    if (recent[0]) {
      return {
        isPlaying: false,
        track: recent[0],
        progressMs: 0,
        fetchedAt: Date.now(),
        stale: playbackFailed,
      };
    }
  } catch {
    historyFailed = true;
  }

  // Keep Spotify's existing cached history as a fallback if Last.fm has no usable track.
  const history = await getSpotifyHistory();
  if (history.title) {
    const playedAt = history.playedAt ? Date.parse(history.playedAt) : NaN;
    return {
      isPlaying: false,
      track: {
        name: history.title,
        artists: history.artist ? [history.artist] : [],
        album: history.album ?? null,
        image: history.albumImageUrl ?? null,
        url: history.songUrl ?? null,
        durationMs: history.durationMs,
        playedAt: Number.isFinite(playedAt) ? playedAt : undefined,
      },
      progressMs: 0,
      fetchedAt: Date.now(),
      stale: playbackFailed || history.stale,
    };
  }
  if (playbackFailed && (historyFailed || history.stale))
    throw new Error("Music activity unavailable");
  return {
    isPlaying: false,
    track: null,
    progressMs: 0,
    fetchedAt: Date.now(),
    stale: playbackFailed,
  };
}
