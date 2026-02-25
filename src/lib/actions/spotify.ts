"use server";

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";

export interface NowPlayingResult {
  isPlaying: boolean;
  trackId?: string;
  title?: string;
  artist?: string;
  albumImageUrl?: string;
  songUrl?: string;
  progressMs?: number;
  durationMs?: number;
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

export async function getNowPlaying(): Promise<NowPlayingResult> {
  try {
    const accessToken = await getAccessToken();

    const res = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (res.status === 204 || res.status === 404) {
      return { isPlaying: false };
    }

    const song = await res.json();

    if (!song || song.currently_playing_type !== "track" || !song.item) {
      return { isPlaying: false };
    }

    return {
      isPlaying: song.is_playing as boolean,
      trackId: song.item.id as string,
      title: song.item.name as string,
      artist: song.item.artists
        .map((a: { name: string }) => a.name)
        .join(", "),
      albumImageUrl: (song.item.album.images[0]?.url ?? null) as string,
      songUrl: song.item.external_urls.spotify as string,
      progressMs: (song.progress_ms ?? 0) as number,
      durationMs: (song.item.duration_ms ?? 1) as number,
    };
  } catch (err) {
    console.error("[Spotify] getNowPlaying failed:", err);
    return { isPlaying: false };
  }
}
