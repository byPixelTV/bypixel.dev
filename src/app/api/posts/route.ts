import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { db, getPostsCollection } from "@/lib/mongo";

export async function GET() {
  try {
    const collection = await getPostsCollection();
    const posts = await collection
      .find({ draft: false })
      .sort({ creationDate: -1 })
      .toArray();

    const authorNameCache = new Map<string, string>();

    const serializedPosts = await Promise.all(
      posts.map(async (post) => {
        let authorName: string | undefined = authorNameCache.get(post.userId);

        if (!authorName) {
          try {
            const user = await db.collection("user").findOne({ _id: new ObjectId(post.userId) });
            authorName = user?.name || "Unknown";
          } catch {
            authorName = "Unknown";
          }
          const cachedAuthorName = authorName ?? "Unknown";
          authorNameCache.set(post.userId, cachedAuthorName);
        }

        const resolvedAuthorName = authorName ?? "Unknown";

        return {
          ...post,
          _id: post._id.toString(),
          authorName: resolvedAuthorName,
        };
      })
    );

    return NextResponse.json({ posts: serializedPosts });
  } catch (error) {
    console.error("Error loading posts:", error);
    return NextResponse.json({ posts: [], error: "Failed to load posts" }, { status: 500 });
  }
}