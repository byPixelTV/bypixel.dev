"use client";

import { useMemo, useRef, useSyncExternalStore } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
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
    scrollShift: -90,
  },
  {
    x: 540,
    width: 500,
    height: 620,
    position: "center",
    scrollShift: -140,
  },
  {
    x: 1160,
    width: 420,
    height: 540,
    position: "top",
    scrollShift: -110,
  },
  {
    x: 1680,
    width: 460,
    height: 580,
    position: "bottom",
    scrollShift: -160,
  },
  {
    x: 2240,
    width: 520,
    height: 620,
    position: "center",
    scrollShift: -130,
  },
] as const satisfies Array<{
  x: number;
  width: number;
  height: number;
  position: ImagePosition;
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

const subscribeViewport = (notify: () => void) => {
  window.addEventListener("resize", notify);
  return () => window.removeEventListener("resize", notify);
};
const readViewport = () => window.innerWidth;
const serverViewport = () => 0;
const simpleMotionQuery = "(max-width: 767px), (hover: none), (pointer: coarse)";
const subscribeSimpleMotion = (notify: () => void) => {
  const media = window.matchMedia(simpleMotionQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const readSimpleMotion = () => window.matchMedia(simpleMotionQuery).matches;
const serverSimpleMotion = () => true;

export default function HorizontalGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const viewportWidth = useSyncExternalStore(subscribeViewport, readViewport, serverViewport);
  const simpleMotion = useSyncExternalStore(
    subscribeSimpleMotion,
    readSimpleMotion,
    serverSimpleMotion,
  );
  const reduce = useReducedMotion();
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
    offset: ["start 15%", "end end"],
  });

  const lastItem = responsiveProjectCards[responsiveProjectCards.length - 1];
  const startOffset = (viewportWidth - firstItem.width) / 2 - firstItem.x;
  const endOffset = (viewportWidth - lastItem.width) / 2 - lastItem.x;
  // Follow the already-smoothed page scroll directly, with no dead zone or second spring.
  const x = useTransform(scrollYProgress, [0, 1], [startOffset, endOffset]);

  return (
    <section
      ref={ref}
      data-project-gallery
      className={`relative left-1/2 right-1/2 w-dvw -translate-x-1/2 ${isMobile ? "h-[350svh]" : "h-[450svh]"}`}
    >
      <div className="project-stage sticky top-0 h-screen w-dvw overflow-hidden">
        <div className="relative h-full">
          {responsiveProjectCards.map((project, index) => (
            <ProjectCardItem
              key={project.name}
              item={project}
              index={index}
              isMobile={isMobile}
              galleryX={x}
              viewportWidth={viewportWidth}
              reduce={Boolean(reduce)}
              simpleMotion={simpleMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCardItem({
  item,
  index,
  isMobile,
  galleryX,
  viewportWidth,
  reduce,
  simpleMotion,
}: {
  item: ProjectCard;
  index: number;
  isMobile: boolean;
  galleryX: MotionValue<number>;
  viewportWidth: number;
  reduce: boolean;
  simpleMotion: boolean;
}) {
  const visibleTags = item.tags?.filter((tag) => tag.toLowerCase() !== "active");
  // One transform per card. Offscreen cards stop changing instead of moving a giant layer.
  const cardTransform = useTransform(galleryX, (offset) => {
    const x = Math.max(-item.width - 180, Math.min(viewportWidth + 180, offset + item.x));
    const passage = Math.max(
      -1,
      Math.min(
        1,
        (x + item.width / 2 - viewportWidth / 2) / Math.max(1, (viewportWidth + item.width) / 2),
      ),
    );
    const direction = index % 2 === 0 ? 1 : -1;
    const y = reduce
      ? 0
      : passage * direction * (simpleMotion ? 22 : Math.abs(item.scrollShift) * 0.65);
    const rotate = reduce || simpleMotion ? 0 : -passage * direction * 5;
    // Keep raster size stable: scrolling only translates and rotates an already painted card.
    return (
      "translate3d(" +
      x.toFixed(2) +
      "px," +
      y.toFixed(2) +
      "px,0) rotate(" +
      rotate.toFixed(2) +
      "deg)"
    );
  });

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
    <div
      data-active={item.active}
      style={{ width: item.width, height: item.height }}
      className="project-surface group relative overflow-hidden rounded-4xl sm:rounded-[2.5rem] border"
    >
      {item.active && (
        <div className="pointer-events-none absolute inset-x-12 top-0 z-30 h-px bg-linear-to-r from-transparent via-violet-300/90 to-transparent" />
      )}
      <div className="relative flex h-full flex-col overflow-hidden">
        <div
          className={`relative ${isMobile ? "h-[40%]" : "h-[46%]"} min-h-48 sm:min-h-55 overflow-hidden`}
        >
          <div className="absolute -inset-x-6 -inset-y-3">
            <Image
              src={item.imagePath}
              alt={`${item.name} preview`}
              fill
              sizes="(max-width: 768px) 90vw, 520px"
              loading={index < 2 ? "eager" : "lazy"}
              decoding="async"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/35 to-transparent" />
          <div className="project-timeline-badge absolute left-4 top-4 sm:left-5 sm:top-5 flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/85 px-2.5 py-1 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-medium text-white/90">
            <Sparkles className="size-3 sm:size-3.5 text-emerald-300" />
            {item.startAt} - {item.endAt ?? "now"}
          </div>
          {item.active && (
            <div className="project-active-badge absolute right-4 top-4 sm:right-5 sm:top-5 flex items-center gap-2 rounded-full border border-violet-300/30 bg-violet-950/90 px-2.5 py-1 sm:px-3 sm:py-1 text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-100">
              <span
                className="project-active-dot size-1.5 rounded-full bg-violet-300"
                aria-hidden="true"
              />
              Active
            </div>
          )}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 flex items-end justify-between gap-3">
            <div className="space-y-1 sm:space-y-1.5">
              <h3 className="max-w-[12ch] text-2xl sm:text-4xl font-semibold tracking-tight text-white">
                {item.name}
              </h3>
            </div>
            {item.url && (
              <div className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs font-medium text-white/85 transition duration-300 sm:group-hover:bg-emerald-400/15 sm:group-hover:text-emerald-50">
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
    </div>
  );

  return (
    <motion.div
      style={{ transform: cardTransform }}
      data-project-card={item.name}
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
