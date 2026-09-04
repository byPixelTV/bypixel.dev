"use client";
import RollText from "@/components/portfolio/RollText";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import SpotifyNowPlaying from "@/components/SpotifyNowPlaying";

const Profile = () => {
  const heroAccentGradient =
    "linear-gradient(100deg, var(--album-1), var(--album-2) 55%, var(--album-3))";
  return (
    <section aria-label="About me" className="immersive-hero">
      <motion.div className="relative min-h-[calc(100vh-8.25rem)]">
        <div className="relative z-10 flex min-h-[calc(100vh-8.25rem)] items-center justify-center px-6 py-14 sm:px-8 lg:px-10">
          <div className="w-full max-w-300 text-center text-white">
            <motion.p
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/72 sm:text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45 }}
            >
              byPixelTV / Fullstack developer / Germany
            </motion.p>

            <motion.h1
              className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              MADE OF CODE.
              <span
                className="block bg-clip-text text-transparent"
                style={{
                  backgroundImage: heroAccentGradient,
                  textShadow: "0 0 26px rgba(255,255,255,0.12)",
                }}
              >
                DRIVEN BY CURIOSITY.
              </span>
            </motion.h1>

            <motion.p
              className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              I build modern, performant software with a focus on clean design and smooth user
              experience.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <a
                href="#projects"
                className="rounded-full border border-white/30 bg-white/92 px-6 py-2.5 text-xs font-medium text-black transition-colors hover:bg-white sm:px-5 sm:py-2 sm:text-sm"
              >
                <RollText>View projects</RollText>
              </a>
              <a
                href="https://discord.gg/yVp7Qvhj9k"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/25 bg-transparent px-6 py-2.5 text-xs font-medium text-white transition-colors hover:bg-white/10 sm:px-5 sm:py-2 sm:text-sm"
                style={{
                  boxShadow: `0 0 0 1px color-mix(in srgb, var(--album-2) 18%, transparent)`,
                }}
              >
                <RollText>Discord</RollText>
              </a>
            </motion.div>

            <motion.div
              className="mx-auto mt-8 w-full max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <SpotifyNowPlaying />
            </motion.div>

            <motion.div
              className="mt-6 flex flex-wrap items-center justify-center gap-2.5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.4 }}
            >
              <motion.a
                href="https://github.com/bypixeltv"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 bg-white/8 p-2.5 backdrop-blur-md transition-colors duration-200 hover:bg-white/16"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaGithub className="h-5 w-5 text-white" />
              </motion.a>
              <motion.a
                href="https://discord.gg/yVp7Qvhj9k"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 bg-white/8 p-2.5 backdrop-blur-md transition-colors duration-200 hover:bg-white/16"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaDiscord className="h-5 w-5 text-white" />
              </motion.a>
              <motion.a
                href="https://twitter.com/bypixeltv"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 bg-white/8 p-2.5 backdrop-blur-md transition-colors duration-200 hover:bg-white/16"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaXTwitter className="h-5 w-5 text-white" />
              </motion.a>
              <motion.a
                href="https://streame.gg/@bypixelttv"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 bg-white/8 p-2.5 backdrop-blur-md transition-colors duration-200 hover:bg-white/16"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src="/streame.png"
                  alt="Streame.gg"
                  width={20}
                  height={20}
                  className="h-5 w-5 rounded-full"
                />
              </motion.a>
              <motion.a
                href="mailto:contact@bypixel.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 bg-white/8 p-2.5 backdrop-blur-md transition-colors duration-200 hover:bg-white/16"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <MdEmail className="h-5 w-5 text-white" />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Profile;
