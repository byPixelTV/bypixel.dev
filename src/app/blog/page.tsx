import { Suspense } from "react";
import BlogFeed from "@/components/blog/BlogFeed";
import BlogFeedSkeleton from "@/components/blog/BlogFeedSkeleton";
import Reveal from "@/components/portfolio/Reveal";

export default function BlogPage() {
  return (
    <main className="blog-editorial">
      <Reveal>
        <header className="blog-hero">
          <p className="eyebrow" data-intro="0">
            The workbench / byPixelTV
          </p>
          <h1 data-intro="1">
            THINK.
            <br />
            <em>BUILD.</em>
            <br />
            SHARE.
          </h1>
          <div data-intro="2">
            <span className="blog-hero-mark" aria-hidden="true">
              ✳
            </span>
            <p>
              Notes, experiments and things learned along the way.
              <br />
              Software, systems and the occasional rabbit hole.
            </p>
          </div>
        </header>
      </Reveal>
      <Suspense fallback={<BlogFeedSkeleton />}>
        <BlogFeed />
      </Suspense>
    </main>
  );
}
