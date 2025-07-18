'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { Icon } from "@iconify/react";

const navItems = {
  home: 'Home',
  projects: 'Projects',
  blog: 'Blog',
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (slug: string) => {
    if (slug === 'home') return pathname === '/';
    return pathname.startsWith(`/${slug}`);
  };

  const handleBackdropKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setMobileMenuOpen(false);
    }
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-300/30">
                  <Image
                    src="/profile.gif"
                    alt="byPixelTV"
                    unoptimized={true}
                    width={40}
                    height={40}
                    className="object-cover"
                    style={{
                      maxWidth: "100%",
                      height: "auto"
                    }} />
                </div>
                <span className="text-white font-bold text-lg">byPixelTV</span>
              </div>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center space-x-8">
                {Object.entries(navItems).map(([slug, label]) => (
                  <Link
                    key={slug}
                    href={slug === 'home' ? '/' : `/${slug}`}
                    onMouseEnter={() => router.prefetch(slug === 'home' ? '/' : `/${slug}`)}
                    className={`transition-colors duration-200 font-medium ${
                      isActive(slug)
                        ? 'text-white'
                        : 'text-white/80 hover:text-white'
                    }`}
                    aria-label={label}
                    aria-current={isActive(slug) ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              <div className="hidden md:flex items-center gap-3">
                <a
                  href="mailto:contact@bypixel.dev"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg border border-white/20 transition-all duration-200 font-medium"
                  aria-label="Contact"
                >
                  📧 Contact
                </a>

                <a
                  href="https://dsc.gg/bypixeltv"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg border border-white/20 transition-all duration-200 font-medium"
                  aria-label="Contact"
                >
                  <Icon icon="ic:baseline-discord" height="25" width="25" />
                </a>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white"
                aria-label="Menu"
                type="button"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="md:hidden absolute inset-0 bg-black/20 backdrop-blur-sm"
            role="button"
            tabIndex={0}
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
            onKeyDown={handleBackdropKeyDown}
          ></div>

          <div
            className="md:hidden absolute top-20 left-4 right-4 z-50 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl p-4"
            role="menu"
            tabIndex={0}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleMenuKeyDown}
          >
            <div className="flex flex-col space-y-4">
              {Object.entries(navItems).map(([slug, label]) => (
                <Link
                  key={slug}
                  href={slug === 'home' ? '/' : `/${slug}`}
                  className={`transition-colors duration-200 font-medium ${
                    isActive(slug)
                      ? 'text-white'
                      : 'text-white/80 hover:text-white'
                  }`}
                  aria-label={label}
                  aria-current={isActive(slug) ? 'page' : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <a
                href="mailto:contact@bypixel.dev"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg border border-white/20 transition-all duration-200 font-medium"
                aria-label="Contact"
                onClick={() => setMobileMenuOpen(false)}
              >
                📧 Contact
              </a>
              <a
                href="https://dsc.gg/bypixeltv"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg border border-white/20 transition-all duration-200 font-medium"
                aria-label="Discord"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon icon="ic:baseline-discord" height="25" width="25" />
                Discord
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
