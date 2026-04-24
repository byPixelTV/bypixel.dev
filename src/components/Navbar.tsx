// This file includes code copied and adapted from:
// https://github.com/AbhiVarde/abhivarde.in/blob/main/app/components/common/Navbar.jsx
// Original work by Abhi Varde, licensed under the MIT License:
// https://github.com/AbhiVarde/abhivarde.in/blob/main/LICENSE
//
// Changes have been made to fit this project’s design and functionality.

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { LuEqual, LuBook, LuUser } from "react-icons/lu";
import type { Variants } from "framer-motion";

const headerNavLinks = [
  { title: "About", url: "/", icon: <LuUser color="#FFFFFF" /> },
  { title: "Blog", url: "/blog", icon: <LuBook color="#FFFFFF" /> },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selected, setSelected] = useState(pathname);
  const { scrollY } = useScroll();
  const hasCrossedScrollThresholdRef = useRef(false);

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
  }, [pathname]);

  const navVariants: Variants = {
    top: {
      backgroundColor: "rgba(20, 4, 48, 0.3)",
      backdropFilter: "blur(8px)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    scroll: {
      backgroundColor: "rgba(8, 2, 22, 0.9)",
      backdropFilter: "blur(14px)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

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
        className="fixed left-0 right-0 top-0 z-40 mx-auto flex w-full max-w-[980px] justify-center transition-all duration-500 ease-in-out"
        initial="hidden"
        animate="visible"
      >
        <motion.nav
          className="mx-auto mt-3 w-[calc(100%-1.5rem)] rounded-3xl border border-purple-900/35 px-3 py-2.5 shadow-lg md:mt-4 md:w-[calc(100%-2rem)]"
          variants={navVariants}
          initial="top"
          animate={isScrolled ? "scroll" : "top"}
        >
          <div className="flex justify-between items-center">
            <motion.div className="flex space-x-1 sm:space-x-2" custom={0}>
              <Link
                href="/"
                className="text-sm md:text-base tracking-wide text-[#F4F0E6] cursor-pointer font-medium"
              >
                {pathname === "/" && (
                  <span className="ml-1 md:text-base tracking-wide">
                    bypixel.dev
                  </span>
                )}
              </Link>
              {pathname !== "/" && (
                <Link
                  href={`/${pathname.split("/")[1]}`}
                  className="md:text-lg tracking-wide text-[#F4F0E6] cursor-pointer font-normal"
                >
                  <span className="text-[#F4F0E6]">/</span>&nbsp;
                  {pathname.split("/")[1]
                    ? pathname.split("/")[1].charAt(0).toUpperCase() +
                      pathname.split("/")[1].slice(1)
                    : ""}
                </Link>
              )}
            </motion.div>

            <div className="flex items-center justify-center md:hidden">
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-[#F4F0E6] focus:outline-none"
              >
                <LuEqual size={24} />
              </motion.button>
            </div>

            <ul className="relative hidden gap-2 rounded-full border border-white/12 bg-white/5 p-1.5 md:flex">
              {headerNavLinks.map((navLink, index) => (
                <motion.li key={index} custom={index + 1}>
                  <Link href={navLink.url}>
                    <motion.button
                      onClick={() => setSelected(navLink.url)}
                      className={`group relative overflow-hidden rounded-full px-3 py-1.5 text-sm tracking-wide font-medium`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span
                        className={`relative z-10 ${
                          selected === navLink.url ? "text-black" : "text-white"
                        }`}
                      >
                        {navLink.title}
                      </span>
                      {selected === navLink.url && (
                        <motion.span
                          layoutId="navbar-pill"
                          className="absolute inset-0 bg-[#F4F0E6] rounded-lg"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 30,
                          }}
                        />
                      )}
                      <motion.span
                        className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    </motion.button>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.nav>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-y-0 left-0 z-50 w-full sm:w-72 bg-[#0c0618] shadow-2xl overflow-hidden"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b border-[#333]">
                <motion.div
                  className="md:text-lg font-medium tracking-wide text-white"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Menu
                </motion.div>
                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white focus:outline-none"
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </motion.button>
              </div>
              <nav className="grow overflow-y-auto">
                <ul className="flex flex-col space-y-1 p-4">
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
