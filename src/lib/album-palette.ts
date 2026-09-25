/** Accent extraction: neutral backgrounds never dilute small, colorful regions. */
export const albumFallback = ["rgb(139 92 246)", "rgb(192 132 252)", "rgb(120 80 205)"];

type Swatch = { count: number; rgb: number[]; saturation: number; chroma: number; hue: number };
const hueDistance = (a: number, b: number) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));

export function extractAlbumPalette(pixels: ArrayLike<number>): string[] {
  const buckets = new Map<number, Swatch>();
  let opaquePixels = 0;
  for (let i = 0; i + 3 < pixels.length; i += 4) {
    if (pixels[i + 3] < 200) continue;
    opaquePixels++;
    const rgb = [pixels[i], pixels[i + 1], pixels[i + 2]];
    const max = Math.max(...rgb) / 255;
    const min = Math.min(...rgb) / 255;
    const chroma = max - min;
    const saturation = max ? chroma / max : 0;
    // Ignore paper, shadows, and compression noise, but retain muted/pastel accents.
    if (max < 0.12 || saturation < 0.18 || chroma < 0.055) continue;
    const [r, g, b] = rgb.map((channel) => channel / 255);
    let hue =
      max === r ? (g - b) / chroma : max === g ? (b - r) / chroma + 2 : (r - g) / chroma + 4;
    hue = (hue * 60 + 360) % 360;
    const key = Math.floor(hue / 15);
    const bucket = buckets.get(key) ?? {
      count: 0,
      rgb: [0, 0, 0],
      saturation: 0,
      chroma: 0,
      hue: (key + 0.5) * 15,
    };
    bucket.count++;
    rgb.forEach((channel, index) => {
      bucket.rgb[index] += channel;
    });
    bucket.saturation += saturation;
    bucket.chroma += chroma;
    buckets.set(key, bucket);
  }
  // Suppress isolated pixels without discarding accents occupying well under 1% of a cover.
  const minimum = Math.max(3, Math.ceil(opaquePixels * 0.0008));
  const candidates = Array.from(buckets.values()).filter((bucket) => bucket.count >= minimum);
  const score = (swatch: Swatch) =>
    Math.sqrt(swatch.count) *
    (0.3 + swatch.saturation / swatch.count) ** 2 *
    (0.5 + swatch.chroma / swatch.count);
  candidates.sort((a, b) => score(b) - score(a));
  const selected: Swatch[] = [];
  for (const candidate of candidates) {
    if (selected.every((other) => hueDistance(candidate.hue, other.hue) >= 30))
      selected.push(candidate);
    if (selected.length === 3) break;
  }
  if (!selected.length) return [...albumFallback];
  return [0, 1, 2].map((index) => {
    const swatch = selected[index % selected.length];
    const average = swatch.rgb.map((value) => value / swatch.count);
    const peak = Math.max(...average);
    // Lift dark accents for the dark UI without shifting their hue or adding grey.
    const lift = Math.max(180, Math.min(235, peak)) / peak;
    const tone = index >= selected.length ? (index === 1 ? 1.08 : 0.86) : 1;
    return `rgb(${average.map((value) => Math.round(Math.min(255, value * lift * tone))).join(" ")})`;
  });
}
