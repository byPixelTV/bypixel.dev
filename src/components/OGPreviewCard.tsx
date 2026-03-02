"use client";

import { useState } from "react";
import Image from "next/image";
import { OGData } from "@/lib/og-fetcher";
import { Check, Copy, ExternalLink } from "lucide-react";

interface OGPreviewCardProps {
  data: OGData;
  href: string;
}

export default function OGPreviewCard({ data, href }: OGPreviewCardProps) {
  const [copied, setCopied] = useState(false);

  const displayHostname = (() => {
    try {
      return new URL(href).hostname;
    } catch {
      return href;
    }
  })();

  const displayPath = (() => {
    try {
      const u = new URL(href);
      const p = u.pathname + u.search;
      return p === "/" ? "" : p;
    } catch {
      return "";
    }
  })();

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  const accentColor = data.themeColor;

  return (
    <div
      className="not-prose my-6 flex flex-col sm:flex-row overflow-hidden rounded-xl border border-white/10 bg-white/5 w-full group cursor-pointer hover:bg-white/10 transition-colors duration-200"
      onClick={() => window.open(href, "_blank", "noopener,noreferrer")}
    >
      {/* Theme-color accent bar */}
      {accentColor && (
        <div
          className="w-full sm:w-1 h-1 sm:h-auto shrink-0"
          style={{ backgroundColor: accentColor }}
        />
      )}

      {/* OG image */}
      {data.image && (
        <div className="relative w-full sm:w-52 shrink-0 aspect-video sm:aspect-auto">
          <Image
            src={data.image}
            alt={data.title ?? "Link preview"}
            fill
            sizes="(max-width: 640px) 100vw, 208px"
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      {/* Text content */}
      <div className="flex flex-col justify-between gap-3 p-4 min-w-0 flex-1">
        <div className="min-w-0 space-y-1">
          {data.title && (
            <p className="text-white font-semibold text-base leading-snug line-clamp-2">
              {data.title}
            </p>
          )}
          {data.description && (
            <p className="text-gray-400 text-sm leading-snug line-clamp-2">
              {data.description}
            </p>
          )}
        </div>

        {/* Footer row */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Favicon + URL */}
          <div className="flex items-center gap-2 min-w-0 flex-1 truncate">
            {data.favicon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.favicon}
                alt=""
                width={14}
                height={14}
                className="rounded-sm shrink-0"
              />
            )}
            <div className="flex items-center gap-1 text-xs min-w-0 truncate">
              {data.siteName && data.siteName !== displayHostname && (
                <>
                  <span className="shrink-0 font-medium text-gray-400">
                    {data.siteName}
                  </span>
                  <span className="shrink-0 text-gray-600">·</span>
                </>
              )}
              <span className="truncate">
                <span className="text-gray-400">{displayHostname}</span>
                {displayPath && (
                  <span className="text-gray-600">{displayPath}</span>
                )}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleCopy}
              title={copied ? "Copied!" : "Copy link"}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { e.stopPropagation(); }}
              title="Open link"
              className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Open</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

