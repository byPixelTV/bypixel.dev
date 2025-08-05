"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface PrefetchLinkButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  href: string;
  children: React.ReactNode;
}

export function PrefetchLinkButton({ href, children, ...props }: PrefetchLinkButtonProps) {
  const router = useRouter();

  const onHover = () => {
    router.prefetch(href);
  };

  return (
    <button
      onMouseEnter={onHover}
      onFocus={onHover} // Für Accessibility, wenn per Tastatur fokusiert wird
      {...props}
    >
      {children}
    </button>
  );
}
