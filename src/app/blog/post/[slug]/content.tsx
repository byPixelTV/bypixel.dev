import { getAuthorName, getPostBySlug, incrementPostViews } from "@/lib/actions/blog";
import { fetchOGData, OGData } from "@/lib/og-fetcher";
import { Marked, Tokens } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";
import { notFound } from "next/navigation";
import BlogPostView from "./BlogPostView";
import { createHighlighter, type Highlighter } from "shiki";

// Define the segment type for the view
type ContentSegment =
  | { type: "html"; html: string }
  | { type: "og"; url: string; data: OGData };

const VIDEO_URL_PATTERN = /\.(mp4|webm|ogg|mov|m4v)(\?[^"']*)?$/i;

// Initialize Shiki highlighter
const getHighlighter = (() => {
  let highlighter: Highlighter | null = null;
  return async () => {
    if (!highlighter) {
      highlighter = await createHighlighter({
        themes: ["github-dark-dimmed"],
        langs: ["javascript", "typescript", "kotlin", "java", "python", "html", "css", "json", "bash", "rust", "go", "yaml", "markdown"],
      });
    }
    return highlighter;
  };
})();

export async function BlogPostContent({ slug }: { slug: string }) {
  const postData = await getPostBySlug(slug);
  if (!postData || !postData.post) notFound();
  const post = postData.post;
  const authorName = await getAuthorName(post.userId);

  await incrementPostViews(post._id.toString());

  const highlighter = await getHighlighter();
  
  const marked = new Marked();
  marked.use(gfmHeadingId());

  // Custom renderer
  const renderer = {
    image(token: Tokens.Image) {
      const { href, text } = token;
      if (href && VIDEO_URL_PATTERN.test(href)) {
        const payload = JSON.stringify({ src: href, caption: text, captionIsLink: false });
        return `<div data-video-payload="${encodeURIComponent(payload)}"></div>`;
      }
      return `<img src="${href}" alt="${text}" class="cursor-zoom-in transition-opacity hover:opacity-95 rounded-3xl border border-white/10 my-8 shadow-2xl" data-post-image="true" data-post-media="true" data-post-type="image" title="Click to enlarge">`;
    },
    code(token: Tokens.Code) {
      const { text, lang } = token;
      const language = lang === "kt" ? "kotlin" : (lang || "text");
      try {
        return highlighter.codeToHtml(text, {
          lang: language,
          theme: "github-dark-dimmed",
        });
      } catch {
        return `<pre><code>${text}</code></pre>`;
      }
    }
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
        const html = await marked.parse(mdChunk);
        segments.push({ type: "html", html: html as string });
      }
    }
    
    const url = match[1];
    const data = await fetchOGData(url);
    segments.push({ type: "og", url, data });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < rawContent.length) {
    const mdChunk = rawContent.slice(lastIndex);
    if (mdChunk.trim()) {
      const html = await marked.parse(mdChunk);
      segments.push({ type: "html", html: html as string });
    }
  }

  const wordCount = rawContent.split(/\s+/).length || 0;
  const readingTime = Math.ceil(wordCount / 200);
  const hasMedia = Boolean(post.thumbnail) || segments.some(s => s.type === "html" && s.html.includes('data-post-media="true"'));

  return (
    <BlogPostView 
      post={JSON.parse(JSON.stringify(post))}
      authorName={authorName}
      segments={segments}
      readingTime={readingTime}
      hasMedia={hasMedia}
    />
  );
}
