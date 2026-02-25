import { NextResponse } from "next/server";

// This endpoint has been replaced by a Server Action.
// All Spotify logic now lives in src/lib/actions/spotify.ts
export function GET() {
  return NextResponse.json({ error: "Gone" }, { status: 410 });
}
