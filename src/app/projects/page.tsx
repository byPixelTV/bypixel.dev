import BackgroundLayout from '@/components/BackgroundLayout';
import Navbar from '@/components/Navbar';
import ProjectCard, { Project } from '@/components/ProjectCard';
import { Metadata } from 'next';

const projects: Record<string, Project> = {
  eramc: {
    title: 'EraMC',
    description:
      'The next era Minecraft server ⚡. We are a community‑driven Minecraft server that focuses on providing a unique and engaging experience for players. Our server features custom plugins, a friendly community, and regular events to keep the gameplay fresh and exciting. We focus on smp, pvp and minigames.',
    link: 'https://discord.gg/eramc',
    image: '/projects/eramc.png',
    date: '2025 – present',
    tech: {
      kotlin: { icon: 'simple-icons:kotlin', name: 'Kotlin' },
      velocity: { icon: 'simple-icons:velocity', name: 'Velocity' },
      redis: { icon: 'devicon-plain:redis', name: 'Redis' },
      mariadb: { icon: 'simple-icons:mariadb', name: 'MariaDB' },
      postgres: { icon: 'simple-icons:postgresql', name: 'PostgreSQL' },
      gradle: { icon: 'simple-icons:gradle', name: 'Gradle' },
      docker: { icon: 'mdi:docker', name: 'Docker' },
      minecraft: { icon: 'mdi:minecraft', name: 'Minecraft' },
      other: { icon: 'basil:other-1-outline', name: 'Other' },
    },
  },
  skydinse: {
    title: 'Skydinse',
    description:
      'A Minecraft server that focuses on providing a unique and engaging experience for players.',
    link: 'https://skydinse.net',
    image: '/projects/skydinse.png',
    date: '2024',
    tech: {
      velocity: { icon: 'simple-icons:velocity', name: 'Velocity' },
      redis: { icon: 'devicon-plain:redis', name: 'Redis' },
      mariadb: { icon: 'simple-icons:mariadb', name: 'MariaDB' },
      skript: { icon: 'streamline-plump:script-2', name: 'Skript' },
      minecraft: { icon: 'mdi:minecraft', name: 'Minecraft' },
      other: { icon: 'basil:other-1-outline', name: 'Other' },
    },
  },
  redivelocity: {
    title: 'RediVelocity',
    description:
      'A Velocity plugin that allows users to sync data between multiple proxies. Useful for large networks working with multiple proxies. Uses Redis to store data and allows for fast and efficient data syncing.',
    link: 'https://github.com/byPixelTV/RediVelocity',
    image: '/projects/redivelocity.png',
    date: '2024 – present',
    tech: {
      velocity: { icon: 'simple-icons:velocity', name: 'Velocity' },
      redis: { icon: 'devicon-plain:redis', name: 'Redis' },
      minecraft: { icon: 'mdi:minecraft', name: 'Minecraft' },
    },
  },
  skredis: {
    title: 'SkRedis',
    description:
      'A Skript addon that allows users to use Redis in their Skript scripts.',
    link: 'https://github.com/byPixelTV/SkRedis',
    image: '/projects/skredis.png',
    date: '2024 – present',
    tech: {
      skript: { icon: 'streamline-plump:script-2', name: 'Skript' },
      redis: { icon: 'devicon-plain:redis', name: 'Redis' },
      minecraft: { icon: 'mdi:minecraft', name: 'Minecraft' },
    },
  },
};

export const metadata: Metadata = {
  title: "Projects | byPixelTV – Software Developer",
  description: "Showcasing my projects and contributions.",
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
    url: "https://bypixel.dev/",
    title: "Projects",
    description: "Showcasing my projects and contributions.",
    images: ["/assets/logo/256x.png"],
    siteName: "byPixelTV — Software Developer",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ProjectsPage() {
  return (
    <BackgroundLayout>
      <Navbar />

      <div className="container mx-auto px-4 py-16 my-[100px]">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">My Projects</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            A collection of projects I&apos;ve worked on, ranging from Minecraft servers to plugins and tools.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {Object.values(projects).map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </BackgroundLayout>
  );
}
