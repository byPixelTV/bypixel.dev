import OGPreviewCard from "@/components/OGPreviewCard";
import ScrollToTop from "@/components/ScrollToTop";
import CustomVideoPlayer from "@/components/blog/CustomVideoPlayer";
import PostImageLightbox from "@/components/blog/PostImageLightbox";
import { Button } from "@/components/ui/button";
import { getAuthorName, getPostBySlug, incrementPostViews } from "@/lib/actions/blog";
import { fetchOGData, OGData } from "@/lib/og-fetcher";
import { ArrowLeft } from "lucide-react";
import { marked } from "marked";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type ContentSegment =
  | { type: "html"; html: string }
  | { type: "og"; url: string; data: OGData };

const VIDEO_URL_PATTERN = /\.(mp4|webm|ogg|mov|m4v)(\?[^"']*)?$/i;
const INLINE_VIDEO_TOKEN_REGEX = /@@INLINE_VIDEO@@(.*?)@@END_INLINE_VIDEO@@/g;

interface InlineVideoTokenPayload {
  src: string;
  caption?: string;
  captionIsLink?: boolean;
}

function createInlineVideoToken(payload: InlineVideoTokenPayload): string {
  return `@@INLINE_VIDEO@@${encodeURIComponent(JSON.stringify(payload))}@@END_INLINE_VIDEO@@`;
}

function parseInlineVideoToken(value: string): InlineVideoTokenPayload | null {
  try {
    return JSON.parse(decodeURIComponent(value)) as InlineVideoTokenPayload;
  } catch {
    return null;
  }
}

function stripHtmlTags(input: string): string {
  return input.replace(/<[^>]+>/g, "").trim();
}

async function buildContentSegments(raw: string): Promise<ContentSegment[]> {
  const segments: ContentSegment[] = [];
  const regex = /<og\s+url=["']([^"']+)["']\s*\/?>/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "html",
        html: await marked.parse(raw.slice(lastIndex, match.index)),
      });
    }
    const url = match[1];
    const data = await fetchOGData(url);
    segments.push({ type: "og", url, data });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < raw.length) {
    segments.push({
      type: "html",
      html: await marked.parse(raw.slice(lastIndex)),
    });
  }

  return segments;
}

function makeMarkdownImagesClickable(html: string): string {
  const getAttribute = (attrs: string, attrName: string): string | null => {
    const match = attrs.match(new RegExp(`\\b${attrName}\\s*=\\s*(["'])(.*?)\\1`, "i"));
    return match?.[2] ?? null;
  };

  const withClickableImages = html.replace(/<img\b([^>]*)>/gi, (match, attrs) => {
    if (/\bdata-post-image\s*=/.test(attrs)) return match;

    const src = getAttribute(attrs, "src");
    const alt = getAttribute(attrs, "alt") || "Post media";

    if (src && VIDEO_URL_PATTERN.test(src)) {
      return createInlineVideoToken({
        src,
        caption: alt,
        captionIsLink: false,
      });
    }

    let updatedAttrs = attrs;

    if (/\bclass\s*=/.test(updatedAttrs)) {
      updatedAttrs = updatedAttrs.replace(
        /\bclass\s*=\s*(["'])(.*?)\1/i,
        (_full: string, quote: string, classNames: string) =>
          `class=${quote}${classNames} cursor-zoom-in transition-opacity hover:opacity-95${quote}`
      );
    } else {
      updatedAttrs += ' class="cursor-zoom-in transition-opacity hover:opacity-95"';
    }

    if (!/\btitle\s*=/.test(updatedAttrs)) {
      updatedAttrs += ' title="Click to enlarge"';
    }

    updatedAttrs += ' data-post-image="true" data-post-media="true" data-post-type="image"';

    return `<img${updatedAttrs}>`;
  });

  return withClickableImages.replace(
    /<a\b[^>]*href=(["'])(https?:\/\/[^"']+\.(?:mp4|webm|ogg|mov|m4v)(?:\?[^"']*)?)\1[^>]*>(.*?)<\/a>/gi,
    (_match, _quote: string, url: string, label: string) => {
      const rawLabel = label?.trim();
      const caption = rawLabel && stripHtmlTags(rawLabel) !== url ? stripHtmlTags(rawLabel) : url;
      return createInlineVideoToken({
        src: url,
        caption,
        captionIsLink: true,
      });
    }
  );
}

function renderHtmlWithInlineVideos(html: string, keyPrefix: string) {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let chunkIndex = 0;

  while ((match = INLINE_VIDEO_TOKEN_REGEX.exec(html)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        <div
          key={`${keyPrefix}-html-${chunkIndex}`}
          dangerouslySetInnerHTML={{ __html: html.slice(lastIndex, match.index) }}
        />
      );
      chunkIndex += 1;
    }

    const payload = parseInlineVideoToken(match[1]);
    if (payload?.src) {
      nodes.push(
        <figure key={`${keyPrefix}-video-${chunkIndex}`} className="not-prose my-6">
          <div className="relative">
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
              className="absolute right-3 top-3 rounded-md border border-white/20 bg-black/65 px-2 py-1 text-xs text-white cursor-pointer hover:bg-black/85"
            >
              Open in gallery
            </button>
          </div>
          {payload.caption && (
            payload.captionIsLink ? (
              <figcaption className="mt-2 text-sm text-sky-300 break-all">
                <a
                  href={payload.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline/60 hover:underline"
                >
                  {payload.caption}
                </a>
              </figcaption>
            ) : (
              <figcaption className="mt-2 text-sm text-gray-400">{payload.caption}</figcaption>
            )
          )}
        </figure>
      );
      chunkIndex += 1;
    }

    lastIndex = INLINE_VIDEO_TOKEN_REGEX.lastIndex;
  }

  if (lastIndex < html.length) {
    nodes.push(
      <div
        key={`${keyPrefix}-html-${chunkIndex}`}
        dangerouslySetInnerHTML={{ __html: html.slice(lastIndex) }}
      />
    );
  }

  INLINE_VIDEO_TOKEN_REGEX.lastIndex = 0;

  return nodes;
}

async function PostContentBody({ slug }: { slug: string }) {
  const postData = await getPostBySlug(slug);

  if (!postData) notFound();

  const post = postData.post;

  if (!post) notFound();

  await incrementPostViews(post._id.toString());
  
  const rawSegments = await buildContentSegments(post.content || "");
  const segments = rawSegments.map((segment) =>
    segment.type === "html"
      ? { ...segment, html: makeMarkdownImagesClickable(segment.html) }
      : segment
  );
  const titleHtml = await marked.parseInline(post.title || "");
  const hasMedia = Boolean(post.thumbnail) || segments.some((segment) => segment.type === "html" && segment.html.includes("data-post-media=\"true\""));

  return (
    <>
      <ScrollToTop />
      <div className="container mx-auto px-4 py-16 mt-20">
        <div className="max-w-4xl mx-auto mb-8">
          <Button
            variant="ghost"
            asChild
            className="text-white hover:text-gray-300 hover:bg-white/10"
          >
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>

        <article id="post-content-root" className="max-w-4xl mx-auto">
          <header className="mb-8 text-center max-w-3xl mx-auto">
            <h1
              className="text-5xl font-bold text-white mb-6"
              dangerouslySetInnerHTML={{ __html: titleHtml }}
            />

            {post.thumbnail && (
              <div className="relative mx-auto w-full aspect-16/9 rounded-lg overflow-hidden max-w-4xl">
                <Image
                  src={post.thumbnail}
                  alt="Post thumbnail"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  className="object-cover rounded-lg cursor-zoom-in transition-opacity hover:opacity-95"
                  data-post-image="true"
                  data-post-media="true"
                  data-post-type="image"
                  title="Click to enlarge"
                />
              </div>
            )}

            <p className="text-xl text-gray-300 my-6">
              {post.shortDescription}
            </p>
            <div className="flex items-center gap-4 text-gray-400 justify-center">
              <span>Written by {getAuthorName(post.userId)}</span>
              <span>•</span>
              <span>{post.views || 0} views</span>
              <span>•</span>
              <time>{new Date(post.creationDate).toLocaleDateString()}</time>
              {post.updateDate && (
                <>
                  <span>•</span>
                  <time>
                    Updated on {new Date(post.updateDate).toLocaleDateString()}
                  </time>
                </>
              )}
            </div>
          </header>
          <div className="prose prose-invert max-w-none">
            {hasMedia && (
              <p className="text-sm text-gray-400 mb-4">Tip: Click images and videos to open the media viewer.</p>
            )}
            {segments.map((seg, i) =>
              seg.type === "html" ? (
                <div key={i}>{renderHtmlWithInlineVideos(seg.html, `segment-${i}`)}</div>
              ) : (
                <div key={i} className="not-prose my-6">
                  <a
                    href={seg.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-2 block break-all text-sm text-sky-300 underline/60 hover:underline"
                  >
                    {seg.url}
                  </a>
                  <OGPreviewCard data={seg.data} href={seg.url} />
                </div>
              )
            )}
          </div>
        </article>
        <PostImageLightbox rootId="post-content-root" />
      </div>
    </>
  );
}

export async function BlogPostContent({ slug }: { slug: string }) {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 mt-20"><div className="flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-white"></div></div></div>}>
      <PostContentBody slug={slug} />
    </Suspense>
  );
}
