import type { ReactNode } from "react";
import BackgroundLayout from "@/components/BackgroundLayout";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <BackgroundLayout>
      <Navbar />
      <div className="blog-route-content">{children}</div>
      <SiteFooter />
    </BackgroundLayout>
  );
}
