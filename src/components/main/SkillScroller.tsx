import { Skill } from "@/lib/schema/skill";
import { useState, useCallback } from "react";
import { Icon } from "@iconify/react";

type SkillScrollerProps = {
  skills: Skill[];
  duration?: number;
  reverse?: boolean;
  className?: string;
  isMobile?: boolean;
};

const SkillScroller: React.FC<SkillScrollerProps> = ({
  skills,
  duration = 60,
  reverse = false,
  className = "",
  isMobile = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);


  const content = isMobile
    ? skills
    : 
      [...skills, ...skills, ...skills, ...skills];

  const animationDirection = reverse ? "reverse" : "normal";

  return (
    <div
      className={`overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="flex min-w-full shrink-0 space-x-4 py-2 w-max flex-nowrap"
        style={{
          animation: `scroll ${duration}s ${animationDirection} linear infinite`,
          animationPlayState: isHovered ? "paused" : "running",
        }}
      >
        {content.map((skill, i) => (
          <div
            key={`${reverse ? "rev" : "fwd"}-${i}`}
            className="flex flex-shrink-0 max-w-full relative justify-center items-center border space-x-1 bg-[#F4F0E6] p-2 text-sm rounded-md shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
          >
            <Icon icon={skill.icon} className="w-4 h-4" />
            <span className="text-black">{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SkillScroller;