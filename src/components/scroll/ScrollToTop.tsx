"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    const w = window as any;
    const lenis = w?.lenis;

    const methodsTried: string[] = [];

    const tryLenis = (arg: any) => {
      try {
        if (lenis && typeof lenis.scrollTo === "function") {
          lenis.scrollTo(arg);
          methodsTried.push(`lenis:${String(arg)}`);
          return true;
        }
      } catch (e) {
        // ignore
      }
      return false;
    };

    // 1) Try Lenis with numeric target
    if (tryLenis(0)) return;
    // 2) Try Lenis with 'top' keyword
    if (tryLenis("top")) return;

    // If Lenis isn't available yet, listen for the ready event and call it once it initializes
    if (!(window as any)?.lenis) {
      const onLenisReady = (e: Event) => {
        try {
          const l = (window as any)?.lenis;
          if (l && typeof l.scrollTo === "function") {
            try {
              l.scrollTo(0, { immediate: false });
            } catch (err) {
              // ignore
            }
          }
        } catch (err) {
          // ignore
        }
      };
      window.addEventListener("lenis-ready", onLenisReady, { once: true });
    }

    // 3) Native smooth scroll (should provide immediate feedback)
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
      methodsTried.push("native:smooth");
    } catch (e) {
      // ignore
    }

    // 4) Try element-based scroll as a last-resort
    try {
      const docEl = document.documentElement || document.body;
      if (docEl && typeof (docEl as any).scrollTo === "function") {
        (docEl as any).scrollTo({ top: 0, behavior: "smooth" });
        methodsTried.push("docEl:smooth");
      }
    } catch (e) {
      // ignore
    }

    // 5) Hard set - immediate
    try {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      methodsTried.push("direct:setScrollTop");
    } catch (e) {
      // ignore
    }

    // If nothing seems to run (debug), log methods tried for developer inspection
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.debug("ScrollToTop methods tried:", methodsTried);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={scrollToTop}
            className="rounded-full shadow-lg bg-background/80 backdrop-blur-md border-border hover:border-primary/50 transition-colors"
            aria-label="Scroll to top"
          >
            <ChevronUp className="size-5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
