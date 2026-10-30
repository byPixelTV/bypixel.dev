"use client";
import SpotifyNowPlaying from "@/components/SpotifyNowPlaying";
import { useAlbumAtmosphere } from "@/components/portfolio/AlbumAtmosphere";
import NowImage from "./NowImage";

export default function NowListening() {
  const { data, loaded } = useAlbumAtmosphere();
  const art = data?.albumImageUrl ? (
    <NowImage
      key={data.albumImageUrl}
      src={data.albumImageUrl}
      alt={data.album ? `${data.album} album cover` : "Current album cover"}
      sizes="(max-width: 760px) 80vw, 260px"
      className="now-album-image"
    />
  ) : !loaded ? (
    <div
      className="now-album-loading now-skeleton"
      role="status"
      aria-label="Loading album cover"
    />
  ) : (
    <div className="now-album-empty">
      <span>♪</span>
      <p>The latest listen appears here.</p>
    </div>
  );
  return (
    <div className="now-listening min-w-0">
      <div className="now-listening-top flex justify-between gap-4 mb-6">
        <span className="eyebrow font-medium tracking-[0.13em] uppercase">From my Spotify</span>
        <span className="eyebrow font-medium tracking-[0.13em] uppercase">
          {!loaded ? "Loading" : data?.isPlaying ? "Listening now" : "Latest listen"}
        </span>
      </div>
      {data?.songUrl && data.albumImageUrl ? (
        <a
          className="now-album-art block m-auto overflow-hidden"
          href={data.songUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Listen to ${data.title} on Spotify`}
        >
          {art}
          <span className="now-album-link-label">Open in Spotify ↗</span>
        </a>
      ) : (
        <div className="now-album-art block m-auto overflow-hidden">{art}</div>
      )}
      <SpotifyNowPlaying />
    </div>
  );
}
