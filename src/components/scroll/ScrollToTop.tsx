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
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
