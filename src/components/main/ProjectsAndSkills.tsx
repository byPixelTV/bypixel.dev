"use client";

import React from "react";
import { IoBriefcaseOutline } from "react-icons/io5";
import { LuTerminal, LuArrowUpRight } from "react-icons/lu";
import Image from "next/image";
import { motion } from "framer-motion";
import { Project } from "@/lib/schema/project";
import { Skill } from "@/lib/schema/skill";
import { Icon } from "@iconify/react";

const STATUS_COLORS: Record<string, string> = {
  now: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  default: "bg-purple-500/10 text-purple-300 border-purple-500/20",
};

const ProjectsAndSkills = ({
  projects,
  skills,
}: {
  projects: Project[];
  skills: Skill[];
}) => {
  // Group skills by category for desktop view
  const skillCategories = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category ?? "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});
  const categoryOrder = ["Frontend", "Backend", "Database", "DevOps & Systems", "Tools & Platforms"];
  const orderedCategories = [
    ...categoryOrder.filter((c) => skillCategories[c]),
    ...Object.keys(skillCategories).filter((c) => !categoryOrder.includes(c)),
  ];

  return (
    <div className="mt-8 flex flex-col gap-6">
      {/* ── Projects ── */}
      <motion.div
        className="p-4 md:p-6 rounded-3xl border border-[#333] bg-[#111111]"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="text-white uppercase tracking-wider flex gap-3 items-center">
          <span className="p-1.5 rounded-md">
            <IoBriefcaseOutline size={20} color="#FFFFFF" />
          </span>
          Projects
        </div>
        <p className="text-sm mt-2 text-[#888]">
          Projects I&apos;ve built or contributed to.
        </p>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {projects?.map((project, i) => (
            <motion.div
              key={i}
              className="group flex gap-3 p-3 rounded-2xl border border-[#222] bg-[#161616] hover:border-purple-900/60 hover:bg-[#18121f] transition-colors duration-200"
              initial={{ x: -8, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.45 + i * 0.07, duration: 0.35 }}
            >
              <Image
                src={project.imagePath}
                alt={project.name}
                width={52}
                height={52}
                className="h-12 w-12 shrink-0 object-cover rounded-xl bg-[#222] border border-[#333] mt-0.5"
              />
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-white truncate">{project.name}</span>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 p-1 rounded-lg text-[#666] hover:text-white hover:bg-white/10 transition-colors"
                      title="Visit"
                    >
                      <LuArrowUpRight size={15} />
                    </a>
                  )}
                </div>
                <p className="text-xs text-purple-300/80 mt-0.5 truncate">{project.role}</p>
                <p className="text-xs text-[#666] mt-0.5">
                  {project.startAt} – {project.endAt ?? "now"}
                </p>
                {project.description && (
                  <p className="text-xs text-[#999] mt-1.5 leading-relaxed">
                    {project.description}
                  </p>
                )}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md border ${
                          tag.toLowerCase() === "active" || tag.toLowerCase() === "wip"
                            ? STATUS_COLORS.now
                            : STATUS_COLORS.default
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Skills ── */}
      <motion.div
        className="p-4 md:p-6 rounded-3xl border border-[#333] bg-[#111111]"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="text-white uppercase tracking-wider flex gap-3 items-center">
          <span className="p-1.5 rounded-md">
            <LuTerminal size={20} color="#FFFFFF" />
          </span>
          Skills
        </div>
        <p className="text-sm mt-2 text-[#888]">
          Tools &amp; frameworks I work with — not limited to.
        </p>

        <div className="flex flex-col gap-5 mt-5">
          {orderedCategories.map((category) => {
            const catSkills = skillCategories[category] ?? [];
            return (
              <div key={category}>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-purple-400/70">
                  {category}
                </span>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 mt-2">
                  {catSkills.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#161616] border border-[#2a2a2a] hover:border-purple-800/60 hover:bg-[#1c1228] transition-colors duration-150 cursor-default"
                    >
                      <Icon icon={skill.icon} className="w-7 h-7 shrink-0" />
                      <span className="text-[11px] text-[#aaa] text-center leading-tight w-full truncate px-0.5">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectsAndSkills;
