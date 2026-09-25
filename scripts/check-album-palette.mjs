import assert from "node:assert/strict";
import { test } from "node:test";
import { extractAlbumPalette, albumFallback } from "../src/lib/album-palette.ts";

function cover(regions) {
  return new Uint8ClampedArray(
    regions.flatMap(([count, color]) =>
      Array.from({ length: count }, () => [...color, 255]).flat(),
    ),
  );
}
const rgb = (color) => color.match(/\d+/g).map(Number);

test("small red and blue accents survive a 98% grey background", () => {
  const palette = extractAlbumPalette(
    cover([
      [9800, [220, 220, 220]],
      [100, [215, 30, 50]],
      [100, [25, 80, 225]],
    ]),
  );
  const colors = palette.map(rgb);
  assert.ok(colors.some(([r, g, b]) => r > g * 2 && r > b * 2));
  assert.ok(colors.some(([r, g, b]) => b > r * 2 && b > g * 2));
  assert.ok(colors.every((color) => Math.max(...color) - Math.min(...color) > 100));
});
test("three distinct accents are preserved instead of averaged into grey", () => {
  const colors = extractAlbumPalette(
    cover([
      [100, [220, 20, 20]],
      [100, [20, 220, 20]],
      [100, [20, 20, 220]],
    ]),
  ).map(rgb);
  for (let channel = 0; channel < 3; channel++)
    assert.ok(colors.some((color) => color[channel] === Math.max(...color)));
});
test("a small pastel accent is retained against white", () => {
  const colors = extractAlbumPalette(
    cover([
      [9900, [250, 250, 250]],
      [100, [180, 210, 245]],
    ]),
  ).map(rgb);
  assert.ok(colors.every(([r, , b]) => b > r + 35));
});
test("monochrome and isolated color noise use the purple fallback", () => {
  assert.deepEqual(
    extractAlbumPalette(
      cover([
        [5000, [255, 255, 255]],
        [5000, [20, 20, 20]],
        [1, [255, 0, 0]],
      ]),
    ),
    albumFallback,
  );
  assert.deepEqual(extractAlbumPalette(new Uint8ClampedArray()), albumFallback);
});
test("transparent pixels do not introduce an accent", () => {
  assert.deepEqual(
    extractAlbumPalette(new Uint8ClampedArray(Array(100).fill([255, 0, 0, 0]).flat())),
    albumFallback,
  );
});
test("a lone dark accent is brightened without inventing new hues", () => {
  const colors = extractAlbumPalette(cover([[1000, [12, 70, 30]]])).map(rgb);
  assert.ok(colors.every(([r, g, b]) => g >= 150 && g > b * 2 && b > r));
});
