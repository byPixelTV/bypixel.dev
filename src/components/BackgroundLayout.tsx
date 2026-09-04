"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Fade only new content; never snapshot or transform the fixed navigation. */
export default function BackgroundLayout({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const content = root.current?.querySelector("main, .article-page");
    const animation = content?.animate([{ opacity: 0.6 }, { opacity: 1 }], {
      duration: 220,
      easing: "ease-out",
    });
    return () => animation?.cancel();
  }, [pathname]);
  return (
    <div ref={root} className="relative z-10 min-h-screen flow-root">
      {children}
    </div>
  );
}
