"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LiquidGlass } from "@vepando/liquid-glass-react";
import { useAlbumAtmosphere } from "@/components/portfolio/AlbumAtmosphere";

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
  return (
    <LiquidGlass radius={22} tint="dark" blur={4} specular={0.8} className="spotify-glass">
      <div className="spotify-widget" aria-label="Spotify activity">
        <div className="spotify-widget-row">
          <div className="spotify-widget-cover">
            <AnimatePresence initial={false}>
              <motion.div
                key={key}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.22 }}
              >
                {data?.albumImageUrl && (
                  <img src={data.albumImageUrl} alt="" className="size-full object-cover" />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="min-w-0 flex-1">
            <div className="spotify-widget-status">
              <span data-playing={data?.isPlaying || undefined} />
              {!loaded
                ? "Loading Spotify…"
                : data?.stale
                  ? "Last known track"
                  : data?.isPlaying
                    ? "Listening now"
                    : "Last listened"}
            </div>
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.18 }}
              >
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
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        {data?.isPlaying && duration > 0 && (
          <div className="spotify-widget-progress">
            <progress max={duration} value={position} aria-label="Song progress" />
            <div>
              <span>{formatTime(position)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}
      </div>
    </LiquidGlass>
  );
}
