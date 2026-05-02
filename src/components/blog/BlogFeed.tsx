"use client";

import { useEffect, useState } from "react";
import BlogPostCard from "@/components/BlogPostCard";
import type { Post } from "@/lib/mongo";

type BlogPostListItem = (Omit<Post, "_id"> & { _id: string }) & {
  authorName: string;
};

interface BlogPostsResponse {
  posts: BlogPostListItem[];
}

export default function BlogFeed() {
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadPosts = async () => {
      try {
        const response = await fetch("/api/posts", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load posts");
        }

        const data = (await response.json()) as BlogPostsResponse;
        if (!cancelled) {
          setPosts(data.posts ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load posts");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <div className="text-center text-gray-400">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400">Error loading posts: {error}</div>;
  }

  if (posts.length === 0) {
    return <div className="text-center text-gray-300">No posts found.</div>;
  }

  return (
    <>
      <div className="text-center text-sm text-gray-400 mt-4 mb-8">Posts found: {posts.length}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {posts.map((post) => (
          <BlogPostCard
            key={post._id}
            post={post}
            authorName={post.authorName || "Unknown"}
          />
        ))}
      </div>
    </>
  );
}