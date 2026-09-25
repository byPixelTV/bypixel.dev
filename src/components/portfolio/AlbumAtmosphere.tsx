"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { albumFallback as fallback, extractAlbumPalette } from "@/lib/album-palette";
import FluidAtmosphere from "./FluidAtmosphere";
import { usePathname } from "next/navigation";
import { getNowPlaying, type NowPlayingResult } from "@/lib/actions/spotify";
import { latestSpotifyActivity } from "@/lib/spotify-activity";
import { spotifyPollDelay } from "@/lib/spotify-polling";
const AlbumContext = createContext<{ data: NowPlayingResult | null; loaded: boolean }>({
  data: null,
  loaded: false,
});
const palettes = new Map<string, string[]>();
export const useAlbumAtmosphere = () => useContext(AlbumContext);

function paletteFromCover(url: string): Promise<string[]> {
  const cached = palettes.get(url);
  if (cached) return Promise.resolve(cached);
  return new Promise((resolve) => {
    const cover = new window.Image();
    cover.crossOrigin = "anonymous";
    cover.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const sampleSize = 96;
        canvas.width = canvas.height = sampleSize;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return resolve(fallback);
        ctx.drawImage(cover, 0, 0, sampleSize, sampleSize);
        const { data } = ctx.getImageData(0, 0, sampleSize, sampleSize);
        const colors = extractAlbumPalette(data);
        if (palettes.size > 24) palettes.clear();
        palettes.set(url, colors);
        resolve(colors);
      } catch {
        resolve(fallback);
      }
    };
    cover.onerror = () => resolve(fallback);
    cover.src = url;
  });
}

export default function AlbumAtmosphere({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<NowPlayingResult | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [atmosphere, setAtmosphere] = useState<{ colors: string[]; trackKey: string | null }>({
    colors: fallback,
    trackKey: null,
  });
  const cover = data?.albumImageUrl ?? null;
  const trackKey =
    data?.trackId ?? data?.songUrl ?? (data?.title ? `${data.title}::${data.artist ?? ""}` : null);
  useEffect(() => {
    let disposed = false;
    let pending = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const poll = async () => {
      if (disposed || pending || document.hidden) return;
      pending = true;
      let delay = 15000;
      try {
        const result = await getNowPlaying();
        delay = spotifyPollDelay(result);
        if (!disposed) {
          setData((previous) => {
            const activity = latestSpotifyActivity(previous, result);
            if (
              previous &&
              !activity.isPlaying &&
              (Object.keys({ ...previous, ...activity }) as (keyof NowPlayingResult)[]).every(
                (key) => previous[key] === activity[key],
              )
            )
              return previous;
            return activity;
          });
        }
      } catch {
        if (!disposed) {
          setData((previous) => latestSpotifyActivity(previous, { isPlaying: false, stale: true }));
        }
      } finally {
        pending = false;
        if (!disposed) {
          setLoaded(true);
          if (!document.hidden) timer = setTimeout(poll, Math.min(delay, 2147483647));
        }
      }
    };
    const visibility = () => {
      clearTimeout(timer);
      void poll();
    };
    void poll();
    document.addEventListener("visibilitychange", visibility);
    return () => {
      disposed = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [pathname]);
  useEffect(() => {
    let disposed = false;
    const apply = (colors: string[]) => {
      if (disposed || !root.current) return;
      setAtmosphere({ colors, trackKey });
      colors.forEach((color, index) =>
        root.current!.style.setProperty(`--album-${index + 1}`, color),
      );
      root.current.dataset.album = cover ? "active" : "idle";
    };
    if (cover) void paletteFromCover(cover).then(apply);
    else apply(fallback);
    return () => {
      disposed = true;
    };
  }, [cover, trackKey]);
  return (
    <AlbumContext value={{ data, loaded }}>
      <div ref={root} className="album-atmosphere" data-home={pathname === "/"}>
        <FluidAtmosphere colors={atmosphere.colors} trackKey={atmosphere.trackKey} />
        {children}
      </div>
    </AlbumContext>
  );
}

/** Random, slow transform paths. No per-frame React state or moving blur filters. */
export function AmbientBlobs({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Map<HTMLElement, Animation>();
    let disposed = false;
    let visible = false;
    const drift = (element: HTMLElement, from = "translate3d(0,0,0) scale(1)") => {
      if (disposed || preference.matches) return;
      const next = `translate3d(${Math.random() * 230 - 115}px,${Math.random() * 180 - 90}px,0) scale(${0.9 + Math.random() * 0.24}) rotate(${Math.random() * 12 - 6}deg)`;
      const animation = element.animate([{ transform: from }, { transform: next }], {
        duration: 6500 + Math.random() * 4500,
        easing: "ease-in-out",
        fill: "forwards",
      });
      const previous = animations.get(element);
      animations.set(element, animation);
      previous?.cancel();
      if (!visible || document.hidden) animation.pause();
      animation.onfinish = () => drift(element, next);
    };
    const sync = () => {
      if (preference.matches) {
        animations.forEach((animation) => animation.cancel());
        animations.clear();
        return;
      }
      root.current?.querySelectorAll<HTMLElement>(".ambient-blob").forEach((element) => {
        if (!animations.has(element)) drift(element);
      });
      animations.forEach((animation) => {
        if (visible && !document.hidden) animation.play();
        else animation.pause();
      });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(root.current);
    preference.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      disposed = true;
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  return (
    <div ref={root} className={`ambient-blobs ${className}`} aria-hidden="true">
      {[1, 2, 3].map((number) => (
        <i
          key={number}
          className="ambient-blob"
          style={{ "--blob-color": `var(--album-${number})` } as CSSProperties}
        >
          {className === "page-ambience" && (
            <>
              <span className="ambient-base-light" />
              <span className="ambient-album-light" />
            </>
          )}
        </i>
      ))}
    </div>
  );
}
