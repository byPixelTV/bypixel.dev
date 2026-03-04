import BackgroundLayout from "@/components/BackgroundLayout";
import Profile from "@/components/main/Profile";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";
import ProjectsAndSkills from "@/components/main/ProjectsAndSkills";
import CodingJourney from "@/components/main/CodingJourney";
import EraMCShowcase from "@/components/main/EraMCShowcase";
import GithubStatsCard from "@/components/main/GithubStatsCard";
import { fetchGithubContributions } from "@/lib/github/contributions";
import { Project } from "@/lib/schema/project";

export const metadata: Metadata = {
  title: "Home | byPixelTV – Software Developer",
  description: "My personal website used as a portfolio and blog.",
  keywords: [
    "bypixeltv",
    "bypixel", 
    "software developer",
    "web developer",
    "blog",
    "programming",
    "coding",
    "tutorials",
    "technology",
    "development",
    "nextjs",
    "bypixel.dev"
  ],
  authors: [{ name: "byPixelTV" }],
  openGraph: {
    siteName: "byPixelTV — Software Developer",
    images: [
      {
        url: "/assets/logo/256x.png",
        width: 256,
        height: 256,
        alt: "byPixelTV Logo"
      }
    ],
    title: "Home",
    description: "Welcome to my personal website, a portfolio and blog showcasing my work as a software developer. Explore my projects, tutorials, and insights into the world of programming. Join me on this journey of coding and creativity!",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Home | byPixelTV – Software Developer",
    description: "My personal website used as a portfolio and blog.",
    images: ["/assets/logo/256x.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const projects: Project[] = [
  {
    name: "EraMC",
    imagePath: "/projects/eramc.png",
    role: "Founder, Developer & Sys Admin",
    description: "Custom Minecraft smp, pvp and mmorpg network — built bespoke plugins, a web dashboard and the full server infrastructure from scratch.",
    tags: ["Minecraft", "Backend", "Web", "Linux", "Active"],
    startAt: "May 2025",
    endAt: "now",
    url: "https://dc.eramc.net",
  },
  {
    name: "BetterAttack",
    imagePath: "/projects/betterattack.webp",
    role: "Sys Admin, Developer & Administrator",
    description: "Minecraft CraftAttack like survival server — plugin development, infrastructure setup and full administration.",
    tags: ["Minecraft", "Backend", "Linux", "Active"],
    startAt: "October 2025",
    endAt: "now",
    url: "https://discord.gg/betterattack",
  },
  {
    name: "Dat Bot",
    imagePath: "/projects/datbot.png",
    role: "Web Developer",
    description: "Feature-rich Discord bot paired with a Next.js web dashboard — moderation, stats and integrations.",
    tags: ["TypeScript", "Next.js", "Discord.js", "Web"],
    startAt: "October 2024",
    endAt: "January 2026",
    url: "https://datbot.xyz",
  },
  {
    name: "DaniSMP",
    imagePath: "/projects/danismp.png",
    role: "Sys Admin, Developer & Administrator",
    description: "One of the biggest german Minecraft sword SMP servers — plugin development, infrastructure setup and full administration.",
    tags: ["Minecraft", "Backend", "Linux"],
    startAt: "February 2025",
    endAt: "May 2025",
    url: "https://discord.gg/danismp",
  },
  {
    name: "Skydinse",
    imagePath: "/projects/skydinse.png",
    role: "Developer",
    description: "Minecraft minigame network — developed gameplay skripts and managed server infrastructure with Skript.",
    tags: ["Minecraft", "Kotlin", "Skript"],
    startAt: "April 2024",
    endAt: "Juli 2025",
    url: "https://skydinse.net",
  },
];

const skills = [
  // Frontend
  { name: "HTML", icon: "vscode-icons:file-type-html", category: "Frontend" },
  { name: "CSS", icon: "vscode-icons:file-type-css", category: "Frontend" },
  { name: "JavaScript", icon: "logos:javascript", category: "Frontend" },
  { name: "TypeScript", icon: "logos:typescript-icon", category: "Frontend" },
  { name: "React", icon: "logos:react", category: "Frontend" },
  { name: "Next.js", icon: "logos:nextjs-icon", category: "Frontend" },
  { name: "Vue", icon: "vscode-icons:file-type-vue", category: "Frontend" },
  { name: "Nuxt", icon: "vscode-icons:file-type-nuxt", category: "Frontend" },
  { name: "Tailwind CSS", icon: "logos:tailwindcss-icon", category: "Frontend" },
  { name: "Framer Motion", icon: "devicon:framermotion", category: "Frontend" },

  // Backend
  { name: "Java", icon: "vscode-icons:file-type-java", category: "Backend" },
  { name: "Kotlin", icon: "vscode-icons:file-type-kotlin", category: "Backend" },
  { name: "Node.js", icon: "logos:nodejs-icon", category: "Backend" },
  { name: "Python", icon: "vscode-icons:file-type-python", category: "Backend" },
  { name: "Spring", icon: "devicon:spring", category: "Backend" },
  { name: "Gradle", icon: "file-icons:gradle", category: "Backend" },
  { name: "Maven", icon: "vscode-icons:file-type-maven", category: "Backend" },
  { name: "Appwrite", icon: "devicon:appwrite", category: "Backend" },
  { name: "Ktor", icon: "devicon:ktor", category: "Backend" },
  { name: "gRPC", icon: "devicon:grpc", category: "Backend" },

  // Database
  { name: "MySQL", icon: "logos:mysql", category: "Database" },
  { name: "MariaDB", icon: "vscode-icons:file-type-mariadb", category: "Database" },
  { name: "SQLite", icon: "vscode-icons:file-type-sqlite", category: "Database" },
  { name: "PostgreSQL", icon: "logos:postgresql", category: "Database" },
  { name: "MongoDB", icon: "logos:mongodb-icon", category: "Database" },
  { name: "Redis", icon: "logos:redis", category: "Database" },
  { name: "Prisma", icon: "logos:prisma", category: "Database" },
  { name: "Clickhouse", icon: "simple-icons:clickhouse", category: "Database" },
  { name: "InfluxDB", icon: "simple-icons:influxdb", category: "Database" },

  // DevOps & Systems
  { name: "Linux", icon: "flat-color-icons:linux", category: "DevOps & Systems" },
  { name: "Git", icon: "logos:git-icon", category: "DevOps & Systems" },
  { name: "Docker", icon: "logos:docker-icon", category: "DevOps & Systems" },
  { name: "Nginx", icon: "vscode-icons:file-type-nginx", category: "DevOps & Systems" },
  { name: "Nginx Proxy Manager", icon: "simple-icons:nginxproxymanager", category: "DevOps & Systems" },
  { name: "Vercel", icon: "logos:vercel-icon", category: "DevOps & Systems" },

  // Tools & Platforms
  { name: "VS Code", icon: "vscode-icons:file-type-vscode", category: "Tools & Platforms" },
  { name: "IntelliJ", icon: "devicon:intellij", category: "Tools & Platforms" },
  { name: "WebStorm", icon: "devicon:webstorm", category: "Tools & Platforms" },
  { name: "PyCharm", icon: "devicon:pycharm", category: "Tools & Platforms" },
  { name: "GoLand", icon: "devicon:goland", category: "Tools & Platforms" },
  { name: "DataGrip", icon: "devicon:datagrip", category: "Tools & Platforms" },
  { name: "Grafana", icon: "devicon:grafana", category: "Tools & Platforms" },
  { name: "Postman", icon: "devicon:postman", category: "Tools & Platforms" },
];

export default async function About() {
  const githubContributions = await fetchGithubContributions();

  return (
    <BackgroundLayout>
      <Navbar />
      <main className="max-w-5xl mx-auto px-5 pt-16 md:pt-18 lg:pt-20 mb-10">
        <Profile />
        <ProjectsAndSkills projects={projects} skills={skills} />
        <div className="mt-6">
          <EraMCShowcase />
        </div>
        <div className="mt-6">
          <CodingJourney />
        </div>
        <GithubStatsCard data={githubContributions} />
      </main>
      <footer className="max-w-5xl mx-auto px-5 pb-8 text-center text-sm text-muted-foreground">
        <p className="text-white">powered by 100% ai code</p>
        <a
          href="https://github.com/byPixelTV/bypixel.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          source on github
        </a>
      </footer>
    </BackgroundLayout>
  );
}