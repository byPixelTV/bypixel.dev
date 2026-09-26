"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

export default function FooterFinale({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: root, offset: ["start end", "start 20%"] });
  const y = useTransform(scrollYProgress, [0, 1], [90, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  return (
    <div ref={root} className="footer-finale relative">
      <motion.div
        className="footer-stage isolate"
        style={{ y: reduce ? 0 : y, scale: reduce ? 1 : scale }}
      >
        {children}
      </motion.div>
    </div>
  );
}
