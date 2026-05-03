"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    const thumb = document.getElementById("custom-scrollbar-thumb");
    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    const updateCustomScrollbar = () => {
      if (!thumb) return;
      const doc = document.documentElement;
      const viewportHeight = window.innerHeight;
      const scrollHeight = doc.scrollHeight;
      const maxScroll = Math.max(scrollHeight - viewportHeight, 1);
      const minThumb = 56;
      const thumbHeight = Math.max((viewportHeight / scrollHeight) * viewportHeight, minThumb);
      const maxThumbTop = viewportHeight - thumbHeight - 2;
      const top = (window.scrollY / maxScroll) * maxThumbTop;

      thumb.style.height = `${thumbHeight}px`;
      thumb.style.transform = `translateY(${Math.max(0, top)}px)`;
    };

    const showScrollbarWhileScrolling = () => {
      root.classList.add("is-scrolling");
      updateCustomScrollbar();
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        root.classList.remove("is-scrolling");
      }, 700);
    };

    const onWheel = () => showScrollbarWhileScrolling();
    const onTouchMove = () => showScrollbarWhileScrolling();
    const onKeyScroll = (event: KeyboardEvent) => {
      const keys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "];
      if (keys.includes(event.key)) showScrollbarWhileScrolling();
    };
    const onNativeScroll = () => {
      updateCustomScrollbar();
      showScrollbarWhileScrolling();
    };

    const lenis = new Lenis({
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1,
      wheelMultiplier: 0.95,
      autoRaf: false,
    });
    let rafId = 0;
    lenis.on("scroll", showScrollbarWhileScrolling);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKeyScroll);
    window.addEventListener("resize", updateCustomScrollbar);
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    updateCustomScrollbar();

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      root.classList.remove("is-scrolling");
      if (hideTimer) clearTimeout(hideTimer);
      lenis.off("scroll", showScrollbarWhileScrolling);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyScroll);
      window.removeEventListener("resize", updateCustomScrollbar);
      window.removeEventListener("scroll", onNativeScroll);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {children}
      <div id="custom-scrollbar-thumb" className="custom-scrollbar-thumb" aria-hidden="true" />
    </>
  );
}
