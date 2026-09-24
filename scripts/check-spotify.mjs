import nextEnv from "@next/env";

// Use the same environment-file precedence as Next.js. Never print credentials.
const production = process.argv.includes("--production");
nextEnv.loadEnvConfig(process.cwd(), !production);

async function check() {
  const names = ["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET", "SPOTIFY_REFRESH_TOKEN"];
  const missing = names.filter((name) => !process.env[name]?.trim());
  if (missing.length) {
    console.error("Missing environment variables:", missing.join(", "));
    process.exitCode = 1;
    return;
  }
  console.log("Spotify direct check:", new Date().toISOString());
  console.log("Uses this machine's environment, bypasses the widget cache, and does not retry.");
  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET,
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    }),
    signal: AbortSignal.timeout(10000),
  });
  console.log("OAuth token: HTTP", tokenResponse.status);
  const token = await tokenResponse.json().catch(() => null);
  if (!tokenResponse.ok) {
    reportFailure(tokenResponse, token);
    process.exitCode = 1;
    return;
  }
  if (!token?.access_token) {
    console.error("OAuth response contained no access token.");
    process.exitCode = 1;
    return;
  }
  for (const path of ["player/currently-playing", "player/recently-played?limit=1"]) {
    const response = await fetch("https://api.spotify.com/v1/me/" + path, {
      headers: { Authorization: "Bearer " + token.access_token },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    console.log(path + ": HTTP " + response.status);
    if (response.status === 204) {
      console.log("Spotify reports no current playback.");
      continue;
    }
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      reportFailure(response, data);
      process.exitCode = 1;
      // A 429 means stop all further requests, including other endpoints.
      if (response.status === 429) return;
      continue;
    }
    const item = data?.item ?? data?.items?.[0]?.track;
    console.log(
      JSON.stringify(
        {
          isPlaying: data?.is_playing,
          type: data?.currently_playing_type,
          trackId: item?.id,
          title: item?.name,
          artists: item?.artists?.map((artist) => artist.name),
          progressMs: data?.progress_ms,
          durationMs: item?.duration_ms,
          playedAt: data?.items?.[0]?.played_at,
          stateChangedAt: data?.timestamp,
        },
        null,
        2,
      ),
    );
  }
}

function reportFailure(response, data) {
  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After");
    console.error(
      data?.error?.reason === "QUOTA_EXCEEDED"
        ? "Spotify development quota exceeded."
        : "Spotify rate/quota limit reached.",
    );
    console.error("Retry-After (seconds):", retryAfter ?? "not provided");
    const seconds = Number(retryAfter);
    if (seconds > 0 && Number.isFinite(seconds)) {
      console.error("Do not retry before:", new Date(Date.now() + seconds * 1000).toISOString());
    }
  } else if (response.status === 401) {
    console.error("Authentication rejected; check Spotify credentials/authorization.");
  } else if (response.status === 403) {
    console.error("Access denied; check Spotify scopes, app access and account eligibility.");
  } else {
    // Only print known OAuth codes, never arbitrary OAuth payloads.
    const known = ["invalid_grant", "invalid_client", "invalid_request"];
    console.error("Spotify request failed.", known.includes(data?.error) ? data.error : "");
  }
}

await check().catch(() => {
  console.error("Spotify diagnostic failed due to a network, timeout or response error.");
  process.exitCode = 1;
});
