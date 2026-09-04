"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** One observer for the whole page; all animation frames run in the compositor. */
export default function MotionStage({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const animations = new Set<Animation>();
    const visible = new Set<Element>();
    const updateVisibility = () => {
      element.dataset.pageVisible = String(!document.hidden);
      for (const animation of animations) {
        if (document.hidden) animation.pause();
        else animation.play();
      }
    };
    const setup = () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      visible.clear();
      element.dataset.reducedMotion = String(preference.matches);
      if (preference.matches || paused) return;
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const target = entry.target as HTMLElement;
            target.dataset.inView = String(entry.isIntersecting);
            if (
              entry.isIntersecting &&
              target.hasAttribute("data-reveal") &&
              !visible.has(target)
            ) {
              visible.add(target);
              const animation = target.animate(
                [
                  { opacity: 0, transform: "translate3d(0, 55px, 0)" },
                  { opacity: 1, transform: "translate3d(0, 0, 0)" },
                ],
                { duration: 850, easing: "cubic-bezier(.2,.75,.2,1)" },
              );
              animations.add(animation);
              animation.onfinish = () => animations.delete(animation);
            }
          }
        },
        { threshold: 0.08 },
      );
      element
        .querySelectorAll("[data-reveal], [data-animate]")
        .forEach((target) => observer?.observe(target));
    };
    setup();
    updateVisibility();
    preference.addEventListener("change", setup);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", setup);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, [paused]);

  return (
    <div ref={root} className={`portfolio-experience ${className}`} data-motion-paused={paused}>
      {children}
      <button
        className="motion-toggle"
        type="button"
        aria-pressed={paused}
        aria-label={paused ? "Resume animations" : "Pause animations"}
        onClick={() => setPaused((value) => !value)}
      >
        <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
        <span>{paused ? "Motion off" : "Motion on"}</span>
      </button>
    </div>
  );
}
