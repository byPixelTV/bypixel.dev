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

const FALLBACK_CARD_COLORS = ["#1DB954", "#4FD1C5", "#A78BFA"];
const CARD_TRANSITION_MS = 650;

type RGB = [number, number, number];

function parseColor(color: string): RGB {
  const hex = color.trim();
  if (hex.startsWith("#")) {
    const value = hex.slice(1);
    if (value.length === 3) {
      return [
        Number.parseInt(value[0] + value[0], 16),
        Number.parseInt(value[1] + value[1], 16),
        Number.parseInt(value[2] + value[2], 16),
      ];
    }
    if (value.length === 6) {
      return [
        Number.parseInt(value.slice(0, 2), 16),
        Number.parseInt(value.slice(2, 4), 16),
        Number.parseInt(value.slice(4, 6), 16),
      ];
    }
  }

  const values = color.match(/\d+/g)?.map(Number) ?? [255, 255, 255];
  return [values[0] ?? 255, values[1] ?? 255, values[2] ?? 255];
}

function mixColor(from: string, to: string, t: number): string {
  const a = parseColor(from);
  const b = parseColor(to);
  const x = Math.max(0, Math.min(1, t));
  const r = Math.round(a[0] + (b[0] - a[0]) * x);
  const g = Math.round(a[1] + (b[1] - a[1]) * x);
  const bCh = Math.round(a[2] + (b[2] - a[2]) * x);
  return `rgb(${r} ${g} ${bCh})`;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function getRegionAverage(
  pixels: Uint8ClampedArray,
  width: number,
  xStart: number,
  xEnd: number,
  yStart: number,
  yEnd: number
): string {
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;

  for (let y = yStart; y < yEnd; y += 2) {
    for (let x = xStart; x < xEnd; x += 2) {
      const i = (y * width + x) * 4;
      r += pixels[i];
      g += pixels[i + 1];
      b += pixels[i + 2];
      count++;
    }
  }

  if (!count) return FALLBACK_CARD_COLORS[0];

  return `rgb(${Math.round(r / count)} ${Math.round(g / count)} ${Math.round(b / count)})`;
}

function getAlbumCardColors(imageUrl: string): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          resolve(FALLBACK_CARD_COLORS);
          return;
        }

        const size = 30;
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);

        const { data } = ctx.getImageData(0, 0, size, size);
        resolve([
          getRegionAverage(data, size, 0, 10, 0, size),
          getRegionAverage(data, size, 10, 20, 0, size),
          getRegionAverage(data, size, 20, size, 0, size),
        ]);
      } catch {
        resolve(FALLBACK_CARD_COLORS);
      }
    };

    img.onerror = () => resolve(FALLBACK_CARD_COLORS);
    img.src = imageUrl;
  });
}

interface SpotifyNowPlayingProps {
  onNowPlayingChange?: (result: NowPlayingResult | null) => void;
}

const SpotifyNowPlaying = ({ onNowPlayingChange }: SpotifyNowPlayingProps) => {
  const [data, setData] = useState<NowPlayingResult | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [progressMs, setProgressMs] = useState(0);
  const [targetCardColors, setTargetCardColors] = useState<string[]>(FALLBACK_CARD_COLORS);
  const [cardColors, setCardColors] = useState<string[]>(FALLBACK_CARD_COLORS);
  const prevTrackId = useRef<string | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cardColorsRef = useRef<string[]>(FALLBACK_CARD_COLORS);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    cardColorsRef.current = cardColors;
  }, [cardColors]);

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
      onNowPlayingChange?.(result);
      if (result.isPlaying && result.progressMs !== undefined) {
        setProgressMs(result.progressMs);
      }
    } catch {
      setData(null);
      onNowPlayingChange?.(null);
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

  useEffect(() => {
    let disposed = false;

    if (!data?.isPlaying || !data.albumImageUrl) {
      setTargetCardColors(FALLBACK_CARD_COLORS);
      return;
    }

    getAlbumCardColors(data.albumImageUrl).then((colors) => {
      if (!disposed) setTargetCardColors(colors);
    });

    return () => {
      disposed = true;
    };
  }, [data?.isPlaying, data?.albumImageUrl, data?.trackId]);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const fromPalette = cardColorsRef.current;
    const toPalette = targetCardColors;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / CARD_TRANSITION_MS, 1);
      const eased = easeInOutCubic(progress);

      const next = fromPalette.map((fromColor, index) =>
        mixColor(fromColor, toPalette[index] ?? fromColor, eased)
      );

      cardColorsRef.current = next;
      setCardColors(next);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targetCardColors]);

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
          className="group relative mt-4 flex flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md transition-colors duration-200 hover:bg-white/14"
          style={{
            boxShadow: `0 0 42px color-mix(in srgb, ${cardColors[0]} 40%, transparent), 0 0 72px color-mix(in srgb, ${cardColors[2]} 26%, transparent)`,
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full blur-3xl"
            style={{ background: `radial-gradient(circle, ${cardColors[0]} 0%, transparent 68%)` }}
            animate={{ x: [0, 12, -10, 0], y: [0, -8, 10, 0], scale: [1, 1.14, 1] }}
            transition={{ duration: 7.5, ease: "easeInOut", repeat: Infinity }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 bottom-[-2.5rem] h-44 w-44 rounded-full blur-3xl"
            style={{ background: `radial-gradient(circle, ${cardColors[1]} 0%, transparent 70%)` }}
            animate={{ x: [0, -10, 8, 0], y: [0, 10, -8, 0], scale: [1, 1.12, 1] }}
            transition={{ duration: 8.2, ease: "easeInOut", repeat: Infinity }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: `linear-gradient(110deg, color-mix(in srgb, ${cardColors[0]} 24%, transparent), color-mix(in srgb, ${cardColors[1]} 18%, transparent) 48%, color-mix(in srgb, ${cardColors[2]} 22%, transparent))`,
            }}
          />

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={data!.trackId ?? data!.title}
              className="relative z-10 w-full"
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
