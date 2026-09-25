"use client";

import { motion, useReducedMotion } from "motion/react";

/** Shared timing makes titles feel like chapters of the same composition. */
export default function ChapterTitle({
  lines,
  id,
  className = "",
}: {
  lines: string[];
  id?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <h2 id={id} className={`chapter-title ${className}`} aria-label={lines.join(" ")}>
      {lines.map((line, index) => (
        <span className="chapter-title-mask" key={line} aria-hidden="true">
          <motion.span
            className={index > 0 ? "chapter-title-accent" : undefined}
            initial={reduce ? false : { y: "110%", rotate: 3 }}
            whileInView={{ y: "0%", rotate: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: reduce ? 0 : 0.95,
              delay: reduce ? 0 : index * 0.12,
              ease: [0.22, 0.75, 0.18, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}
