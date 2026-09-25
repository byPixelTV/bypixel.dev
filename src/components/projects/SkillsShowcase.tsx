"use client";
import ChapterTitle from "@/components/portfolio/ChapterTitle";
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

const skillNotes: Record<string, string> = {
  HTML: "Semantic structure that makes interfaces accessible and understandable.",
  CSS: "Responsive layouts, visual detail, and motion that feels natural.",
  JavaScript: "The interaction layer between an idea and a working interface.",
  TypeScript: "Typed application logic, from the browser to backend services.",
  React: "Reusable components and stateful, interactive interfaces.",
  "Next.js": "Full-stack React applications, including the Dat Bot dashboard.",
  Vue: "Reactive components for building interfaces with a compact API.",
  Nuxt: "Routing, rendering, and server features around Vue applications.",
  "Tailwind CSS": "A consistent visual system built directly into components.",
  "Framer Motion": "Transitions and interaction feedback in React interfaces.",
  Java: "JVM applications and the ecosystem behind Minecraft servers.",
  Kotlin: "Backend services and Minecraft plugins, including BetterAttack and EraMC.",
  "Node.js": "JavaScript beyond the browser: APIs, integrations, and tooling.",
  Python: "Scripts and automation that take repetitive work off the table.",
  Spring: "A foundation for structured JVM backend applications.",
  Gradle: "Dependency management and repeatable builds for JVM projects.",
  Maven: "Building and managing dependencies in the Java ecosystem.",
  Appwrite: "Backend building blocks for authentication, storage, and data.",
  Ktor: "Lightweight HTTP services written in Kotlin.",
  gRPC: "Typed communication between services.",
  MySQL: "Relational storage for structured application data.",
  MariaDB: "An open-source relational database in the MySQL ecosystem.",
  SQLite: "An embedded database for applications that need local storage.",
  PostgreSQL: "Relational data with flexible queries and strong constraints.",
  MongoDB: "Document-based data storage, including this website's blog.",
  Redis: "Fast in-memory storage for caching and short-lived state.",
  Prisma: "Typed database access and schema management.",
  Clickhouse: "Column-oriented storage for analytical queries.",
  InfluxDB: "Time-series data, metrics, and measurements.",
  Linux: "The foundation of the server infrastructure I administer.",
  Git: "Version history, collaboration, and room to experiment.",
  Docker: "Reproducible environments packaged into containers.",
  Nginx: "Routing web traffic and serving applications behind a reverse proxy.",
  "Nginx Proxy Manager": "Managing proxy hosts and certificates through a web interface.",
  Vercel: "A deployment platform for web applications.",
  "VS Code": "An extensible editor for web development and everyday coding.",
  IntelliJ: "A development environment for Java and Kotlin projects.",
  WebStorm: "Tools for navigating and developing JavaScript applications.",
  PyCharm: "A focused environment for Python development.",
  GoLand: "Editing, navigating, and debugging Go applications.",
  DataGrip: "Exploring databases and working with SQL.",
  Grafana: "Dashboards that make infrastructure metrics easier to understand.",
  Postman: "Exploring endpoints and testing API requests.",
};
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
          <ChapterTitle id="skills-heading" lines={["MY SKILL", "UNIVERSE."]} />
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
      <div className="skill-insight" aria-live="polite" aria-atomic="true">
        <span className="eyebrow">In focus / {category}</span>
        <strong>{selected}</strong>
        <p>{skillNotes[selected]}</p>
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
