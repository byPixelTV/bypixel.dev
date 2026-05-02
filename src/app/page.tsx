import BackgroundLayout from "@/components/BackgroundLayout";
import Navbar from "@/components/Navbar";
import Profile from "@/components/Profile";
import HorizontalGallery from "@/components/projects/ProjectsGalery";
import EraMCShowcase from "@/components/projects/EraMCShowcase";
import SkillsShowcase from "@/components/projects/SkillsShowcase";
import CodingJourney from "@/components/projects/CodingJourney";
import AIFooter from "@/components/AIFooter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | byPixelTV - Software Developer",
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
    title: "Home | byPixelTV - Software Developer",
    description: "My personal website used as a portfolio and blog.",
    images: ["/assets/logo/256x.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function About() {
  return (
    <BackgroundLayout>
      <Navbar />
      <main className="relative z-10 w-full pb-14 pt-22 md:pt-26">
        <div className="mx-auto w-full max-w-395 space-y-10 px-4 sm:px-7 md:space-y-20 lg:px-12">
          <section className="py-2">
            <Profile />
          </section>
          <section className="space-y-10 md:space-y-20">
            <HorizontalGallery />
            <EraMCShowcase />
            <SkillsShowcase />
            <CodingJourney />
          </section>
        </div>
      </main>
      <AIFooter />
    </BackgroundLayout>
  );
}
