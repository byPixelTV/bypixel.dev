"use server";

import { spotifyFetch } from "@/lib/spotify-fetch";
import { latestSpotifyActivity } from "@/lib/spotify-activity";
const NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_ENDPOINT = "https://api.spotify.com/v1/me/player/recently-played";
const TOP_ARTISTS_ENDPOINT = "https://api.spotify.com/v1/me/top/artists";

let lastKnownTrack: NowPlayingResult | null = null;

function rememberActivity(incoming: NowPlayingResult): NowPlayingResult {
  lastKnownTrack = latestSpotifyActivity(lastKnownTrack, incoming);
  return lastKnownTrack;
}

export interface NowPlayingResult {
  isPlaying: boolean;
  isRecent?: boolean;
  stale?: boolean;
  retryAfterMs?: number;
  trackId?: string;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
  progressMs?: number;
  durationMs?: number;
  playedAt?: string;
}

export interface TopArtistResult {
  id: string;
  name: string;
  imageUrl?: string;
  spotifyUrl?: string;
  genres: string[];
  popularity?: number;
}

function mapSpotifyTrack(
  track: {
    id: string;
    name: string;
    artists: { name: string }[];
    album: { name: string; images?: { url: string }[] };
    external_urls: { spotify: string };
    duration_ms?: number;
  },
  overrides: Partial<NowPlayingResult> = {},
): NowPlayingResult {
  return {
    isPlaying: false,
    trackId: track.id,
    title: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    album: track.album.name,
    albumImageUrl: track.album.images?.[0]?.url,
    songUrl: track.external_urls.spotify,
    durationMs: track.duration_ms ?? 1,
    ...overrides,
  };
}

export async function getRecentlyPlayed(): Promise<NowPlayingResult> {
  try {
    const res = await spotifyFetch(`${RECENTLY_PLAYED_ENDPOINT}?limit=1`);

    if (!res.ok) {
      if (res.status !== 429)
        console.error("[Spotify] Recently played request failed:", res.status);
      return rememberActivity({
        isPlaying: false,
        stale: true,
        retryAfterMs: Number(res.headers.get("Retry-After")) * 1000 || 15000,
      });
    }

    const data = await res.json();
    const item = data.items?.[0];

    if (!item?.track) {
      return rememberActivity({
        isPlaying: false,
        stale: res.headers.get("X-Spotify-Stale") === "true",
        retryAfterMs: Number(res.headers.get("Retry-After")) * 1000 || undefined,
      });
    }

    return rememberActivity(
      mapSpotifyTrack(item.track, {
        isRecent: true,
        playedAt: item.played_at,
        stale: res.headers.get("X-Spotify-Stale") === "true",
        retryAfterMs: Number(res.headers.get("Retry-After")) * 1000 || undefined,
      }),
    );
  } catch (err) {
    console.error("[Spotify] getRecentlyPlayed failed:", err);
    return rememberActivity({ isPlaying: false, stale: true });
  }
}

// History's cooldown must not stop the client checking for new live playback.
// The fetch layer independently enforces history and API-wide cooldowns.
async function playbackHistory(): Promise<NowPlayingResult> {
  return { ...(await getRecentlyPlayed()), retryAfterMs: 15000 };
}

export async function getNowPlaying(): Promise<NowPlayingResult> {
  try {
    const res = await spotifyFetch(NOW_PLAYING_ENDPOINT);

    if (res.status === 204 && res.headers.get("X-Spotify-Stale") !== "true") {
      return playbackHistory();
    }

    if (!res.ok || res.headers.get("X-Spotify-Stale") === "true") {
      // An API failure cannot tell us whether playback stopped. Keep the API's
      // last track, but label it as unconfirmed instead of reporting last played.
      if (!lastKnownTrack?.title && res.ok && res.status !== 204) {
        const cached = await res.json();
        if (cached.item && cached.currently_playing_type === "track") {
          rememberActivity(
            mapSpotifyTrack(cached.item, {
              playedAt: new Date(Number(res.headers.get("X-Spotify-Observed-At"))).toISOString(),
            }),
          );
        }
      }
      if (!lastKnownTrack?.title) await getRecentlyPlayed();
      return rememberActivity({
        isPlaying: false,
        stale: true,
        retryAfterMs: Number(res.headers.get("Retry-After")) * 1000 || 15000,
      });
    }

    const song = await res.json();
    const observedAt = Number(res.headers.get("X-Spotify-Observed-At")) || Date.now();
    const progressMs = Math.max(0, (song?.progress_ms ?? 0) + Date.now() - observedAt);

    if (!song || song.currently_playing_type !== "track" || !song.item) {
      return playbackHistory();
    }

    if (!song.is_playing) {
      // Spotify may still expose the paused track before history catches up.
      // Use its state-change timestamp, not the time of this poll.
      if (typeof song.timestamp === "number" && Number.isFinite(song.timestamp)) {
        rememberActivity(
          mapSpotifyTrack(song.item, {
            playedAt: new Date(song.timestamp).toISOString(),
          }),
        );
      }
      return playbackHistory();
    }

    return rememberActivity(
      mapSpotifyTrack(song.item, {
        isPlaying: true,
        progressMs: Math.min(song.item.duration_ms ?? Infinity, progressMs),
        playedAt: new Date(
          Number(res.headers.get("X-Spotify-Observed-At")) || Date.now(),
        ).toISOString(),
      }),
    );
  } catch (err) {
    console.error("[Spotify] getNowPlaying failed:", err);
    return rememberActivity({ isPlaying: false, stale: true, retryAfterMs: 15000 });
  }
}

export async function getTopArtists(): Promise<TopArtistResult[]> {
  try {
    const res = await spotifyFetch(`${TOP_ARTISTS_ENDPOINT}?time_range=short_term&limit=5`);

    if (!res.ok) {
      if (res.status !== 429)
        console.error(
          "[Spotify] Top artists request failed:",
          res.status,
          res.status === 403 ? "Check that Spotify authorization includes user-top-read." : "",
        );
      return [];
    }

    const data = await res.json();

    return (data.items ?? []).map(
      (artist: {
        id: string;
        name: string;
        images?: { url: string }[];
        external_urls?: { spotify?: string };
        genres?: string[];
        popularity?: number;
      }) => ({
        id: artist.id,
        name: artist.name,
        imageUrl: artist.images?.[0]?.url,
        spotifyUrl: artist.external_urls?.spotify,
        genres: artist.genres ?? [],
        popularity: artist.popularity,
      }),
    );
  } catch (err) {
    console.error("[Spotify] getTopArtists failed:", err);
    return [];
  }
}
