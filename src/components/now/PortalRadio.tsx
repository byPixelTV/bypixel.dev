"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./PortalRadio.module.css";

type Player = {
  playVideo(): void;
  pauseVideo(): void;
  setVolume(volume: number): void;
  destroy(): void;
};
type YouTube = {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      host: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady(event: { target: Player }): void;
        onStateChange(event: { data: number }): void;
        onAutoplayBlocked(): void;
        onError(): void;
      };
    },
  ) => Player;
};
type YouTubeWindow = Window & { YT?: YouTube; onYouTubeIframeAPIReady?: () => void };
let apiPromise: Promise<YouTube> | undefined;

function loadYouTube(): Promise<YouTube> {
  const target = window as YouTubeWindow;
  if (target.YT?.Player) return Promise.resolve(target.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const previous = target.onYouTubeIframeAPIReady;
    const timeout = window.setTimeout(fail, 15000);
    function fail() {
      clearTimeout(timeout);
      target.onYouTubeIframeAPIReady = previous;
      script.remove();
      apiPromise = undefined;
      reject(new Error("YouTube unavailable"));
    }
    target.onYouTubeIframeAPIReady = () => {
      clearTimeout(timeout);
      target.onYouTubeIframeAPIReady = previous;
      if (target.YT?.Player) resolve(target.YT);
      else fail();
      previous?.();
    };
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = fail;
    document.head.appendChild(script);
  });
  return apiPromise;
}

export default function PortalRadio() {
  const section = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<Player | null>(null);
  const visible = useRef(false);
  const paused = useRef(false);
  const [discovered, setDiscovered] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const sync = () => {
      if (visible.current && !document.hidden && !paused.current) player.current?.playVideo();
      else player.current?.pauseVideo();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting && entry.intersectionRatio >= 0.35;
        if (visible.current) setDiscovered(true);
        sync();
      },
      { threshold: [0, 0.35] },
    );
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  useEffect(() => {
    if (!discovered) return;
    let disposed = false;
    let instance: Player | undefined;
    let fadeTimer: ReturnType<typeof setInterval> | undefined;
    const resetVolume = () => {
      clearInterval(fadeTimer);
      fadeTimer = undefined;
      player.current?.setVolume(3);
    };
    const fadeIn = () => {
      resetVolume();
      const started = performance.now();
      fadeTimer = setInterval(() => {
        if (!visible.current || document.hidden || paused.current) {
          resetVolume();
          return;
        }
        const progress = Math.min(1, (performance.now() - started) / 3000);
        // Start audibly at 3%, then smoothly reach a quiet 10% volume.
        player.current?.setVolume(3 + 7 * progress * progress * (3 - 2 * progress));
        if (progress === 1) clearInterval(fadeTimer);
      }, 100);
    };
    void loadYouTube()
      .then((api) => {
        if (disposed || !host.current) return;
        // YouTube replaces its mount element; keep React's host intact.
        const mount = document.createElement("div");
        host.current.replaceChildren(mount);
        instance = new api.Player(mount, {
          videoId: "Ffx56ZqZoIM",
          host: "https://www.youtube-nocookie.com",
          playerVars: { playsinline: 1, controls: 0, origin: window.location.origin },
          events: {
            onReady: ({ target }) => {
              if (disposed) return;
              player.current = target;
              target.setVolume(3);
              setReady(true);
              if (visible.current && !document.hidden && !paused.current) target.playVideo();
            },
            onStateChange: ({ data }) => {
              if (disposed) return;
              if (data === 1 && (!visible.current || document.hidden || paused.current)) {
                resetVolume();
                player.current?.pauseVideo();
                return;
              }
              if (data === 1) fadeIn();
              else resetVolume();
              setPlaying(data === 1);
            },
            onAutoplayBlocked: () => {
              if (!disposed) {
                resetVolume();
                setPlaying(false);
              }
            },
            onError: () => {
              if (!disposed) {
                resetVolume();
                setFailed(true);
                setPlaying(false);
              }
            },
          },
        });
        const iframe = host.current.querySelector("iframe");
        if (iframe) {
          iframe.title = "Portal radio audio";
          iframe.tabIndex = -1;
          iframe.setAttribute("allow", "autoplay; encrypted-media");
        }
      })
      .catch(() => {
        if (!disposed) setFailed(true);
      });
    return () => {
      disposed = true;
      clearInterval(fadeTimer);
      player.current = null;
      instance?.destroy();
    };
  }, [discovered]);

  const label = playing ? "Pause Portal radio" : "Play Portal radio";
  return (
    <div className={styles.depth}>
      <section
        ref={section}
        className={styles.radio}
        data-discovered={discovered}
        aria-label="Portal radio"
      >
        <div className={styles.art}>
          <Image
            src="/portal.jpeg"
            alt="The glowing 85.2 FM radio from Portal"
            width={1920}
            height={1080}
            sizes="(max-width: 468px) calc(100vw - 48px), 420px"
          />
        </div>
        <div className={styles.caption}>
          <div>
            <span className="eyebrow">Aperture Science / 85.2 FM</span>
            <p>
              I played Portal and Portal 2 for the first time in 2026. Portal 2 was a recent
              discovery, and I still find it wild that a game like this came out in 2011. Both feel
              timeless.
            </p>
            <p>The Source Engine behind them is just as fascinating to me.</p>
          </div>
          {failed ? (
            <a href="https://youtu.be/Ffx56ZqZoIM" target="_blank" rel="noopener noreferrer">
              Listen on YouTube
            </a>
          ) : (
            <button
              type="button"
              disabled={!ready}
              title={label}
              aria-label={label}
              aria-pressed={playing}
              onClick={() => {
                paused.current = playing;
                if (playing) player.current?.pauseVideo();
                else player.current?.playVideo();
              }}
            >
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </button>
          )}
        </div>
        <div ref={host} className={styles.player} aria-hidden="true" inert />
      </section>
    </div>
  );
}
