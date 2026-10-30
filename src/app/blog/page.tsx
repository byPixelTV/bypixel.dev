import { Suspense } from "react";
import BlogFeed from "@/components/blog/BlogFeed";
import BlogFeedSkeleton from "@/components/blog/BlogFeedSkeleton";

export default function BlogPage() {
  return (
    <main className="simple-blog">
      <header className="simple-page-header">
        <p className="simple-label">B Y P I X E L / W R I T I N G</p>
        <h1>
          Blog<span>.</span>
        </h1>
        <p>Notes on development, projects and whatever I’m learning.</p>
      </header>
      <Suspense fallback={<BlogFeedSkeleton />}>
        <BlogFeed />
      </Suspense>
    </main>
  );
}
