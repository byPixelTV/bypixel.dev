import { NextResponse } from "next/server";
import { serverDatabases } from "@/lib/appwrite/server";
import { Query } from "node-appwrite";
import { Posts } from "../../../../../types/appwrite";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params; 

  try {
    const response = await serverDatabases.listDocuments(
      "685a9e8a0021f75d1389",
      "685a9ec7002f9eb12d08",
      [
        Query.equal("slug", slug),
        Query.equal("draft", false)
      ]
    );

    if (response.documents.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const post = response.documents[0] as unknown as Posts;
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return NextResponse.json({ error: "Failed to load post" }, { status: 500 });
  }
}