"use client";
import RollText from "@/components/portfolio/RollText";

import { useState, useEffect, useRef, type CSSProperties } from "react";
import { Icon } from "@iconify/react";
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
const categories = ["Frontend", "Backend", "Database", "DevOps & Systems", "Tools & Platforms"];
const descriptions = [
  "Interfaces, interactions and everything you see.",
  "The logic and services behind the experience.",
  "Where data finds its structure.",
  "From local development to running in production.",
  "The tools that make the everyday workflow work.",
];

export default function SkillsShowcase() {
  const [category, setCategory] = useState("Frontend");
  const [selected, setSelected] = useState("React");
  const root = useRef<HTMLElement>(null);
  const visibleSkills = skills.filter((skill) => skill.category === category);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (root.current)
        root.current.dataset.visible = String(entry.isIntersecting && !document.hidden);
    });
    const visibility = () => {
      if (root.current && document.hidden) root.current.dataset.visible = "false";
      else if (root.current) {
        observer.unobserve(root.current);
        observer.observe(root.current);
      }
    };
    if (root.current) observer.observe(root.current);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  return (
    <section
      ref={root}
      className="skill-universe constellation"
      aria-labelledby="skills-heading"
      data-enter
    >
      <div className="skill-heading">
        <div>
          <p className="eyebrow">02 / {skills.length} tools. Five disciplines.</p>
          <h2 id="skills-heading">
            MY SKILL
            <br />
            <span>UNIVERSE.</span>
          </h2>
        </div>
        <p>
          Pick a discipline. Explore its orbit.
          <br />
          The tools I use to turn ideas into things.
        </p>
      </div>
      <div className="constellation-layout">
        <div
          className="constellation-categories"
          role="group"
          aria-label="Choose a skill discipline"
        >
          {categories.map((item, index) => (
            <button
              type="button"
              key={item}
              aria-pressed={category === item}
              onClick={() => {
                setCategory(item);
                setSelected(skills.find((skill) => skill.category === item)!.name);
              }}
            >
              <span className="eyebrow">0{index + 1}</span>
              <RollText>{item}</RollText>
              <span aria-hidden="true">{category === item ? "−" : "+"}</span>
            </button>
          ))}
          <p key={category} className="category-copy">
            {descriptions[categories.indexOf(category)]}
          </p>
        </div>
        <div className="constellation-scene">
          <div className="constellation-rings" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="constellation-center">
            <span className="eyebrow">Exploring / {category}</span>
            <strong aria-live="polite">
              <span key={selected} className="skill-focus-name">
                {selected}
              </span>
            </strong>
            <span>Choose a technology to bring it into focus.</span>
          </div>
          <ul
            key={category}
            className="constellation-nodes"
            aria-label={`${category} technologies`}
          >
            {visibleSkills.map((skill, index) => {
              const angle = (index / visibleSkills.length) * Math.PI * 2 - Math.PI / 2;
              return (
                <li
                  key={skill.name}
                  style={
                    {
                      "--orbit-delay": -(index / visibleSkills.length) * 90 - 67.5 + "s",
                      "--arrival-delay": `${index * 28}ms`,
                      "--node-x": `${50 + Math.cos(angle) * 40}%`,
                      "--node-y": `${50 + Math.sin(angle) * 39}%`,
                    } as CSSProperties
                  }
                >
                  <button
                    type="button"
                    aria-pressed={selected === skill.name}
                    onClick={() => setSelected(skill.name)}
                  >
                    <Icon
                      icon={skill.icon}
                      width={32}
                      height={32}
                      aria-hidden="true"
                      className={
                        ["Framer Motion", "Prisma", "Vercel"].includes(skill.name)
                          ? "skill-icon-light"
                          : undefined
                      }
                    />
                    <span>{skill.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <span className="constellation-caption eyebrow">
            {visibleSkills.length} technologies in this orbit
          </span>
        </div>
      </div>
      <details className="complete-toolkit">
        <summary>
          View the complete toolkit <span>{skills.length} technologies / +</span>
        </summary>
        <div>
          {categories.map((item) => (
            <section key={item}>
              <h3>{item}</h3>
              <p>
                {skills
                  .filter((skill) => skill.category === item)
                  .map((skill) => skill.name)
                  .join(" · ")}
              </p>
            </section>
          ))}
        </div>
      </details>
    </section>
  );
}
