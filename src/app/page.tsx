import BackgroundLayout from "@/components/BackgroundLayout";
import Profile from "@/components/main/Profile";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";
import ProjectsAndSkills from "@/components/main/ProjectsAndSkills";
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
    name: "Dat Bot",
    imagePath: "/projects/datbot.png",
    role : "Developer",
    startAt: "October 2024",
    endAt: "now",
    url: "https://datbot.xyz",
  },
  {
    name: "EraMC",
    imagePath: "/projects/eramc.png",
    role : "Founder & Developer",
    startAt: "May 2025",
    endAt: "July 2025 (abandoned)",
  },
  {
    name: "Skydinse",
    imagePath: "/projects/skydinse.png",
    role : "Developer",
    startAt: "April 2024",
    endAt: "Juli 2025",
    url: "https://skydinse.net",
  },
];

const skills = [
  // Frontend
  { name: "HTML", icon: "vscode-icons:file-type-html" },
  { name: "CSS", icon: "vscode-icons:file-type-css" },
  { name: "JavaScript", icon: "logos:javascript" }, 
  { name: "TypeScript", icon: "logos:typescript-icon" }, 
  { name: "React", icon: "logos:react" }, 
  { name: "Next.js", icon: "logos:nextjs-icon" }, 
  { name: "Vue", icon: "vscode-icons:file-type-vue" },
  { name: "Nuxt", icon: "vscode-icons:file-type-nuxt" },
  { name: "Tailwind CSS", icon: "logos:tailwindcss-icon" }, 
  { name: "Framer Motion", icon: "devicon:framermotion" }, 
  
  // Backend
  { name: "Java", icon: "vscode-icons:file-type-java" },
  { name: "Kotlin", icon: "vscode-icons:file-type-kotlin" },
  { name: "Node.js", icon: "logos:nodejs-icon" }, 
  { name: "Python", icon: "vscode-icons:file-type-python" },
  { name: "Spring", icon: "devicon:spring" },
  { name: "Gradle", icon: "file-icons:gradle" },
  { name: "Maven", icon: "vscode-icons:file-type-maven" },
  { name: "Appwrite", icon: "devicon:appwrite" },
  
  // Database
  { name: "MySQL", icon: "logos:mysql" }, 
  { name: "MariaDB", icon: "vscode-icons:file-type-mariadb" },
  { name: "SQLite", icon: "vscode-icons:file-type-sqlite" },
  { name: "PostgreSQL", icon: "logos:postgresql" }, 
  { name: "MongoDB", icon: "logos:mongodb-icon" }, 
  { name: "Redis", icon: "logos:redis" }, 
  
  // DevOps & Systems
  { name: "Linux", icon: "flat-color-icons:linux" },
  { name: "Git", icon: "logos:git-icon" }, 
  { name: "Docker", icon: "logos:docker-icon" }, 
  { name: "Nginx", icon: "vscode-icons:file-type-nginx" },
  { name: "Nginx Proxy Manager", icon: "simple-icons:nginxproxymanager" },
  { name: "Vercel", icon: "logos:vercel-icon" }, 
  
  // Tools & Platforms
  { name: "VS Code", icon: "vscode-icons:file-type-vscode" },
  { name: "IntelliJ", icon: "devicon:intellij" },
  { name: "WebStorm", icon: "devicon:webstorm" },
  { name: "PyCharm", icon: "devicon:pycharm" },
  { name: "DataGrip", icon: "devicon:datagrip" },
  { name: "Grafana", icon: "devicon:grafana" },
  { name: "Prometheus", icon: "devicon:prometheus" },
  { name: "Postman", icon: "devicon:postman" },
];

export default function About() {
  return (
    <BackgroundLayout>
      <Navbar />
      <main className="max-w-5xl mx-auto px-5 pt-16 md:pt-18 lg:pt-20 mb-10">
        <Profile />
        <ProjectsAndSkills projects={projects} skills={skills} />
      </main>
    </BackgroundLayout>
  );
}