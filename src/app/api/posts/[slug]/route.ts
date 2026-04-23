import { NextResponse } from "next/server";
import { serverTables } from "@/lib/appwrite/server";
import { Query } from "node-appwrite";
import { Posts } from "../../../../../types/appwrite";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params; 

  try {
    const response = await serverTables.listRows({
      databaseId: "685a9e8a0021f75d1389",
      tableId: "685a9ec7002f9eb12d08",
      queries: [
        Query.equal("slug", slug),
        Query.equal("draft", false)
      ],
    });

    if (response.rows.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const post = response.rows[0] as unknown as Posts;
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return NextResponse.json({ error: "Failed to load post" }, { status: 500 });
  }
}