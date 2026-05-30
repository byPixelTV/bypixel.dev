"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomVideoPlayer from "@/components/blog/CustomVideoPlayer";
import { SerializedPost } from "@/lib/mongo";
import { Marked, parseInline } from "marked";
import parse, { Element, type HTMLReactParserOptions } from "html-react-parser";

interface PostFormData {
  title: string;
  shortDescription: string;
  thumbnail: string;
  slug: string;
  draft: boolean;
  content: string;
}

interface PostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: SerializedPost;
  onSave: (postData: PostFormData) => Promise<{ success: boolean; error?: string }>;
}

const markdownParser = new Marked({ gfm: true, breaks: true });
const VIDEO_URL_PATTERN = /\.(mp4|webm|ogg|mov|m4v)(\?[^"']*)?$/i;

function renderMediaPayload(src: string, caption: string) {
  return `<div data-video-payload="${encodeURIComponent(JSON.stringify({ src, caption, captionIsLink: false }))}"></div>`;
}

function renderMediaHtml(src: string, alt: string) {
  if (VIDEO_URL_PATTERN.test(src)) {
    return renderMediaPayload(src, alt);
  }

  return `<img src="${src}" alt="${alt}" class="rounded-3xl border border-white/10 my-8 shadow-2xl">`;
}

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

function isStandaloneImageParagraph(token: MarkdownToken): token is MarkdownToken & {
  type: "paragraph";
  tokens: Array<{
    type: "image";
    href: string;
    text: string;
  }>;
} {
  return token.type === "paragraph" && Array.isArray(token.tokens) && token.tokens.length === 1 && token.tokens[0]?.type === "image";
}

function renderCaptionedImageFigure(imageToken: { href: string; text: string }, captionRaw: string) {
  const imageHtml = renderMediaHtml(imageToken.href, imageToken.text);
  const captionHtml = parseInline(captionRaw);

  return [
    "",
    "",
    `<figure class="my-8 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">`,
    imageHtml,
    captionHtml ? `<figcaption class="border-t border-white/10 bg-white/[0.03] px-4 py-3 text-left text-xs sm:text-sm leading-relaxed text-white/55">${captionHtml}</figcaption>` : "",
    `</figure>`,
    "",
    "",
  ].join("");
}

function renderMarkdownPreview(marked: Marked, chunk: string) {
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

const previewParserOptions: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.attribs && domNode.attribs["data-video-payload"]) {
      try {
        const payload = JSON.parse(decodeURIComponent(domNode.attribs["data-video-payload"]));

        return (
          <figure className="my-8 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <CustomVideoPlayer
              src={payload.src}
              className="w-full"
              wrapperProps={{
                "data-post-media": "true",
                "data-post-type": "video",
                "data-post-src": payload.src,
                title: "Inline video preview",
              }}
            />
            {payload.caption && (
              <figcaption className="border-t border-white/10 bg-white/[0.03] px-4 py-3 text-left text-xs sm:text-sm leading-relaxed text-white/55">
                {payload.caption}
              </figcaption>
            )}
          </figure>
        );
      } catch {
        return null;
      }
    }

    // For any other node, do not replace — return undefined to let parser handle it
    return undefined;
  },
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function PostDialog({
  open,
  onOpenChange,
  post,
  onSave,
}: PostDialogProps) {
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    shortDescription: "",
    thumbnail: "",
    slug: "",
    draft: true,
    content: "",
  });
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [slugTouched, setSlugTouched] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const wordCount = useMemo(() => {
    const words = formData.content.trim().split(/\s+/).filter(Boolean);
    return words.length;
  }, [formData.content]);

  const readingTime = useMemo(() => Math.max(1, Math.ceil(wordCount / 200)), [wordCount]);

  const previewHtml = useMemo(() => {
    const content = formData.content.trim();
    if (!content) {
      return "<p><em>Nothing to preview yet. Start writing your post content in Markdown.</em></p>";
    }

    return renderMarkdownPreview(markdownParser, content) as string;
  }, [formData.content]);

  useEffect(() => {
    let cancelled = false;

    if (post) {
      queueMicrotask(() => {
        if (cancelled) return;
        setSlugTouched(true);
        setSubmitError(null);
        setActiveTab("write");
        setFormData({
          title: post.title || "",
          shortDescription: post.shortDescription || "",
          thumbnail: post.thumbnail || "",
          slug: post.slug || "",
          draft: post.draft ?? true,
          content: post.content || "",
        });
      });
    } else {
      queueMicrotask(() => {
        if (cancelled) return;
        setSlugTouched(false);
        setSubmitError(null);
        setActiveTab("write");
        setFormData({
          title: "",
          shortDescription: "",
          thumbnail: "",
          slug: "",
          draft: true,
          content: "",
        });
      });
    }

    return () => {
      cancelled = true;
    };
  }, [post, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setSubmitError("Title is required");
      return;
    }

    if (!formData.shortDescription.trim()) {
      setSubmitError("Short description is required");
      return;
    }

    if (!formData.slug.trim()) {
      setSubmitError("Slug is required");
      return;
    }

    if (!/^[a-z0-9-]+$/.test(formData.slug.trim())) {
      setSubmitError("Slug can only contain lowercase letters, numbers, and hyphens");
      return;
    }

    setSubmitError(null);
    setIsSaving(true);

    const result = await onSave({
      ...formData,
      title: formData.title.trim(),
      shortDescription: formData.shortDescription.trim(),
      slug: formData.slug.trim(),
      content: formData.content.trim(),
      thumbnail: formData.thumbnail.trim(),
    });

    if (!result.success) {
      setSubmitError(result.error || "Failed to save post");
    }

    setIsSaving(false);
  };

  const handleInputChange = (
    field: keyof PostFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field !== "title" && field !== "slug") {
      setSubmitError(null);
    }

    if (field === "title" && !post && !slugTouched && typeof value === "string") {
      setFormData((prev) => ({ ...prev, slug: slugify(value) }));
    }

    if (field === "slug") {
      setSlugTouched(true);
      setSubmitError(null);
    }
  };

  const generateSlugFromTitle = () => {
    const generatedSlug = slugify(formData.title);
    setSlugTouched(true);
    setFormData((prev) => ({ ...prev, slug: generatedSlug }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-lenis-prevent
        data-lenis-prevent-wheel
        className="w-[96vw] max-w-[96vw] xl:max-w-[1600px] bg-black text-white border border-neutral-800 h-[94vh] max-h-[94vh] flex flex-col overflow-hidden p-5 sm:p-6"
      >
        <DialogHeader>
          <DialogTitle className="text-white">
            {post ? "Edit Post" : "Create New Post"}
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            {post
              ? "Make changes to your post here."
              : "Fill in the details to create a new post."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-col flex-1 overflow-hidden">
          {submitError && (
            <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {submitError}
            </div>
          )}

          <div
            onWheelCapture={(event) => event.stopPropagation()}
            className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[340px_minmax(0,1fr)]"
          >
            <aside className="min-h-0 overflow-y-auto overscroll-contain rounded-xl border border-neutral-800 bg-neutral-950/40 p-4">
              <div className="mb-4 border-b border-neutral-800 pb-3">
                <p className="text-sm font-semibold text-white">Post Settings</p>
                <p className="text-xs text-neutral-400">Configure metadata and publishing options.</p>
              </div>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="text-white">
                    Title
                  </Label>
                  <Input
                    id="title"
                    className="bg-neutral-900 text-white border-neutral-700 placeholder:text-neutral-500"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter post title..."
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="shortDescription" className="text-white">
                    Short Description
                  </Label>
                  <Textarea
                    id="shortDescription"
                    className="min-h-24 resize-y bg-neutral-900 text-white border-neutral-700 placeholder:text-neutral-500"
                    value={formData.shortDescription}
                    onChange={(e) =>
                      handleInputChange("shortDescription", e.target.value)
                    }
                    placeholder="Enter short description..."
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="slug" className="text-white">
                      Slug
                    </Label>
                    <Button
                      type="button"
                      onClick={generateSlugFromTitle}
                      variant="outline"
                      className="h-7 border-neutral-700 bg-neutral-900 px-2 text-xs text-neutral-300 hover:bg-neutral-800"
                    >
                      Generate
                    </Button>
                  </div>
                  <Input
                    id="slug"
                    className="bg-neutral-900 text-white border-neutral-700 placeholder:text-neutral-500"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", slugify(e.target.value))}
                    placeholder="enter-post-slug"
                    required
                  />
                  <p className="text-xs text-neutral-500 break-all">
                    URL: /blog/post/{formData.slug || "your-post-slug"}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="draft" className="text-white">
                    Status
                  </Label>
                  <Select
                    value={formData.draft ? "draft" : "published"}
                    onValueChange={(value) =>
                      handleInputChange("draft", value === "draft")
                    }
                  >
                    <SelectTrigger className="bg-neutral-900 text-white border-neutral-700">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 text-white border-neutral-700">
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="thumbnail" className="text-white">
                    Thumbnail URL
                  </Label>
                  <Input
                    id="thumbnail"
                    className="bg-neutral-900 text-white border-neutral-700 placeholder:text-neutral-500"
                    value={formData.thumbnail}
                    onChange={(e) => handleInputChange("thumbnail", e.target.value)}
                    placeholder="https://example.com/image.png"
                  />
                </div>
              </div>
            </aside>

            <section className="min-h-0 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950/40 p-4 flex flex-col">
              <div className="mb-3 flex items-center justify-between gap-3 border-b border-neutral-800 pb-3">
                <div>
                  <p className="text-base font-semibold text-white">Editor</p>
                  <p className="text-xs text-neutral-400">Write your post in Markdown with live preview.</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => setActiveTab("write")}
                    className={activeTab === "write" ? "h-8 bg-white px-3 text-xs text-black" : "h-8 bg-neutral-900 px-3 text-xs text-neutral-300 hover:bg-neutral-800"}
                  >
                    Write
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={activeTab === "preview" ? "h-8 bg-white px-3 text-xs text-black" : "h-8 bg-neutral-900 px-3 text-xs text-neutral-300 hover:bg-neutral-800"}
                  >
                    Preview
                  </Button>
                </div>
              </div>

              <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                <span>{wordCount} words</span>
                <span>{formData.content.length} chars</span>
                <span>{readingTime} min read</span>
              </div>

              {activeTab === "write" ? (
                <Textarea
                  id="content"
                  className="min-h-0 h-full w-full resize-none bg-neutral-900 text-white border-neutral-700 placeholder:text-neutral-500 font-mono text-sm leading-6 overflow-y-auto"
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="# Heading\n\nWrite your post content here..."
                />
              ) : (
                <div className="min-h-0 h-full w-full overflow-y-auto overscroll-contain rounded-lg border border-neutral-800 bg-black p-5">
                  <article className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-neutral-200 prose-a:text-purple-400">
                    {parse(previewHtml, previewParserOptions)}
                  </article>
                </div>
              )}
            </section>
          </div>
          <DialogFooter>
            <Button
              type="button"
              disabled={isSaving}
              onClick={() => onOpenChange(false)}
              className="gap-2 bg-red-600 hover:bg-red-700 text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-white text-black hover:bg-neutral-200"
            >
              {isSaving ? "Saving..." : post ? "Update Post" : "Create Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
