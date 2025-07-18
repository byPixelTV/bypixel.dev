import BackgroundLayout from "@/components/BackgroundLayout";
import Navbar from "@/components/Navbar";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Metadata } from "next";

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

export default function Page() {
  return (
    <BackgroundLayout>
      <Navbar />
      <div className="overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 mt-[125px] md:mt-[175px]">
          <div className="flex flex-col lg:flex-row items-start gap-16">
            <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Software Developer with
              </h1>
              <h2 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500
                  after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-full
                  after:bg-gradient-to-r after:from-purple-500 after:to-pink-500">
                  passion for code.
                </span>
              </h2>
            </div>

              <div>
                <span className="text-base-content/70 font-bold text-2xl block mb-2 text-white">SOCIALS</span>
                <div className="flex justify-start gap-2">
                  <a href="https://github.com/byPixelTV" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-square text-white hover:text-blue-600 transition" aria-label="GitHub">
                    <Icon icon="mdi:github" height="50" width="45" />
                  </a>
                  <a href="https://discord.gg/yVp7Qvhj9k" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-square text-white hover:text-blue-600 transition" aria-label="Discord">
                    <Icon icon="ic:baseline-discord" height="50" width="45" />
                  </a>
                  <a href="https://bsky.app/profile/bypixel.dev" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-square text-white hover:text-blue-600 transition" aria-label="Bluesky">
                    <Icon icon="bi:bluesky" height="50" width="45" />
                  </a>
                </div>
              </div>
            </div>

            <div className="relative lg:flex-shrink-0 hidden md:block">
              <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl backdrop-blur-sm">
                <Image
                  src="/profile.gif"
                  alt="byPixelTV Profile"
                  className="w-full h-full object-cover"
                  width={384}
                  height={384}
                  unoptimized={true}
                  style={{
                    maxWidth: "100%",
                    height: "auto"
                  }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundLayout>
  );
}
