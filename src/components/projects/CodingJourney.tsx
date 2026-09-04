"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";
import { Icon } from "@iconify/react";
const milestones = [
  {
    year: "2022",
    title: "The Spark",
    description:
      "Started my journey with Python and HTML/CSS. Built my first scripts and websites, discovering the magic of making ideas come to life through code.",
    tags: ["Python", "HTML", "CSS"],
    icon: "logos:python",
    color: "from-blue-500/20 to-yellow-500/20",
  },
  {
    year: "2023",
    title: "Logic & Systems",
    description:
      "Dived into Minecraft Skripting which taught me event-driven logic. Simultaneously started my journey into Linux Server Administration, learning the foundations of hosting and system management.",
    tags: ["Skript", "Linux", "JavaScript"],
    icon: "logos:linux-tux",
    color: "from-orange-500/20 to-red-500/20",
  },
  {
    year: "2024",
    title: "JVM & Infrastructure",
    description:
      "Shifted focus to Kotlin and Java for high-performance backend development. Mastered Docker and explored Proxmox to build a more robust and scalable project infrastructure.",
    tags: ["Kotlin", "Java", "Docker", "Proxmox"],
    icon: "vscode-icons:file-type-kotlin",
    color: "from-purple-500/20 to-blue-500/20",
  },
  {
    year: "2025",
    title: "Founding EraMC",
    description:
      "Founded the EraMC Network. A year of massive growth: deep-diving into Async programming, MongoDB, and TypeScript/Next.js to build a seamless player experience from web to game.",
    tags: ["Next.js", "TypeScript", "MongoDB", "Async", "EraMC"],
    icon: "ph:rocket-duotone",
    color: "from-emerald-500/20 to-cyan-500/20",
  },
  {
    year: "2026",
    title: "Next-Level Performance",
    description:
      "Pushing EraMC to unprecedented levels. Exploring Go for high-performance tooling and continuing to refine the Kotlin ecosystem for maximum efficiency and scale. Helping other servers and communities with my knowledge and experience to bring the best possible experience to their players.",
    tags: ["Go", "Next.js", "Advanced Kotlin", "Scale"],
    icon: "logos:go",
    color: "from-cyan-400/20 to-blue-600/20",
    isCurrent: true,
  },
];

export default function CodingJourney() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: root, offset: ["start center", "end center"] });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length)
          setActive(Number((visible[visible.length - 1].target as HTMLElement).dataset.index));
      },
      { rootMargin: "-25% 0px -45% 0px", threshold: 0 },
    );
    root.current?.querySelectorAll("[data-index]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return (
    <section ref={root} className="journey-editorial" aria-labelledby="journey-heading">
      <div className="journey-overview">
        <p className="eyebrow">03 / The story so far</p>
        <h2 id="journey-heading">
          ONE SPARK.
          <br />
          <em>STILL BUILDING.</em>
        </h2>
        <p>
          From the first script to the systems behind it. Five chapters of learning by making
          things.
        </p>
        <div className="journey-current" aria-hidden="true">
          <span className="eyebrow">
            Chapter 0{active + 1} / 0{milestones.length}
          </span>
          <span key={active} className="journey-year">
            {milestones[active].year}
          </span>
          <span>{milestones[active].title}</span>
        </div>
        <nav className="journey-chapters" aria-label="Coding journey years">
          {milestones.map((m, i) => (
            <a
              href={"#year-" + m.year}
              key={m.year}
              aria-current={active === i ? "step" : undefined}
            >
              {m.year}
            </a>
          ))}
        </nav>
        <div className="journey-progress" aria-hidden="true">
          <motion.div style={{ scaleX: reduce ? scrollYProgress : progress }} />
        </div>
      </div>
      <ol className="journey-chapter-list">
        {milestones.map((m, i) => (
          <motion.li
            key={m.year}
            id={"year-" + m.year}
            data-index={i}
            data-current={active === i}
            initial={false}
            whileInView={{ opacity: 1 }}
            className="journey-chapter"
          >
            <div className="journey-chapter-top">
              <span className="eyebrow">
                0{i + 1} / {m.year}
              </span>
              <Icon icon={m.icon} width={42} height={42} aria-hidden="true" />
            </div>
            <h3>{m.title}</h3>
            <p>{m.description}</p>
            <ul className="journey-tags" aria-label="Technologies">
              {m.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            <span className="journey-chapter-number" aria-hidden="true">
              0{i + 1}
            </span>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
