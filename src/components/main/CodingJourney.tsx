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
      "Dove into Kotlin and the JVM ecosystem, building more complex projects and learning about backend development, databases, and server management.",
    tags: ["Kotlin", "Java", "JVM", "Dev Ops"],
    link: null,
  },
  {
    year: "2025",
    title: "Massive Growth",
    description:
      "My most intense learning year yet. Picked up TypeScript, React, Next.js, databases, Docker, Linux systems and much more — shipping real projects along the way. A year of leveling up in every way. The biggest project in 2025 was EraMC, a Minecraft server network I founded and built from the ground up, which has been an incredible learning experience in software development, systems administration, and community building. There was also DaniSMP, one of the biggest sword smp servers in Germany at the time, where I learned to fix issues under pressure and manage a large player base. Each project pushed me to learn new technologies and solve complex problems, making 2025 a year of massive growth and achievement.",
    tags: ["TypeScript", "Next.js", "Docker", "Linux", "Databases", "Dev Ops", "Kotlin", "Minecraft", "Community Building"],
    link: {
        label: "EraMC Network",
        url: "https://dc.eramc.net",
      },
    },
  {
    year: "2026",
    title: "What's Next",
    description:
      "The journey continues — exploring exciting new technologies and taking on bigger, more ambitious projects. The best is yet to come. I'm currently focused on expanding EraMC, diving deeper into infrastructure and exploring AI and machine learning. The goal is to keep pushing the boundaries of what I can build and learn.",
    tags: ["Infrastructure", "AI", "Machine Learning", "Kotlin", "???"],
    link: null,
    isCurrent: true,
  },
];

const CodingJourney = () => {
  return (
    <motion.div
      id="coding-journey"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <div className="rounded-2xl border border-white/12 bg-[#0b0c14]/80 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-white uppercase tracking-wider flex gap-3 items-center">
              <span className="p-1.5 rounded-md">
                <LuCode size={20} color="#FFFFFF" />
              </span>
              Coding Journey
            </div>
            <p className="sm:text-lg mt-3 text-white/90">
              How I went from zero to where I am today.
            </p>
          </div>
          <div className="rounded-full border border-white/12 px-3 py-1 text-[11px] text-white/60">
            {milestones.length} milestones
          </div>
        </div>

        <div className="relative mt-8 pl-1">
          <div className="absolute left-[12px] top-2.5 bottom-2.5 w-px bg-linear-to-b from-white/35 via-white/15 to-transparent" />

          <div className="flex flex-col gap-4 sm:gap-5">
            {milestones.map((milestone, i) => (
              <motion.div
                key={i}
                className="flex gap-4"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + i * 0.08, duration: 0.35 }}
              >
                <div className="relative shrink-0 flex items-start pt-1">
                  <div
                    className={`h-6 w-6 rounded-full border-2 flex items-center justify-center z-10 ${
                      milestone.isCurrent
                        ? "border-purple-200 bg-purple-200"
                        : "border-white/35 bg-[#0f1018]"
                    }`}
                  >
                    {milestone.isCurrent && (
                      <div className="h-2 w-2 rounded-full bg-[#0f1018]" />
                    )}
                  </div>
                </div>

                <article
                  className={`flex-1 rounded-xl border p-4 sm:p-4.5 ${
                    milestone.isCurrent
                      ? "border-purple-300/35 bg-[#131524]"
                      : "border-white/10 bg-[#0d0f18]/90"
                  }`}
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2.5">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                        milestone.isCurrent
                          ? "border-purple-300/60 text-purple-100"
                          : "border-white/25 text-white/75"
                      }`}
                    >
                      {milestone.year}
                    </span>
                    <span className="font-semibold text-white">{milestone.title}</span>
                  </div>

                  <p className="max-w-3xl text-sm leading-relaxed text-white/70">
                    {milestone.description}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {milestone.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/12 px-2 py-0.5 text-[10px] font-medium text-white/75"
                      >
                        {tag}
                      </span>
                    ))}
                    {milestone.link && (
                      <a
                        href={milestone.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-white/90 underline decoration-white/35 underline-offset-4 transition-colors hover:text-white"
                      >
                        ↗ {milestone.link.label}
                      </a>
                    )}
                  </div>
                </article>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CodingJourney;
