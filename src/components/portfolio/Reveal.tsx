"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

/** One observer, finite compositor animations, and readable HTML before hydration. */
export default function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;
    const animations = Array.from(
      root.current?.querySelectorAll<HTMLElement>("[data-intro]") ?? [],
    ).map((target) =>
      target.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 500,
        delay: Number(target.dataset.intro) * 100,
        easing: "ease-out",
        fill: "backwards",
      }),
    );
    const stop = () => {
      if (preference.matches) animations.forEach((animation) => animation.finish());
    };
    preference.addEventListener("change", stop);
    return () => {
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", stop);
    };
  }, []);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          if (preference.matches) continue;
          const animation = entry.target.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 650,
            delay: Number((entry.target as HTMLElement).dataset.enterDelay ?? 0),
            fill: "backwards",
            easing: "cubic-bezier(.2,.7,.2,1)",
          });
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        }
      },
      { threshold: 0.08 },
    );
    element.querySelectorAll("[data-enter]").forEach((target) => observer.observe(target));
    const stop = () => animations.forEach((animation) => animation.finish());
    preference.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", stop);
    };
  }, []);
  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
