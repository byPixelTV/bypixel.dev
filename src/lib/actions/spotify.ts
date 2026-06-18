"use server";

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played";
const TOP_ARTISTS_ENDPOINT = "https://api.spotify.com/v1/me/top/artists";

export interface NowPlayingResult {
  isPlaying: boolean;
  isRecent?: boolean;
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

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN!;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  const data = await res.json();
  return data.access_token as string;
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
    const accessToken = await getAccessToken();

    const res = await fetch(`${RECENTLY_PLAYED_ENDPOINT}?limit=1`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!res.ok) {
      return { isPlaying: false };
    }

    const data = await res.json();
    const item = data.items?.[0];

    if (!item?.track) {
      return { isPlaying: false };
    }

    return mapSpotifyTrack(item.track, {
      isRecent: true,
      playedAt: item.played_at,
    });
  } catch (err) {
    console.error("[Spotify] getRecentlyPlayed failed:", err);
    return { isPlaying: false };
  }
}

export async function getNowPlaying(): Promise<NowPlayingResult> {
  try {
    const accessToken = await getAccessToken();

    const res = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (res.status === 204 || res.status === 404) {
      return getRecentlyPlayed();
    }

    const song = await res.json();

    if (!song || song.currently_playing_type !== "track" || !song.item) {
      return getRecentlyPlayed();
    }

    if (!song.is_playing) {
      return getRecentlyPlayed();
    }

    return mapSpotifyTrack(song.item, {
      isPlaying: true,
      progressMs: (song.progress_ms ?? 0) as number,
    });
  } catch (err) {
    console.error("[Spotify] getNowPlaying failed:", err);
    return getRecentlyPlayed();
  }
}

export async function getTopArtists(): Promise<TopArtistResult[]> {
  try {
    const accessToken = await getAccessToken();

    const res = await fetch(
      `${TOP_ARTISTS_ENDPOINT}?time_range=short_term&limit=5`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      },
    );

    if (!res.ok) {
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
