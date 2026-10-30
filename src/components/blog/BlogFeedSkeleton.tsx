export default function BlogFeedSkeleton() {
  return (
    <section className="simple-feed" role="status" aria-label="Loading articles">
      <div className="simple-feed-header">
        <h2>Articles</h2>
        <span>Loading…</span>
      </div>
      <div className="simple-post-grid">
        {[0, 1, 2, 3].map((item) => (
          <div className="simple-post-placeholder" key={item} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        ))}
      </div>
    </section>
  );
}
