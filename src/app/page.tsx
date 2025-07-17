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
    type: "website",
    url: "https://bypixel.dev/",
    title: "Home",
    description: "Software Developer with passion for code. Check out my projects and socials.",
    images: ["https://cdn.bypixel.dev/raw/1JQ6U4.png"],
    siteName: "byPixelTV — Software Developer",
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
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col lg:flex-row items-start gap-16">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Software Developer with
              </h1>
              <h2 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                <span className="relative text-transparent bg-clip-text radient-text bg-gradient-to-r from-purple-500 to-pink-500">
                  passion for code.
                </span>
              </h2>
            </div>

            <div>
              <span className="text-base-content/70 font-bold block mb-2 text-white">SOCIALS</span>
              <div className="flex justify-start gap-2">
                <a href="https://github.com/byPixelTV" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-square text-white hover:text-blue-600 transition" aria-label="GitHub">
                  <Icon icon="mdi:github" height="27" width="27" />
                </a>
                <a href="https://discord.gg/yVp7Qvhj9k" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-square text-white hover:text-blue-600 transition" aria-label="Discord">
                  <Icon icon="ic:baseline-discord" height="27" width="27" />
                </a>
                <a href="https://bsky.app/profile/bypixel.dev" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-square text-white hover:text-blue-600 transition" aria-label="Bluesky">
                  <Icon icon="bi:bluesky" height="27" width="27" />
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
    </BackgroundLayout>
  );
}
