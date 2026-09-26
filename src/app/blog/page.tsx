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
        <header className="blog-hero relative grid items-end gap-x-15">
          <p className="eyebrow font-medium tracking-[0.13em] uppercase" data-intro="0">
            The workbench / byPixelTV
          </p>
          <ScrollScene travel={35}>
            <ChapterTitle as="h1" lines={["THINK.", "BUILD.", "SHARE."]} />
          </ScrollScene>
          <div data-intro="2">
            <span className="blog-hero-mark text-[115px] leading-none mb-[30px]" aria-hidden="true">
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
