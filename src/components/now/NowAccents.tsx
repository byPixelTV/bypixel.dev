"use client";
import { useEffect, useRef, type ReactNode } from "react";

export function NowStar() {
  const root = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animation: Animation | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (!preference.matches)
          animation = el.animate(
            [{ transform: "rotate(-100deg) scale(.8)" }, { transform: "rotate(0) scale(1)" }],
            { duration: 1400, delay: 250, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" },
          );
      },
      { threshold: 0.8 },
    );
    const stop = () => {
      if (preference.matches) animation?.cancel();
    };
    observer.observe(el);
    preference.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      animation?.cancel();
      preference.removeEventListener("change", stop);
    };
  }, []);
  return (
    <span ref={root} className="now-asterisk" aria-hidden="true">
      ✳
    </span>
  );
}

export function NowCardDetail({
  kind,
  children,
}: {
  kind: "race" | "minecraft";
  children?: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    const card = el?.closest("article");
    if (!el || !card) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animations: Animation[] = [];
    const play = () => {
      if (
        preference.matches ||
        document.hidden ||
        animations.some((a) => a.playState === "running")
      )
        return;
      animations.forEach((a) => a.cancel());
      animations = Array.from(el.querySelectorAll("i")).map((pixel, index) =>
        pixel.animate(
          kind === "race"
            ? [
                { opacity: 0.18, offset: 0 },
                { opacity: 0.18, offset: 0.08 + index * 0.1 },
                { opacity: 1, offset: 0.12 + index * 0.1 },
                { opacity: 1, offset: 0.8 },
                { opacity: 0.18, offset: 0.81 },
                { opacity: 0.18, offset: 1 },
              ]
            : [
                { opacity: 0, transform: "scale(.4)" },
                { opacity: 1, transform: "scale(1)", offset: 0.4 },
                { opacity: 0, transform: "scale(.7)" },
              ],
          {
            duration: kind === "race" ? 2200 : 1000,
            delay: kind === "race" ? 0 : index * 150,
            easing: "ease-out",
          },
        ),
      );
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          play();
          observer.disconnect();
        }
      },
      { threshold: 0.7 },
    );
    const stop = () => {
      if (preference.matches || document.hidden) animations.forEach((a) => a.cancel());
    };
    observer.observe(el);
    card.addEventListener("pointerenter", play);
    card.addEventListener("focusin", play);
    preference.addEventListener("change", stop);
    document.addEventListener("visibilitychange", stop);
    return () => {
      observer.disconnect();
      animations.forEach((a) => a.cancel());
      card.removeEventListener("pointerenter", play);
      card.removeEventListener("focusin", play);
      preference.removeEventListener("change", stop);
      document.removeEventListener("visibilitychange", stop);
    };
  }, [kind]);
  return (
    <div ref={root} className={"now-detail now-detail-" + kind}>
      {children}
      <span aria-hidden="true">
        {Array.from({ length: kind === "race" ? 5 : 3 }, (_, i) => (
          <i key={i} />
        ))}
      </span>
    </div>
  );
}
