"use client";

import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import Lenis from "lenis";

declare global {
  interface Window {
    portfolioScroll?: Lenis;
  }
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px), (hover: none) and (pointer: coarse)");
    let lenis: Lenis | undefined;
    let frame = 0;
    const animate = (time: number) => {
      lenis?.raf(time);
      frame = requestAnimationFrame(animate);
    };
    const visibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden && lenis) frame = requestAnimationFrame(animate);
    };
    const setup = () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
      lenis = undefined;
      delete window.portfolioScroll;
      if (preference.matches || mobile.matches) return;
      lenis = new Lenis({
        smoothWheel: true,
        syncTouch: true,
        touchMultiplier: 1,
        wheelMultiplier: 0.95,
        anchors: true,
        stopInertiaOnNavigate: true,
        autoRaf: false,
        prevent: (node) =>
          Boolean(node.closest("[data-lenis-prevent], [data-slot='dialog-content']")),
      });
      window.portfolioScroll = lenis;
      visibility();
    };
    setup();
    preference.addEventListener("change", setup);
    mobile.addEventListener("change", setup);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
      delete window.portfolioScroll;
      preference.removeEventListener("change", setup);
      mobile.removeEventListener("change", setup);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    const thumb = document.getElementById("custom-scrollbar-thumb");
    let frame = 0;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    const update = () => {
      frame = 0;
      if (!thumb) return;
      const height = window.innerHeight;
      const maxScroll = root.scrollHeight - height;
      const thumbHeight = Math.min(height, Math.max(56, (height * height) / root.scrollHeight));
      thumb.style.height = `${thumbHeight}px`;
      thumb.style.transform = `translateY(${maxScroll > 0 ? (window.scrollY / maxScroll) * (height - thumbHeight) : 0}px)`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onScroll = () => {
      schedule();
      root.classList.add("is-scrolling");
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => root.classList.remove("is-scrolling"), 700);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(hideTimer);
      observer.disconnect();
      root.classList.remove("is-scrolling");
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return (
    <MotionConfig reducedMotion="user">
      {children}
      <div id="custom-scrollbar-thumb" className="custom-scrollbar-thumb" aria-hidden="true" />
    </MotionConfig>
  );
}
