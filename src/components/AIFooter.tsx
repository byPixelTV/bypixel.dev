"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export default function AIFooter() {
  return (
    <footer id="sourcecode" className="relative py-24 px-4 overflow-hidden scroll-mt-28">
      {/* Background Gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-150 h-75 bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/3 border border-white/10 backdrop-blur-2xl p-8 md:p-12 rounded-[3rem] text-center"
        >
          <div className="flex justify-center mb-8">
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
              <Icon icon="ph:cpu-duotone" className="text-4xl text-purple-400" />
            </div>
          </div>

          <h3 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter mb-6 uppercase">
            What about AI development?
          </h3>

          <div className="space-y-6 text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            <p>
              I use AI extensively in my workflow—and I&apos;m proud of it. In the modern web ecosystem, AI allows me to be faster, more efficient, and write better code than ever before. 
            </p>
            <p>
              While my Minecraft server networks are still <span className="text-white/80 font-bold">95% handcrafted</span> logic, I leverage AI to accelerate frontend development and solve repetitive boilerplate. I believe that as long as you <span className="text-white/80 font-bold">understand the code</span> you ship, AI is the ultimate multiplier for any engineer.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="https://github.com/byPixelTV/bypixel.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-black text-lg transition-all hover:scale-105"
            >
              <Icon icon="mdi:github" className="text-2xl" />
              VIEW SOURCE CODE
              <Icon icon="ph:arrow-up-right-bold" className="text-sm transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
            
            <div className="text-sm text-slate-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Transparency first
            </div>
          </div>
        </motion.div>

        <div className="mt-20 text-center space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-600">
            © 2026 byPixelTV — Built with Next.js, AI & Pure Passion
          </p>
        </div>
      </div>
    </footer>
  );
}
