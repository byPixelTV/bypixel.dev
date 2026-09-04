"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getTopArtists, type TopArtistResult } from "@/lib/actions/spotify";

const favorites: TopArtistResult[] = [
  { id: "raf-camora", name: "RAF Camora", genres: ["german hip hop"] },
  { id: "travis-scott", name: "Travis Scott", genres: ["rap", "trap"] },
  { id: "yeat", name: "Yeat", genres: ["rage rap"] },
  { id: "nf", name: "NF", genres: ["hip hop"] },
  { id: "don-toliver", name: "Don Toliver", genres: ["melodic rap"] },
];

export default function NowArtists() {
  const [artists, setArtists] = useState(favorites);
  const [live, setLive] = useState(false);
  useEffect(() => {
    let disposed = false;
    getTopArtists()
      .then((result) => {
        if (disposed || !result.length) return;
        setArtists(result);
        setLive(true);
      })
      .catch(() => {
        /* Keep the explicitly labelled personal favorites. */
      });
    return () => {
      disposed = true;
    };
  }, []);
  return (
    <div className="now-artists">
      <div className="now-artists-label">
        <h3>{live ? "My top artists" : "Personal favorites"}</h3>
        <span className="eyebrow">{live ? "Spotify / Past 4 weeks" : "Regular rotation"}</span>
      </div>
      <ol>
        {artists.map((artist, index) => {
          const content = (
            <>
              <span className="now-artist-number">0{index + 1}</span>
              <span className="now-artist-image">
                {artist.imageUrl ? (
                  <Image src={artist.imageUrl} alt="" width={72} height={72} sizes="72px" />
                ) : (
                  <span aria-hidden="true">{artist.name.slice(0, 1)}</span>
                )}
              </span>
              <span className="now-artist-name">
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
    </div>
  );
}
