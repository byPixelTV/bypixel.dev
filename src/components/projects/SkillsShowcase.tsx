"use client";

import { useRef, useState, useMemo, useEffect, useSyncExternalStore } from "react";
import { Icon } from "@iconify/react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  type MotionValue,
} from "framer-motion";
import type { Skill } from "@/lib/schema/skill";

const skills: Skill[] = [
  { name: "HTML", icon: "vscode-icons:file-type-html", category: "Frontend" },
  { name: "CSS", icon: "vscode-icons:file-type-css", category: "Frontend" },
  { name: "JavaScript", icon: "logos:javascript", category: "Frontend" },
  { name: "TypeScript", icon: "logos:typescript-icon", category: "Frontend" },
  { name: "React", icon: "logos:react", category: "Frontend" },
  { name: "Next.js", icon: "logos:nextjs-icon", category: "Frontend" },
  { name: "Vue", icon: "vscode-icons:file-type-vue", category: "Frontend" },
  { name: "Nuxt", icon: "vscode-icons:file-type-nuxt", category: "Frontend" },
  {
    name: "Tailwind CSS",
    icon: "logos:tailwindcss-icon",
    category: "Frontend",
  },
  { name: "Framer Motion", icon: "devicon:framermotion", category: "Frontend" },
  { name: "Java", icon: "vscode-icons:file-type-java", category: "Backend" },
  {
    name: "Kotlin",
    icon: "vscode-icons:file-type-kotlin",
    category: "Backend",
  },
  { name: "Node.js", icon: "logos:nodejs-icon", category: "Backend" },
  {
    name: "Python",
    icon: "vscode-icons:file-type-python",
    category: "Backend",
  },
  { name: "Spring", icon: "devicon:spring", category: "Backend" },
  { name: "Gradle", icon: "file-icons:gradle", category: "Backend" },
  { name: "Maven", icon: "vscode-icons:file-type-maven", category: "Backend" },
  { name: "Appwrite", icon: "devicon:appwrite", category: "Backend" },
  { name: "Ktor", icon: "devicon:ktor", category: "Backend" },
  { name: "gRPC", icon: "devicon:grpc", category: "Backend" },
  { name: "MySQL", icon: "logos:mysql", category: "Database" },
  {
    name: "MariaDB",
    icon: "vscode-icons:file-type-mariadb",
    category: "Database",
  },
  {
    name: "SQLite",
    icon: "vscode-icons:file-type-sqlite",
    category: "Database",
  },
  { name: "PostgreSQL", icon: "logos:postgresql", category: "Database" },
  { name: "MongoDB", icon: "logos:mongodb-icon", category: "Database" },
  { name: "Redis", icon: "logos:redis", category: "Database" },
  { name: "Prisma", icon: "logos:prisma", category: "Database" },
  { name: "Clickhouse", icon: "simple-icons:clickhouse", category: "Database" },
  { name: "InfluxDB", icon: "simple-icons:influxdb", category: "Database" },
  {
    name: "Linux",
    icon: "flat-color-icons:linux",
    category: "DevOps & Systems",
  },
  { name: "Git", icon: "logos:git-icon", category: "DevOps & Systems" },
  { name: "Docker", icon: "logos:docker-icon", category: "DevOps & Systems" },
  {
    name: "Nginx",
    icon: "vscode-icons:file-type-nginx",
    category: "DevOps & Systems",
  },
  {
    name: "Nginx Proxy Manager",
    icon: "simple-icons:nginxproxymanager",
    category: "DevOps & Systems",
  },
  { name: "Vercel", icon: "logos:vercel-icon", category: "DevOps & Systems" },
  {
    name: "VS Code",
    icon: "vscode-icons:file-type-vscode",
    category: "Tools & Platforms",
  },
  { name: "IntelliJ", icon: "devicon:intellij", category: "Tools & Platforms" },
  { name: "WebStorm", icon: "devicon:webstorm", category: "Tools & Platforms" },
  { name: "PyCharm", icon: "devicon:pycharm", category: "Tools & Platforms" },
  { name: "GoLand", icon: "devicon:goland", category: "Tools & Platforms" },
  { name: "DataGrip", icon: "devicon:datagrip", category: "Tools & Platforms" },
  { name: "Grafana", icon: "devicon:grafana", category: "Tools & Platforms" },
  { name: "Postman", icon: "devicon:postman", category: "Tools & Platforms" },
];

function useViewportWidth() {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("resize", onStoreChange);
      return () => window.removeEventListener("resize", onStoreChange);
    },
    () => (typeof window !== "undefined" ? window.innerWidth : 0),
    () => 0,
  );
}

export default function SkillsShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [sectionHeight, setSectionHeight] = useState<number | null>(null);
  const viewportWidth = useViewportWidth();
  const isMobile = viewportWidth > 0 && viewportWidth < 768;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 35, stiffness: 90 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Move all useTransform hooks to the top level, out of conditional blocks
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.6, 0.65],
    [0, 1, 1, 0],
  );
  const titleScale = useTransform(scrollYProgress, [0, 0.15], [0.8, 1]);

  const kotlinIconOpacity = useTransform(
    scrollYProgress,
    [0.5, 0.55, 0.95, 1],
    [0, 1, 1, 0],
  );
  const kotlinIconScale = useTransform(scrollYProgress, [0.5, 0.6], [0.4, 1]);
  const kotlinIconY = useTransform(scrollYProgress, [0.55, 0.65], [0, isMobile ? -100 : -180]);
  const kotlinCoreTitleOpacity = useTransform(
    scrollYProgress,
    [0.55, 0.62],
    [0, 1],
  );

  const ktorOpacity = useTransform(
    scrollYProgress,
    [0.6, 0.65, 0.95, 1],
    [0, 1, 1, 0],
  );
  const ktorX = useTransform(scrollYProgress, [0.6, 0.65], [-50, 0]);

  const serialOpacity = useTransform(
    scrollYProgress,
    [0.63, 0.68, 0.95, 1],
    [0, 1, 1, 0],
  );
  const serialX = useTransform(scrollYProgress, [0.63, 0.68], [50, 0]);

  const mongoOpacity = useTransform(
    scrollYProgress,
    [0.66, 0.71, 0.95, 1],
    [0, 1, 1, 0],
  );
  const mongoX = useTransform(scrollYProgress, [0.66, 0.71], [-50, 0]);

  const redisOpacity = useTransform(
    scrollYProgress,
    [0.69, 0.74, 0.95, 1],
    [0, 1, 1, 0],
  );
  const redisX = useTransform(scrollYProgress, [0.69, 0.74], [50, 0]);

  const progressWidth = useTransform(scrollYProgress, [0, 0.6], ["0%", "100%"]);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  useEffect(() => {
    const compute = () => {
      const vh = typeof window !== "undefined" ? window.innerHeight : 800;
      const perSkillFactor = isMobile ? 0.12 : 0.08; // smaller multiplier to avoid huge lengths
      const baseMultiplier = isMobile ? 2 : 2; // minimum viewport multiples
      const maxMultiplier = 4; // cap the total viewport multiples (increased for longer scroll)
      const estimated = Math.min(
        maxMultiplier,
        Math.max(baseMultiplier, Math.ceil(skills.length * perSkillFactor)),
      );
      setSectionHeight(Math.round(vh * estimated));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [isMobile]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;
    mouseX.set(x - 0.5);
    mouseY.set(y - 0.5);
  };

  interface SkillPos {
    x: number;
    y: number;
    offset: number;
    rotation: number;
    id: number;
  }

  const skillPositions = useMemo<SkillPos[]>(() => {
    return skills.map((_, i) => {
      const angle = i * 137.5 * (Math.PI / 180);
      const minRadius = isMobile ? 12 : 8;
      const maxRadius = isMobile ? 40 : 35;
      const radius = minRadius + ((i % 5) * (maxRadius - minRadius)) / 5;
      const x = 50 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius;
      return {
        x,
        y,
        offset: i / skills.length,
        rotation: ((i * 15) % 60) - 30,
        id: i,
      };
    });
  }, [isMobile]);

  return (
    <section
      ref={containerRef}
      className={`relative w-dvw left-[50%] -translate-x-1/2 overflow-visible`}
      style={{ height: sectionHeight ? `${sectionHeight}px` : (isMobile ? "200vh" : "400vh") }}
      onMouseMove={isMobile ? undefined : handleMouseMove}
    >
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden">
        {mounted && (
          <>
            <motion.div
              style={{ opacity: titleOpacity, scale: titleScale }}
              className="pointer-events-none relative z-20 flex flex-col items-center text-center px-4 w-full"
            >
              <p className="mb-3 sm:mb-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.5em] text-blue-400/60">
                Technology Odyssey
              </p>
              <h2 className="text-4xl sm:text-7xl md:text-8xl font-bold tracking-tighter text-white w-full">
                Skill Universe
              </h2>
              <p className="mt-4 sm:mt-6 mx-auto max-w-lg text-xs sm:text-base text-slate-400 leading-relaxed">
                A dynamic journey through my technical stack. Scroll to explore
                the constellation.
              </p>
            </motion.div>

            <div className="absolute inset-0 z-10 perspective-1000">
              {skills.map((skill, i) => (
                <SkillItem
                  key={skill.name}
                  skill={skill}
                  pos={skillPositions[i]}
                  mouseX={smoothMouseX}
                  mouseY={smoothMouseY}
                  scrollYProgress={scrollYProgress}
                  isMobile={isMobile}
                />
              ))}
            </div>

            <motion.div
              style={{ opacity: titleOpacity }}
              className="absolute bottom-6 sm:bottom-10 flex items-center gap-3 sm:gap-4 text-[8px] sm:text-[9px] font-bold tracking-[0.3em] text-slate-500"
            >
              <span className="text-blue-500/60">01</span>
              <div className="h-px w-16 sm:w-24 bg-slate-800 relative">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-blue-500/40"
                  style={{ width: progressWidth }}
                />
              </div>
              <span>Universe Explore</span>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}

interface SkillItemProps {
  skill: Skill;
  pos: { x: number; y: number; offset: number; rotation: number; id: number };
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
  isMobile: boolean;
}

function SkillItem({
  skill,
  pos,
  mouseX,
  mouseY,
  scrollYProgress,
  isMobile,
}: SkillItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const zProgress = useTransform(scrollYProgress, (val) => {
    const universeProgress = Math.min(val / 0.8, 1);
    return (universeProgress + pos.offset) % 1;
  });

  const universeOpacity = useTransform(scrollYProgress, [0.4, 0.5], [1, 0]);

  const baseScale = useTransform(
    zProgress,
    [0, 0.2, 0.6, 0.9, 1],
    [isMobile ? 0.45 : 0.7, isMobile ? 0.85 : 1.0, isMobile ? 1.1 : 1.6, isMobile ? 2.2 : 3.4, isMobile ? 3.2 : 6],
  );
  const hoverScale = useTransform(baseScale, (s) => (s as number) * 1.4);

  const opacity = useTransform<number | number[], number>(
    [zProgress, universeOpacity],
    (values) => {
      const [z, u] = (Array.isArray(values) ? values : [values, 1]) as [number, number];
      const baseOp = z < 0.05 ? z / 0.05 : z > 0.8 ? (1 - z) / 0.2 : 1;
      return baseOp * u;
    },
  );

  const blur = useTransform(
    zProgress,
    [0, 0.2, 0.7, 0.95],
    ["1px", "0px", "0px", "2px"],
  );

  const xPos = useTransform(
    zProgress,
    [0, 1],
    [pos.x, pos.x + (pos.x - 50) * (isMobile ? 1.2 : 1.8)],
  );
  const yPos = useTransform(
    zProgress,
    [0, 1],
    [pos.y, pos.y + (pos.y - 50) * (isMobile ? 1.2 : 1.8)],
  );

  const left = useTransform(xPos, (v) => `${v}%`);
  const top = useTransform(yPos, (v) => `${v}%`);

  const mouseMoveX = useTransform(
    [mouseX, zProgress],
    ([mx, z]) => (mx as number) * (z as number) * (isMobile ? 20 : 60),
  );
  const mouseMoveY = useTransform(
    [mouseY, zProgress],
    ([my, z]) => (my as number) * (z as number) * (isMobile ? 20 : 60),
  );

  const zIndex = useTransform(zProgress, (v) => Math.round(v * 100));

  return (
    <motion.div
      className="absolute flex flex-col items-center justify-center group"
      style={{
        left,
        top,
        x: mouseMoveX,
        y: mouseMoveY,
        opacity,
        scale: isHovered ? hoverScale : baseScale,
        filter: blur,
        zIndex,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => isMobile && setIsHovered(!isHovered)}
    >
      <div className={`relative flex items-center justify-center ${isMobile ? 'p-2' : 'p-3 sm:p-4'} rounded-xl sm:rounded-2xl bg-slate-900/40 border border-slate-800/50 backdrop-blur-sm transition-all duration-300 group-hover:bg-blue-500/20 group-hover:border-blue-400/40 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]`}>
        <Icon
          icon={skill.icon}
          className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6 sm:h-8 sm:w-8'} text-white/70 transition-colors duration-300 group-hover:text-white`}
        />
        <motion.div
          className="absolute -bottom-10 sm:-bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-blue-600 px-2 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-white shadow-2xl pointer-events-none z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8,
            y: isHovered ? 0 : 5,
          }}
        >
          {skill.name}
        </motion.div>
      </div>
    </motion.div>
  );
}
