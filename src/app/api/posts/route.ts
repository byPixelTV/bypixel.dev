import { NextResponse } from "next/server";
import { getPostSummaries } from "@/lib/blog-data";
import { isAdminFromHeaders } from "@/lib/session";

export async function GET(request: Request) {
  try {
    const isAdmin = await isAdminFromHeaders(new Headers(request.headers));
    const posts = await getPostSummaries(isAdmin);
    return NextResponse.json({ posts }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Error loading posts:", error);
    return NextResponse.json(
      { posts: [], error: "Failed to load posts" },
      { status: 500, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}
