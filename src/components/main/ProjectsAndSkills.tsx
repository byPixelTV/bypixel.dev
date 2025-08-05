"use client";

import React from "react";
import { IoBriefcaseOutline } from "react-icons/io5";
import { LuTerminal } from "react-icons/lu";
import Image from "next/image";
import { motion } from "framer-motion";
import { Project } from "@/lib/schema/project";
import { Skill } from "@/lib/schema/skill";
import { Button } from "../ui/button";
import SkillScroller from "./SkillScroller";

const ProjectsAndSkills = ({
  projects,
  skills,
}: {
  projects: Project[];
  skills: Skill[];
}) => {
  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        className="p-4 md:p-6 rounded-3xl border border-[#333] bg-[#111111]"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div>
          <div className="text-white uppercase tracking-wider flex gap-3 items-center">
            <span className="p-1.5 rounded-md">
              <IoBriefcaseOutline size={20} color="#FFFFFF" />
            </span>
            Projects
          </div>
          <p className="sm:text-lg mt-4 text-white">
            Projects I have worked on
          </p>
          {projects?.map((project, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 ${i === 0 ? "mt-6" : "mt-3"}`}
            >
              <Image
                src={project.imagePath}
                alt={project.name}
                width={64}
                height={64}
                className="h-16 w-16 object-cover rounded-md bg-[#333] border border-[#333]"
              />
              <div className="flex w-full flex-col">
                <p className="hidden sm:block font-medium text-white">
                  {project.name}
                </p>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex flex-col">
                    <p className="text-sm text-white">{project.role}</p>
                    <p className="text-sm text-white">
                      {project.startAt} - {project.endAt}
                    </p>
                  </div>
                  {project.url && (
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div
        className="p-4 md:p-6 rounded-3xl border border-[#333] bg-[#111111]"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div>
          <div className="text-white uppercase tracking-wider flex gap-3 items-center">
            <span className="p-1.5 rounded-md">
              <LuTerminal size={20} color="#FFFFFF" />
            </span>
            Skills
          </div>
          <p className="sm:text-lg mt-4 text-white">
            I&apos;ve worked with the following tools & frameworks, but not
            limited to.
          </p>

          {/* Mobile/Tablet view - single scrolling row */}
          <div className="mt-6 overflow-hidden hidden sm:flex lg:hidden">
            <SkillScroller skills={skills} duration={60} isMobile />
          </div>

          {/* Desktop view - multiple rows */}
          <div className="flex sm:hidden lg:flex flex-col space-y-2 mt-6">
            {(() => {
              if (!skills?.length) return null;

              const numRows = 3;
              const skillsPerRow = Math.ceil(skills.length / numRows);

              return Array.from({ length: numRows }, (_, rowIndex) => {
                const startIndex = rowIndex * skillsPerRow;
                const endIndex = Math.min(
                  startIndex + skillsPerRow,
                  skills.length
                );
                const rowSkills = skills.slice(startIndex, endIndex);
                if (rowSkills.length === 0) return null;
                const isReverse = rowIndex % 2 === 1;

                return (
                  <SkillScroller
                    key={rowIndex}
                    skills={rowSkills}
                    duration={60}
                    reverse={isReverse}
                  />
                );
              }).filter(Boolean);
            })()}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectsAndSkills;
