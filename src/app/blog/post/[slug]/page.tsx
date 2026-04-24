import BackgroundLayout from "@/components/BackgroundLayout";
import Navbar from "@/components/Navbar";
import { getPostBySlug } from "@/lib/actions/blog";
import { Metadata } from "next";
import { Suspense } from "react";
import { BlogPostContent } from "./content";

export const revalidate = 60;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const defaultTitle = "byPixelTV – Software Developer";
  const defaultDescription = "Software Developer with passion for code. Check out my projects and socials.";
  const defaultImage = "https://cdn.bypixel.dev/raw/FIwMLM.png";
  const siteUrl = "https://bypixel.dev";

  try {
    const response = await getPostBySlug(slug);

    const post = response.post;

    if (response.error || !post) {
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

    const title = post.title || defaultTitle;
    const description = post.shortDescription || defaultDescription;
    const image = post.thumbnail || defaultImage;
    const postUrl = `${siteUrl}/blog/post/${slug}`;

    return {
      title: `${title} | byPixelTV`,
      description,
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
        url: postUrl,
        title,
        description,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        siteName: "byPixelTV — Software Developer",
        publishedTime: post.creationDate,
        modifiedTime: post.updateDate || post.updateDate,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch {
    return {
      title: `Blog Post | byPixelTV`,
      description: defaultDescription,
      openGraph: {
        title: `Blog Post | byPixelTV`,
        description: defaultDescription,
        url: `${siteUrl}/blog/post/${slug}`,
        images: [defaultImage],
      },
    };
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <>
      <Navbar />
      <BackgroundLayout>
        <Suspense
          fallback={
            <div className="container mx-auto px-4 py-16 mt-20">
              <div className="flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-white"></div>
              </div>
            </div>
          }
        >
          <BlogPostContent slug={slug} />
        </Suspense>
      </BackgroundLayout>
    </>
  );
}
