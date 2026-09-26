"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const DURATION = 500;
const FORWARD_STAGGER = 14;
const REVERSE_STAGGER = 9;
const MAX_STAGGER_INDEX = 22;

export default function RollText({
  children,
  autoPlay = false,
  playOnHover = true,
}: {
  children: string;
  autoPlay?: boolean;
  playOnHover?: boolean;
}) {
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = root.current;
    const trigger = element?.closest("a, button, summary") ?? element;

    if (!element || !trigger) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animations: Animation[] = [];
    let timers: number[] = [];
    let hovered = false;
    let focused = false;

    const clearTimers = () => {
      timers.forEach(window.clearTimeout);
      timers = [];
    };

    const ensureAnimations = () => {
      if (animations.length) return;

      animations = Array.from(element.querySelectorAll<HTMLElement>(".roll-track")).map((track) => {
        const animation = track.animate(
          [{ transform: "translate3d(0, 0, 0)" }, { transform: "translate3d(0, -50%, 0)" }],
          {
            duration: DURATION,
            easing: "cubic-bezier(.2,.82,.2,1)",
            fill: "both",
          },
        );

        animation.pause();
        animation.currentTime = 0;
        return animation;
      });
    };

    const forward = () => {
      if (preference.matches) return;

      const song = element.closest(".spotify-song-text");
      if (song && Number(getComputedStyle(song).opacity) < 0.999) return;

      ensureAnimations();
      clearTimers();

      animations.forEach((animation, index) => {
        const currentTime = Number(animation.currentTime ?? 0);
        const isAlreadyMoving = currentTime > 0;
        const delay = isAlreadyMoving ? 0 : Math.min(index, MAX_STAGGER_INDEX) * FORWARD_STAGGER;

        const play = () => {
          animation.updatePlaybackRate(1);
          animation.play();
        };

        if (delay === 0) {
          play();
        } else {
          timers.push(window.setTimeout(play, delay));
        }
      });
    };

    const backward = () => {
      if (hovered || focused) return;

      clearTimers();

      const active = animations.filter((animation) => Number(animation.currentTime ?? 0) > 0);

      active
        .slice()
        .reverse()
        .forEach((animation, index) => {
          const delay = index * REVERSE_STAGGER;

          const play = () => {
            if (Number(animation.currentTime ?? 0) <= 0) return;
            animation.updatePlaybackRate(-1);
            animation.play();
          };

          if (delay === 0) {
            play();
          } else {
            timers.push(window.setTimeout(play, delay));
          }
        });
    };

    const enter = () => {
      hovered = true;
      forward();
    };

    const leave = () => {
      hovered = false;
      backward();
    };

    const focus = () => {
      focused = true;
      forward();
    };

    const blur = () => {
      focused = false;
      backward();
    };

    const onPreferenceChange = () => {
      clearTimers();

      if (!preference.matches) return;

      animations.forEach((animation) => animation.cancel());
      animations = [];
    };

    if (autoPlay && !preference.matches) {
      ensureAnimations();
      forward();

      const last = animations.at(-1);
      if (last) {
        last.onfinish = () => {
          if (last.playbackRate > 0) backward();
        };
      }
    }

    if (playOnHover) {
      trigger.addEventListener("pointerenter", enter);
      trigger.addEventListener("pointerleave", leave);
      trigger.addEventListener("focusin", focus);
      trigger.addEventListener("focusout", blur);
    }

    preference.addEventListener("change", onPreferenceChange);

    return () => {
      clearTimers();
      trigger.removeEventListener("pointerenter", enter);
      trigger.removeEventListener("pointerleave", leave);
      trigger.removeEventListener("focusin", focus);
      trigger.removeEventListener("focusout", blur);
      preference.removeEventListener("change", onPreferenceChange);
      animations.forEach((animation) => animation.cancel());
    };
  }, [children, autoPlay, playOnHover]);

  return (
    <span ref={root} className="roll-text inline-block">
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className="roll-visual inline-flex whitespace-nowrap">
        {Array.from(children).map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            className="roll-letter inline-block h-[1.2em] overflow-hidden"
            style={
              {
                "--letter-delay": Math.min(index, MAX_STAGGER_INDEX) * FORWARD_STAGGER + "ms",
              } as CSSProperties
            }
          >
            <span className="roll-track">
              <span>{letter === " " ? "\u00a0" : letter}</span>
              <span>{letter === " " ? "\u00a0" : letter}</span>
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
