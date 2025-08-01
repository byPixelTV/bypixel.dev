import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PlausibleProvider from 'next-plausible'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PlausibleProvider domain="bypixel.dev">{children}</PlausibleProvider>
      </body>
    </html>
  );
}
