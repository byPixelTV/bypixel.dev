"use client";

import BackgroundLayout from "@/components/BackgroundLayout";
import BlogFeed from "@/components/blog/BlogFeed";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <BackgroundLayout>
        <div className="container mx-auto px-6 py-24 mt-16 min-h-screen">
          <header className="text-center mb-16 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                Latest <span className="text-purple-400">Insights</span>
              </h1>
              <div className="h-1 w-20 bg-purple-500 mx-auto rounded-full mb-8 shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
              <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                Thoughts, tutorials, and deep dives into software development, DevOps, and the future of technology.
              </p>
            </motion.div>
            
            {/* Ambient light effect for header */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
          </header>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <BlogFeed />
          </motion.section>
        </div>
      </BackgroundLayout>
    </>
  );
}