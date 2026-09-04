import Reveal from "@/components/portfolio/Reveal";
import BlogPostCard from "@/components/BlogPostCard";
import { getPostSummaries } from "@/lib/blog-data";
import { isServerAdmin } from "@/lib/session";

export default async function BlogFeed() {
  const isAdmin = await isServerAdmin();
  const posts = await getPostSummaries(isAdmin);
  const draftCount = posts.filter((post) => post.draft).length;
  return (
    <Reveal className="max-w-6xl mx-auto">
      {isAdmin && draftCount > 0 && (
        <p className="mb-6 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-100">
          Admin view · {draftCount} private drafts
        </p>
      )}
      <div className="blog-feed-label eyebrow">
        <span>{posts.length - draftCount} published articles</span>
        <span>Notes from the workbench</span>
      </div>
      {posts.length ? (
        <div className="blog-card-grid">
          {posts.map((post, index) => (
            <div key={post._id} data-enter data-enter-delay={Math.min(index, 3) * 80}>
              <BlogPostCard post={post} authorName={post.authorName} />
            </div>
          ))}
        </div>
      ) : (
        <p className="py-16 text-white/60">No articles found yet.</p>
      )}
    </Reveal>
  );
}
