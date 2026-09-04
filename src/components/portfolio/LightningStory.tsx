"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import RollText from "./RollText";

export default function LightningStory() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const id = useId();
  return (
    <div className="footer-story" data-open={open}>
      <button
        type="button"
        className="footer-emblem"
        aria-expanded={open}
        aria-controls={id}
        aria-label="Discover the story behind the lightning bolt"
        onClick={() => setOpen(!open)}
      >
        <Image src="/assets/logo/eramc_base.svg" width={180} height={260} alt="" />
        <span>
          <RollText>A FAMILIAR SPARK ↗</RollText>
        </span>
      </button>
      <motion.div
        id={id}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.55, ease: [0.22, 0.8, 0.2, 1] }}
        onUpdate={() => {
          if (!open) return;
          const bottom = document.documentElement.scrollHeight - window.innerHeight;
          if (window.portfolioScroll) {
            window.portfolioScroll.resize();
            window.portfolioScroll.scrollTo(bottom, { immediate: true });
          } else window.scrollTo({ top: bottom, behavior: "instant" });
        }}
        className="footer-story-reveal"
        aria-hidden={!open}
        inert={!open}
      >
        <div className="footer-story-copy">
          <p className="eyebrow">An EraMC easter egg</p>
          <h3>It started with a server.</h3>
          <p>
            This lightning bolt was the icon of EraMC, a Minecraft server I owned and poured a huge
            amount of time into.
          </p>
          <p>
            It stayed with me. A reminder of that chapter, and of what keeps me building: speed,
            innovation and the spark of a new idea.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
