import "server-only";
import { cache } from "react";
import { getPostBySlug } from "@/lib/actions/blog";

// Request-local only: metadata and content share a read, private drafts never enter a shared cache.
export const getReadablePost = cache((slug: string) =>
  getPostBySlug(slug, { includeDraftsForAdmin: true }),
);
