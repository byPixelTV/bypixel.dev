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

import { usePathname } from "next/navigation";
import { getNowPlaying, type NowPlayingResult } from "@/lib/actions/spotify";
const AlbumContext = createContext<{ data: NowPlayingResult | null; loaded: boolean }>({
  data: null,
  loaded: false,
});
const fallback = ["rgb(139 92 246)", "rgb(192 132 252)", "rgb(120 80 205)"];
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
        canvas.width = canvas.height = 24;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return resolve(fallback);
        ctx.drawImage(cover, 0, 0, 24, 24);
        const { data } = ctx.getImageData(0, 0, 24, 24);
        const colors = [0, 1, 2].map((region) => {
          const rgb = [0, 0, 0];
          let count = 0;
          for (let y = 0; y < 24; y++)
            for (let x = region * 8; x < region * 8 + 8; x++) {
              const offset = (y * 24 + x) * 4;
              for (let channel = 0; channel < 3; channel++) rgb[channel] += data[offset + channel];
              count++;
            }
          const average = rgb.map((value) => value / count);
          const peak = Math.max(...average, 1);
          const lift = Math.max(1, 165 / peak);
          return `rgb(${average.map((value) => Math.round(Math.min(235, value * lift + 12))).join(" ")})`;
        });
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
  const cover = data?.albumImageUrl ?? null;
  // Scope scroll-driven styles to the scenery, avoiding invalidation of the whole page.
  useEffect(() => {
    if (pathname !== "/") return;
    const scenery = root.current?.querySelector<HTMLElement>(".page-ambience");
    if (!scenery) return;
    const baseLights = scenery.querySelectorAll<HTMLElement>(".ambient-base-light");
    const albumLights = scenery.querySelectorAll<HTMLElement>(".ambient-album-light");
    let frame = 0;
    let previousPresence: number | undefined;
    const update = () => {
      frame = 0;
      const progress = Math.min(1, Math.max(0, (window.scrollY / window.innerHeight - 0.2) / 0.8));
      const presence = 1 - progress;
      if (presence === previousPresence) return;
      previousPresence = presence;
      baseLights.forEach((light) => {
        light.style.opacity = String(1 - presence);
      });
      albumLights.forEach((light) => {
        light.style.opacity = String(presence);
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);
  useEffect(() => {
    let disposed = false;
    let pending = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const poll = async () => {
      if (disposed || pending || document.hidden) return;
      pending = true;
      try {
        const result = await getNowPlaying();
        if (!disposed) {
          setData((previous) => {
            if (
              previous &&
              !result.isPlaying &&
              (Object.keys({ ...previous, ...result }) as (keyof NowPlayingResult)[]).every(
                (key) => previous[key] === result[key],
              )
            )
              return previous;
            return result;
          });
        }
      } catch {
        /* Keep the last known track during temporary network failures. */
      } finally {
        pending = false;
        if (!disposed) {
          setLoaded(true);
          if (!document.hidden) timer = setTimeout(poll, 5000);
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
  }, []);
  useEffect(() => {
    let disposed = false;
    const apply = (colors: string[]) => {
      if (disposed || !root.current) return;
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
  }, [cover]);
  return (
    <AlbumContext value={{ data, loaded }}>
      <div ref={root} className="album-atmosphere" data-home={pathname === "/"}>
        <AmbientBlobs className="page-ambience" />
        <svg
          className="ambient-chart"
          viewBox="0 0 1600 1000"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <g fill="none" stroke="currentColor" strokeWidth="0.65">
            <ellipse cx="800" cy="500" rx="750" ry="350" transform="rotate(-28 800 500)" />
            <ellipse cx="800" cy="500" rx="920" ry="460" transform="rotate(-28 800 500)" />
            <path d="M110 185h12m-6-6v12M1390 730h12m-6-6v12M1210 130h12m-6-6v12M340 820h12m-6-6v12" />
            <circle cx="230" cy="300" r="3" />
            <circle cx="1320" cy="625" r="3" />
          </g>
        </svg>
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
