import BlogPostCard from "@/components/BlogPostCard";
import { getPostSummaries } from "@/lib/blog-data";
import { isServerAdmin } from "@/lib/session";

export default async function BlogFeed() {
  const isAdmin = await isServerAdmin();
  const posts = await getPostSummaries(isAdmin);
  const drafts = posts.filter((post) => post.draft).length;
  return (
    <section aria-label="Blog posts" className="simple-feed">
      {isAdmin && drafts > 0 && (
        <p className="simple-draft-notice">Admin view · {drafts} private drafts</p>
      )}
      <div className="simple-feed-header">
        <h2>Articles</h2>
        <span>{posts.length - drafts} published</span>
      </div>
      {posts.length ? (
        <div className="simple-post-grid">
          {posts.map((post) => (
            <BlogPostCard key={post._id} post={post} authorName={post.authorName} />
          ))}
        </div>
      ) : (
        <p className="simple-empty">No articles yet.</p>
      )}
    </section>
  );
}
