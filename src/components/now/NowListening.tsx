"use client";
import Image from "next/image";
import SpotifyNowPlaying from "@/components/SpotifyNowPlaying";
import { useAlbumAtmosphere } from "@/components/portfolio/AlbumAtmosphere";

export default function NowListening() {
  const { data } = useAlbumAtmosphere();
  return (
    <div className="now-listening min-w-0">
      <div className="now-listening-top flex justify-between gap-4 mb-6">
        <span className="eyebrow font-medium tracking-[0.13em] uppercase">From my Spotify</span>
        <span className="eyebrow font-medium tracking-[0.13em] uppercase">
          {data?.isPlaying ? "Listening now" : "Latest listen"}
        </span>
      </div>
      {data?.albumImageUrl ? (
        <a
          className="now-album-art block m-auto overflow-hidden"
          href={data.songUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={"Listen to " + data.title + " on Spotify"}
        >
          <Image
            src={data.albumImageUrl}
            alt={data.album ? data.album + " album cover" : "Current album cover"}
            width={420}
            height={420}
            sizes="(max-width: 760px) 80vw, 420px"
          />
          <span>Open in Spotify ↗</span>
        </a>
      ) : (
        <div className="now-album-placeholder min-h-[280px] grid gap-[18px]">
          <span>
            THE DAILY
            <br />
            SOUNDTRACK.
          </span>
          <p>The latest listen appears here.</p>
        </div>
      )}
      <SpotifyNowPlaying />
    </div>
  );
}
