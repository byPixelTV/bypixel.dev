"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { Icon } from "@iconify/react";

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
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: root,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const slots = Array.from(element.querySelectorAll<HTMLElement>(".journey-chapter-slot"));

    let frame = 0;

    const update = () => {
      frame = 0;

      // Switch chapter when its actual scroll slot crosses
      // the reading line. Do NOT measure the card itself.
      const readingLine = window.innerHeight * 0.42;

      let next = 0;

      for (let index = 0; index < slots.length; index++) {
        const rect = slots[index].getBoundingClientRect();

        if (rect.top <= readingLine) {
          next = index;
        } else {
          break;
        }
      }

      setActive((current) => (current === next ? current : next));
    };

    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(element);

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    update();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();

      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const current = milestones[active];

  return (
    <section ref={root} className="journey-editorial" aria-labelledby="journey-heading">
      <div className="journey-overview">
        <p className="eyebrow">03 / Development timeline</p>

        <h2 id="journey-heading">
          FROM SCRIPTS
          <br />
          <em>TO SYSTEMS.</em>
        </h2>

        <p className="journey-intro">
          How my development stack evolved from simple scripts and websites into backend systems,
          infrastructure and scalable services.
        </p>

        <div className="journey-current" aria-live="polite">
          <span className="eyebrow">{current.year}</span>

          <motion.div
            key={current.year}
            className="journey-current-content"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduce ? 0 : 0.35,
              ease: [0.22, 0.75, 0.18, 1],
            }}
          >
            <span className="journey-year">{current.shortTitle}</span>

            <span className="journey-current-tech">{current.tags.slice(0, 3).join(" · ")}</span>
          </motion.div>
        </div>

        <nav className="journey-chapters" aria-label="Development timeline">
          {milestones.map((milestone, index) => (
            <a
              href={`#year-${milestone.year}`}
              key={milestone.year}
              aria-current={active === index ? "step" : undefined}
            >
              {String(index + 1).padStart(2, "0")} / {milestone.year}
            </a>
          ))}
        </nav>

        <div className="journey-progress" aria-hidden="true">
          <motion.div
            style={{
              scaleX: reduce ? scrollYProgress : progress,
            }}
          />
        </div>
      </div>

      <ol className="journey-chapter-list">
        {milestones.map((milestone, index) => (
          <li
            key={milestone.year}
            id={`year-${milestone.year}`}
            data-index={index}
            data-current={active === index}
            className="journey-chapter-slot"
          >
            <div className="journey-card-frame">
              <motion.article
                className="journey-chapter"
                initial={false}
                animate={{
                  opacity: active === index ? 1 : 0.72,
                }}
                transition={{
                  duration: reduce ? 0 : 0.35,
                  ease: [0.22, 0.75, 0.18, 1],
                }}
              >
                <div className="journey-chapter-top">
                  <div className="journey-chapter-meta">
                    <span className="eyebrow">
                      {String(index + 1).padStart(2, "0")} / {milestone.year}
                    </span>

                    {milestone.isCurrent && <span className="journey-current-badge">Current</span>}
                  </div>

                  <Icon icon={milestone.icon} width={42} height={42} aria-hidden="true" />
                </div>

                <h3>{milestone.title}</h3>

                <p>{milestone.description}</p>

                <ul className="journey-tags" aria-label="Technologies">
                  {milestone.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>

                <span className="journey-chapter-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </motion.article>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
