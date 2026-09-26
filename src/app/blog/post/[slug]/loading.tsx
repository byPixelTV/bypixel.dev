export default function ArticleLoading() {
  return (
    <main className="article-loading min-h-[120svh]" role="status">
      <span className="sr-only">Loading article…</span>
      <div aria-hidden="true">
        <span />
        <span />
        <span />
        <div />
      </div>
    </main>
  );
}
