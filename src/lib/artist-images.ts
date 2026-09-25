import "server-only";
import type { TopArtistResult } from "@/lib/actions/spotify";

const normalize = (name: string) => name.normalize("NFKC").trim().toLowerCase();

/** Cache successes and misses, and share lookups across simultaneous visitors. */
export function createArtistImageLookup() {
  const cache = new Map<string, { image?: string; expiresAt: number }>();
  const pending = new Map<string, Promise<string | undefined>>();

  return async function lookup(name: string): Promise<string | undefined> {
    const key = normalize(name);
    if (!key) return undefined;
    const cached = cache.get(key);
    if (cached && cached.expiresAt > Date.now()) return cached.image;
    const existing = pending.get(key);
    if (existing) return existing;

    const work = (async () => {
      let image = cached?.image;
      let lifetime = 300000;
      try {
        const response = await fetch(
          `https://api.deezer.com/search/artist?q=${encodeURIComponent(name)}&limit=10`,
          { cache: "no-store", signal: AbortSignal.timeout(4000) },
        );
        if (response.ok) {
          const data = await response.json();
          const artist = Array.isArray(data.data)
            ? data.data.find(
                (item: { name?: unknown }) =>
                  typeof item?.name === "string" && normalize(item.name) === key,
              )
            : undefined;
          if (typeof artist?.picture_medium === "string") {
            const url = new URL(artist.picture_medium);
            if (
              url.protocol === "https:" &&
              url.hostname === "cdn-images.dzcdn.net" &&
              url.pathname.startsWith("/images/artist/") &&
              !url.port &&
              !url.username &&
              !url.password &&
              !url.search
            ) {
              image = url.href;
              lifetime = 86400000;
            }
          }
        }
      } catch {
        // An unavailable image provider must never hide the artist list.
      }
      cache.set(key, { image, expiresAt: Date.now() + lifetime });
      if (cache.size > 256) cache.delete(cache.keys().next().value!);
      return image;
    })().finally(() => pending.delete(key));
    pending.set(key, work);
    return work;
  };
}

const lookupArtistImage = createArtistImageLookup();

export async function withArtistImages(artists: TopArtistResult[]): Promise<TopArtistResult[]> {
  return Promise.all(
    artists.map(async (artist) => ({
      ...artist,
      imageUrl: artist.imageUrl || (await lookupArtistImage(artist.name)),
    })),
  );
}
