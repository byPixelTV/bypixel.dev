import BackgroundLayout from "@/components/BackgroundLayout";
import Navbar from "@/components/Navbar";
import { Icon } from "@iconify/react";
import { Metadata } from "next";
import * as motion from "motion/react-client"
import SkillsScrollDownButton from "@/components/extra/SkillsScrollDownButton";

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

const skillCategories = [
  {
    title: "Frontend",
    skills: [
      { name: "HTML", icon: "vscode-icons:file-type-html" },
      { name: "CSS", icon: "vscode-icons:file-type-css" },
      { name: "JavaScript", icon: "vscode-icons:file-type-js-official" },
      { name: "TypeScript", icon: "vscode-icons:file-type-typescript-official" },
      { name: "Next.js", icon: "vscode-icons:file-type-next" },
      { name: "Vue", icon: "vscode-icons:file-type-vue" },
      { name: "Nuxt", icon: "vscode-icons:file-type-nuxt" },
      { name: "Tailwind", icon: "vscode-icons:file-type-tailwind" }
    ]
  },
  {
    title: "Backend",
    skills: [
      { name: "Java", icon: "vscode-icons:file-type-java" },
      { name: "Kotlin", icon: "vscode-icons:file-type-kotlin" },
      { name: "Node.js", icon: "vscode-icons:file-type-node" },
      { name: "Python", icon: "vscode-icons:file-type-python" },
      { name: "Spring", icon: "devicon:spring" },
      { name: "Gradle", icon: "vscode-icons:file-type-gradle" },
      { name: "Maven", icon: "vscode-icons:file-type-maven" },
      { name: "Appwrite", icon: "devicon:appwrite" }
    ]
  },
  {
    title: "Database",
    skills: [
      { name: "MySQL", icon: "vscode-icons:file-type-mysql" },
      { name: "MariaDB", icon: "vscode-icons:file-type-mariadb" },
      { name: "SQLite", icon: "vscode-icons:file-type-sqlite" },
      { name: "PostgreSQL", icon: "vscode-icons:file-type-pgsql" },
      { name: "MongoDB", icon: "vscode-icons:file-type-mongo" },
      { name: "Redis", icon: "devicon:redis" }
    ]
  },
  {
    title: "DevOps & Systems",
    skills: [
      { name: "Linux", icon: "flat-color-icons:linux" },
      { name: "Docker", icon: "vscode-icons:file-type-docker2" },
      { name: "Nginx", icon: "vscode-icons:file-type-nginx" },
      { name: "Nginx Proxy Manager", icon: "simple-icons:nginxproxymanager" }
    ]
  },
  {
    title: "Tools & Platforms",
    skills: [
      { name: "VS Code", icon: "vscode-icons:file-type-vscode" },
      { name: "IntelliJ", icon: "devicon:intellij" },
      { name: "WebStorm", icon: "devicon:webstorm" },
      { name: "PyCharm", icon: "devicon:pycharm" },
      { name: "DataGrip", icon: "devicon:datagrip" },
      { name: "Grafana", icon: "devicon:grafana" },
      { name: "Prometheus", icon: "devicon:prometheus" },
      { name: "Postman", icon: "devicon:postman" }
    ]
  }
];

export default function Page() {
  return (
    <BackgroundLayout>
      <Navbar />
      
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-12">
          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-tight">
            byPixelTV
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl">
            Software Developer with 
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 ml-2">
              passion for code.
            </span>
          </p>

          {/* Social Buttons */}
          <div className="flex flex-col items-center space-y-6">
            <span className="text-white/70 font-medium text-lg uppercase tracking-wider">Connect</span>
            <div className="flex justify-center gap-4">
              <a 
                href="https://github.com/byPixelTV" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group p-4 bg-white/10 hover:bg-white/20 rounded-full border border-white/20 transition-all duration-300 hover:scale-110 hover:border-purple-500/50"
                aria-label="GitHub"
              >
                <Icon 
                  icon="mdi:github" 
                  className="w-8 h-8 text-white group-hover:text-purple-400 transition-colors duration-300" 
                />
              </a>
              <a 
                href="https://discord.gg/yVp7Qvhj9k" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group p-4 bg-white/10 hover:bg-white/20 rounded-full border border-white/20 transition-all duration-300 hover:scale-110 hover:border-purple-500/50"
                aria-label="Discord"
              >
                <Icon 
                  icon="ic:baseline-discord" 
                  className="w-8 h-8 text-white group-hover:text-purple-400 transition-colors duration-300" 
                />
              </a>
              <a 
                href="https://bsky.app/profile/bypixel.dev" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group p-4 bg-white/10 hover:bg-white/20 rounded-full border border-white/20 transition-all duration-300 hover:scale-110 hover:border-purple-500/50"
                aria-label="Bluesky"
              >
                <Icon 
                  icon="bi:bluesky" 
                  className="w-8 h-8 text-white group-hover:text-purple-400 transition-colors duration-300" 
                />
              </a>
            </div>
          </div>
        </div>

        {/* Animated Scroll Indicator */}
        <SkillsScrollDownButton />
      </div>
      
      {/* Skills Section */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20" id="skills">
        <div className="w-full max-w-6xl">
          {/* Section Title */}
          <div className="text-center mb-16 pt-24">
            <motion.h2 
              className="text-5xl md:text-6xl font-bold text-white mb-2 inline-block relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Skills & Technologies
              <motion.span
                className="absolute left-0 -bottom-1 h-1 bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 1.3, ease: "easeOut" }}
              />
            </motion.h2>
          </div>

          {/* Skills Grid - Wrapped in a single motion.div for synchronized animation */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ 
                  duration: 0.6, 
                  delay: categoryIndex * 0.1,
                  ease: "easeOut" 
                }}
              >
                <h3 className="text-xl font-semibold text-white mb-4 text-center">
                  {category.title}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex flex-col items-center p-3 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300 group"
                    >
                      <Icon 
                        icon={skill.icon} 
                        className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform duration-300" 
                      />
                      <span className="text-white/80 text-sm text-center group-hover:text-white transition-colors duration-300">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Source Code Link */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <a
              href="https://github.com/byPixelTV/bypixel.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 rounded-full text-white hover:text-purple-300 transition-all duration-300 group"
            >
              <Icon 
                icon="mdi:code-braces" 
                className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" 
              />
              <span className="font-medium">View Source Code</span>
              <Icon 
                icon="mdi:external-link" 
                className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" 
              />
            </a>
          </motion.div>
        </div>
      </div>
    </BackgroundLayout>
  );
}