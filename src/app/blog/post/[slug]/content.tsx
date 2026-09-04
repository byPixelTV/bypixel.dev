import { getAuthorName } from "@/lib/actions/blog";
import { getReadablePost } from "@/lib/blog-post-data";
import { Suspense } from "react";
import PostViewTracker from "@/components/blog/PostViewTracker";
import StreamedLinkPreview from "@/components/blog/StreamedLinkPreview";

import { Marked, Parser, Tokens, parseInline } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";
import { notFound } from "next/navigation";
import BlogPostView from "./BlogPostView";
import { createHighlighter, type Highlighter } from "shiki";

// Define the segment type for the view
type ContentSegment = { type: "html"; html: string } | { type: "og"; url: string };

const VIDEO_URL_PATTERN = /\.(mp4|webm|ogg|mov|m4v)(\?[^"']*)?$/i;

type MarkdownToken = {
  type: string;
  raw: string;
  text?: string;
  href?: string;
  tokens?: Array<{
    type: string;
    raw?: string;
    text?: string;
    href?: string;
  }>;
};

function renderMediaPayload(src: string, caption: string) {
  return `<div data-video-payload="${encodeURIComponent(JSON.stringify({ src, caption, captionIsLink: false }))}"></div>`;
}

function renderMediaHtml(src: string, alt: string) {
  if (VIDEO_URL_PATTERN.test(src)) {
    return renderMediaPayload(src, alt);
  }

  return `<img src="${src}" alt="${alt}" class="cursor-zoom-in transition-opacity hover:opacity-95 rounded-3xl border border-white/10 my-8 shadow-2xl" data-post-image="true" data-post-media="true" data-post-type="image" title="Click to enlarge">`;
}

function isStandaloneImageParagraph(token: MarkdownToken): token is MarkdownToken & {
  type: "paragraph";
  tokens: Array<{
    type: "image";
    href: string;
    text: string;
  }>;
} {
  return (
    token.type === "paragraph" &&
    Array.isArray(token.tokens) &&
    token.tokens.length === 1 &&
    token.tokens[0]?.type === "image"
  );
}

function renderCaptionedImageFigure(
  imageToken: { href: string; text: string },
  captionRaw: string,
) {
  const imageHtml = renderMediaHtml(imageToken.href, imageToken.text);
  const captionHtml = parseInline(captionRaw);

  return [
    "",
    "",
    `<figure class="not-prose my-8 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">`,
    imageHtml,
    captionHtml
      ? `<figcaption class="border-t border-white/10 bg-white/[0.03] px-4 py-3 text-left text-xs sm:text-sm leading-relaxed text-white/55">${captionHtml}</figcaption>`
      : "",
    `</figure>`,
    "",
    "",
  ].join("");
}

function renderMarkdownChunk(marked: Marked, chunk: string) {
  const tokens = marked.lexer(chunk) as MarkdownToken[];
  const output: string[] = [];

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index];

    if (isStandaloneImageParagraph(token)) {
      const imageToken = token.tokens[0];
      let nextIndex = index + 1;

      while (tokens[nextIndex]?.type === "space") {
        nextIndex++;
      }

      const nextToken = tokens[nextIndex];

      if (nextToken?.type === "paragraph" && !VIDEO_URL_PATTERN.test(imageToken.href)) {
        output.push(renderCaptionedImageFigure(imageToken, nextToken.raw));
        index = nextIndex;
        continue;
      }
    }

    output.push(token.raw);
  }

  return marked.parse(output.join(""));
}

// Initialize Shiki highlighter
const getHighlighter = (() => {
  let highlighter: Promise<Highlighter> | null = null;
  return async () => {
    if (!highlighter) {
      highlighter = createHighlighter({
        themes: ["github-dark-dimmed"],
        langs: [
          "javascript",
          "typescript",
          "kotlin",
          "java",
          "python",
          "html",
          "css",
          "json",
          "bash",
          "rust",
          "go",
          "yaml",
          "markdown",
        ],
      });
    }
    return highlighter;
  };
})();

export async function BlogPostContent({ slug }: { slug: string }) {
  const postData = await getReadablePost(slug);
  if (!postData || !postData.post) notFound();
  const post = postData.post;
  const authorPromise = getAuthorName(post.userId);

  const highlighter = /(^|\n)\s*(```|~~~)/.test(post.content) ? await getHighlighter() : null;

  const marked = new Marked();
  marked.use(gfmHeadingId());

  // Custom renderer
  const renderer = {
    image(token: Tokens.Image) {
      const { href, text } = token;
      return renderMediaHtml(href, text);
    },
    link(token: Tokens.Link) {
      const { href, text, title, tokens } = token;
      if (href && VIDEO_URL_PATTERN.test(href)) {
        return renderMediaPayload(href, text);
      }

      const linkHtml = Parser.parseInline(tokens);
      return `<a href="${href}"${title ? ` title="${title}"` : ""}>${linkHtml}</a>`;
    },
    code(token: Tokens.Code) {
      const { text, lang } = token;
      const language = lang === "kt" ? "kotlin" : lang || "text";
      try {
        return highlighter!.codeToHtml(text, {
          lang: language,
          theme: "github-dark-dimmed",
        });
      } catch {
        return `<pre><code>${text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
      }
    },
  };

  marked.use({ renderer });

  // Normalize content: ensure GFM blocks are recognized
  const rawContent = (post.content || "").replace(/\r\n/g, "\n");

  const segments: ContentSegment[] = [];
  const ogRegex = /<og\s+url=["']([^"']+)["']\s*\/?>/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = ogRegex.exec(rawContent)) !== null) {
    if (match.index > lastIndex) {
      const mdChunk = rawContent.slice(lastIndex, match.index);
      if (mdChunk.trim()) {
        const html = await renderMarkdownChunk(marked, mdChunk);
        segments.push({ type: "html", html: html as string });
      }
    }

    const url = match[1];
    segments.push({ type: "og", url });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < rawContent.length) {
    const mdChunk = rawContent.slice(lastIndex);
    if (mdChunk.trim()) {
      const html = await renderMarkdownChunk(marked, mdChunk);
      segments.push({ type: "html", html: html as string });
    }
  }

  const wordCount = rawContent.split(/\s+/).length || 0;
  const readingTime = Math.ceil(wordCount / 200);
  const hasMedia =
    Boolean(post.thumbnail) ||
    segments.some((s) => s.type === "html" && s.html.includes('data-post-media="true"'));

  const authorName = await authorPromise;
  return (
    <>
      <PostViewTracker postId={post._id.toString()} />
      <BlogPostView
        post={JSON.parse(JSON.stringify(post))}
        authorName={authorName}
        segments={segments}
        previews={segments.map((segment, index) =>
          segment.type === "og" ? (
            <Suspense
              key={index}
              fallback={
                <a className="streamed-link-placeholder" href={segment.url}>
                  {segment.url} ↗
                </a>
              }
            >
              <StreamedLinkPreview url={segment.url} />
            </Suspense>
          ) : null,
        )}
        readingTime={readingTime}
        hasMedia={hasMedia}
      />
    </>
  );
}
