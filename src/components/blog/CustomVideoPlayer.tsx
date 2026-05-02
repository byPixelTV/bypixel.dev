"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Maximize, Minimize, Pause, Play, Volume2, VolumeX } from "lucide-react";

interface CustomVideoPlayerProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  wrapperProps?: React.HTMLAttributes<HTMLDivElement> & {
    [key: `data-${string}`]: string | undefined;
  };
}

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

function formatPlaybackRate(rate: number): string {
  return Number.isInteger(rate) ? `${rate}` : `${rate}`;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const remaining = total % 60;
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

export default function CustomVideoPlayer({
  src,
  className,
  autoPlay = false,
  onClick,
  wrapperProps,
}: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const speedMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncFromVideo = () => {
      setCurrentTime(video.currentTime || 0);
      setDuration(video.duration || 0);
      setIsPlaying(!video.paused && !video.ended);
      setIsMuted(video.muted || video.volume === 0);
      setVolume(video.volume);
    };

    const initialSyncId = requestAnimationFrame(syncFromVideo);

    video.addEventListener("loadedmetadata", syncFromVideo);
    video.addEventListener("timeupdate", syncFromVideo);
    video.addEventListener("play", syncFromVideo);
    video.addEventListener("pause", syncFromVideo);
    video.addEventListener("volumechange", syncFromVideo);
    video.addEventListener("ended", syncFromVideo);

    return () => {
      cancelAnimationFrame(initialSyncId);
      video.removeEventListener("loadedmetadata", syncFromVideo);
      video.removeEventListener("timeupdate", syncFromVideo);
      video.removeEventListener("play", syncFromVideo);
      video.removeEventListener("pause", syncFromVideo);
      video.removeEventListener("volumechange", syncFromVideo);
      video.removeEventListener("ended", syncFromVideo);
    };
  }, [src]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!speedMenuRef.current?.contains(event.target as Node)) {
        setSpeedMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSpeedMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      try {
        await video.play();
      } catch {
        // autoplay might be blocked by browser settings
      }
      return;
    }

    video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.muted || video.volume === 0) {
      const nextVolume = volume > 0 ? volume : 1;
      video.muted = false;
      video.volume = nextVolume;
      return;
    }

    video.muted = true;
  };

  const handleSeek = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value;
    setCurrentTime(value);
  };

  const handleVolume = (value: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = value;
    video.muted = value === 0;
    setVolume(value);
  };

  const handlePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
    setSpeedMenuOpen(false);
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      await container.requestFullscreen();
      return;
    }

    await document.exitFullscreen();
  };

  return (
    <div
      ref={containerRef}
      {...wrapperProps}
      className={[
        "relative overflow-hidden rounded-2xl border border-violet-300/25 bg-[#0b0715] shadow-[0_24px_80px_rgba(30,10,56,0.55)]",
        className ?? "",
        wrapperProps?.className ?? "",
      ].join(" ")}
      onClick={(event) => {
        wrapperProps?.onClick?.(event);
        onClick?.(event);
      }}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay={autoPlay}
        playsInline
        className="h-full w-full bg-black"
        onClick={(event) => event.stopPropagation()}
      >
        Your browser does not support this video.
      </video>

      <div className="absolute inset-x-0 bottom-0 border-t border-violet-300/20 bg-linear-to-t from-[#0b0715]/95 via-[#120a24]/80 to-transparent px-3 py-3 sm:px-4 sm:py-4">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          onChange={(event) => handleSeek(Number(event.target.value))}
          className="mb-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-violet-200/20 accent-violet-400"
          aria-label="Video progress"
        />

        <div className="flex items-center gap-2 text-white">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              void togglePlay();
            }}
            className="rounded-md border border-violet-300/25 bg-violet-500/15 p-2 transition-colors hover:bg-violet-500/25 cursor-pointer"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>

          <span className="min-w-20 text-xs text-white/90 sm:text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              toggleMute();
            }}
            className="rounded-md border border-violet-300/25 bg-violet-500/15 p-2 transition-colors hover:bg-violet-500/25 cursor-pointer"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(event) => handleVolume(Number(event.target.value))}
            className="h-1.5 w-16 cursor-pointer appearance-none rounded-full bg-violet-200/20 accent-violet-400 sm:w-24"
            aria-label="Video volume"
          />

          <div className="flex-1" />

          <div ref={speedMenuRef} className="relative">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setSpeedMenuOpen((open) => !open);
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-violet-300/25 bg-violet-500/15 px-2.5 text-xs text-white transition-colors hover:bg-violet-500/25 sm:text-sm"
              aria-haspopup="menu"
              aria-expanded={speedMenuOpen}
              aria-label="Playback speed"
            >
              {formatPlaybackRate(playbackRate)}x
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${speedMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {speedMenuOpen && (
              <div
                className="absolute bottom-11 right-0 z-30 min-w-24 overflow-hidden rounded-lg border border-violet-300/20 bg-[#110a22] shadow-[0_12px_36px_rgba(18,8,35,0.65)]"
                role="menu"
                onClick={(event) => event.stopPropagation()}
              >
                {PLAYBACK_RATES.map((rate) => {
                  const selected = rate === playbackRate;
                  return (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => handlePlaybackRate(rate)}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors cursor-pointer ${
                        selected
                          ? "bg-violet-500/25 text-white"
                          : "text-violet-100 hover:bg-violet-400/15"
                      }`}
                      role="menuitemradio"
                      aria-checked={selected}
                    >
                      <span>{formatPlaybackRate(rate)}x</span>
                      {selected && <Check className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              void toggleFullscreen();
            }}
            className="rounded-md border border-violet-300/25 bg-violet-500/15 p-2 transition-colors hover:bg-violet-500/25 cursor-pointer"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
