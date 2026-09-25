import { afterEach, expect, mock, setSystemTime, test } from "bun:test";

mock.module("server-only", () => ({}));
const { createArtistImageLookup, withArtistImages } = await import("../src/lib/artist-images");
const originalFetch = globalThis.fetch;
const image = "https://cdn-images.dzcdn.net/images/artist/test/250x250.jpg";
const artistResponse = (name = "NF", picture_medium = image) =>
  Response.json({
    data: [
      { name: "NF!", picture_medium: image + "wrong" },
      { name, picture_medium },
    ],
  });
afterEach(() => {
  globalThis.fetch = originalFetch;
  setSystemTime();
});

test("exact artist matching skips an unrelated first result and shares concurrent lookups", async () => {
  const lookup = createArtistImageLookup();
  globalThis.fetch = mock(async () => artistResponse());
  expect(await Promise.all(Array.from({ length: 10 }, () => lookup("NF")))).toEqual(
    Array(10).fill(image),
  );
  expect(await lookup(" nf ")).toBe(image);
  expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  expect(globalThis.fetch.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
});

test("Spotify images are retained without contacting Deezer", async () => {
  globalThis.fetch = mock();
  const artists = [{ id: "nf", name: "NF", imageUrl: "https://i.scdn.co/image/test", genres: [] }];
  expect(await withArtistImages(artists)).toEqual(artists);
  expect(globalThis.fetch).not.toHaveBeenCalled();
});

test("missing matches, invalid images and API failures remain harmless and are cached briefly", async () => {
  for (const response of [
    () => artistResponse("Different artist"),
    () => artistResponse("NF", "https://example.com/photo.jpg"),
    () => artistResponse("NF", "http://cdn-images.dzcdn.net/images/artist/test.jpg"),
    () => Response.json({ error: { code: 4 } }),
    () => new Response(null, { status: 429 }),
    () => new Response("invalid json"),
    () => {
      throw new Error("timeout");
    },
  ]) {
    setSystemTime(new Date("2035-01-01T00:00:00Z"));
    const lookup = createArtistImageLookup();
    globalThis.fetch = mock(async () => response());
    expect(await lookup("NF")).toBeUndefined();
    expect(await lookup("NF")).toBeUndefined();
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    setSystemTime(new Date("2035-01-01T00:05:01Z"));
    globalThis.fetch = mock(async () => artistResponse());
    expect(await lookup("NF")).toBe(image);
  }
});

test("cached images survive a provider outage after their daily refresh expires", async () => {
  setSystemTime(new Date("2035-02-01T00:00:00Z"));
  const lookup = createArtistImageLookup();
  globalThis.fetch = mock(async () => artistResponse());
  expect(await lookup("NF")).toBe(image);
  setSystemTime(new Date("2035-02-01T23:59:00Z"));
  expect(await lookup("NF")).toBe(image);
  expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  setSystemTime(new Date("2035-02-02T00:00:01Z"));
  globalThis.fetch = mock(async () => {
    throw new Error("offline");
  });
  expect(await lookup("NF")).toBe(image);
  expect(await lookup("NF")).toBe(image);
  expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  setSystemTime(new Date("2035-02-02T00:05:02Z"));
  globalThis.fetch = mock(async () => artistResponse("NF", image + "new"));
  expect(await lookup("NF")).toBe(image + "new");
});
