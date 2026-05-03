// For adding custom fonts with other frameworks, see:
// https://tailwindcss.com/docs/font-family
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import 'lenis/dist/lenis.css'
import SmoothScroll from "@/components/scroll/SmoothScroll";
import ScrollToTop from "@/components/scroll/ScrollToTop";
import PageLoader from "@/components/scroll/PageLoader";
import { Suspense } from "react";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "bypixel.dev",
  description: "Welcome to my personal website, a portfolio and blog showcasing my work as a software developer. Explore my projects, tutorials, and insights into the world of programming. Join me on this journey of coding and creativity!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${fontSans.variable} ${fontMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <PageLoader />
        </Suspense>
        <SmoothScroll>
          {children}
          <ScrollToTop />
        </SmoothScroll>
      </body>
    </html>
  );
}
