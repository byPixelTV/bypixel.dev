"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

const techStack = [
  { name: "Kotlin",          icon: "vscode-icons:file-type-kotlin" },
  { name: "Java",            icon: "vscode-icons:file-type-java" },
  { name: "Ktor",            icon: "devicon:ktor" },
  { name: "gRPC",            icon: "devicon:grpc" },
  { name: "Next.js",         icon: "logos:nextjs-icon" },
  { name: "MongoDB",         icon: "logos:mongodb-icon" },
  { name: "Redis",           icon: "logos:redis" },
  { name: "ClickHouse",      icon: "simple-icons:clickhouse" },
  { name: "Docker",          icon: "logos:docker-icon" },
  { name: "Linux",           icon: "flat-color-icons:linux" },
  { name: "Grafana",         icon: "devicon:grafana" },
  { name: "GitHub Actions",  icon: "logos:github-actions" },
  { name: "Tailscale",       icon: "simple-icons:tailscale" },
];

const EraMCShowcase = () => {
  return (
    <motion.div
      className="rounded-3xl border border-[#333] bg-[#111111] overflow-hidden"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.65, duration: 0.5 }}
    >
      {/* Banner */}
      <div className="relative h-44 sm:h-52 w-full overflow-hidden">
        <Image
          src="/projects/banners/eramc.png"
          alt="EraMC Banner"
          fill
          className="object-cover"
          quality={90}
        />
        {/* Darken overlay */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Bottom fade into card */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#111111] to-transparent" />

        {/* Icon + title inside banner */}
        <div className="absolute bottom-0 left-0 p-5 sm:p-6 flex items-end gap-4">
          <div className="relative shrink-0">
            <Image
              src="/projects/eramc.png"
              alt="EraMC Icon"
              width={64}
              height={64}
              className="rounded-xl object-cover border border-white/10 shadow-lg"
            />
          </div>
          <div>
            <h3
              className="text-2xl sm:text-3xl font-extrabold tracking-tight"
              style={{
                background: "linear-gradient(90deg, #7F00FF, #a600f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              EraMC
            </h3>
            <p className="text-xs text-white/50 mt-0.5 font-medium uppercase tracking-widest">
              Founder &amp; Developer · May 2025 – now
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6 pt-3">
        <p className="text-sm sm:text-base text-[#aaa] leading-relaxed">
          EraMC is a high-performance Minecraft network with a fully custom
          backend written in <span className="text-white/80">Kotlin</span>.
          All game logic and database access runs directly on the server —
          kept fast and non-blocking through{" "}
          <span className="text-white/80">coroutines</span> across the entire
          stack.{" "}
          <span className="text-white/80">gRPC</span> and{" "}
          <span className="text-white/80">Ktor</span> handle specific
          inter-service and API communication where needed.{" "}
          <span className="text-white/80">ClickHouse</span> stores analytical
          event data, <span className="text-white/80">Grafana</span> provides
          real-time infrastructure visibility, and the whole stack runs in{" "}
          <span className="text-white/80">Docker</span> containers tied
          together via a private{" "}
          <span className="text-white/80">Tailscale</span> mesh. All web-based frontend components are built with <span className="text-white/80">Next.js</span>.
          We use <span className="text-white/80">GitHub Actions</span> for <span className="text-blue-400/80">CI/CD</span>, with automated testing and deployment pipelines that keep our development process smooth and efficient. The result is a responsive, scalable Minecraft network that delivers a seamless gaming experience to players around the world.
        </p>

        {/* Tech Stack */}
        <div className="mt-5">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-3 font-semibold">
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="flex items-center gap-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-2.5 py-1.5 text-xs text-[#ccc] hover:border-[#444] transition-colors"
              >
                <Icon icon={tech.icon} className="text-base shrink-0" />
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-5 flex gap-3">
          <Button
            asChild
            size="sm"
            className="bg-[#7F00FF] hover:bg-[#9400ff] text-white border-0"
          >
            <a
              href="https://dc.eramc.net"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Discord
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default EraMCShowcase;
