"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Icon } from "@iconify/react";

const milestones = [
  {
    year: "2022",
    title: "The Spark",
    description: "Started my journey with Python and HTML/CSS. Built my first scripts and websites, discovering the magic of making ideas come to life through code.",
    tags: ["Python", "HTML", "CSS"],
    icon: "logos:python",
    color: "from-blue-500/20 to-yellow-500/20",
  },
  {
    year: "2023",
    title: "Logic & Systems",
    description: "Dived into Minecraft Skripting which taught me event-driven logic. Simultaneously started my journey into Linux Server Administration, learning the foundations of hosting and system management.",
    tags: ["Skript", "Linux", "JavaScript"],
    icon: "logos:linux-tux",
    color: "from-orange-500/20 to-red-500/20",
  },
  {
    year: "2024",
    title: "JVM & Infrastructure",
    description: "Shifted focus to Kotlin and Java for high-performance backend development. Mastered Docker and explored Proxmox to build a more robust and scalable project infrastructure.",
    tags: ["Kotlin", "Java", "Docker", "Proxmox"],
    icon: "vscode-icons:file-type-kotlin",
    color: "from-purple-500/20 to-blue-500/20",
  },
  {
    year: "2025",
    title: "Founding EraMC",
    description: "Founded the EraMC Network. A year of massive growth: deep-diving into Async programming, MongoDB, and TypeScript/Next.js to build a seamless player experience from web to game.",
    tags: ["Next.js", "TypeScript", "MongoDB", "Async", "EraMC"],
    icon: "ph:rocket-duotone",
    color: "from-emerald-500/20 to-cyan-500/20",
  },
  {
    year: "2026",
    title: "Next-Level Performance",
    description: "Pushing EraMC to unprecedented levels. Exploring Go for high-performance tooling and continuing to refine the Kotlin ecosystem for maximum efficiency and scale.",
    tags: ["Go", "Next.js", "Advanced Kotlin", "Scale"],
    icon: "logos:go",
    color: "from-cyan-400/20 to-blue-600/20",
    isCurrent: true,
  },
];

export default function CodingJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section ref={containerRef} className="relative py-20 px-4 max-w-5xl mx-auto">
      <div className="flex flex-col items-center mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-3 rounded-2xl bg-white/5 border border-white/10 mb-6"
        >
          <Icon icon="ph:path-bold" className="text-3xl text-purple-400" />
        </motion.div>
        <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter mb-4">
          CODING JOURNEY
        </h2>
        <p className="text-slate-400 max-w-md">
          A timeline of my evolution as a developer, from the first script to high-performance networks.
        </p>
      </div>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2 hidden sm:block" />
        <motion.div
          style={{ scaleY, originY: 0 }}
          className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-purple-500 via-blue-500 to-transparent -translate-x-1/2 hidden sm:block"
        />

        <div className="space-y-12 sm:space-y-24">
          {milestones.map((m, i) => (
            <TimelineItem key={m.year} milestone={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ milestone, index }: { milestone: typeof milestones[0]; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`relative flex flex-col md:flex-row items-center gap-8 ${
        isEven ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Year Circle */}
      <div className="absolute left-4 md:left-1/2 w-10 h-10 rounded-full bg-slate-950 border-2 border-slate-800 flex items-center justify-center -translate-x-1/2 z-10 hidden sm:flex">
        <div className={`w-3 h-3 rounded-full ${milestone.isCurrent ? 'bg-purple-500 animate-pulse' : 'bg-slate-600'}`} />
      </div>

      {/* Content Card */}
      <div className={`w-full md:w-[45%] ${isEven ? 'md:text-left' : 'md:text-right'} group`}>
        <div className={`relative p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/20`}>
          {/* Subtle background glow */}
          <div className={`absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br ${milestone.color} blur-3xl opacity-50 group-hover:opacity-80 transition-opacity`} />
          
          <div className={`flex flex-col ${isEven ? 'items-start' : 'md:items-end'} mb-4`}>
            <span className="text-sm font-black text-purple-400 tracking-[0.3em] mb-2">{milestone.year}</span>
            <div className="flex items-center gap-3">
              {isEven && <Icon icon={milestone.icon} className="text-3xl" />}
              <h3 className="text-2xl font-bold text-white italic tracking-tight">{milestone.title}</h3>
              {!isEven && <Icon icon={milestone.icon} className="text-3xl" />}
            </div>
          </div>

          <p className="text-slate-400 leading-relaxed mb-6 text-sm">
            {milestone.description}
          </p>

          <div className={`flex flex-wrap gap-2 ${isEven ? '' : 'md:justify-end'}`}>
            {milestone.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Spacer for MD screens */}
      <div className="hidden md:block md:w-[10%]" />
    </motion.div>
  );
}
