import BlogFeedSkeleton from "@/components/blog/BlogFeedSkeleton";
export default function BlogLoading() {
  return (
    <main className="blog-page content-width">
      <header className="page-intro">
        <p className="micro-label">The blog</p>
        <h1>
          Thoughts, projects
          <br />
          <span>&amp; things I learn.</span>
        </h1>
      </header>
      <BlogFeedSkeleton />
    </main>
  );
}
