import "server-only";
import { ObjectId } from "mongodb";
import { db, getPostsCollection, type Post } from "@/lib/mongo";

export type BlogPostSummary = Omit<Post, "_id" | "content"> & { _id: string; authorName: string };

/** Callers must authenticate before enabling drafts. No shared cache contains private posts. */
export async function getPostSummaries(includeDrafts = false): Promise<BlogPostSummary[]> {
  const collection = await getPostsCollection();
  const posts = await collection
    .find<Omit<Post, "content">>(includeDrafts ? {} : { draft: false }, {
      projection: { content: 0 },
    })
    .sort({ creationDate: -1 })
    .toArray();
  const authorIds = [...new Set(posts.map((post) => post.userId))].filter((id) =>
    ObjectId.isValid(id),
  );
  const authors = authorIds.length
    ? await db
        .collection("user")
        .find(
          { _id: { $in: authorIds.map((id) => new ObjectId(id)) } },
          { projection: { name: 1 } },
        )
        .toArray()
    : [];
  const names = new Map(
    authors.map((author) => [author._id.toString(), String(author.name || "Unknown")]),
  );
  return posts.map((post) => ({
    ...post,
    _id: post._id.toString(),
    authorName: names.get(post.userId) ?? "Unknown",
  }));
}
