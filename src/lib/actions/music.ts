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
    console.warn("[Music] Spotify playback unavailable; checking listening history.");
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
    console.warn("[Music] Last.fm returned no completed tracks; checking Spotify history.");
  } catch (error) {
    historyFailed = true;
    const reason =
      error instanceof Error ? error.message.match(/^Last\.fm (?:HTTP )?\d+/)?.[0] : null;
    console.warn(
      process.env.LASTFM_USERNAME && process.env.LASTFM_API_KEY
        ? `[Music] Last.fm history unavailable${reason ? ` (${reason})` : " (request or response error)"}; checking Spotify history.`
        : "[Music] Last.fm is not configured (LASTFM_USERNAME or LASTFM_API_KEY missing); checking Spotify history.",
    );
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
  if (historyFailed || history.stale) {
    console.warn("[Music] No last-played track available from listening history.");
    throw new Error("Music activity unavailable");
  }
  return {
    isPlaying: false,
    track: null,
    progressMs: 0,
    fetchedAt: Date.now(),
    stale: playbackFailed,
  };
}
