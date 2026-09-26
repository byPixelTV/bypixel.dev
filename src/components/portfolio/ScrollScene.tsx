"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/** Measure the stationary wrapper; animate only its contents to avoid scroll feedback. */
export function ScrollScene({
  children,
  className = "",
  travel = 45,
  turn = 0,
  zoom = 1,
}: {
  children: ReactNode;
  className?: string;
  travel?: number;
  turn?: number;
  zoom?: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: root, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [travel, -travel]);
  const scale = useTransform(scrollYProgress, [0, 0.4, 1], [zoom, 1, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-turn, turn]);
  return (
    <div ref={root} className={`scroll-scene ${className}`}>
      <motion.div
        style={{ y: reduce ? 0 : y, rotate: reduce ? 0 : rotate, scale: reduce ? 1 : scale }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function SceneRibbon({ words }: { words: string }) {
  const root = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: root, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["3%", "-24%"]);
  return (
    <div ref={root} className="scene-ribbon overflow-hidden pointer-events-none" aria-hidden="true">
      <motion.div style={{ x: reduce ? 0 : x }}>
        {words}
        <span> ✳ </span>
        {words}
        <span> ✳ </span>
      </motion.div>
    </div>
  );
}
