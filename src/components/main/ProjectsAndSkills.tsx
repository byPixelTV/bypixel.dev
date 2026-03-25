"use client";

import { LuTerminal, LuArrowUpRight, LuWaypoints, LuChevronsDown } from "react-icons/lu";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Project } from "@/lib/schema/project";
import { Skill } from "@/lib/schema/skill";
import { Icon } from "@iconify/react";

const ProjectsAndSkills = ({
  projects,
  skills,
}: {
  projects: Project[];
  skills: Skill[];
}) => {
  const { scrollYProgress } = useScroll();
  const bridgeOpacity = useTransform(scrollYProgress, [0, 0.45, 1], [0.25, 1, 0.4]);
  const bridgeScale = useTransform(scrollYProgress, [0, 0.45, 1], [0.96, 1, 0.97]);
  const bridgeY = useTransform(scrollYProgress, [0, 1], [18, -6]);

  const secondaryProjects = projects.filter((project) => project.name.toLowerCase());
  const skillRows: Skill[][] = [[], [], []];
  skills.forEach((skill, index) => {
    skillRows[index % 3].push(skill);
  });

  return (
    <div id="projects" className="relative scroll-mt-28 flex flex-col gap-16">
      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">My Projects</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/55 sm:text-base">
            A selection of projects I built to solve real problems and improve my skills.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {secondaryProjects?.map((project, i) => (
            <motion.article
              key={project.name}
              className="group overflow-hidden rounded-2xl border border-white/12 bg-[#0b0c14]/80 transition-colors duration-200 hover:border-purple-400/45 hover:bg-[#101322]"
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 + i * 0.06, duration: 0.35 }}
            >
              <div className="relative aspect-16/9 overflow-hidden border-b border-white/10 bg-[#090a12]">
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="relative aspect-square w-full max-w-[220px] overflow-hidden rounded-2xl bg-[#0d0f18] ring-1 ring-white/10">
                    <Image
                      src={project.imagePath}
                      alt={project.name}
                      fill
                      sizes="(max-width: 1024px) 220px, 18vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold text-white truncate">{project.name}</h3>
                    <p className="mt-1 text-xs text-white/55 truncate">{project.role}</p>
                    <p className="mt-1 text-[11px] text-white/45 truncate">
                      {project.startAt} - {project.endAt ?? "Now"}
                    </p>
                  </div>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-white/12 p-1.5 text-white/65 transition-colors hover:border-purple-400/45 hover:text-white"
                      title="Visit"
                    >
                      <LuArrowUpRight size={15} />
                    </a>
                  )}
                </div>

                <p className="mt-3 text-sm leading-relaxed text-white/70">{project.description}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {Array.from(new Set([
                    ...(project.tags ?? []),
                    ...(project.endAt && project.endAt.toLowerCase() !== "now" ? ["Former Member"] : []),
                  ])).map((tag, i) => (
                    <span
                      key={`${tag}-${i}`}
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                        tag.toLowerCase() === "active" || tag.toLowerCase() === "wip"
                          ? "border-emerald-400/35 text-emerald-300"
                          : tag.toLowerCase() === "inactive" || tag.toLowerCase() === "discontinued"
                            ? "border-rose-400/40 text-rose-300"
                          : tag.toLowerCase() === "maintenance"
                            ? "border-amber-400/40 text-amber-300"
                            : tag.toLowerCase() === "primary"
                              ? "border-sky-400/45 text-sky-300"
                            : tag.toLowerCase() === "former member" || tag.toLowerCase() === "ex-team"
                              ? "border-slate-300/35 text-slate-200"
                              : "border-purple-400/30 text-purple-300"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

      </motion.section>

      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.45 }}
      >
        <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#0b0c14]/80 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 text-white uppercase tracking-wider">
                <span className="rounded-md p-1.5">
                  <LuTerminal size={20} color="#FFFFFF" />
                </span>
                Skills
              </div>
              <p className="mt-2 text-sm text-white/55">
                Core technologies I use regularly.
              </p>
            </div>
            <div className="rounded-full border border-white/12 px-3 py-1 text-[11px] text-white/60">
              {skills.length} tools in active rotation
            </div>
          </div>

          <div className="mt-6 space-y-3 overflow-hidden">
            {skillRows.map((row, rowIndex) => {
              const repeated = [...row, ...row];
              const isReverse = rowIndex === 1;
              const duration = 34 + rowIndex * 4;

              return (
                <div key={`skill-row-${rowIndex}`} className="relative overflow-hidden">
                  <div
                    className={`flex w-max gap-3 ${isReverse ? "skills-marquee-reverse" : "skills-marquee"}`}
                    style={{ animationDuration: `${duration}s` }}
                  >
                    {repeated.map((skill, i) => (
                      <div
                        key={`${skill.name}-${i}`}
                        className="group flex min-w-[136px] items-center gap-2 rounded-xl border border-white/10 bg-[#0b0c14]/76 px-3 py-2.5 transition-colors duration-200 hover:border-purple-400/45 hover:bg-[#111322]"
                      >
                        <Icon icon={skill.icon} className="h-4 w-4 shrink-0" />
                        <span className="truncate text-[11px] font-medium text-white/85">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-xl border border-purple-400/25 bg-linear-to-r from-[#161826] via-[#121423] to-[#0e101a] p-3.5 text-sm text-white/75">
            <div className="flex items-center gap-2">
              <LuWaypoints className="h-4 w-4 text-purple-200" />
              <span className="font-medium">These skills are reflected in the timeline below.</span>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="relative -mt-7 flex h-28 items-center justify-center">
        <motion.div
          className="pointer-events-none relative w-full max-w-[540px]"
          style={{ opacity: bridgeOpacity, scale: bridgeScale, y: bridgeY }}
        >
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-linear-to-r from-transparent via-white/35 to-transparent" />
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/12 bg-[#101320]/85 px-3 py-1 text-[11px] text-white/70 backdrop-blur-sm">
            <LuChevronsDown className="h-3.5 w-3.5 text-purple-200/90" />
            Continue to journey
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .skills-marquee {
          animation-name: skillsMarquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .skills-marquee-reverse {
          animation-name: skillsMarqueeReverse;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes skillsMarquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes skillsMarqueeReverse {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectsAndSkills;
