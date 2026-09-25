"use client";

import { useEffect, useRef } from "react";

/** Observe the stationary heading, never the translated and clipped text. */
export default function ChapterTitle({
  as: Tag = "h2",
  lines,
  id,
  className = "",
}: {
  as?: "h1" | "h2";
  lines: string[];
  id?: string;
  className?: string;
}) {
  const root = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const heading = root.current;
    if (!heading) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animations: Animation[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (preference.matches) return;
        animations = Array.from(heading.querySelectorAll(".chapter-title-line")).map(
          (line, index) =>
            line.animate(
              [
                { transform: "translateY(105%)", opacity: 0 },
                { transform: "translateY(0)", opacity: 1 },
              ],
              {
                duration: 850,
                delay: index * 100,
                easing: "cubic-bezier(.22,.75,.18,1)",
                fill: "backwards",
              },
            ),
        );
      },
      { threshold: 0.12 },
    );
    const stop = () => {
      if (preference.matches) animations.forEach((animation) => animation.cancel());
    };
    observer.observe(heading);
    preference.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", stop);
    };
  }, [lines.join("|")]);
  return (
    <Tag ref={root} id={id} className={`chapter-title ${className}`} aria-label={lines.join(" ")}>
      {lines.map((line, index) => (
        <span className="chapter-title-mask" key={line} aria-hidden="true">
          <span className={`chapter-title-line ${index > 0 ? "chapter-title-accent" : ""}`}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
