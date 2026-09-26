"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { getTopArtists, getFavoriteArtists, type TopArtistResult } from "@/lib/actions/spotify";

import { favoriteArtists } from "@/lib/favorite-artists";

export default function NowArtists() {
  const reduce = useReducedMotion();
  const [artists, setArtists] = useState<TopArtistResult[]>(favoriteArtists);
  const [live, setLive] = useState(false);
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
          setArtists(result);
          setLive(true);
        })
        .catch(() => {
          /* Keep the explicitly labelled personal favorites. */
        })
        .finally(() => {
          pending = false;
          if (!disposed && !document.hidden) timer = setTimeout(refresh, 60000);
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
      <div className="now-artists-label min-h-[54px] flex justify-between items-center flex-wrap gap-2 pb-4">
        <h3>{live ? "My top artists" : "Personal favorites"}</h3>
        <span className="eyebrow font-medium tracking-[0.13em] uppercase">
          {live ? "Spotify / Past 4 weeks" : "Regular rotation"}
        </span>
      </div>
      <ol>
        {artists.map((artist, index) => {
          const content = (
            <>
              <span className="now-artist-number text-[11px]">0{index + 1}</span>
              <span className="now-artist-image shrink-0 grid place-items-center overflow-hidden rounded-full text-[28px]">
                {artist.imageUrl ? (
                  <Image src={artist.imageUrl} alt="" width={72} height={72} sizes="72px" />
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
            <motion.li
              key={artist.id}
              initial={reduce ? false : { opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: reduce ? 0 : 0.7,
                delay: reduce ? 0 : Math.min(index, 4) * 0.06,
                ease: [0.22, 0.75, 0.18, 1],
              }}
            >
              {artist.spotifyUrl ? (
                <a href={artist.spotifyUrl} target="_blank" rel="noopener noreferrer">
                  {content}
                </a>
              ) : (
                <div>{content}</div>
              )}
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
