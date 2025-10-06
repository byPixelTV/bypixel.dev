import BackgroundLayout from "@/components/BackgroundLayout";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";
import { fetchReposUser } from "@/lib/github/github_util";
import ProjectsCard from "@/components/projects/ProjectCard";

export const metadata: Metadata = {
  title: "Projects | byPixelTV – Software Developer",
  description: "Overview of projects I that are available on GitHub.",
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
    "bypixel.dev",
    "blog",
  ],
  authors: [{ name: "byPixelTV" }],
  openGraph: {
    siteName: "byPixelTV — Software Developer",
    images: [
      {
        url: "/assets/logo/256x.png",
        width: 256,
        height: 256,
        alt: "byPixelTV Logo",
      },
    ],
    title: "Projects",
    description: "Overview of projects that are available on GitHub.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Projects | byPixelTV – Software Developer",
    description: "Overview of projects that are available on GitHub.",
    images: ["/assets/logo/256x.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const repos = await fetchReposUser(
    "byPixelTV",
    "projects",
    process.env.GITHUB_API_TOKEN
  );

  // Sort by stars descending
  const sortedRepos = repos.sort((a, b) => b.stars - a.stars);

  return (
    <>
      <Navbar />
      <BackgroundLayout>
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="container mx-auto px-4 py-16 mt-20">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                My GitHub Projects 🚀
              </h1>
            </div>
          </div>

          {sortedRepos.length === 0 ? (
            <p className="text-gray-400 text-center">No projects found 😢</p>
          ) : (
            <div
              className="
    grid 
    gap-6 
    grid-cols-1 
    sm:grid-cols-2 
    lg:grid-cols-3 
    xl:grid-cols-4
    auto-rows-fr
    w-full
    max-w-7xl
    mx-auto
  "
            >
              {sortedRepos.map((repo) => (
                <ProjectsCard key={repo.url} repo={repo} />
              ))}
            </div>
          )}
        </section>
      </BackgroundLayout>
    </>
  );
}
