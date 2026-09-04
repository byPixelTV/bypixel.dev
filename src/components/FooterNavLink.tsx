"use client";

import { usePathname, useRouter } from "next/navigation";

import RollText from "@/components/portfolio/RollText";

interface FooterNavLinkProps {
  href: string;
  children: string;
}

export default function FooterNavLink({ href, children }: FooterNavLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  const targetPath = href.split("#")[0].split("?")[0];

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (pathname === targetPath) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    router.push(href, {
      scroll: true,
    });
  };

  return (
    <a href={href} onClick={handleClick}>
      <RollText>{children}</RollText>
    </a>
  );
}
