"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3, Sparkles } from "lucide-react";

import type { Project } from "@/lib/schema/project";

type ImagePosition = "top" | "center" | "bottom" | "full";

type ProjectCard = Project & {
  x: number;
  width: number;
  height: number;
  position: ImagePosition;
  depth: number;
  scrollShift: number;
};

const projects: Project[] = [
  {
    name: "EraMC",
    imagePath: "/projects/eramc.png",
    role: "Founder, Developer & Sys Admin",
    description:
      "Custom Minecraft smp server, pvp server and more coming soon — built bespoke plugins, a web dashboard and the full server infrastructure from scratch.",
    tags: ["Minecraft", "Backend", "Web", "Linux", "Active", "WIP", "Primary"],
    startAt: "May 2025",
    endAt: "now",
    url: "https://dc.eramc.net",
  },
  {
    name: "BetterAttack",
    imagePath: "/projects/betterattack.webp",
    role: "Sys Admin, Developer & Administrator",
    description:
      "Minecraft CraftAttack like survival server — plugin development, infrastructure setup and full administration.",
    tags: ["Minecraft", "Backend", "Linux", "Active"],
    startAt: "October 2025",
    endAt: "now",
    url: "https://discord.gg/betterattack",
  },
  {
    name: "Dat Bot",
    imagePath: "/projects/datbot.png",
    role: "Web Developer",
    description:
      "Feature-rich Discord bot paired with a Next.js web dashboard — moderation, stats and integrations.",
    tags: ["TypeScript", "Next.js", "Discord.js", "Web"],
    startAt: "October 2024",
    endAt: "January 2026",
    url: "https://datbot.xyz",
  },
  {
    name: "DaniSMP",
    imagePath: "/projects/danismp.png",
    role: "Sys Admin, Developer & Administrator",
    description:
      "One of the biggest german Minecraft sword SMP servers — plugin development, infrastructure setup and full administration.",
    tags: ["Minecraft", "Backend", "Linux"],
    startAt: "February 2025",
    endAt: "May 2025",
    url: "https://discord.gg/danismp",
  },
  {
    name: "Skydinse",
    imagePath: "/projects/skydinse.png",
    role: "Developer",
    description:
      "Minecraft minigame network — developed gameplay skripts and managed server infrastructure with Skript.",
    tags: ["Minecraft", "Kotlin", "Skript"],
    startAt: "April 2024",
    endAt: "Juli 2025",
    url: "https://skydinse.net",
  },
];

const projectLayouts = [
  {
    x: 0,
    width: 430,
    height: 560,
    position: "top",
    depth: 0.2,
    scrollShift: -90,
  },
  {
    x: 540,
    width: 500,
    height: 620,
    position: "center",
    depth: 0.5,
    scrollShift: -140,
  },
  {
    x: 1160,
    width: 420,
    height: 540,
    position: "top",
    depth: 0.35,
    scrollShift: -110,
  },
  {
    x: 1680,
    width: 460,
    height: 580,
    position: "bottom",
    depth: 0.45,
    scrollShift: -160,
  },
  {
    x: 2240,
    width: 520,
    height: 620,
    position: "center",
    depth: 0.55,
    scrollShift: -130,
  },
] as const satisfies Array<{
  x: number;
  width: number;
  height: number;
  position: ImagePosition;
  depth: number;
  scrollShift: number;
}>;

const projectCards: ProjectCard[] = projects.map((project, index) => {
  const layout = projectLayouts[index];

  return {
    ...project,
    ...layout,
  };
});

function useViewportWidth() {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("resize", onStoreChange);
      return () => window.removeEventListener("resize", onStoreChange);
    },
    () => window.innerWidth,
    () => 0,
  );
}

export default function HorizontalGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const viewportWidth = useViewportWidth();
  const firstItem = projectCards[0];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const totalWidth =
    Math.max(...projectCards.map((card) => card.x + card.width)) + 620;
  const travelDistance = Math.max(totalWidth - viewportWidth, 0);
  const startOffset = Math.max(
    (viewportWidth - firstItem.width) / 2 - firstItem.x,
    0,
  );
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [startOffset, -travelDistance],
  );

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={ref}
      className="relative left-1/2 right-1/2 h-[400vh] w-screen -translate-x-1/2"
    >
      <div className="sticky top-0 h-screen w-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[12%] top-[18%] h-[22vh] w-[28vw] rounded-full bg-sky-300/8 blur-3xl mix-blend-screen opacity-60" />
          <div className="absolute right-[8%] top-[10%] h-[26vh] w-[22vw] rounded-full bg-emerald-300/8 blur-3xl mix-blend-screen opacity-50" />
        </div>
        <motion.div
          style={{ x, width: totalWidth }}
          className="relative h-full"
        >
          {projectCards.map((project, index) => (
            <ProjectCardItem
              key={project.name}
              item={project}
              index={index}
              progress={scrollYProgress}
              mouseX={smoothX}
              mouseY={smoothY}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCardItem({
  item,
  index,
  progress,
  mouseX,
  mouseY,
}: {
  item: ProjectCard;
  index: number;
  progress: MotionValue<number>;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const depth = item.depth;
  const yScroll = useTransform(progress, [0, 1], [0, item.scrollShift]);
  const xMouse = useTransform(mouseX, [-0.5, 0.5], [-48 * depth, 48 * depth]);
  const yMouse = useTransform(mouseY, [-0.5, 0.5], [-48 * depth, 48 * depth]);
  const tilt = useTransform(mouseX, [-0.5, 0.5], [7, -7]);
  const cardTone = [
    "from-emerald-300/25 via-cyan-300/10 to-slate-950/90",
    "from-sky-300/25 via-emerald-300/10 to-slate-950/90",
    "from-cyan-300/20 via-slate-300/10 to-slate-950/90",
    "from-emerald-400/20 via-teal-300/10 to-slate-950/90",
    "from-sky-400/20 via-cyan-300/10 to-slate-950/90",
  ][index];

  const getVerticalPosition = () => {
    switch (item.position) {
      case "top":
        return "top-[9%]";
      case "center":
        return "top-1/2 -translate-y-1/2";
      case "bottom":
        return "bottom-[9%]";
      case "full":
        return "top-0 h-full";
      default:
        return "top-1/2 -translate-y-1/2";
    }
  };

  const content = (
    <motion.div
      style={{
        x: xMouse,
        y: yMouse,
        width: item.width,
        height: item.height,
      }}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      className="group relative overflow-hidden rounded-[2.5rem] bg-slate-950/45 shadow-[0_30px_90px_rgba(2,6,23,0.42)] backdrop-blur-2xl will-change-transform"
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute left-[9%] top-[7%] h-[44%] w-[58%] rounded-full blur-3xl opacity-85 bg-linear-to-br ${cardTone}`}
        />
        <div className="absolute right-[12%] top-[16%] h-[26%] w-[26%] rounded-full bg-white/8 blur-3xl opacity-45" />
        <div className="absolute inset-x-[18%] bottom-[14%] h-[18%] rounded-full bg-cyan-300/8 blur-3xl opacity-40" />
      </div>

      <div className="relative flex h-full flex-col overflow-hidden">
        <div className="relative h-[46%] min-h-55 overflow-hidden">
          <Image
            src={item.imagePath}
            alt={`${item.name} preview`}
            fill
            sizes="(max-width: 768px) 90vw, 520px"
            className="object-cover transition duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/35 to-transparent" />
          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/55 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
            <Sparkles className="size-3.5 text-emerald-300" />
            {item.startAt} - {item.endAt ?? "now"}
          </div>
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
            <div className="space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-[0.32em] text-white/65">
                Project {index + 1}
              </p>
              <h3 className="max-w-[12ch] text-4xl font-semibold tracking-tight text-white drop-shadow-[0_6px_20px_rgba(0,0,0,0.45)]">
                {item.name}
              </h3>
            </div>
            <div className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white/85 backdrop-blur-md transition duration-300 group-hover:bg-emerald-400/15 group-hover:text-emerald-50">
              Open
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-5 p-5">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/65">
              <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-white/82">
                {item.role}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/35 px-3 py-1.5 text-white/70">
                <Clock3 className="size-3.5" />
                {item.startAt} - {item.endAt ?? "now"}
              </span>
            </div>

            <p className="max-w-prose text-sm leading-6 text-white/78">
              {item.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {item.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs font-medium text-white/82 transition duration-300 group-hover:border-emerald-300/25 group-hover:bg-emerald-300/10 group-hover:text-emerald-50"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-sm text-white/70">
              <span>
                {item.url ? "External project link" : "Project showcase"}
              </span>
              <span className="inline-flex items-center gap-1.5 text-white/90 transition group-hover:translate-x-0.5 group-hover:text-emerald-100">
                View project
                <ArrowUpRight className="size-4" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        style={{ rotate: tilt }}
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
      >
        <div className="absolute left-[14%] top-[14%] h-[52%] w-[42%] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-[14%] bottom-[10%] h-[30%] w-[30%] rounded-full bg-emerald-300/12 blur-3xl" />
        <div className="absolute inset-x-[24%] top-[18%] h-10 rounded-full bg-white/8 blur-2xl" />
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div
      style={{
        x: item.x,
        y: yScroll,
      }}
      className={`absolute ${getVerticalPosition()}`}
    >
      {item.url ? (
        <Link
          href={item.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${item.name}`}
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </motion.div>
  );
}
