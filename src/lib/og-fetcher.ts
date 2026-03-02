export interface OGData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  siteName?: string;
  favicon?: string;
  themeColor?: string;
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#([0-9]+);/g, (_, dec) =>
      String.fromCodePoint(parseInt(dec, 10))
    )
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, "\u00a0");
}

export async function fetchOGData(url: string): Promise<OGData> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        Accept: "text/html,application/xhtml+xml",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return { url };

    const html = await response.text();

    /**
     * Extract content from a <meta> tag by property or name attribute.
     * Handles both attribute orders: property/name before content, and content before property/name.
     */
    const getMetaContent = (property: string): string | undefined => {
      // property/name attr first, then content attr
      const a =
        html.match(
          new RegExp(
            `<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']+)["']`,
            "i"
          )
        ) ||
        // content attr first, then property/name attr
        html.match(
          new RegExp(
            `<meta[^>]*content=["']([^"']+)["'][^>]*(?:property|name)=["']${property}["']`,
            "i"
          )
        );
      return a?.[1];
    };

    const rawTitle =
      getMetaContent("og:title") ||
      html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];

    const rawDescription =
      getMetaContent("og:description") || getMetaContent("description");

    const { hostname } = new URL(url);

    return {
      title: rawTitle ? decodeHtmlEntities(rawTitle.trim()) : undefined,
      description: rawDescription ? decodeHtmlEntities(rawDescription.trim()) : undefined,
      image: getMetaContent("og:image"),
      url: getMetaContent("og:url") || url,
      siteName: getMetaContent("og:site_name") || hostname,
      favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`,
      themeColor: getMetaContent("theme-color"),
    };
  } catch (error) {
    console.error(`Failed to fetch OG data for ${url}:`, error);
    return { url };
  }
}
