"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { LuGlobe, LuRocket } from "react-icons/lu";
import HeroImage from "../../../public/hero.png";
import { Icon } from "@iconify/react";

const Profile = () => {
  return (
    <div className="mt-8 md:mt-10">
      <div className="relative overflow-hidden rounded-3xl shadow-2xl">
        <div className="absolute inset-0 z-0">
          <Image
            src={HeroImage}
            alt="Background"
            fill
            style={{ objectFit: "cover" }}
            quality={100}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        </div>

        <div className="relative z-10 flex flex-col p-6 sm:p-8">
          <div className="text-white max-w-xl">
            <motion.h2
              className="font-medium uppercase tracking-wider flex items-center text-sm sm:text-base"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LuGlobe className="mr-2" size={18} />
              About me
            </motion.h2>
            <motion.h1
              className="mt-3 sm:mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Hey, I&apos;m <span className="text-purple-400">byPixelTV</span>,
              <motion.span
                className="inline-block ml-2"
                animate={{
                  rotate: [0, 14, -8, 14, -4, 10, 0, 0],
                }}
                transition={{
                  duration: 2.5,
                  ease: "easeInOut",
                  times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 1],
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                👋
              </motion.span>
            </motion.h1>
            <motion.p
              className="mt-4 sm:mt-6 text-base sm:text-lg font-light leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Passionate{" "}
              <span className="text-purple-400">Fullstack Developer</span> from
              Germany <Icon icon="twemoji:flag-germany" className="inline" />,
              pushing the boundaries of technology to create immersive digital
              experiences.
            </motion.p>
          </div>

          <div className="mt-auto pt-8 sm:pt-10 max-w-xl">
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-3xl p-4 sm:p-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.h2
                className="font-medium uppercase tracking-wider flex items-center text-sm sm:text-base"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <LuRocket className="mr-2" size={18} />
                My Goal
              </motion.h2>
              <motion.p
                className="mt-3 sm:mt-4 text-base sm:text-lg font-light leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Creating unique and engaging experiences that not only look
                great but also function seamlessly. My mission is to bridge the
                gap between design and development, ensuring a smooth and
                enjoyable user experience.
              </motion.p>
            </motion.div>
          </div>

          {/* Social Icons - moved inside flex container and responsive positioning */}
          <motion.div
            className="flex justify-center sm:justify-end mt-6 sm:mt-0 sm:absolute sm:bottom-6 sm:right-6 space-x-3 z-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.a
              href="https://github.com/bypixeltv"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-md p-2 sm:p-2 rounded-full hover:bg-white/20 transition-colors duration-200 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon icon="mdi:github" className="w-5 h-5 text-white" />
            </motion.a>
            <motion.a
              href="https://discord.gg/yVp7Qvhj9k"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-md p-2 sm:p-2 rounded-full hover:bg-white/20 transition-colors duration-200 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon icon="ic:baseline-discord" className="w-5 h-5 text-white" />
            </motion.a>
            <motion.a
              href="https://twitter.com/bypixeltv"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-md p-2 sm:p-2 rounded-full hover:bg-white/20 transition-colors duration-200 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon icon="mdi:twitter" className="w-5 h-5 text-white" />
            </motion.a>
            <motion.a
              href="mailto:contact@bypixel.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-md p-2 sm:p-2 rounded-full hover:bg-white/20 transition-colors duration-200 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon icon="mdi:email" className="w-5 h-5 text-white" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
