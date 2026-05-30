"use client";

import React from "react";
import OGPreviewCard from "@/components/OGPreviewCard";
import CustomVideoPlayer from "@/components/blog/CustomVideoPlayer";
import { LuArrowLeft, LuCalendar, LuEye, LuUser, LuClock } from "react-icons/lu";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import ScrollToTop from "@/components/scroll/ScrollToTop";
import PostImageLightbox from "@/components/blog/PostImageLightbox";
import parse, { HTMLReactParserOptions, Element } from "html-react-parser";
import { Post } from "@/lib/mongo";
import { OGData } from "@/lib/og-fetcher";
import { cn } from "@/lib/utils";

interface ContentSegment {
  type: "html" | "og";
  html?: string;
  url?: string;
  data?: OGData;
}

interface BlogPostViewProps {
  post: Omit<Post, "_id"> & { _id: string };
  authorName: string;
  segments: ContentSegment[];
  readingTime: number;
  hasMedia: boolean;
}

const parserOptions: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.attribs && domNode.attribs["data-video-payload"]) {
      try {
        const payload = JSON.parse(decodeURIComponent(domNode.attribs["data-video-payload"]));
        return (
          <figure className="not-prose my-12">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <CustomVideoPlayer
                src={payload.src}
                className="w-full"
                wrapperProps={{
                  "data-post-media": "true",
                  "data-post-type": "video",
                  "data-post-src": payload.src,
                  title: "Inline video",
                }}
              />
              <button
                type="button"
                data-post-open-viewer="true"
                data-post-open-viewer-src={payload.src}
                className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/60 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white cursor-pointer hover:bg-black/80 transition-colors"
              >
                Open Gallery
              </button>
            </div>
            {payload.caption && (
              <figcaption className="mt-3 text-center text-sm text-white/40 font-medium italic">
                {payload.caption}
              </figcaption>
            )}
          </figure>
        );
      } catch {
        return null;
      }
    }
    return undefined;
  },
};

export default function BlogPostView({ post, authorName, segments, readingTime, hasMedia }: BlogPostViewProps) {
  // We use the 'article-body' class to target styles even if prose selectors fail due to nesting
  const proseClasses = cn(
    "prose prose-invert prose-purple max-w-none",
    "prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight",
    "prose-h1:text-4xl sm:text-5xl prose-h1:mt-12 prose-h1:mb-8",
    "prose-h2:text-3xl sm:text-4xl prose-h2:mt-10 prose-h2:mb-6",
    "prose-h3:text-2xl sm:text-3xl prose-h3:mt-8 prose-h3:mb-4",
    "prose-p:text-white/80 prose-p:leading-[1.8] prose-p:text-lg",
    "prose-a:text-purple-400 prose-a:font-medium prose-a:no-underline hover:prose-a:text-purple-300 prose-a:transition-colors",
    "prose-strong:text-white prose-strong:font-bold",
    "prose-code:text-purple-300 prose-code:bg-purple-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none",
    "prose-pre:bg-transparent prose-pre:p-0 prose-pre:border-none prose-pre:overflow-visible",
    "prose-img:rounded-3xl prose-img:border prose-img:border-white/10 prose-img:shadow-2xl",
    "prose-blockquote:border-l-purple-500 prose-blockquote:bg-white/5 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-3xl prose-blockquote:text-white/70 prose-blockquote:italic"
  );

  return (
    <>
      <ScrollToTop />
      <div className="container mx-auto px-6 py-24 mt-16 min-h-screen">
        <motion.div 
          className="max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link 
            href="/blog"
            className="group inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium"
          >
            <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
              <LuArrowLeft className="size-4" />
            </div>
            Back to Articles
          </Link>
        </motion.div>

        <article id="post-content-root" className="max-w-4xl mx-auto">
          <header className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1
                className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight leading-[1.1]"
                dangerouslySetInnerHTML={{ __html: post.title }}
              />
              
              <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-6 text-[13px] font-medium text-white/40 mb-10">
                <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                  <LuUser className="size-3.5 text-purple-500" />
                  {authorName}
                </span>
                <span className="flex items-center gap-2">
                  <LuCalendar className="size-3.5 text-purple-500" />
                  {dayjs(post.creationDate).format("MMMM D, YYYY")}
                </span>
                <span className="flex items-center gap-2">
                  <LuClock className="size-3.5 text-purple-500" />
                  {readingTime} min read
                </span>
                <span className="flex items-center gap-2">
                  <LuEye className="size-3.5 text-purple-500" />
                  {post.views || 0} views
                </span>
              </div>
            </motion.div>

            {post.thumbnail && (
              <motion.div 
                className="relative mx-auto w-full aspect-video rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  className="object-cover cursor-zoom-in transition-transform duration-700 hover:scale-[1.02]"
                  data-post-image="true"
                  data-post-media="true"
                  data-post-type="image"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0c0618]/40 to-transparent pointer-events-none" />
              </motion.div>
            )}

            {post.shortDescription && (
              <motion.p 
                className="mt-10 text-xl md:text-2xl text-white/70 font-medium leading-relaxed max-w-3xl mx-auto italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                &ldquo;{post.shortDescription}&rdquo;
              </motion.p>
            )}
          </header>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className={proseClasses}>
              {hasMedia && (
                <div className="not-prose flex items-center gap-2 mb-10 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full w-fit mx-auto text-[11px] font-bold uppercase tracking-wider text-purple-300/80">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                  </span>
                  Tip: Click media to enlarge
                </div>
              )}
              
              {segments.map((seg, i) =>
                seg.type === "html" ? (
                  <React.Fragment key={i}>{parse(seg.html!, parserOptions)}</React.Fragment>
                ) : (
                  <div key={i} className="not-prose my-12 group">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="h-px grow bg-white/10" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 group-hover:text-purple-500/40 transition-colors">External Preview</span>
                      <div className="h-px grow bg-white/10" />
                    </div>
                    {seg.data && <OGPreviewCard data={seg.data} href={seg.url!} />}
                  </div>
                )
              )}
            </div>
            
            <div className="absolute top-[20%] left-[-20%] w-96 h-96 bg-purple-600/5 blur-[120px] rounded-full pointer-events-none -z-1" />
            <div className="absolute bottom-[20%] right-[-20%] w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none -z-1" />
          </motion.div>

          <footer className="mt-20 pt-10 border-t border-white/10 flex flex-col items-center">
             <div className="text-center mb-8">
               <p className="text-white/40 text-sm mb-4 font-medium uppercase tracking-[0.2em]">Thanks for reading</p>
               <h3 className="text-2xl font-bold text-white mb-2">Want to stay updated?</h3>
               <p className="text-white/60 text-sm max-w-sm mx-auto">Follow me on social media or reach out via email for collaboration.</p>
             </div>
             
             <div className="flex items-center gap-4">
               <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/5 hover:bg-white/10">
                 <Link href="/blog">All Articles</Link>
               </Button>
               <Button asChild className="rounded-full bg-purple-600 hover:bg-purple-700 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                 <Link href="/#top">Back Home</Link>
               </Button>
             </div>
          </footer>
        </article>
        <PostImageLightbox rootId="post-content-root" />
      </div>
    </>
  );
}
