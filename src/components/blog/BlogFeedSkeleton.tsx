export default function BlogFeedSkeleton() {
  return (
    <div className="blog-card-grid grid" role="status" aria-label="Loading articles">
      <span className="sr-only">Loading articles…</span>
      {[0, 1, 2, 3].map((item) => (
        <div className="blog-skeleton overflow-hidden pb-[25px]" key={item} aria-hidden="true">
          <div />
          <span />
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}
