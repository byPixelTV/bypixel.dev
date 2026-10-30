import "server-only";

export type Period = "overall" | "7day" | "1month" | "3month" | "6month" | "12month";
export type MusicImage = { url: string; width?: number; height?: number };
export type Artist = {
  name: string;
  url: string | null;
  image: string | null;
  plays?: number;
  mbid?: string;
};
export type Track = {
  name: string;
  artists: string[];
  album: string | null;
  image: string | null;
  url: string | null;
  durationMs?: number;
  playedAt?: number;
  plays?: number;
};
export type NowPlaying = {
  isPlaying: boolean;
  track: Track | null;
  progressMs: number;
  fetchedAt: number;
};

const spotifyApi = "https://api.spotify.com/v1";
const lastfmApi = "https://ws.audioscrobbler.com/2.0/";
const memory = new Map<string, { until: number; value: unknown }>();
const pending = new Map<string, Promise<unknown>>();
const blockedUntil = new Map<string, number>();

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

async function cached<T>(
  key: string,
  ttlMs: number,
  load: () => Promise<T>,
  allowStale = true,
): Promise<T> {
  const previous = memory.get(key);
  if (previous && previous.until > Date.now()) return previous.value as T;
  const inFlight = pending.get(key);
  if (inFlight) return inFlight as Promise<T>;
  const task = (async () => {
    try {
      const value = await load();
      memory.set(key, { value, until: Date.now() + ttlMs });
      return value;
    } catch (error) {
      // Prefer slightly stale content during transient upstream failures.
      if (allowStale && previous) return previous.value as T;
      throw error;
    } finally {
      pending.delete(key);
    }
  })();
  pending.set(key, task);
  return task;
}

async function request(url: string, init: RequestInit = {}): Promise<Response> {
  const host = new URL(url).host;
  const remaining = (blockedUntil.get(host) ?? 0) - Date.now();
  if (remaining > 0)
    throw new Error(`${host} rate limited; retry in ${Math.ceil(remaining / 1000)}s`);
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (response.status === 429) {
    const retry = Number(response.headers.get("retry-after"));
    const delay = Number.isFinite(retry) && retry >= 0 ? retry * 1000 : 60_000;
    blockedUntil.set(host, Date.now() + delay);
    throw new Error(`${host} rate limited`);
  }
  return response;
}

let token: { value: string; expires: number } | undefined;
let tokenPromise: Promise<string> | undefined;
async function accessToken(force = false): Promise<string> {
  if (!force && token && token.expires > Date.now() + 30_000) return token.value;
  if (tokenPromise) return tokenPromise;
  tokenPromise = (async () => {
    const client = required("SPOTIFY_CLIENT_ID");
    const secret = required("SPOTIFY_CLIENT_SECRET");
    const refresh = required("SPOTIFY_REFRESH_TOKEN");
    const response = await request("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${client}:${secret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh }),
    });
    if (!response.ok)
      throw new Error(
        `Spotify token refresh failed (${response.status}): ${await response.text()}`,
      );
    const data = (await response.json()) as { access_token: string; expires_in: number };
    token = { value: data.access_token, expires: Date.now() + data.expires_in * 1000 };
    return token.value;
  })().finally(() => {
    tokenPromise = undefined;
  });
  return tokenPromise;
}

async function spotifyGet(path: string): Promise<Response> {
  let response = await request(`${spotifyApi}${path}`, {
    headers: { Authorization: `Bearer ${await accessToken()}` },
  });
  if (response.status === 401) {
    response = await request(`${spotifyApi}${path}`, {
      headers: { Authorization: `Bearer ${await accessToken(true)}` },
    });
  }
  return response;
}

type SpotifyItem = {
  type?: string;
  name: string;
  duration_ms?: number;
  artists?: Array<{ name: string }>;
  album?: { name: string; images?: MusicImage[] };
  external_urls?: { spotify?: string };
};

export async function getCurrentlyPlaying(): Promise<NowPlaying> {
  return cached(
    "spotify:now",
    2_000,
    async () => {
      const fetchedAt = Date.now();
      const response = await spotifyGet("/me/player/currently-playing");
      if (response.status === 204)
        return { isPlaying: false, track: null, progressMs: 0, fetchedAt };
      if (!response.ok) throw new Error(`Spotify playback failed (${response.status})`);
      const data = (await response.json()) as {
        is_playing?: boolean;
        progress_ms?: number;
        item?: SpotifyItem;
        currently_playing_type?: string;
      };
      const item = data.item;
      if (!item || item.type !== "track")
        return { isPlaying: false, track: null, progressMs: 0, fetchedAt };
      return {
        isPlaying: Boolean(data.is_playing),
        progressMs: data.progress_ms ?? 0,
        fetchedAt,
        track: {
          name: item.name,
          artists: item.artists?.map((a) => a.name) ?? [],
          album: item.album?.name ?? null,
          image: item.album?.images?.[0]?.url ?? null,
          url: item.external_urls?.spotify ?? null,
          durationMs: item.duration_ms,
        },
      };
    },
    false,
  );
}

type LastfmImage = { "#text": string; size: string };
type LastfmArtist = string | { "#text"?: string; name?: string };
type LastfmTrack = {
  name: string;
  artist?: LastfmArtist;
  album?: { "#text"?: string };
  image?: LastfmImage[];
  url?: string;
  date?: { uts?: string };
  playcount?: string;
  "@attr"?: { nowplaying?: string };
};
function imageOf(images?: LastfmImage[]): string | null {
  return (
    [...(images ?? [])]
      .reverse()
      .find((i) => i["#text"] && !i["#text"].includes("2a96cbd8b46e442fc41c2b86b821562f"))?.[
      "#text"
    ] ?? null
  );
}
function artistName(artist?: LastfmArtist): string {
  return typeof artist === "string" ? artist : (artist?.["#text"] ?? artist?.name ?? "");
}
function asArray<T>(value?: T | T[]): T[] {
  return value == null ? [] : Array.isArray(value) ? value : [value];
}
function toTrack(t: LastfmTrack): Track {
  return {
    name: t.name,
    artists: [artistName(t.artist)].filter(Boolean),
    album: t.album?.["#text"] || null,
    image: imageOf(t.image),
    url: t.url ?? null,
    ...(t.date?.uts ? { playedAt: Number(t.date.uts) * 1000 } : {}),
    ...(t.playcount ? { plays: Number(t.playcount) } : {}),
  };
}
async function lastfm<T>(
  method: string,
  params: Record<string, string | number>,
  ttlMs: number,
): Promise<T> {
  const url = new URL(lastfmApi);
  url.search = new URLSearchParams({
    method,
    user: required("LASTFM_USERNAME"),
    api_key: required("LASTFM_API_KEY"),
    format: "json",
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  }).toString();
  return cached(
    `lastfm:${method}:${url.searchParams.get("user")}:${JSON.stringify(params)}`,
    ttlMs,
    async () => {
      const response = await request(url.toString());
      if (!response.ok) throw new Error(`Last.fm HTTP ${response.status}`);
      const data = (await response.json()) as T & { error?: number; message?: string };
      if (data.error) throw new Error(`Last.fm ${data.error}: ${data.message}`);
      return data;
    },
  );
}

export async function getRecentlyPlayed(limit = 20): Promise<Track[]> {
  const data = await lastfm<{ recenttracks: { track?: LastfmTrack | LastfmTrack[] } }>(
    "user.getrecenttracks",
    { limit: Math.max(1, Math.min(200, Math.floor(limit))) },
    30_000,
  );
  return asArray(data.recenttracks?.track)
    .filter((t) => t["@attr"]?.nowplaying !== "true")
    .map(toTrack);
}

export async function getTopTracks(period: Period = "1month", limit = 20): Promise<Track[]> {
  const data = await lastfm<{ toptracks: { track?: LastfmTrack | LastfmTrack[] } }>(
    "user.gettoptracks",
    { period, limit: Math.max(1, Math.min(100, Math.floor(limit))) },
    3_600_000,
  );
  return asArray(data.toptracks?.track).map(toTrack);
}

// MusicBrainz permits roughly one request per second per client. Serialize searches.
let musicBrainzQueue: Promise<unknown> = Promise.resolve();
let lastMusicBrainzRequest = 0;
function musicBrainzSearch(name: string): Promise<string | null> {
  return cached(`musicbrainz:artist:${name.toLowerCase()}`, 30 * 24 * 60 * 60_000, () => {
    const job = musicBrainzQueue
      .catch(() => undefined)
      .then(async () => {
        const wait = Math.max(0, 1100 - (Date.now() - lastMusicBrainzRequest));
        if (wait) await new Promise((resolve) => setTimeout(resolve, wait));
        lastMusicBrainzRequest = Date.now();
        const url = new URL("https://musicbrainz.org/ws/2/artist/");
        url.searchParams.set("query", `artist:"${name.replace(/["\\]/g, " ")}"`);
        url.searchParams.set("fmt", "json");
        url.searchParams.set("limit", "5");
        const response = await request(url.toString(), {
          headers: { "User-Agent": "PersonalMusicWebsite/1.0 (artist-image-lookup)" },
        });
        if (!response.ok) throw new Error(`MusicBrainz HTTP ${response.status}`);
        const data = (await response.json()) as { artists?: Array<{ id: string; name: string }> };
        return data.artists?.find((a) => a.name.toLowerCase() === name.toLowerCase())?.id ?? null;
      });
    musicBrainzQueue = job.then(
      () => undefined,
      () => undefined,
    );
    return job;
  });
}

type FanartImage = { url: string; likes?: string };
async function fanartArtistImage(mbid: string): Promise<string | null> {
  return cached(`fanart:artist:${mbid}`, 7 * 24 * 60 * 60_000, async () => {
    const key = process.env.FANARTTV_API_KEY;
    if (!key) return null;
    const response = await request(
      `https://webservice.fanart.tv/v3/music/${encodeURIComponent(mbid)}?api_key=${encodeURIComponent(key)}`,
    );
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Fanart.tv HTTP ${response.status}`);
    const data = (await response.json()) as {
      artistthumb?: FanartImage[];
      artistbackground?: FanartImage[];
    };
    const pick = (images?: FanartImage[]) =>
      images?.filter((i) => i.url).sort((a, b) => Number(b.likes ?? 0) - Number(a.likes ?? 0))[0]
        ?.url;
    return pick(data.artistthumb) ?? pick(data.artistbackground) ?? null;
  });
}

/** Resolves a portrait using the Last.fm MBID, or a rate-limited MusicBrainz lookup. */
export async function getArtistImage(
  artist: Pick<Artist, "name" | "mbid" | "image">,
): Promise<string | null> {
  if (!process.env.FANARTTV_API_KEY) return artist.image;
  try {
    const mbid = artist.mbid || (await musicBrainzSearch(artist.name));
    if (!mbid) return artist.image;
    return (await fanartArtistImage(mbid)) ?? artist.image;
  } catch {
    return artist.image;
  }
}

export async function getTopArtists(
  period: Period = "1month",
  limit = 20,
  enrichImages = true,
): Promise<Artist[]> {
  type A = { name: string; url?: string; mbid?: string; playcount?: string; image?: LastfmImage[] };
  const data = await lastfm<{ topartists: { artist?: A | A[] } }>(
    "user.gettopartists",
    { period, limit: Math.max(1, Math.min(100, Math.floor(limit))) },
    3_600_000,
  );
  const artists = asArray(data.topartists?.artist).map((a) => ({
    name: a.name,
    url: a.url ?? null,
    mbid: a.mbid || undefined,
    image: imageOf(a.image),
    plays: Number(a.playcount ?? 0),
  }));
  if (!enrichImages) return artists;
  // Keep image enrichment bounded and cached. Each artist can be requested independently.
  return Promise.all(
    artists.map(async (artist) => ({ ...artist, image: await getArtistImage(artist) })),
  );
}

export async function getTopAlbums(
  period: Period = "1month",
  limit = 20,
): Promise<
  Array<{ name: string; artist: string; image: string | null; url: string | null; plays: number }>
> {
  type A = {
    name: string;
    artist?: LastfmArtist;
    url?: string;
    playcount?: string;
    image?: LastfmImage[];
  };
  const data = await lastfm<{ topalbums: { album?: A | A[] } }>(
    "user.gettopalbums",
    { period, limit: Math.max(1, Math.min(100, Math.floor(limit))) },
    3_600_000,
  );
  return asArray(data.topalbums?.album).map((a) => ({
    name: a.name,
    artist: artistName(a.artist),
    image: imageOf(a.image),
    url: a.url ?? null,
    plays: Number(a.playcount ?? 0),
  }));
}

export async function getMusicStats() {
  const [nowPlaying, recent, artists, tracks, albums] = await Promise.all([
    getCurrentlyPlaying(),
    getRecentlyPlayed(10),
    getTopArtists("1month", 10),
    getTopTracks("1month", 10),
    getTopAlbums("1month", 10),
  ]);
  return { nowPlaying, recent, artists, tracks, albums };
}
