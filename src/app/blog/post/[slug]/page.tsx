import { serverDatabases, serverUsers } from "@/lib/appwrite/server";
import { Query } from "node-appwrite";
import Navbar from "@/components/Navbar";
import BackgroundLayout from "@/components/BackgroundLayout";
import { notFound } from "next/navigation";
import { Posts } from "../../../../../types/appwrite";
import { marked } from "marked";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ScrollToTop from "@/components/ScrollToTop";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getPostBySlug(slug: string): Promise<Posts | null> {
  try {
    // Query by postSlug field
    const response = await serverDatabases.listDocuments<Posts>(
      "685a9e8a0021f75d1389",
      "685a9ec7002f9eb12d08",
      [
        Query.equal("post-slug", slug),
        Query.equal("draft", false), // Only get published posts
      ]
    );

    if (response.documents.length === 0) {
      return null;
    }

    return response.documents[0] as Posts;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

async function incrementPostViews(postId: string) {
  try {
    // Hole den aktuellen Post
    const post = await serverDatabases.getDocument<Posts>(
      "685a9e8a0021f75d1389",
      "685a9ec7002f9eb12d08",
      postId
    );

    // Erhöhe die Views um 1
    await serverDatabases.updateDocument(
      "685a9e8a0021f75d1389",
      "685a9ec7002f9eb12d08",
      postId,
      {
        views: (post.views || 0) + 1,
      }
    );
  } catch (error) {
    console.error("Error incrementing views:", error);
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // Default values
  const defaultTitle = "byPixelTV – Software Developer";
  const defaultDescription = "Software Developer with passion for code. Check out my projects and socials.";
  const defaultImage = "https://cdn.bypixel.dev/raw/A9FXHb.png";
  const siteUrl = "https://bypixel.dev";

  if (!post) {
    return {
      title: "Post Not Found | byPixelTV",
      description: "The requested blog post could not be found.",
      openGraph: {
        title: "Post Not Found | byPixelTV",
        description: "The requested blog post could not be found.",
        url: `${siteUrl}/blog/post/${slug}`,
        images: [defaultImage],
      },
      twitter: {
        card: "summary_large_image",
        title: "Post Not Found | byPixelTV",
        description: "The requested blog post could not be found.",
        images: [defaultImage],
      },
    };
  }

  // Use post data with fallbacks
  const title = post.title || defaultTitle;
  const description = post["short-description"] || defaultDescription;
  const image = post.thumbnail || defaultImage;
  const postUrl = `${siteUrl}/blog/post/${slug}`;

  return {
    title: `${title} | byPixelTV`,
    description: description,
    keywords: [
      "bypixeltv",
      "bypixel",
      "software developer",
      "web developer",
      "blog",
      "programming",
      "coding",
      post.title,
    ].filter(Boolean),
    authors: [{ name: "byPixelTV" }],
    openGraph: {
      type: "article",
      url: postUrl,
      title: `${title}`,
      description: description,
      images: [
        {
          url: image,
          width: 256,
          height: 256,
          alt: title,
        },
      ],
      siteName: "byPixelTV — Software Developer",
      publishedTime: post.$createdAt,
      modifiedTime: post["update-date"] || post.$updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | byPixelTV`,
      description: description,
      images: [image],
      creator: "@byPixelTV", // Add your Twitter handle if you have one
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  await incrementPostViews(post.$id);

  const html = await marked.parse(post.content || "");
  const titleHtml = await marked.parseInline(post.title || "");

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <BackgroundLayout>
        <div className="container mx-auto px-4 py-16 mt-20">
          {/* Back Button */}
          <div className="max-w-4xl mx-auto mb-8">
            <Button
              variant="ghost"
              asChild
              className="text-white hover:text-gray-300 hover:bg-white/10"
            >
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>

          <article className="max-w-4xl mx-auto">
            <header className="mb-8 text-center max-w-3xl mx-auto">
              {/* Title mit Markdown support */}
              <h1
                className="text-5xl font-bold text-white mb-6"
                dangerouslySetInnerHTML={{ __html: titleHtml }}
              />

              {/* Thumbnail - Responsive aspect ratio */}
              {post.thumbnail && (
                <div className="relative mx-auto w-full aspect-[16/9] rounded-lg overflow-hidden max-w-4xl">
                  <Image
                    src={post.thumbnail}
                    alt="Post thumbnail"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    className="object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Short Description & Meta */}
              <p className="text-xl text-gray-300 my-6">
                {post.shortDescription}
              </p>
              <div className="flex items-center gap-4 text-gray-400 justify-center">
                <span>
                  Written by {(await serverUsers.get(post["user-id"])).name}
                </span>
                <span>•</span>
                <span>{post.views || 0} views</span>
                <span>•</span>
                <time>{new Date(post.$createdAt).toLocaleDateString()}</time>
                {post["update-date"] && (
                  <>
                    <span>•</span>
                    <time>
                      Updated on{" "}
                      {new Date(post["update-date"]).toLocaleDateString()}
                    </time>
                  </>
                )}
              </div>
            </header>
            <div className="prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </article>
        </div>
      </BackgroundLayout>
    </>
  );
}
