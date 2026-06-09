"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import SpotifyNowPlaying from "@/components/SpotifyNowPlaying";
import type { NowPlayingResult } from "@/lib/actions/spotify";

const ACTIVE_FALLBACK_BLOB_COLORS = ["#1DB954", "#40C7FF", "#A78BFA"];
const IDLE_BLOB_COLORS = ["#d8dbe2", "#b9bec8", "#8f96a3"];
const BLOB_TRANSITION_MS = 650;

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

  if (!count) return ACTIVE_FALLBACK_BLOB_COLORS[0];

  return `rgb(${Math.round(r / count)} ${Math.round(g / count)} ${Math.round(b / count)})`;
}

function getAlbumBlobColors(imageUrl: string): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          resolve(ACTIVE_FALLBACK_BLOB_COLORS);
          return;
        }

        const size = 36;
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);

        const { data } = ctx.getImageData(0, 0, size, size);
        const left = getRegionAverage(data, size, 0, 12, 0, size);
        const mid = getRegionAverage(data, size, 12, 24, 0, size);
        const right = getRegionAverage(data, size, 24, size, 0, size);

        resolve([left, mid, right]);
      } catch {
        resolve(ACTIVE_FALLBACK_BLOB_COLORS);
      }
    };

    img.onerror = () => resolve(ACTIVE_FALLBACK_BLOB_COLORS);
    img.src = imageUrl;
  });
}

const Profile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [albumAmbience, setAlbumAmbience] = useState<string | null>(null);
  const [targetBlobColors, setTargetBlobColors] = useState<string[]>(IDLE_BLOB_COLORS);
  const [blobColors, setBlobColors] = useState<string[]>(IDLE_BLOB_COLORS);
  const blobColorsRef = useRef<string[]>(IDLE_BLOB_COLORS);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    blobColorsRef.current = blobColors;
  }, [blobColors]);

  useEffect(() => {
    let disposed = false;

    if (!albumAmbience || isMobile) return;

    getAlbumBlobColors(albumAmbience).then((colors) => {
      if (!disposed) setTargetBlobColors(colors);
    });

    return () => {
      disposed = true;
    };
  }, [albumAmbience, isMobile]);

  useEffect(() => {
    if (isMobile) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const fromPalette = blobColorsRef.current;
    const toPalette = targetBlobColors;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / BLOB_TRANSITION_MS, 1);
      const eased = easeInOutCubic(progress);

      const next = fromPalette.map((fromColor, index) =>
        mixColor(fromColor, toPalette[index] ?? fromColor, eased)
      );

      blobColorsRef.current = next;
      setBlobColors(next);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targetBlobColors, isMobile]);

  const renderedBlobColors = isMobile ? targetBlobColors : blobColors;
  const heroAccentGradient = `linear-gradient(90deg, ${renderedBlobColors[0]}, ${renderedBlobColors[1]} 52%, ${renderedBlobColors[2]})`;

  const handleNowPlayingChange = (result: NowPlayingResult | null) => {
    if (isMobile) {
      setAlbumAmbience(null);
      setTargetBlobColors(IDLE_BLOB_COLORS);
      return;
    }

    if (result?.isPlaying && result.albumImageUrl) {
      setAlbumAmbience(result.albumImageUrl);
      return;
    }
    setAlbumAmbience(null);
    setTargetBlobColors(IDLE_BLOB_COLORS);
  };

  return (
    <section id="top">
      <motion.div
        layout
        className="relative min-h-[calc(100vh-8.25rem)]"
        transition={{ layout: { duration: 0.4, ease: "easeInOut" } }}
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-20 -inset-y-20 overflow-visible opacity-80 sm:-inset-x-32 sm:-inset-y-28 sm:opacity-100"
          initial={false}
          animate={{ opacity: isMobile ? 0.76 : albumAmbience ? 1 : 0.92 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        >
          <>
            <motion.div
              className="absolute -left-32 -top-20 h-104 w-104 rounded-full blur-[84px] saturate-[1.75] sm:-left-44 sm:-top-28 sm:h-[38rem] sm:w-[38rem] sm:blur-[128px] sm:saturate-[1.95]"
              style={{
                background: `radial-gradient(circle, color-mix(in srgb, ${renderedBlobColors[0]} 92%, white) 0%, ${renderedBlobColors[0]} 22%, transparent 68%)`,
                mixBlendMode: "screen",
              }}
              animate={isMobile ? { x: 0, y: 0, scale: 1 } : { x: [0, 54, -40, 0], y: [0, -40, 22, 0], scale: [1, 1.28, 0.92, 1] }}
              transition={isMobile ? { duration: 0 } : { duration: 12, ease: "easeInOut", repeat: Infinity }}
            />
            <motion.div
              className="absolute -right-24 top-10 h-96 w-96 rounded-full blur-[88px] saturate-[1.8] sm:-right-40 sm:top-4 sm:h-[34rem] sm:w-[34rem] sm:blur-[126px] sm:saturate-[2]"
              style={{
                background: `radial-gradient(circle, color-mix(in srgb, ${renderedBlobColors[1]} 88%, white) 0%, ${renderedBlobColors[1]} 24%, transparent 66%)`,
                mixBlendMode: "screen",
              }}
              animate={isMobile ? { x: 0, y: 0, scale: 1 } : { x: [0, -44, 30, 0], y: [0, 38, -28, 0], scale: [1, 0.9, 1.22, 1] }}
              transition={isMobile ? { duration: 0 } : { duration: 11, ease: "easeInOut", repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-36 left-[18%] hidden h-[34rem] w-[34rem] rounded-full blur-[112px] saturate-[1.85] sm:block"
              style={{
                background: `radial-gradient(circle, color-mix(in srgb, ${renderedBlobColors[2]} 90%, white) 0%, ${renderedBlobColors[2]} 26%, transparent 70%)`,
                mixBlendMode: "screen",
              }}
              animate={{ x: [0, 26, -30, 0], y: [0, -26, 20, 0], scale: [1, 1.25, 0.9, 1] }}
              transition={{ duration: 13, ease: "easeInOut", repeat: Infinity }}
            />
            <motion.div
              className="absolute left-[50%] top-[16%] hidden h-[18rem] w-[18rem] -translate-x-1/2 rounded-full blur-[92px] saturate-[1.9] sm:block"
              style={{
                background: `radial-gradient(circle, color-mix(in srgb, ${renderedBlobColors[1]} 82%, white) 0%, ${renderedBlobColors[1]} 20%, transparent 64%)`,
                mixBlendMode: "screen",
              }}
              animate={{ x: [0, 18, -16, 0], y: [0, -18, 18, 0], scale: [0.92, 1.2, 0.94] }}
              transition={{ duration: 9.5, ease: "easeInOut", repeat: Infinity }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at center, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 22%, rgba(0,0,0,0) 55%), radial-gradient(circle at 50% 48%, color-mix(in srgb, ${renderedBlobColors[1]} 22%, transparent) 0%, transparent 46%)`,
                filter: "blur(18px)",
                mixBlendMode: "overlay",
              }}
            />
          </>
        </motion.div>

        <div className="relative z-10 flex min-h-[calc(100vh-8.25rem)] items-center justify-center px-6 py-14 sm:px-8 lg:px-10">
          <div className="w-full max-w-300 text-center text-white">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-[54%] rounded-full blur-3xl"
              style={{
                background: `radial-gradient(circle, ${renderedBlobColors[1]} 0%, transparent 68%)`,
                opacity: albumAmbience ? 0.18 : 0.12,
              }}
            />
            <motion.p
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/72 sm:text-xs"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              Hey I&apos;m byPixelTV
            </motion.p>

            <motion.h1
              className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              A fullstack developer
              <span
                className="block bg-clip-text text-transparent"
                style={{ backgroundImage: heroAccentGradient, textShadow: "0 0 26px rgba(255,255,255,0.12)" }}
              >
                from Germany.
              </span>
            </motion.h1>

            <motion.p
              className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              I build modern, performant software with a focus on clean design and smooth user experience.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <a
                href="#projects"
                className="rounded-full border border-white/30 bg-white/92 px-6 py-2.5 text-xs font-medium text-black transition-colors hover:bg-white sm:px-5 sm:py-2 sm:text-sm"
              >
                View projects
              </a>
              <a
                href="mailto:contact@bypixel.dev"
                className="rounded-full border border-white/25 bg-transparent px-6 py-2.5 text-xs font-medium text-white transition-colors hover:bg-white/10 sm:px-5 sm:py-2 sm:text-sm"
                style={{ boxShadow: `0 0 0 1px color-mix(in srgb, ${renderedBlobColors[1]} 18%, transparent)` }}
              >
                Contact
              </a>
            </motion.div>

            <motion.div
              className="mx-auto mt-8 w-full max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <SpotifyNowPlaying onNowPlayingChange={isMobile ? undefined : handleNowPlayingChange} />
            </motion.div>

            <motion.div
              className="mt-6 flex flex-wrap items-center justify-center gap-2.5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.4 }}
            >
              <motion.a
                href="https://github.com/bypixeltv"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 bg-white/8 p-2.5 backdrop-blur-md transition-colors duration-200 hover:bg-white/16"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaGithub className="h-5 w-5 text-white" />
              </motion.a>
              <motion.a
                href="https://discord.gg/yVp7Qvhj9k"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 bg-white/8 p-2.5 backdrop-blur-md transition-colors duration-200 hover:bg-white/16"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaDiscord className="h-5 w-5 text-white" />
              </motion.a>
              <motion.a
                href="https://twitter.com/bypixeltv"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 bg-white/8 p-2.5 backdrop-blur-md transition-colors duration-200 hover:bg-white/16"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaXTwitter className="h-5 w-5 text-white" />
              </motion.a>
              <motion.a
                href="https://streame.gg/@bypixelttv"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 bg-white/8 p-2.5 backdrop-blur-md transition-colors duration-200 hover:bg-white/16"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src="/streame.png"
                  alt="Streame.gg"
                  width={20}
                  height={20}
                  className="h-5 w-5 rounded-full"
                />
              </motion.a>
              <motion.a
                href="mailto:contact@bypixel.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 bg-white/8 p-2.5 backdrop-blur-md transition-colors duration-200 hover:bg-white/16"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <MdEmail className="h-5 w-5 text-white" />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Profile;
