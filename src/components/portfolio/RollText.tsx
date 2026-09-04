"use client";
import { useEffect, useRef, type CSSProperties } from "react";

/** Finish a roll even when the pointer leaves; ignore retriggers until it finishes. */
export default function RollText({
  children,
  autoPlay = false,
  playOnHover = true,
}: {
  children: string;
  autoPlay?: boolean;
  playOnHover?: boolean;
}) {
  const root = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const trigger = root.current?.closest("a, button, summary");
    if (!trigger) return;
    let animations: Animation[] = [];
    const roll = () => {
      const song = root.current?.closest(".spotify-song-text");
      if (song && Number(getComputedStyle(song).opacity) < 0.999) return;
      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        animations.some((a) => a.playState === "running")
      )
        return;
      animations.forEach((a) => a.cancel());
      animations = Array.from(root.current?.querySelectorAll<HTMLElement>(".roll-track") ?? []).map(
        (el, i) =>
          el.animate([{ transform: "translateY(0)" }, { transform: "translateY(-50%)" }], {
            duration: 560,
            delay: Math.min(i, 22) * 12,
            easing: "cubic-bezier(.22,.75,.18,1)",
            fill: "backwards",
          }),
      );
    };
    if (autoPlay) roll();
    if (playOnHover) trigger.addEventListener("pointerenter", roll);
    if (playOnHover) trigger.addEventListener("focus", roll);
    return () => {
      trigger.removeEventListener("pointerenter", roll);
      trigger.removeEventListener("focus", roll);
      animations.forEach((a) => a.cancel());
    };
  }, [children, autoPlay, playOnHover]);
  return (
    <span ref={root} className="roll-text">
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className="roll-visual">
        {Array.from(children).map((letter, index) => (
          <span
            key={index}
            className="roll-letter"
            style={{ "--letter-delay": Math.min(index, 22) * 12 + "ms" } as CSSProperties}
          >
            <span className="roll-track">
              <span>{letter === " " ? "\u00a0" : letter}</span>
              <span>{letter === " " ? "\u00a0" : letter}</span>
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
