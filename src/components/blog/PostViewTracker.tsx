"use client";
import { useEffect } from "react";
import { incrementPostViews } from "@/lib/actions/blog";

export default function PostViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    // Count a mounted article, not an RSC prefetch or a metadata request.
    const timer = setTimeout(() => {
      void incrementPostViews(postId);
    }, 1000);
    return () => clearTimeout(timer);
  }, [postId]);
  return null;
}
