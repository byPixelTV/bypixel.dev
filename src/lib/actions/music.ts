"use server";

import { getCurrentlyPlaying, getRecentlyPlayed, type NowPlaying, type Track } from "@/lib/music";

export type MusicSnapshot = {
  isPlaying: boolean;
  track: Track | null;
  progressMs: number;
  fetchedAt: number;
};

export async function getMusicSnapshot(): Promise<MusicSnapshot> {
  const live: NowPlaying = await getCurrentlyPlaying();
  if (live.isPlaying && live.track) return live;

  if (live.track) return live;

  const recent = await getRecentlyPlayed(1);
  return {
    isPlaying: false,
    track: recent[0] ?? null,
    progressMs: 0,
    fetchedAt: Date.now(),
  };
}
