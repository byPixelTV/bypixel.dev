import ArticleLoading from "./loading";
import { getReadablePost } from "@/lib/blog-post-data";
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

  const defaultTitle = "byPixelTV - Software Developer";
  const defaultDescription =
    "Software Developer with passion for code. Check out my projects and socials.";
  const defaultImage = "https://cdn.bypixel.dev/raw/FIwMLM.png";
  const siteUrl = "https://bypixel.dev";

  try {
    const response = await getReadablePost(slug);

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
        modifiedTime: post.updateDate,
      },
      robots: {
        index: !post.draft,
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
      <Suspense fallback={<ArticleLoading />}>
        <BlogPostContent slug={slug} />
      </Suspense>
    </>
  );
}
