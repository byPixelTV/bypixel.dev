"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { getNowPlaying, type NowPlayingResult } from "@/lib/actions/spotify";

// Animated equalizer bars – only renders while a song is active
const MusicBars = () => (
  <div className="flex items-end gap-[2px] h-4">
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
        from { height: 4px; }
        to   { height: 16px; }
      }
    `}</style>
  </div>
);

const POLL_INTERVAL = 5_000; // 5 s — Discord-like

const SpotifyNowPlaying = () => {
  const [data, setData] = useState<NowPlayingResult | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const prevTrackId = useRef<string | null>(null);

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

  const show = data?.isPlaying && data.title;

  // Variants for song-change crossfade/slide
  const contentVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      y: dir * 12,
    }),
    center: { opacity: 1, y: 0 },
    exit: (dir: number) => ({
      opacity: 0,
      y: dir * -12,
    }),
  };

  return (
    // Outer container animates in/out when going from playing → not playing
    <AnimatePresence>
      {show && (
        <motion.a
          key="spotify-container"
          href={data!.songUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative overflow-hidden flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 mt-4 hover:bg-white/15 transition-colors duration-200 group"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4 }}
        >
          {/* Inner content re-mounts on track change for the slide animation */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={data!.trackId ?? data!.title}
              className="flex items-center gap-3 w-full min-w-0"
              custom={direction}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Album Art */}
              {data!.albumImageUrl && (
                <div className="relative shrink-0">
                  <Image
                    src={data!.albumImageUrl}
                    alt={data!.title ?? "Album art"}
                    width={44}
                    height={44}
                    className="rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 rounded-lg ring-1 ring-white/10" />
                </div>
              )}

              {/* Track info */}
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <Icon
                    icon="mdi:spotify"
                    className="text-[#1DB954] shrink-0"
                    style={{ fontSize: "14px" }}
                  />
                  <span className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">
                    Now Playing
                  </span>
                </div>
                <p className="text-sm font-semibold text-white truncate leading-tight group-hover:text-white/90">
                  {data!.title}
                </p>
                <p className="text-xs text-white/50 truncate">{data!.artist}</p>
              </div>

              {/* Equalizer bars */}
              <div className="shrink-0">
                <MusicBars />
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.a>
      )}
    </AnimatePresence>
  );
};

export default SpotifyNowPlaying;
