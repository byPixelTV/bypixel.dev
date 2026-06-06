// This file includes code copied and adapted from:
// https://github.com/AbhiVarde/abhivarde.in/blob/main/app/components/common/Navbar.jsx
// Original work by Abhi Varde, licensed under the MIT License:
// https://github.com/AbhiVarde/abhivarde.in/blob/main/LICENSE
//
// Changes have been made to fit this project’s design and functionality.

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { LuEqual, LuBook, LuUser, LuX } from "react-icons/lu";
import type { Variants } from "framer-motion";

const headerNavLinks = [
  { title: "About", url: "/", icon: <LuUser color="#FFFFFF" /> },
  { title: "Blog", url: "/blog", icon: <LuBook color="#FFFFFF" /> },
];

const sectionLinks = [
  { title: "Top", hash: "#top" },
  { title: "Projects", hash: "#projects" },
  { title: "EraMC", hash: "#eramc" },
  { title: "Skills", hash: "#skills" },
  { title: "Journey", hash: "#journey" },
  { title: "Sourcecode", hash: "#sourcecode" },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSectionsMenuOpen, setIsSectionsMenuOpen] = useState(false);
  const [, setSelected] = useState(pathname);
  const { scrollY } = useScroll();
  const hasCrossedScrollThresholdRef = useRef(false);
  const sectionsMenuRef = useRef<HTMLLIElement | null>(null);
  const sectionHref = (hash: string) => (pathname === "/" ? hash : `/${hash}`);
  const showSectionsNavigation = pathname === "/";

  const handleSectionClick = async (hash: string, event?: React.MouseEvent) => {
    if (event) event.preventDefault();
    const id = hash.replace("#", "");

    const scrollToSelector = (selector: string) => {
      const el = document.getElementById(id) || document.querySelector(selector);
      if (el) {
        (el as Element).scrollIntoView({ behavior: "smooth", block: "start" });
        return true;
      }
      return false;
    };

    if (pathname === "/") {
      // Same page: smooth scroll directly
      if (!scrollToSelector(hash)) {
        // Fallback to setting location.hash so browser can try
        window.location.hash = hash;
      }
    } else {
      // Navigate to home without auto-scrolling, then smooth-scroll when element exists
      router.push(`/#${id}`, { scroll: false });
      // try immediate scroll, otherwise wait a bit for content to mount
      if (!scrollToSelector(hash)) {
        const maxAttempts = 12;
        let attempts = 0;
        const interval = setInterval(() => {
          attempts += 1;
          if (scrollToSelector(hash) || attempts >= maxAttempts) {
            clearInterval(interval);
          }
        }, 50);
      }
    }

    setIsSectionsMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Prefetch all pages on mount
  useEffect(() => {
    headerNavLinks.forEach(({ url }) => {
      // Prefetch only if different from current path to save bandwidth
      if (url !== pathname) {
        router.prefetch(url);
      }
    });
    
    // Also prefetch blog posts list aggressively
    if (pathname !== "/blog") {
      router.prefetch("/blog");
    }
  }, [pathname, router]);

  // Scroll listener for navbar styling
  useMotionValueEvent(scrollY, "change", (latest) => {
    const nextScrolled = latest > 20;
    if (nextScrolled !== hasCrossedScrollThresholdRef.current) {
      hasCrossedScrollThresholdRef.current = nextScrolled;
      setIsScrolled(nextScrolled);
    }
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelected(pathname);
    setIsMobileMenuOpen(false);
    setIsSectionsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!sectionsMenuRef.current) return;
      if (!sectionsMenuRef.current.contains(event.target as Node)) {
        setIsSectionsMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const mobileMenuVariants: Variants = {
    closed: {
      x: -100,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
  };

  const mobileMenuItemVariants: Variants = {
    closed: { x: -40, opacity: 0 },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <>
      <motion.header
        className="fixed left-0 right-0 top-0 z-40 mx-auto flex w-full justify-center transition-all duration-500 ease-in-out"
        initial="hidden"
        animate="visible"
      >
        <motion.nav
          className="mx-auto mt-3 w-[calc(100%-1.5rem)] rounded-3xl px-3 py-2.5 shadow-lg md:mt-4 md:w-[calc(100%-2rem)]"
          initial="top"
          animate={isScrolled ? "scroll" : "top"}
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-4">
            <motion.div className="flex items-center space-x-2 sm:space-x-3" custom={0}>
              <Link href="/" className="brand-mark" aria-label="bypixel.dev home">
                <span className="brand-title">bypixel.dev</span>
                <span className="brand-sub">software engineer</span>
              </Link>
              {pathname !== "/" && (
                <Link
                  href={`/${pathname.split("/")[1]}`}
                  className="brand-crumb md:text-lg tracking-wide text-[#F4F0E6] cursor-pointer font-normal"
                >
                  <span className="text-[#F4F0E6]">/</span>&nbsp;
                  {pathname.split("/")[1]
                    ? pathname.split("/")[1].charAt(0).toUpperCase() +
                      pathname.split("/")[1].slice(1)
                    : ""}
                </Link>
              )}
            </motion.div>

            <motion.div
              className="mx-auto hidden md:flex"
              animate={
                isScrolled
                  ? {
                      opacity: 0,
                      scale: 0.9,
                      y: -8,
                      filter: "drop-shadow(0 0 20px rgba(255,255,255,0.35)) blur(1.5px)",
                    }
                  : {
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      filter: "drop-shadow(0 0 0 rgba(255,255,255,0)) blur(0px)",
                    }
              }
              transition={{ duration: 0.34, ease: "easeOut" }}
              style={{ pointerEvents: isScrolled ? "none" : "auto" }}
            >
              <Link
                href="/"
                aria-label="Go to homepage"
                className="nav-logo"
              >
                <span className={`nav-logo-core ${isScrolled ? "nav-logo-core-exit" : ""}`}>
                  <Image
                    src="/assets/logo/eramc_base.svg"
                    alt="ERAMC lightning logo"
                    width={30}
                    height={44}
                    priority
                  />
                </span>
              </Link>
            </motion.div>

            <div className="md:hidden" />

            <ul className="relative hidden items-center justify-end gap-2 md:flex">
              {headerNavLinks.map((navLink) => (
                <motion.li key={navLink.url}>
                  <Link
                    href={navLink.url}
                    className={`nav-btn inline-flex min-w-28 items-center justify-center rounded-xl px-5 py-2.5 text-base font-semibold tracking-wide transition-all duration-300 ${
                      pathname === navLink.url ? "active-nav" : ""
                    }`}
                  >
                    {navLink.title}
                  </Link>
                </motion.li>
              ))}
              {showSectionsNavigation && (
                <li ref={sectionsMenuRef} className="relative">
                  <button
                    type="button"
                    className="nav-btn inline-flex h-[46px] w-[46px] items-center justify-center rounded-xl transition-all duration-300"
                    onClick={() => setIsSectionsMenuOpen((prev) => !prev)}
                    aria-haspopup="menu"
                    aria-expanded={isSectionsMenuOpen}
                    aria-label={isSectionsMenuOpen ? "Close sections menu" : "Open sections menu"}
                  >
                    {isSectionsMenuOpen ? <LuX size={20} /> : <LuEqual size={20} />}
                  </button>
                  <AnimatePresence>
                    {isSectionsMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        className="absolute right-0 top-full z-30 mt-2 w-44 rounded-2xl border border-white/12 bg-[#120a22]/95 p-2 shadow-2xl backdrop-blur-xl"
                      >
                        {sectionLinks.map((section) => (
                          <Link
                            key={section.hash}
                            href={sectionHref(section.hash)}
                            className="block rounded-lg px-3 py-2 text-sm text-white/88 transition hover:bg-white/10"
                            onClick={(e) => handleSectionClick(section.hash, e)}
                          >
                            {section.title}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )}
            </ul>
          </div>
        </motion.nav>
      </motion.header>

      <div className="fixed right-4 top-5 z-[60] md:hidden">
        <motion.button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#0c0618]/90 text-[#F4F0E6] shadow-xl backdrop-blur-md focus:outline-none"
          whileTap={{ scale: 0.94 }}
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav-drawer"
        >
          {isMobileMenuOpen ? (
            <svg
              className="h-5 w-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          ) : (
            <LuEqual size={22} />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            className="fixed inset-y-0 left-0 z-50 w-full sm:w-72 bg-[#0c0618] shadow-2xl overflow-hidden"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b border-[#333]">
                <Link href="/" className="nav-logo" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="nav-logo-core">
                    <Image
                      src="/assets/logo/eramc_base.svg"
                      alt="ERAMC lightning logo"
                      width={22}
                      height={32}
                    />
                  </span>
                </Link>
                <div className="h-7 w-7 sm:h-8 sm:w-8" />
              </div>
              <nav className="grow overflow-y-auto">
                <ul className="flex flex-col space-y-1 p-4">
                  {showSectionsNavigation && (
                    <>
                      <li className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                        Sections
                      </li>
                      {sectionLinks.map((section, index) => (
                        <motion.li
                          key={section.hash}
                          variants={mobileMenuItemVariants}
                          custom={index + 10}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Link
                            href={sectionHref(section.hash)}
                            className="block rounded-lg px-3 py-2 text-sm tracking-wider text-white transition duration-300 ease-in-out hover:bg-white/5"
                            onClick={(e) => handleSectionClick(section.hash, e)}
                          >
                            {section.title}
                          </Link>
                        </motion.li>
                      ))}
                      <li className="my-2 border-t border-white/10" />
                    </>
                  )}
                  {headerNavLinks.map((item, index) => (
                    <motion.li
                      key={index}
                      variants={mobileMenuItemVariants}
                      custom={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={item.url}
                        className={`block py-2 px-3 rounded-lg transition duration-300 ease-in-out ${
                          pathname === item.url
                            ? "text-white bg-white/10"
                            : "text-white hover:bg-white/5"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg">{item.icon}</div>
                          <span className="text-sm tracking-wider">
                            {item.title}
                          </span>
                        </div>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
