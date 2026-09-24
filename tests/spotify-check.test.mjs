import { expect, test } from "bun:test";
import { spawnSync } from "node:child_process";

function diagnostic(responses) {
  const scriptUrl = new URL("../scripts/check-spotify.mjs", import.meta.url).href;
  return spawnSync(
    "node",
    [
      "--input-type=module",
      "-e",
      `
    const responses = ${JSON.stringify(responses)};
    let calls = 0;
    globalThis.fetch = async () => {
      const response = responses[calls++];
      if (!response) throw new Error("Unexpected extra request");
      return Response.json(response.body, { status: response.status, headers: response.headers });
    };
    await import(${JSON.stringify(scriptUrl)});
    console.log("REQUEST_COUNT=" + calls);
  `,
    ],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        SPOTIFY_CLIENT_ID: "diagnostic-client",
        SPOTIFY_CLIENT_SECRET: "diagnostic-secret",
        SPOTIFY_REFRESH_TOKEN: "diagnostic-refresh",
      },
    },
  );
}

test("diagnostic reports quota and cooldown, stops before history, and hides tokens", () => {
  const result = diagnostic([
    { status: 200, body: { access_token: "private-access-token" } },
    {
      status: 429,
      headers: { "Retry-After": "120" },
      body: { error: { reason: "QUOTA_EXCEEDED" } },
    },
  ]);
  expect(result.status).toBe(1);
  expect(result.stdout).toContain("HTTP 429");
  expect(result.stdout).toContain("REQUEST_COUNT=2");
  expect(result.stderr).toContain("quota exceeded");
  expect(result.stderr).toContain("120");
  expect(result.stdout + result.stderr).not.toContain("private-access-token");
  expect(result.stdout + result.stderr).not.toContain("diagnostic-secret");
});

test("diagnostic prints the actual playback and history tracks", () => {
  const result = diagnostic([
    { status: 200, body: { access_token: "private-access-token" } },
    { status: 200, body: { is_playing: true, item: { id: "live", name: "Live track" } } },
    { status: 200, body: { items: [{ track: { id: "history", name: "History track" } }] } },
  ]);
  expect(result.status).toBe(0);
  expect(result.stdout).toContain("Live track");
  expect(result.stdout).toContain("History track");
  expect(result.stdout).toContain("REQUEST_COUNT=3");
  expect(result.stdout + result.stderr).not.toContain("private-access-token");
});
