"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import CustomVideoPlayer from "@/components/blog/CustomVideoPlayer";

type MediaType = "image" | "video";

interface LightboxMedia {
  src: string;
  alt: string;
  type: MediaType;
}

interface PostImageLightboxProps {
  rootId: string;
}

export default function PostImageLightbox({ rootId }: PostImageLightboxProps) {
  const [media, setMedia] = useState<LightboxMedia[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const hasMultipleMedia = useMemo(() => media.length > 1, [media.length]);

  const close = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || media.length === 0) return current;
      return (current - 1 + media.length) % media.length;
    });
  }, [media.length]);

  const goNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || media.length === 0) return current;
      return (current + 1) % media.length;
    });
  }, [media.length]);

  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;
    let rafId: number | null = null;

    const nodes = Array.from(
      root.querySelectorAll<HTMLElement>("[data-post-media='true']")
    );

    const collected = nodes
      .map((node, index) => {
        node.setAttribute("data-lightbox-index", String(index));

        const typeAttr = node.getAttribute("data-post-type");
        const type: MediaType = typeAttr === "video" ? "video" : "image";

        const dataSrc = node.getAttribute("data-post-src");
        let src = dataSrc || "";

        if (!src && node instanceof HTMLImageElement) {
          src = node.currentSrc || node.src;
        }

        if (!src && node instanceof HTMLVideoElement) {
          src = node.currentSrc || node.src || node.querySelector("source")?.src || "";
        }

        if (!src) return null;

        return {
          src,
          alt: node.getAttribute("alt") || node.getAttribute("aria-label") || "Post media",
          type,
        };
      })
      .filter((item): item is LightboxMedia => Boolean(item));

    rafId = requestAnimationFrame(() => {
      setMedia(collected);
    });

    const handleRootClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const openButton = target?.closest("[data-post-open-viewer='true']") as HTMLElement | null;

      if (openButton) {
        event.preventDefault();
        event.stopPropagation();

        const openSrc = openButton.getAttribute("data-post-open-viewer-src") || "";
        if (!openSrc) return;

        const index = collected.findIndex((item) => item.src === openSrc);
        if (index === -1) return;

        setActiveIndex(index);
        return;
      }

      const mediaElement = target?.closest("[data-post-media='true']") as HTMLElement | null;
      if (!mediaElement) return;

      if (mediaElement.getAttribute("data-post-type") === "video" && !openButton) return;

      const index = Number(mediaElement.getAttribute("data-lightbox-index"));
      if (!Number.isFinite(index)) return;

      setActiveIndex(index);
    };

    root.addEventListener("click", handleRootClick);

    return () => {
      root.removeEventListener("click", handleRootClick);
      nodes.forEach((node) => node.removeAttribute("data-lightbox-index"));
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [rootId]);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
      if (event.key === "ArrowLeft" && hasMultipleMedia) {
        goPrev();
      }
      if (event.key === "ArrowRight" && hasMultipleMedia) {
        goNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, close, goNext, goPrev, hasMultipleMedia]);

  useEffect(() => {
    if (activeIndex === null) return;

    const activeThumb = document.querySelector<HTMLButtonElement>(
      `[data-lightbox-thumb-index='${activeIndex}']`
    );

    activeThumb?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeIndex]);

  if (activeIndex === null || !media[activeIndex]) return null;

  const activeMedia = media[activeIndex];

  return (
    <div
      className="fixed inset-0 z-120 bg-black/85"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Media preview"
    >
      {hasMultipleMedia && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            goPrev();
          }}
          aria-label="Previous media"
          className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white/85 hover:bg-black/80 hover:text-white transition-colors cursor-pointer sm:left-4"
        >
          <ChevronLeft className="h-7 w-7 sm:h-8 sm:w-8" />
        </button>
      )}

      {hasMultipleMedia && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            goNext();
          }}
          aria-label="Next media"
          className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white/85 hover:bg-black/80 hover:text-white transition-colors cursor-pointer sm:right-4"
        >
          <ChevronRight className="h-7 w-7 sm:h-8 sm:w-8" />
        </button>
      )}

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          close();
        }}
        aria-label="Close media preview"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 rounded-full bg-black/55 p-2 text-white hover:bg-black/80 transition-colors cursor-pointer"
      >
        <X className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      <div
        className="absolute inset-0 flex items-center justify-center px-6 pb-28 pt-16 sm:px-12 sm:pb-32 sm:pt-20 pointer-events-none"
      >
        {activeMedia.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeMedia.src}
            alt={activeMedia.alt}
            className="max-h-full max-w-full rounded-lg object-contain shadow-2xl pointer-events-auto"
            onClick={(event) => event.stopPropagation()}
          />
        ) : (
          <CustomVideoPlayer
            src={activeMedia.src}
            autoPlay
            className="max-h-full max-w-full rounded-lg bg-black shadow-2xl pointer-events-auto"
            onClick={(event) => event.stopPropagation()}
          />
        )}
      </div>

      {media.length > 0 && (
        <div
          className="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-black/55 px-3 py-3 sm:px-5"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto pb-1">
            {media.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={`${item.src}-${index}`}
                  type="button"
                  data-lightbox-thumb-index={index}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Open media ${index + 1}`}
                  className={`relative h-14 w-24 shrink-0 overflow-hidden rounded-md border transition-all cursor-pointer sm:h-16 sm:w-28 ${
                    isActive
                      ? "border-sky-400 ring-1 ring-sky-300"
                      : "border-white/20 hover:border-white/50"
                  }`}
                >
                  {item.type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.src}
                      alt={item.alt || `Thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <>
                      <video
                        src={item.src}
                        muted
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-cover"
                      />
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25 text-xs font-semibold text-white">
                        VIDEO
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
