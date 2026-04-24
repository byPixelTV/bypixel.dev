import BackgroundLayout from "@/components/BackgroundLayout";
import BlogFeed from "@/components/blog/BlogFeed";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | byPixelTV – Software Developer",
  description: "Welcome to my personal blog, where I delve into the realms of software development, engineering, system administration and the captivating world of DevOps.",
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
    "blog"
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
    title: "Blog",
    description: "Welcome to my personal blog, where I delve into the realms of software development, engineering, system administration and the captivating world of DevOps.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Blog | byPixelTV – Software Developer",
    description: "Welcome to my personal blog, where I delve into the realms of software development, engineering, system administration and the captivating world of DevOps.",
    images: ["/assets/logo/256x.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <BackgroundLayout>
        <div className="container mx-auto px-4 py-16 mt-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Blog Posts
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Thoughts, tutorials, and insights about development and technology.
            </p>
          </div>
          <BlogFeed />
        </div>
      </BackgroundLayout>
    </>
  );
}