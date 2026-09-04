"use client";

import { useMemo, useRef, useSyncExternalStore } from "react";
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
  active: boolean;
  x: number;
  width: number;
  height: number;
  position: ImagePosition;
  depth: number;
  scrollShift: number;
};

function isActiveProject(project: Project) {
  return (
    project.endAt?.trim().toLowerCase() === "now" ||
    project.tags?.some((tag) => tag.toLowerCase() === "active") === true
  );
}

const projects: Project[] = [
  {
    name: "Dat Bot",
    imagePath: "/projects/datbot.png",
    role: "Web Developer",
    description:
      "Feature-rich Discord bot paired with a Next.js web dashboard — moderation, stats and integrations.",
    tags: ["TypeScript", "Next.js", "Discord.js", "Web", "Kotlin", "Active", "JDA"],
    startAt: "October 2024",
    endAt: "now",
    url: "https://datbot.xyz",
  },
  {
    name: "EraMC",
    imagePath: "/projects/eramc.png",
    role: "Founder, Developer & Sys Admin",
    description:
      "Custom Minecraft smp server, pvp server and more coming soon — built bespoke plugins, a web dashboard and the full server infrastructure from scratch.",
    tags: ["Minecraft", "Backend", "Web", "Linux", "Kotlin", "Go"],
    startAt: "May 2025",
    endAt: "July 2026",
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
    tags: ["Minecraft", "Kotlin", "Skript", "Backend", "Linux", "Next.js", "Web"],
    startAt: "August 2026",
    endAt: "now",
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

const orderedProjects = [...projects].sort(
  (projectA, projectB) => Number(isActiveProject(projectB)) - Number(isActiveProject(projectA)),
);

const projectCards: ProjectCard[] = orderedProjects.map((project, index) => {
  const layout = projectLayouts[index];

  return {
    ...project,
    ...layout,
    active: isActiveProject(project),
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
  const isMobile = viewportWidth > 0 && viewportWidth < 768;

  const responsiveProjectCards = useMemo(() => {
    return projectCards.map((card, index) => {
      if (!isMobile) return card;

      // Mobile adjustments
      const mobileWidth = Math.min(viewportWidth * 0.85, 400);
      const mobileHeight = mobileWidth * 1.3;
      return {
        ...card,
        width: mobileWidth,
        height: mobileHeight,
        x: index * (mobileWidth + 40),
        scrollShift: -50,
      };
    });
  }, [isMobile, viewportWidth]);

  const firstItem = responsiveProjectCards[0];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const totalWidth =
    Math.max(...responsiveProjectCards.map((card) => card.x + card.width)) + (isMobile ? 100 : 620);
  const travelDistance = Math.max(totalWidth - viewportWidth, 0);
  const startOffset = Math.max((viewportWidth - firstItem.width) / 2 - firstItem.x, 0);
  const x = useTransform(scrollYProgress, [0, 1], [startOffset, -travelDistance]);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothPointerX = useSpring(pointerX, { stiffness: 70, damping: 24, mass: 0.55 });
  const smoothPointerY = useSpring(pointerY, { stiffness: 70, damping: 24, mass: 0.55 });
  const ambientX = useTransform(smoothPointerX, [-0.5, 0.5], [-22, 22]);
  const ambientY = useTransform(smoothPointerY, [-0.5, 0.5], [-14, 14]);
  const ambientXInverse = useTransform(smoothPointerX, [-0.5, 0.5], [18, -18]);
  const ambientYInverse = useTransform(smoothPointerY, [-0.5, 0.5], [10, -10]);

  return (
    <section
      ref={ref}
      onPointerMove={(event) => {
        if (isMobile || event.pointerType !== "mouse") return;
        pointerX.set(event.clientX / window.innerWidth - 0.5);
        pointerY.set(event.clientY / window.innerHeight - 0.5);
      }}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
      className={`relative left-1/2 right-1/2 w-dvw -translate-x-1/2 ${isMobile ? "h-[250vh]" : "h-[400vh]"}`}
    >
      <div className="sticky top-0 h-screen w-dvw overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            style={{ x: ambientX, y: ambientY }}
            className="absolute left-[12%] top-[18%] h-[22vh] w-[28vw] rounded-full bg-sky-300/8 blur-3xl mix-blend-screen opacity-60"
          />
          <motion.div
            style={{ x: ambientXInverse, y: ambientYInverse }}
            className="absolute right-[8%] top-[10%] h-[26vh] w-[22vw] rounded-full bg-emerald-300/8 blur-3xl mix-blend-screen opacity-50"
          />
        </div>
        <motion.div style={{ x, width: totalWidth }} className="relative h-full">
          {responsiveProjectCards.map((project, index) => (
            <ProjectCardItem
              key={project.name}
              item={project}
              index={index}
              mouseX={smoothPointerX}
              mouseY={smoothPointerY}
              isMobile={isMobile}
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
  mouseX,
  mouseY,
  isMobile,
}: {
  item: ProjectCard;
  index: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  isMobile: boolean;
}) {
  const cardTone = item.active
    ? "from-violet-400/30 via-fuchsia-300/12 to-slate-950/90"
    : [
        "from-emerald-300/25 via-cyan-300/10 to-slate-950/90",
        "from-sky-300/25 via-emerald-300/10 to-slate-950/90",
        "from-cyan-300/20 via-slate-300/10 to-slate-950/90",
        "from-emerald-400/20 via-teal-300/10 to-slate-950/90",
        "from-sky-400/20 via-cyan-300/10 to-slate-950/90",
      ][index];
  const visibleTags = item.tags?.filter((tag) => tag.toLowerCase() !== "active");
  const xMouse = useTransform(mouseX, [-0.5, 0.5], [-32 * item.depth, 32 * item.depth]);
  const yMouse = useTransform(mouseY, [-0.5, 0.5], [-22 * item.depth, 22 * item.depth]);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [4 * item.depth, -4 * item.depth]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5 * item.depth, 5 * item.depth]);

  const getVerticalPosition = () => {
    if (isMobile) return "top-1/2 -translate-y-1/2";
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
      data-active={item.active}
      style={{
        x: isMobile ? 0 : xMouse,
        y: isMobile ? 0 : yMouse,
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
        transformPerspective: 1400,
        width: item.width,
        height: item.height,
      }}
      whileHover={isMobile ? {} : { scale: 1.01 }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      className={`group relative overflow-hidden rounded-4xl sm:rounded-[2.5rem] border bg-slate-950/45 backdrop-blur-2xl will-change-transform ${
        item.active
          ? "border-violet-300/35 shadow-[0_30px_100px_rgba(2,6,23,0.5),0_0_52px_rgba(139,92,246,0.2)]"
          : "border-white/8 shadow-[0_30px_90px_rgba(2,6,23,0.42)]"
      }`}
    >
      {item.active && (
        <div className="pointer-events-none absolute inset-x-12 top-0 z-30 h-px bg-linear-to-r from-transparent via-violet-300/90 to-transparent shadow-[0_0_18px_rgba(196,181,253,0.8)]" />
      )}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute left-[9%] top-[7%] h-[44%] w-[58%] rounded-full blur-3xl opacity-85 bg-linear-to-br ${cardTone}`}
        />
        <div className="absolute right-[12%] top-[16%] h-[26%] w-[26%] rounded-full bg-white/8 blur-3xl opacity-45" />
        <div className="absolute inset-x-[18%] bottom-[14%] h-[18%] rounded-full bg-cyan-300/8 blur-3xl opacity-40" />
      </div>

      <div className="relative flex h-full flex-col overflow-hidden">
        <div
          className={`relative ${isMobile ? "h-[40%]" : "h-[46%]"} min-h-48 sm:min-h-55 overflow-hidden`}
        >
          <Image
            src={item.imagePath}
            alt={`${item.name} preview`}
            fill
            sizes="(max-width: 768px) 90vw, 520px"
            className="object-cover transition duration-700 ease-out sm:group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/35 to-transparent" />
          <div className="project-timeline-badge absolute left-4 top-4 sm:left-5 sm:top-5 flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/55 px-2.5 py-1 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-medium text-white/90 backdrop-blur-md">
            <Sparkles className="size-3 sm:size-3.5 text-emerald-300" />
            {item.startAt} - {item.endAt ?? "now"}
          </div>
          {item.active && (
            <div className="project-active-badge absolute right-4 top-4 sm:right-5 sm:top-5 flex items-center gap-2 rounded-full border border-violet-300/30 bg-violet-950/65 px-2.5 py-1 sm:px-3 sm:py-1 text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-100 backdrop-blur-md">
              <span
                className="project-active-dot size-1.5 rounded-full bg-violet-300"
                aria-hidden="true"
              />
              Active
            </div>
          )}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 flex items-end justify-between gap-3">
            <div className="space-y-1 sm:space-y-1.5">
              <p className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.32em] text-white/65">
                Project {index + 1}
              </p>
              <h3 className="max-w-[12ch] text-2xl sm:text-4xl font-semibold tracking-tight text-white drop-shadow-[0_6px_20px_rgba(0,0,0,0.45)]">
                {item.name}
              </h3>
            </div>
            {item.url && (
              <div className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs font-medium text-white/85 backdrop-blur-md transition duration-300 sm:group-hover:bg-emerald-400/15 sm:group-hover:text-emerald-50">
                Open
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-3 sm:gap-5 p-4 sm:p-5">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.28em] text-white/65">
              <span className="rounded-full border border-white/10 bg-white/8 px-2.5 py-1 sm:px-3 sm:py-1.5 text-white/82">
                {item.role}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/35 px-2.5 py-1 sm:px-3 sm:py-1.5 text-white/70">
                <Clock3 className="size-3 sm:size-3.5" />
                {item.startAt} - {item.endAt ?? "now"}
              </span>
            </div>

            <p className="max-w-prose text-xs sm:text-sm leading-5 sm:leading-6 text-white/78 line-clamp-3 sm:line-clamp-none">
              {item.description}
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {visibleTags?.slice(0, isMobile ? 3 : undefined).map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/8 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-medium text-white/82 transition duration-300 sm:group-hover:border-emerald-300/25 sm:group-hover:bg-emerald-300/10 sm:group-hover:text-emerald-50"
                >
                  {tag}
                </span>
              ))}
              {isMobile && visibleTags && visibleTags.length > 3 && (
                <span className="text-[10px] text-white/50 self-center">
                  +{visibleTags.length - 3}
                </span>
              )}
            </div>

            {item.url && (
              <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3 sm:pt-4 text-xs sm:text-sm text-white/70">
                <span>External project link</span>
                <span className="inline-flex items-center gap-1.5 text-white/90 transition sm:group-hover:translate-x-0.5 sm:group-hover:text-emerald-100">
                  View project
                  <ArrowUpRight className="size-3.5 sm:size-4" />
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {!isMobile && (
        <motion.div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
          <div className="absolute left-[14%] top-[14%] h-[52%] w-[42%] rounded-full bg-white/10 blur-3xl" />
          <div className="absolute right-[14%] bottom-[10%] h-[30%] w-[30%] rounded-full bg-emerald-300/12 blur-3xl" />
          <div className="absolute inset-x-[24%] top-[18%] h-10 rounded-full bg-white/8 blur-2xl" />
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <motion.div
      style={{
        x: item.x,
        y: 0,
      }}
      className={`absolute ${getVerticalPosition()}`}
    >
      {item.url ? (
        <Link href={item.url} target="_blank" rel="noreferrer" aria-label={`Open ${item.name}`}>
          {content}
        </Link>
      ) : (
        content
      )}
    </motion.div>
  );
}
