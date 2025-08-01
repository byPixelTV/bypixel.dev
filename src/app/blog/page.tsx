import { serverDatabases, serverUsers } from "@/lib/appwrite/server";
import Navbar from "@/components/Navbar";
import BackgroundLayout from "@/components/BackgroundLayout";
import { Posts } from "../../../types/appwrite";
import BlogPostCard from "@/components/BlogPostCard";
import { Query } from "node-appwrite";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

// Add error logging to see what's happening
async function getPosts(): Promise<{ posts: Posts[]; error: string | null }> {
  try {
    // Add logging to check if environment variables exist
    console.log('Appwrite endpoint:', process.env.APPWRITE_ENDPOINT);
    console.log('Appwrite project ID:', process.env.APPWRITE_PROJECT_ID);
    
    const response = await serverDatabases.listDocuments(
      "685a9e8a0021f75d1389",
      "685a9ec7002f9eb12d08",
      [Query.equal("draft", false)]
    );

    return {
      posts: response.documents as unknown as Posts[],
      error: null,
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      posts: [],
      error: error instanceof Error ? error.message : "Failed to load posts",
    };
  }
}

async function getAuthorName(userId: string) {
  try {
    const user = await serverUsers.get(userId);
    return user.name || "Unknown";
  } catch {
    return "Unknown";
  }
}

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

export default async function BlogPage() {
  const { posts, error } = await getPosts();

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
            <div className="text-sm text-gray-400 mt-4">
              Posts found: {posts.length}
            </div>
          </div>

          {error ? (
            <div className="text-center text-red-400">Error loading posts: {error}</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-300">No posts found.</div>
          ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {await Promise.all(
                    posts.map(async (post) => {
                    const authorName = await getAuthorName(post.userId);
                    return <BlogPostCard key={post.$id} post={post} authorName={authorName} />;
                    })
                )}
                </div>
          )}
        </div>
      </BackgroundLayout>
    </>
  );
}