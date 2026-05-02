"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isChanging, setIsChanging] = useState(false);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      setIsChanging(true);
      prevPathname.current = pathname;

      const timer = setTimeout(() => {
        setIsChanging(false);
      }, 1500); // Increased slightly to allow for the rotation + pause cycle

      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  return (
    <AnimatePresence mode="wait">
      {isChanging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0c0618]/90 backdrop-blur-xl"
        >
          <motion.div
            className="relative"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.4, opacity: 0, filter: "blur(15px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* The Lightning Bolt with Rotation + Pause Sequence */}
            <motion.div
              animate={{
                filter: [
                  "invert(1) brightness(1) drop-shadow(0 0 10px rgba(255,255,255,0.4))",
                  "invert(1) brightness(2.2) drop-shadow(0 0 35px rgba(255,255,255,1))",
                  "invert(1) brightness(1.1) drop-shadow(0 0 15px rgba(255,255,255,0.6))",
                  "invert(1) brightness(2.8) drop-shadow(0 0 45px rgba(255,255,255,1))",
                  "invert(1) brightness(1) drop-shadow(0 0 10px rgba(255,255,255,0.4))",
                ],
                scale: [1, 1.05, 1, 1.08, 1],
                // Rotation sequence: rotates 360 degrees and then stays at 0 for the rest of the duration
                rotate: [0, 360, 360, 360, 360],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                // Custom times to define the rotation vs pause ratio
                times: [0, 0.4, 0.6, 0.8, 1],
                ease: "easeInOut",
              }}
              className="relative z-10"
            >
              <Image
                src="/assets/logo/eramc_base.svg"
                alt="Loading..."
                width={85}
                height={125}
                priority
              />
            </motion.div>

            {/* Pulsing Background Glow (stays as requested) */}
            <motion.div
              animate={{
                opacity: [0.3, 0.7, 0.4, 0.9, 0.3],
                scale: [1, 1.25, 1.1, 1.35, 1],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-[-50px] rounded-full bg-radial-gradient from-white/25 via-violet-600/15 to-transparent blur-3xl -z-1"
            />
            
            {/* Soft Ambient Flicker */}
            <motion.div
              animate={{
                opacity: [0, 0.15, 0, 0.25, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-[-120px] bg-white/5 rounded-full blur-[100px] -z-2"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
