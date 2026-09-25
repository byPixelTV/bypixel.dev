import ChapterTitle from "@/components/portfolio/ChapterTitle";
import { ScrollScene, SceneRibbon } from "@/components/portfolio/ScrollScene";
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
          <ScrollScene travel={35}>
            <ChapterTitle as="h1" lines={["THINK.", "BUILD.", "SHARE."]} />
          </ScrollScene>
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
      <SceneRibbon words="NOTES FROM THE WORKBENCH" />
      <Suspense fallback={<BlogFeedSkeleton />}>
        <BlogFeed />
      </Suspense>
    </main>
  );
}
