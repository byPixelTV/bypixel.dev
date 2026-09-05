"use client";

import Image from "next/image";
import RollText from "@/components/portfolio/RollText";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useAlbumAtmosphere, AmbientBlobs } from "@/components/portfolio/AlbumAtmosphere";
import { useEffect, useId, useRef, useState } from "react";

const time = (ms: number) => {
  const seconds = Math.floor(Math.max(0, ms) / 1000);
  return Math.floor(seconds / 60) + ":" + String(seconds % 60).padStart(2, "0");
};

export default function SpotifyNowPlaying() {
  const { data } = useAlbumAtmosphere();
  const reduce = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const detailId = useId();
  const trackKey = data?.trackId ?? data?.songUrl ?? data?.title;
  const hasTrack = Boolean(data?.title);
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLProgressElement>(null);
  const elapsed = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!hasTrack) return;
    let inView = false;
    const sync = () => {
      if (root.current) root.current.dataset.active = String(inView && !document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    if (root.current) observer.observe(root.current);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [hasTrack]);
  useEffect(() => {
    if (!data?.isPlaying || !data.durationMs) return;
    const received = performance.now();
    const update = () => {
      if (document.hidden || root.current?.dataset.active !== "true") return;
      const value = Math.min(
        data?.durationMs ?? 0,
        (data?.progressMs ?? 0) + (data?.isPlaying ? performance.now() - received : 0),
      );
      if (progress.current) progress.current.value = value;
      if (elapsed.current) elapsed.current.textContent = time(value);
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [data]);
  if (!hasTrack) return null;
  return (
    <motion.div
      ref={root}
      className="spotify-live"
      aria-label="Spotify activity"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 0.75, 0.18, 1] }}
    >
      <AmbientBlobs className="spotify-ambience" />
      {data?.title ? (
        <div
          className="spotify-track"
          data-expanded={expanded}
          onKeyDown={(event) => {
            if (event.key === "Escape") setExpanded(false);
          }}
        >
          <button
            type="button"
            className="spotify-toggle"
            aria-expanded={expanded}
            aria-controls={detailId}
            onClick={() => setExpanded(!expanded)}
          >
            {data.albumImageUrl && (
              <Image
                src={data.albumImageUrl}
                alt=""
                width={64}
                height={64}
                sizes="64px"
                className="spotify-cover"
              />
            )}
            <span className="spotify-status">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="11" fill="currentColor" />
                <path
                  d="M6 9c4-1.2 8-1 12 1M7 12c3-1 6.5-.7 10 1M8 15c2.8-.6 5-.3 8 1"
                  fill="none"
                  stroke="#102416"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              {data.isPlaying ? "Now playing" : "Last played"}
            </span>
            <span className="spotify-copy" aria-live="polite" aria-atomic="true">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={trackKey}
                  className="spotify-song-text"
                  initial="incoming"
                  animate="visible"
                  exit="outgoing"
                >
                  <strong title={data.title}>
                    <TrackRollText reduce={Boolean(reduce)}>{data.title}</TrackRollText>
                  </strong>
                  <span>
                    <TrackRollText reduce={Boolean(reduce)}>{data.artist ?? ""}</TrackRollText>
                  </span>
                  {data.album && (
                    <motion.small
                      variants={{
                        incoming: { opacity: 0 },
                        visible: { opacity: 1 },
                        outgoing: { opacity: 0 },
                      }}
                      transition={{ duration: reduce ? 0 : 0.56 }}
                    >
                      {data.album}
                    </motion.small>
                  )}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="spotify-indicator" aria-hidden="true">
              {data.isPlaying ? (
                <span className="spotify-bars">
                  <i />
                  <i />
                  <i />
                </span>
              ) : (
                "↗"
              )}
            </span>
            {data.isPlaying && data.durationMs && (
              <span className="spotify-timeline">
                <progress
                  ref={progress}
                  max={data.durationMs}
                  value={data.progressMs ?? 0}
                  aria-label="Track progress"
                />
                <span className="spotify-times">
                  <span ref={elapsed}>{time(data.progressMs ?? 0)}</span>
                  <span>{time(data.durationMs)}</span>
                </span>
              </span>
            )}
            <span className="spotify-disclosure">
              {expanded ? "Less detail" : "Track details"}{" "}
              <span aria-hidden="true">{expanded ? "−" : "+"}</span>
            </span>
          </button>
          <motion.div
            id={detailId}
            className="spotify-details"
            initial={false}
            animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 0.75, 0.18, 1] }}
            inert={!expanded}
            aria-hidden={!expanded}
          >
            <div className="spotify-details-inner">
              <dl>
                <div>
                  <dt>Track</dt>
                  <dd>{data.title}</dd>
                </div>
                <div>
                  <dt>Artist</dt>
                  <dd>{data.artist}</dd>
                </div>
                {data.album && (
                  <div>
                    <dt>Album</dt>
                    <dd>{data.album}</dd>
                  </div>
                )}
                {data.durationMs && (
                  <div>
                    <dt>Duration</dt>
                    <dd>{time(data.durationMs)}</dd>
                  </div>
                )}
              </dl>
              {data.songUrl && (
                <a
                  className="spotify-open"
                  href={data.songUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <RollText>Open song in Spotify ↗</RollText>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      ) : null}
    </motion.div>
  );
}

/** The old letters roll out as the new ones enter; no second autoplay or hover pass. */
function TrackRollText({ children, reduce }: { children: string; reduce: boolean }) {
  return (
    <span className="roll-text">
      <span className="sr-only">{children}</span>
      <span className="roll-visual" aria-hidden="true">
        {Array.from(children).map((letter, index) => (
          <span key={index} className="roll-letter">
            <motion.span
              className="spotify-roll-glyph"
              style={{ display: "block", height: "1.2em", lineHeight: 1.2 }}
              variants={{
                incoming: { y: reduce ? 0 : "100%", opacity: 0 },
                visible: { y: 0, opacity: 1 },
                outgoing: { y: reduce ? 0 : "-100%", opacity: 0 },
              }}
              transition={{
                duration: reduce ? 0 : 0.56,
                delay: reduce ? 0 : Math.min(index, 22) * 0.012,
                ease: [0.22, 0.75, 0.18, 1],
              }}
            >
              {letter === " " ? "\u00a0" : letter}
            </motion.span>
          </span>
        ))}
      </span>
    </span>
  );
}
