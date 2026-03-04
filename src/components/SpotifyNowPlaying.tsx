"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { getNowPlaying, type NowPlayingResult } from "@/lib/actions/spotify";

// Animated equalizer bars
const MusicBars = () => (
  <div className="flex items-end gap-[2px] h-3.5">
    {[0.55, 0.7, 0.6].map((dur, i) => (
      <span
        key={i}
        className="w-[3px] rounded-full bg-[#1DB954]"
        style={{
          animation: `spotifyBar ${dur}s ease-in-out infinite alternate`,
          animationDelay: `${i * 0.12}s`,
        }}
      />
    ))}
    <style>{`
      @keyframes spotifyBar {
        from { height: 3px; }
        to   { height: 14px; }
      }
    `}</style>
  </div>
);

function formatMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

const POLL_INTERVAL = 5_000;

const SpotifyNowPlaying = () => {
  const [data, setData] = useState<NowPlayingResult | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [progressMs, setProgressMs] = useState(0);
  const prevTrackId = useRef<string | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNowPlaying = async () => {
    try {
      const result = await getNowPlaying();

      if (
        result.isPlaying &&
        result.trackId &&
        prevTrackId.current !== null &&
        result.trackId !== prevTrackId.current
      ) {
        setDirection(1);
      }
      if (result.isPlaying && result.trackId) {
        prevTrackId.current = result.trackId;
      }

      setData(result);
      if (result.isPlaying && result.progressMs !== undefined) {
        setProgressMs(result.progressMs);
      }
    } catch {
      setData(null);
    }
  };

  useEffect(() => {
    fetchNowPlaying();
    const id = setInterval(fetchNowPlaying, POLL_INTERVAL);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tick progress forward every second between polls
  useEffect(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (!data?.isPlaying) return;
    const duration = data.durationMs ?? Infinity;
    tickRef.current = setInterval(() => {
      setProgressMs((prev) => Math.min(prev + 1000, duration));
    }, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.isPlaying, data?.trackId, data?.durationMs]);

  const show = data?.isPlaying && data.title;
  const progressPercent = data?.durationMs
    ? Math.min((progressMs / data.durationMs) * 100, 100)
    : 0;

  const contentVariants = {
    enter: (dir: number) => ({ opacity: 0, y: dir * 10 }),
    center: { opacity: 1, y: 0 },
    exit: (dir: number) => ({ opacity: 0, y: dir * -10 }),
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          key="spotify-container"
          href={data!.songUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative overflow-hidden flex flex-col bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl mt-4 hover:bg-white/15 transition-colors duration-200 group"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={data!.trackId ?? data!.title}
              className="w-full"
              custom={direction}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {/* Top section: album art + track info */}
              <div className="flex items-center gap-3 px-4 pt-3 pb-2">
                {/* Album Art – bigger */}
                {data!.albumImageUrl && (
                  <div className="relative shrink-0">
                    <Image
                      src={data!.albumImageUrl}
                      alt={data!.title ?? "Album art"}
                      width={56}
                      height={56}
                      className="rounded-xl object-cover"
                    />
                    <div className="absolute inset-0 rounded-xl ring-1 ring-white/10" />
                  </div>
                )}

                {/* Track info */}
                <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Icon
                        icon="mdi:spotify"
                        className="text-[#1DB954] shrink-0"
                        style={{ fontSize: "13px" }}
                      />
                      <span className="text-[10px] uppercase tracking-widest text-white/50 font-semibold truncate">
                        Now Playing
                      </span>
                    </div>
                    <div className="shrink-0">
                      <MusicBars />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-white truncate leading-tight group-hover:text-white/90">
                    {data!.title}
                  </p>
                  <p className="text-xs text-white/50 truncate">{data!.artist}</p>
                  {data!.album && (
                    <p className="text-[11px] text-white/30 truncate italic leading-tight">
                      {data!.album}
                    </p>
                  )}
                </div>
              </div>

              {/* Progress section */}
              <div className="px-4 pb-3">
                {/* Animated progress bar */}
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    key={data!.trackId}
                    className="h-full bg-[#1DB954] rounded-full"
                    style={{
                      width: `${progressPercent}%`,
                      transition: "width 1s linear",
                    }}
                  />
                </div>
                {/* Time display */}
                <div className="flex justify-between items-center mt-1.5">
                  <span className="text-[10px] text-white/40 tabular-nums font-medium">
                    {formatMs(progressMs)}
                  </span>
                  <span className="text-[10px] text-white/40 tabular-nums font-medium">
                    {data!.durationMs ? formatMs(data!.durationMs) : ""}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.a>
      )}
    </AnimatePresence>
  );
};

export default SpotifyNowPlaying;
