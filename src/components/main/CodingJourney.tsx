"use client";

import React from "react";
import { motion } from "framer-motion";
import { LuCode } from "react-icons/lu";

const milestones = [
  {
    year: "2022",
    title: "The Beginning",
    description:
      "Started my coding journey with HTML & basic JavaScript — building my first static pages and getting hooked on seeing things come alive in the browser.",
    tags: ["HTML", "JavaScript"],
    link: null,
  },
  {
    year: "2023",
    title: "Scripting with Skript",
    description:
      "Explored Skript, a Minecraft scripting language, which taught me logic, event-driven programming, and how to build real features for a community.",
    tags: ["Skript", "Minecraft"],
    link: {
      label: "SkriptLang on GitHub",
      url: "https://github.com/skriptlang/skript",
    },
  },
  {
    year: "2024",
    title: "Kotlin & the JVM",
    description:
      "Jumped into Kotlin and JVM-based development — writing plugins, learning OOP deeply, and building more complex backend systems.",
    tags: ["Kotlin", "Java", "JVM"],
    link: null,
  },
  {
    year: "2025",
    title: "Massive Growth",
    description:
      "My most intense learning year yet. Picked up TypeScript, React, Next.js, databases, Docker, Linux systems and much more — shipping real projects along the way.",
    tags: ["TypeScript", "Next.js", "Docker", "Linux", "Databases"],
    link: null,
  },
  {
    year: "2026",
    title: "What's Next",
    description:
      "The journey continues — exploring exciting new technologies and taking on bigger, more ambitious projects. The best is yet to come.",
    tags: ["???"],
    link: null,
    isCurrent: true,
  },
];

const CodingJourney = () => {
  return (
    <motion.div
      className="p-4 md:p-6 rounded-3xl border border-[#333] bg-[#111111]"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <div className="text-white uppercase tracking-wider flex gap-3 items-center">
        <span className="p-1.5 rounded-md">
          <LuCode size={20} color="#FFFFFF" />
        </span>
        Coding Journey
      </div>
      <p className="sm:text-lg mt-4 text-white">
        How I went from zero to where I am today.
      </p>

      <div className="relative mt-8 ml-2">
        {/* Vertical connector line */}
        <div className="absolute left-[11px] top-3 bottom-3 w-px bg-[#333]" />

        <div className="flex flex-col gap-8">
          {milestones.map((milestone, i) => (
            <motion.div
              key={i}
              className="flex gap-5"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
            >
              {/* Dot */}
              <div className="relative shrink-0 flex items-start pt-0.5">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 ${
                    milestone.isCurrent
                      ? "border-white bg-white"
                      : "border-[#555] bg-[#111111]"
                  }`}
                >
                  {milestone.isCurrent && (
                    <div className="w-2 h-2 rounded-full bg-[#111111]" />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                      milestone.isCurrent
                        ? "border-white text-white"
                        : "border-[#444] text-[#aaa]"
                    }`}
                  >
                    {milestone.year}
                  </span>
                  <span className="font-semibold text-white">
                    {milestone.title}
                  </span>
                </div>
                <p className="text-sm text-[#aaa] leading-relaxed">
                  {milestone.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {milestone.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-md bg-[#1a1a1a] border border-[#333] text-[#ccc]"
                    >
                      {tag}
                    </span>
                  ))}
                  {milestone.link && (
                    <a
                      href={milestone.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2 py-0.5 rounded-md bg-[#1a1a1a] border border-[#444] text-white hover:border-white transition-colors"
                    >
                      ↗ {milestone.link.label}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CodingJourney;
