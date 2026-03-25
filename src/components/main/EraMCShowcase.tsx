"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";

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
      className="overflow-hidden rounded-2xl border border-white/12 bg-[#0b0c14]/80"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.65, duration: 0.5 }}
    >
      <div className="relative aspect-16/6 overflow-hidden border-b border-white/10">
        <Image
          src="/projects/banners/eramc.png"
          alt="EraMC Banner"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
          className="object-cover"
          quality={90}
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0b0c14] via-[#0b0c14]/40 to-transparent" />

        <div className="absolute bottom-0 left-0 flex items-end gap-4 px-5 pb-4 sm:px-6 sm:pb-5">
          <div className="relative shrink-0">
            <Image
              src="/projects/eramc.png"
              alt="EraMC Icon"
              width={56}
              height={56}
              className="rounded-xl object-cover border border-white/10"
            />
          </div>
          <div>
            <span className="mb-1 inline-flex text-[10px] font-semibold uppercase tracking-widest text-purple-200">
              Main Project
            </span>
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

      <div className="p-5 sm:p-6">
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
          We use <span className="text-white/80">GitHub Actions</span> for <span className="text-purple-300/85">CI/CD</span>, with automated testing and deployment pipelines that keep our development process smooth and efficient. The result is a responsive, scalable Minecraft network that delivers a seamless gaming experience to players around the world.
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
                className="flex items-center gap-1.5 rounded-full border border-white/12 px-2.5 py-1 text-xs text-[#ccc]"
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
