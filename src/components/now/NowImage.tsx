"use client";

import Image from "next/image";
import { useState } from "react";

/** A stable placeholder remains visible until the new image has actually loaded. */
export default function NowImage({
  src,
  alt,
  fallback,
  sizes,
  className = "",
}: {
  src: string;
  alt: string;
  fallback?: string;
  sizes: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <span className={`now-image ${className}`} data-loaded={loaded} data-failed={failed}>
      <span className="now-image-placeholder" aria-hidden="true">
        {fallback}
      </span>
      {!failed && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="now-image-photo"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
