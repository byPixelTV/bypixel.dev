"use server";

import { ObjectId } from "mongodb";
import { db, getPostsCollection, Post, SerializedPost } from "../mongo";

interface PostFormData {
  title: string;
  shortDescription: string;
  thumbnail: string;
  slug: string;
  draft: boolean;
  content: string;
}

const defaultThumbnail = "https://cdn.bypixel.dev/raw/FIwMLM.png";

function toPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

// Helper function to validate and sanitize thumbnail URL
function validateThumbnailUrl(url: string): string | undefined {
  if (!url || url.trim() === "") {
    return undefined; // Return undefined for empty strings
  }

  const trimmedUrl = url.trim();

  // Check if it's a valid URL format
  try {
    new URL(trimmedUrl);
    return trimmedUrl;
  } catch {
    // If not a valid URL, try adding https://
    try {
      if (
        !trimmedUrl.startsWith("http://") &&
        !trimmedUrl.startsWith("https://")
      ) {
        new URL(`https://${trimmedUrl}`);
        return `https://${trimmedUrl}`;
      }
    } catch {
      // If still invalid, return undefined
      return undefined;
    }
  }

  return trimmedUrl;
}

export async function getPosts() {
  try {
    const collection = await getPostsCollection();
    const posts = await collection.find({ }).toArray();

    // ObjectId → string serialisieren
    const serialized = posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
    }));

    return { posts: serialized, error: null };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { posts: [], error: "Failed to fetch posts" };
  }
}

export async function getPostBySlug(slug: string): Promise<{
  post: Post | null;
  error: string | null;
}> {
  try {
    const collection = await getPostsCollection();
    const post = await collection.findOne({ slug, draft: false });

    if (!post) {
      return {
        post: null,
        error: "Post not found",
      };
    }
    return {
      post,
      error: null,
    };
  } catch (error) {
    return {
      post: null,
      error: error instanceof Error ? error.message : "Failed to fetch post",
    };
  }
}

export async function incrementPostViews(postId: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const collection = await getPostsCollection();
    await collection.updateOne(
      { _id: new ObjectId(postId) },
      { $inc: { views: 1 } }
    );
    return { success: true, error: null };
  }
  catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to increment views",
    };
  }
}

export async function getAuthorName(userId: string): Promise<string> {
  try {
    const user = await db.collection("user").findOne({ _id: new ObjectId(userId) });
    return user?.name || "Unknown";
  } catch {
    return "Unknown";
  }
}

export async function createPost(postData: Post, userId: string) {
  try {
    // Validate and sanitize thumbnail URL
    const thumbnailUrl = validateThumbnailUrl(postData.thumbnail ?? defaultThumbnail) || defaultThumbnail;
    const collection = await getPostsCollection();

    // Map camelCase form data to hyphenated database field names
    const documentData: Post = {
      title: postData.title,
      shortDescription: postData.shortDescription,
      slug: postData.slug,
      draft: postData.draft,
      content: postData.content,
      userId: userId,
      creationDate: new Date().toISOString(),
      _id: new ObjectId,
      views: 0
    };

    // Only add thumbnail if it's a valid URL
    if (thumbnailUrl) {
      documentData.thumbnail = thumbnailUrl;
    }

    const result = await collection.insertOne(documentData);
    return { success: true, data: toPlainObject(result) };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create post",
    };
  }
}

export async function createPostByFormData(postData: PostFormData, userId: string) {
  return createPost(postData as Post, userId);
}

export async function updatePost(postId: string, postData: PostFormData, originalPost?: SerializedPost) {
  try {
    // Validate and sanitize thumbnail URL
    const thumbnailUrl = validateThumbnailUrl(postData.thumbnail);

    // Check if only the draft status is being changed
    // If originalPost is not provided, always set updateDate for safety
    let onlyDraftChanged = false;
    if (originalPost) {
      const fieldsToCheck = ["title", "shortDescription", "slug", "content", "thumbnail"];
      onlyDraftChanged =
        fieldsToCheck.every(
          (field) => postData[field as keyof PostFormData] === originalPost[field as keyof Post]
        ) && postData.draft !== originalPost.draft;
    }

    // Build document data
    const documentData: Partial<Post> & {
      thumbnail?: string | null;
    } = {
      title: postData.title,
      shortDescription: postData.shortDescription,
      slug: postData.slug,
      draft: postData.draft,
      content: postData.content,
      // @ts-expect-error thumbnail can be null, because undefined just ignores it and does not remove it
      thumbnail: thumbnailUrl || null,
    };

    // Only set updateDate if more than just draft is being changed
    if (!onlyDraftChanged) {
      documentData.updateDate = new Date().toISOString();
    }

    const collection = await getPostsCollection();

    const result = await collection.updateOne(
      { _id: new ObjectId(postId) },
      { $set: documentData }
    );
    return { success: true, data: toPlainObject(result) };
  } catch (error) {
    console.error("Error updating post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update post",
    };
  }
}

export async function deletePost(postId: string) {
  try {
    const collection = await getPostsCollection();
    await collection.deleteOne({ _id: new ObjectId(postId) });
    return { success: true };
  } catch (error) {
    
    console.error("Error deleting post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete post",
    };
  }
}
