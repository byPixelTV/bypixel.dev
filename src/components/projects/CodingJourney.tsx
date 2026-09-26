"use client";
import { Icon } from "@iconify/react";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import ChapterTitle from "@/components/portfolio/ChapterTitle";
const milestones = [
  {
    year: "2022",
    title: "The Spark",
    shortTitle: "The Spark",
    description:
      "Started my journey with Python and HTML/CSS. Built my first scripts and websites, discovering the fundamentals of turning ideas into working software.",
    tags: ["Python", "HTML", "CSS"],
    icon: "logos:python",
  },
  {
    year: "2023",
    title: "Logic & Systems",
    shortTitle: "Logic & Systems",
    description:
      "Dived into Minecraft Skripting and event-driven logic while getting deeper into Linux server administration, hosting and system management.",
    tags: ["Skript", "Linux", "JavaScript"],
    icon: "logos:linux-tux",
  },
  {
    year: "2024",
    title: "JVM & Infrastructure",
    shortTitle: "JVM & Infra",
    description:
      "Moved into Kotlin and Java for larger backend projects while using Docker, Linux and Proxmox to build and operate more capable infrastructure.",
    tags: ["Kotlin", "Java", "Docker", "Proxmox"],
    icon: "vscode-icons:file-type-kotlin",
  },
  {
    year: "2025",
    title: "Founding EraMC",
    shortTitle: "EraMC",
    description:
      "Founded the EraMC Network and connected game servers, backend systems and web applications using Kotlin, MongoDB, TypeScript and Next.js.",
    tags: ["Next.js", "TypeScript", "MongoDB", "Async", "EraMC"],
    icon: "ph:rocket-duotone",
  },
  {
    year: "2026",
    title: "Scale & Performance",
    shortTitle: "Scale & Performance",
    description:
      "Focused on architecture, performance and reusable infrastructure. Expanded into Go for backend services and tooling while continuing to build scalable Kotlin systems and production infrastructure.",
    tags: ["Go", "Kotlin", "Backend", "Infrastructure", "Scale"],
    icon: "logos:go",
    isCurrent: true,
  },
];

export default function CodingJourney() {
  return (
    <section className="story-editorial" aria-labelledby="story-heading">
      <header className="story-editorial-intro grid items-end mb-10">
        <p className="eyebrow font-medium tracking-[0.13em] uppercase">02 / A work in progress</p>
        <ChapterTitle id="story-heading" lines={["FOLLOWING", "THE CURIOSITY."]} />
        <p>
          From the first script to the systems I build today.
          <br />
          One idea leading to the next.
        </p>
      </header>
      <ol>
        {milestones.map((milestone, index) => (
          <StoryMoment key={milestone.year} milestone={milestone} index={index} />
        ))}
      </ol>
    </section>
  );
}
function StoryMoment({
  milestone,
  index,
}: {
  milestone: (typeof milestones)[number];
  index: number;
}) {
  const root = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: root, offset: ["start end", "end start"] });
  const yearX = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    [index % 2 ? 75 : -75, 0, index % 2 ? -35 : 35],
  );
  const yearScale = useTransform(scrollYProgress, [0, 0.4, 1], [0.82, 1, 1.08]);
  const yearOpacity = useTransform(scrollYProgress, [0, 0.28, 0.72, 1], [0.7, 1, 1, 0.7]);
  const copyY = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [55, 0, 0, -25]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.25, 0.85, 1], [0.2, 1, 1, 0.5]);
  const trace = useTransform(scrollYProgress, [0, 0.45, 1], [0, 1, 1]);
  return (
    <li ref={root} id={`year-${milestone.year}`} className="story-moment grid items-center">
      <motion.div
        className="story-moment-year font-[850] leading-none select-none"
        aria-hidden="true"
        style={{
          x: reduce ? 0 : yearX,
          scale: reduce ? 1 : yearScale,
          opacity: reduce ? 1 : yearOpacity,
        }}
      >
        {milestone.year}
      </motion.div>
      <motion.div
        className="story-moment-copy"
        style={{ y: reduce ? 0 : copyY, opacity: reduce ? 1 : copyOpacity }}
      >
        <p className="eyebrow font-medium tracking-[0.13em] uppercase">
          {milestone.year} / {milestone.isCurrent ? "Still unfolding" : `Chapter 0${index + 1}`}
        </p>
        <div className="story-detail flex items-center gap-[18px]" aria-hidden="true">
          <Icon icon={milestone.icon} width={28} height={28} />
          <svg viewBox="0 0 160 42">
            <motion.path
              d={
                [
                  "M2 21h28l12-14 20 28 12-14h84",
                  "M2 21h40V7h45v28h35V21h36",
                  "M2 30h35V12h35v18h35V12h51",
                  "M2 21h38l20-14 20 14-20 14-20-14m40 0h78",
                  "M2 30h25l24-18h22l22 18h20l25-18h18",
                ][index]
              }
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              style={{ pathLength: reduce ? 1 : trace }}
            />
          </svg>
        </div>
        <h3>{milestone.title}</h3>
        <p>{milestone.description}</p>
        <ul aria-label="Technologies">
          {milestone.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </motion.div>
      <span className="story-moment-index absolute bottom-[18px] left-[18px]" aria-hidden="true">
        0{index + 1}
      </span>
    </li>
  );
}
