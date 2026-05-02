"use client";

import { useEffect, useState } from "react";
import BlogPostCard from "@/components/BlogPostCard";
import type { Post } from "@/lib/mongo";
import { motion } from "framer-motion";

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
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="size-10 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-white/40 text-sm font-medium animate-pulse">Fetching articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-red-500/5 border border-red-500/10 rounded-2xl">
        <p className="text-red-400 font-medium">Error loading posts</p>
        <p className="text-red-400/60 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
        <p className="text-white/60">No articles found yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <div className="h-px flex-grow bg-white/10" />
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 whitespace-nowrap">
          {posts.length} {posts.length === 1 ? "Article" : "Articles"} Published
        </span>
        <div className="h-px flex-grow bg-white/10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-10">
        {posts.map((post, index) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <BlogPostCard
              post={post}
              authorName={post.authorName || "Unknown"}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}