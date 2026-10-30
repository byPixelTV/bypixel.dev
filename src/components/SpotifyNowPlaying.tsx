"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LiquidGlass } from "@vepando/liquid-glass-react";
import { useAlbumAtmosphere } from "@/components/portfolio/AlbumAtmosphere";
import { FaSpotify } from "react-icons/fa";

function formatTime(ms: number) {
  const seconds = Math.floor(Math.max(0, ms) / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function SpotifyNowPlaying() {
  const { data, loaded } = useAlbumAtmosphere();
  const [elapsed, setElapsed] = useState(0);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const started = performance.now();
    const update = () =>
      setElapsed(data?.isPlaying && !document.hidden ? performance.now() - started : 0);
    update();
    if (!data?.isPlaying) return;
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [data]);

  const duration = data?.durationMs ?? 0;
  const position = Math.max(0, Math.min(duration, (data?.progressMs ?? 0) + elapsed));
  const key = data?.trackId ?? data?.songUrl ?? data?.title ?? "empty";
  const showProgress = Boolean(data?.isPlaying && duration > 0);
  const status = !loaded
    ? "Loading Spotify…"
    : data?.stale
      ? "Last known track"
      : data?.isPlaying
        ? "Listening now"
        : "Last listened";
  return (
    <LiquidGlass radius={22} tint="dark" blur={4} specular={0.8} className="spotify-glass">
      <div className="spotify-widget" aria-label="Spotify activity">
        <div className="spotify-widget-track">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={key}
              className="spotify-widget-row"
              initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reducedMotion ? 0 : -6 }}
              transition={{ duration: reducedMotion ? 0 : 0.2, ease: "easeInOut" }}
            >
              <div className="spotify-widget-cover">
                {data?.albumImageUrl && (
                  <img src={data.albumImageUrl} alt="" className="size-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="spotify-widget-status">
                  <motion.span
                    className="spotify-status-dot"
                    animate={{ backgroundColor: data?.isPlaying ? "#45d479" : "#888888" }}
                    transition={{ duration: reducedMotion ? 0 : 0.35 }}
                    aria-hidden="true"
                  />
                  <span className="spotify-status-label" aria-live="polite">
                    <AnimatePresence initial={false} mode="wait">
                      <motion.span
                        key={status}
                        initial={{ opacity: 0, y: reducedMotion ? 0 : 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: reducedMotion ? 0 : -3 }}
                        transition={{ duration: reducedMotion ? 0 : 0.16, ease: "easeInOut" }}
                      >
                        {status}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </div>
                {data?.songUrl ? (
                  <a
                    className="spotify-widget-title"
                    href={data.songUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.title}
                  </a>
                ) : (
                  <p className="spotify-widget-title">
                    {data?.title ?? (loaded ? "No recent listening activity" : " ")}
                  </p>
                )}
                <p className="spotify-widget-artist">{data?.artist}</p>
                {data?.album && data.album !== data.title && (
                  <p className="spotify-widget-album">{data.album}</p>
                )}
              </div>
              <FaSpotify className="spotify-widget-service" aria-label="Spotify" />
            </motion.div>
          </AnimatePresence>
        </div>
        <motion.div
          className="spotify-widget-progress"
          initial={false}
          animate={{
            opacity: showProgress ? 1 : 0,
            height: showProgress ? "auto" : 0,
            marginTop: showProgress ? 14 : 0,
            y: showProgress || reducedMotion ? 0 : 4,
          }}
          transition={{ duration: reducedMotion ? 0 : 0.3, ease: "easeInOut" }}
          aria-hidden={!showProgress}
        >
          <progress max={duration || 1} value={position} aria-label="Song progress" />
          <div>
            <span>{formatTime(position)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </motion.div>
      </div>
    </LiquidGlass>
  );
}
