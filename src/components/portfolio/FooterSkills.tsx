"use client";
import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { skills } from "@/lib/skills";

export default function FooterSkills() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let inView = false;
    const sync = () => {
      element.dataset.running = String(inView && !document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  return (
    <section id="skills" ref={root} className="footer-skills" aria-label="My development toolkit">
      <div className="footer-skills-window">
        <div className="footer-skills-track">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="footer-skills-group"
              aria-hidden={copy === 1 ? true : undefined}
            >
              {skills.map((skill) => (
                <li key={skill.name}>
                  <Icon icon={skill.icon} width={42} height={42} aria-hidden="true" />
                  <span className="sr-only">{skill.name}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
