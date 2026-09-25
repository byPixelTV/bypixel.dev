"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/** A reversible scroll passage, measured on a stationary wrapper. */
export default function ScrollPassage({
  children,
  className = "",
  zoom = 0.94,
  travel = 42,
}: {
  children: ReactNode;
  className?: string;
  zoom?: number;
  travel?: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: root, offset: ["start 95%", "end 5%"] });
  const scale = useTransform(scrollYProgress, [0, 0.24, 0.82, 1], [zoom, 1, 1, 0.985]);
  const y = useTransform(scrollYProgress, [0, 0.24, 0.82, 1], [travel, 0, 0, -18]);
  const opacity = useTransform(scrollYProgress, [0, 0.24, 0.82, 1], [0.2, 1, 1, 0.4]);
  return (
    <div ref={root} className={`scroll-passage ${className}`}>
      <motion.div
        className="scroll-passage-content"
        style={{ scale: reduce ? 1 : scale, y: reduce ? 0 : y, opacity: reduce ? 1 : opacity }}
      >
        {children}
      </motion.div>
    </div>
  );
}
