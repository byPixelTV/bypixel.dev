"use server";

import { serverDatabases, serverUsers } from "@/lib/appwrite/server";
import { Posts } from "../../../types/appwrite";

interface PostFormData {
  title: string;
  shortDescription: string;
  thumbnail: string;
  slug: string;
  draft: boolean;
  content: string;
}

// Define the database document structure
interface PostDocumentData {
  title: string;
  "short-description": string;
  "post-slug": string;
  draft: boolean;
  content: string;
  "user-id": string;
  "creation-date": string;
  thumbnail?: string; // Optional field
  "update-date"?: string; // Optional field for updates
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

export async function getPosts(): Promise<{
  posts: Posts[];
  error: string | null;
}> {
  try {
    const response = await serverDatabases.listDocuments(
      "685a9e8a0021f75d1389",
      "685a9ec7002f9eb12d08"
    );

    return {
      posts: response.documents as Posts[],
      error: null,
    };
  } catch (error) {
    return {
      posts: [],
      error: error instanceof Error ? error.message : "Failed to load posts",
    };
  }
}

export async function getAuthorName(userId: string): Promise<string> {
  try {
    const user = await serverUsers.get(userId);
    return user.name || "Unknown";
  } catch {
    return "Unknown";
  }
}

export async function createPost(postData: PostFormData, userId: string) {
  try {
    // Validate and sanitize thumbnail URL
    const thumbnailUrl = validateThumbnailUrl(postData.thumbnail);

    // Map camelCase form data to hyphenated database field names
    const documentData: PostDocumentData = {
      title: postData.title,
      "short-description": postData.shortDescription,
      "post-slug": postData.slug,
      draft: postData.draft,
      content: postData.content,
      "user-id": userId,
      "creation-date": new Date().toISOString(),
    };

    // Only add thumbnail if it's a valid URL
    if (thumbnailUrl) {
      documentData.thumbnail = thumbnailUrl;
    }

    const result = await serverDatabases.createDocument(
      "685a9e8a0021f75d1389",
      "685a9ec7002f9eb12d08",
      "unique()",
      documentData
    );
    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create post",
    };
  }
}

export async function updatePost(postId: string, postData: PostFormData) {
  try {
    // Validate and sanitize thumbnail URL
    const thumbnailUrl = validateThumbnailUrl(postData.thumbnail);

    // Map camelCase form data to hyphenated database field names
    // For updates, we use Partial to allow optional fields
    const documentData: Partial<PostDocumentData> & {
      thumbnail?: string | null;
    } = {
      title: postData.title,
      "short-description": postData.shortDescription,
      "post-slug": postData.slug,
      draft: postData.draft,
      content: postData.content,
      // @ts-expect-error thumbnail can be null, because undefined just ignores it and does not remove it
      thumbnail: thumbnailUrl || null,
      "update-date": new Date().toISOString(),
    };

    const result = await serverDatabases.updateDocument(
      "685a9e8a0021f75d1389",
      "685a9ec7002f9eb12d08",
      postId,
      documentData
    );
    return { success: true, data: result };
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
    await serverDatabases.deleteDocument(
      "685a9e8a0021f75d1389",
      "685a9ec7002f9eb12d08",
      postId
    );
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete post",
    };
  }
}
