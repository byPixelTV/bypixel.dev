import BlogFeedSkeleton from "@/components/blog/BlogFeedSkeleton";
export default function BlogLoading() {
  return (
    <main className="simple-blog">
      <header className="simple-page-header">
        <p className="simple-label">B Y P I X E L / W R I T I N G</p>
        <h1>
          Blog<span>.</span>
        </h1>
        <p>Notes on development, projects and whatever I’m learning.</p>
      </header>
      <BlogFeedSkeleton />
    </main>
  );
}
