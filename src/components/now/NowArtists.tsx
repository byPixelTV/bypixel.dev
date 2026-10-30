"use client";

import { useEffect, useState } from "react";
import { LiquidGlass } from "@vepando/liquid-glass-react";
import NowImage from "@/components/now/NowImage";
import {
  getTopArtists,
  getFavoriteArtists,
  getArtistImages,
  type TopArtistResult,
} from "@/lib/actions/spotify";

import { favoriteArtists } from "@/lib/favorite-artists";

export default function NowArtists() {
  const [artists, setArtists] = useState<TopArtistResult[]>(favoriteArtists);
  const [live, setLive] = useState(false);
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    let disposed = false;
    let pending = false;
    let hasTopArtists = false;
    let timer: ReturnType<typeof setTimeout>;
    const refresh = () => {
      if (disposed || pending || document.hidden) return;
      pending = true;
      void getTopArtists()
        .then(async (result) => {
          if (disposed) return;
          if (!result.length) {
            if (hasTopArtists) return;
            const fallback = await getFavoriteArtists();
            if (!disposed) setArtists(fallback);
            return;
          }
          hasTopArtists = true;
          setArtists((current) =>
            result.map((artist) => ({
              ...artist,
              imageUrl:
                artist.imageUrl ||
                current.find((old) => old.id === artist.id && old.name === artist.name)?.imageUrl,
            })),
          );
          setLive(true);
          if (result.some((artist) => !artist.imageUrl)) {
            void getArtistImages(
              result.filter((artist) => !artist.imageUrl).map(({ id, name }) => ({ id, name })),
            )
              .then((enriched) => {
                if (disposed) return;
                setArtists((current) =>
                  current.map((artist) => {
                    const match = enriched.find(
                      (item) => item.id === artist.id && item.name === artist.name,
                    );
                    return match?.imageUrl ? { ...artist, imageUrl: match.imageUrl } : artist;
                  }),
                );
              })
              .catch(() => {});
          }
        })
        .catch(() => {
          /* Keep the explicitly labelled personal favorites. */
        })
        .finally(() => {
          pending = false;
          if (!disposed && !document.hidden) timer = setTimeout(refresh, 60000);
          if (!disposed) setSettled(true);
        });
    };
    const visibility = () => {
      clearTimeout(timer);
      refresh();
    };
    document.addEventListener("visibilitychange", visibility);
    void refresh();
    return () => {
      disposed = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  return (
    <div className="now-artists min-w-0">
      <LiquidGlass radius={20} tint="dark" blur={4} specular={0.8} className="now-artists-glass">
        <div className="now-artists-label min-h-[54px] flex justify-between items-center flex-wrap gap-2 pb-4">
          <h3>{!settled ? "Artists" : live ? "My top artists" : "Personal favorites"}</h3>
          <span className="eyebrow font-medium tracking-[0.13em] uppercase">
            {!settled ? "Loading" : live ? "Recent listening" : "Regular rotation"}
          </span>
        </div>
        {!settled ? (
          <ol className="now-artist-skeletons" aria-label="Loading artists" aria-busy="true">
            {favoriteArtists.map((artist) => (
              <li key={artist.id}>
                <div aria-hidden="true">
                  <span className="now-skeleton now-skeleton-number" />
                  <span className="now-skeleton now-skeleton-avatar" />
                  <span className="now-skeleton-copy">
                    <span className="now-skeleton" />
                    <span className="now-skeleton" />
                  </span>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <ol>
            {artists.map((artist, index) => {
              const content = (
                <>
                  <span className="now-artist-number text-[11px]">0{index + 1}</span>
                  <span className="now-artist-image shrink-0 grid place-items-center overflow-hidden rounded-full text-[28px]">
                    {artist.imageUrl ? (
                      <NowImage
                        key={artist.imageUrl}
                        src={artist.imageUrl}
                        alt=""
                        fallback={artist.name.slice(0, 1)}
                        sizes="64px"
                      />
                    ) : (
                      <span aria-hidden="true">{artist.name.slice(0, 1)}</span>
                    )}
                  </span>
                  <span className="now-artist-name min-w-0">
                    <strong>{artist.name}</strong>
                    <small>{artist.genres.slice(0, 2).join(" / ") || "On repeat"}</small>
                  </span>
                  {artist.spotifyUrl && <span aria-hidden="true">↗</span>}
                </>
              );
              return (
                <li key={artist.id}>
                  {artist.spotifyUrl ? (
                    <a href={artist.spotifyUrl} target="_blank" rel="noopener noreferrer">
                      {content}
                    </a>
                  ) : (
                    <div>{content}</div>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </LiquidGlass>
    </div>
  );
}
