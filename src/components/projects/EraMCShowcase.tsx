"use client";

import { useRef, Suspense, useMemo, useEffect, useState, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function useViewportWidth() {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("resize", onStoreChange);
      return () => window.removeEventListener("resize", onStoreChange);
    },
    () => (typeof window !== "undefined" ? window.innerWidth : 0),
    () => 0,
  );
}

function NetworkNodes({ progress }: { progress: MotionValue<number> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 3000;
  
  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    /* eslint-disable react-hooks/purity */
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    /* eslint-enable react-hooks/purity */
    return [pos];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.03 + progress.get() * 1.5;
    pointsRef.current.position.z = progress.get() * 10;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#8B5CF6"
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

const techStack = [
  { name: "Kotlin", icon: "vscode-icons:file-type-kotlin", category: "Core" },
  { name: "Java", icon: "vscode-icons:file-type-java", category: "Core" },
  { name: "Go", icon: "logos:go", category: "External Tools" },
  { name: "Ktor", icon: "devicon:ktor", category: "API Layer" },
  { name: "gRPC", icon: "devicon:grpc", category: "Microservices" },
  { name: "Redis", icon: "logos:redis", category: "Global Sync" },
  { name: "MongoDB", icon: "logos:mongodb-icon", category: "Persistence" },
  { name: "ClickHouse", icon: "simple-icons:clickhouse", category: "Analytics" },
  { name: "Docker", icon: "logos:docker-icon", category: "Ops" },
  { name: "Grafana", icon: "devicon:grafana", category: "Metrics" },
];

const highlights = [
  {
    title: "0% Pay-to-Win",
    description: "Fair play is our core. No advantages for money, just pure skill and dedication.",
    icon: "ph:scales-bold",
    color: "from-green-400 to-emerald-600",
  },
  {
    title: "99% Self-Code",
    description: "Bespoke plugins and custom backend architecture for a unique experience.",
    icon: "ph:code-bold",
    color: "from-blue-400 to-indigo-600",
  },
  {
    title: "0% Bullshit",
    description: "Direct communication, transparent development, and a player-first mindset.",
    icon: "ph:chat-circle-dots-bold",
    color: "from-purple-400 to-fuchsia-600",
  },
];

export default function EraMCShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const viewportWidth = useViewportWidth();
  const isMobile = isMounted && viewportWidth < 768;

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  });

  // CANVAS GLOBAL FADE OUT
  const canvasOpacity = useTransform(smoothProgress, [0, 0.05, 0.9, 0.98], [0, 1, 1, 0]);

  // BACKGROUND PARALLAX TEXT
  const bgNetworkY = useTransform(smoothProgress, [0, 1], [150, -150]);
  const bgNetworkOpacity = useTransform(smoothProgress, [0, 0.1, 0.85, 0.95], [0, 0.12, 0.12, 0]);

  // HERO (0 - 0.2)
  const heroOpacity = useTransform(smoothProgress, [0, 0.05, 0.2, 0.25], [0, 1, 1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.1], [0.8, 1]);
  const heroY = useTransform(smoothProgress, [0, 0.25], [0, -50]);

  // BANNER (0.2 - 0.4)
  const bannerOpacity = useTransform(smoothProgress, [0.2, 0.3, 0.45, 0.55], [0, 1, 1, 0]);
  const bannerScale = useTransform(smoothProgress, [0.2, 0.35], [1.1, 1]);
  const bannerImageY = useTransform(smoothProgress, [0.2, 0.55], ["-15%", "15%"]);

  // MANIFESTO (0.5 - 0.7)
  const manifestoOpacity = useTransform(smoothProgress, [0.5, 0.6, 0.75, 0.8], [0, 1, 1, 0]);
  const manifestoY = useTransform(smoothProgress, [0.5, 0.8], [100, -50]);

  // TECHNICAL (0.75 - 1.0)
  const techOpacity = useTransform(smoothProgress, [0.75, 0.82, 0.98, 1], [0, 1, 1, 1]);
  const techY = useTransform(smoothProgress, [0.75, 0.95], [100, 0]);

  return (
    <section
      ref={containerRef}
      className="relative w-dvw left-[50%] -translate-x-1/2 h-[800vh] md:h-[1500vh] overflow-visible bg-black"
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {isMounted && (
          <>
            {/* NETWORK BACKGROUND ANCHOR */}
            <motion.div 
              style={{ y: bgNetworkY, opacity: bgNetworkOpacity }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0"
            >
              <h2 className="text-[22vw] sm:text-[18vw] font-black text-white/80 leading-none tracking-tighter uppercase select-none italic">
                ERAMC
              </h2>
              <h2 className="mt-[-2vw] sm:mt-[-4vw] text-[14vw] sm:text-[12vw] font-black text-purple-500/40 leading-none tracking-widest uppercase select-none">
                NETWORK
              </h2>
            </motion.div>

            {/* THREE.JS PARTICLES */}
            <motion.div style={{ opacity: canvasOpacity }} className="absolute inset-0 z-0 pointer-events-none">
              <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#A855F7" />
                <Suspense fallback={null}>
                  <NetworkNodes progress={smoothProgress} />
                </Suspense>
              </Canvas>
            </motion.div>

            {/* STAGE 1: HERO */}
            <motion.div
              style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center pointer-events-none"
            >
              <div className="relative mb-8 sm:mb-12 group">
                <div className="absolute inset-0 bg-purple-600/15 blur-[80px] sm:blur-[120px] rounded-full scale-150" />
                <div className="relative w-36 h-36 sm:w-64 sm:h-64 rounded-4xl sm:rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                  <Image
                    src="/projects/eramc.png"
                    alt="EraMC Icon"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <p className="mb-4 sm:mb-6 text-[10px] sm:text-sm font-bold uppercase tracking-[0.6em] sm:tracking-[1em] text-purple-400/60">
                EraMC Network
              </p>
              <h2 className="text-6xl sm:text-9xl md:text-[14rem] font-black tracking-tighter text-white italic leading-[0.8] sm:leading-[0.75]">
                FOUNDED
              </h2>
            </motion.div>

            {/* STAGE 2: BANNER PORTAL */}
            <motion.div
              style={{ opacity: bannerOpacity, scale: bannerScale }}
              className="absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-16 pointer-events-none"
            >
              <div className="relative w-full max-w-7xl aspect-4/5 sm:aspect-video md:aspect-21/9 rounded-4xl sm:rounded-[3.5rem] overflow-hidden border border-white/5 shadow-2xl">
                <motion.div 
                  style={{ y: bannerImageY }}
                  className="absolute inset-0 w-full h-[130%] top-[-15%]"
                >
                  <Image
                    src="/projects/banners/eramc.png"
                    alt="EraMC Banner"
                    fill
                    className="object-cover brightness-90"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 sm:bottom-16 sm:left-16 sm:right-16 flex flex-col items-start sm:items-end sm:flex-row justify-between gap-6 sm:gap-12">
                  <div className="max-w-2xl">
                    <h3 className="text-3xl sm:text-7xl font-bold text-white tracking-tighter mb-4 sm:mb-6 italic">
                      Infinite Scaling.
                    </h3>
                    <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-medium">
                      Architecture designed for thousands. We don&apos;t just host servers; 
                      we engineer distributed systems.
                    </p>
                  </div>
                  <Button
                    asChild
                    className="bg-purple-600 text-white hover:bg-white hover:text-black rounded-full px-8 py-6 sm:px-12 sm:py-9 text-lg sm:text-2xl font-black transition-all italic pointer-events-auto relative z-100"
                  >
                    <a href="https://dc.eramc.net" target="_blank" rel="noopener noreferrer">
                      JOIN DISCORD
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* STAGE 3: MANIFESTO */}
            <motion.div
              style={{ opacity: manifestoOpacity, y: manifestoY }}
              className="absolute inset-0 z-40 flex flex-col items-center justify-center p-4 sm:p-6 pointer-events-none"
            >
              <div className="text-center mb-12 sm:mb-24">
                <h3 className="text-4xl sm:text-8xl font-black text-white mb-4 sm:mb-6 tracking-tighter italic">THE MANIFESTO</h3>
                <div className="h-1 w-24 sm:h-1.5 sm:w-48 bg-purple-500 mx-auto rounded-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-10 max-w-7xl w-full">
                {highlights.map((h) => (
                  <motion.div
                    key={h.title}
                    whileHover={isMobile ? {} : { y: -15, backgroundColor: "rgba(255,255,255,0.08)" }}
                    className="group relative bg-white/5 border border-white/10 backdrop-blur-3xl p-6 sm:p-12 rounded-4xl sm:rounded-[3.5rem] transition-all"
                  >
                    <div className={`w-12 h-12 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-linear-to-br ${h.color} flex items-center justify-center mb-6 sm:mb-10 shadow-2xl`}>
                      <Icon icon={h.icon} className="text-2xl sm:text-4xl text-white" />
                    </div>
                    <h4 className="text-xl sm:text-3xl font-bold text-white mb-2 sm:mb-4 italic tracking-tight">{h.title}</h4>
                    <p className="text-slate-400 text-sm sm:text-lg leading-relaxed">{h.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* STAGE 4: ASYNC-FIRST ARCHITECTURE */}
            <motion.div
              style={{ opacity: techOpacity, y: techY }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-6 pointer-events-none"
            >
              <div className="max-w-7xl w-full overflow-y-auto max-h-[90vh] sm:max-h-none sm:overflow-visible pr-2">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-20 items-center">
                  <div className="space-y-6 sm:space-y-12">
                    <div className="space-y-4 sm:space-y-6">
                      <span className="text-purple-400 font-black tracking-[0.4em] uppercase text-[10px] sm:text-sm">Technical Philosophy</span>
                      <h3 className="text-4xl sm:text-6xl font-black text-white italic tracking-tighter uppercase leading-tight">Async-First<br/>Architecture</h3>
                      <p className="text-sm sm:text-xl text-slate-300 leading-relaxed">
                        We push the boundaries of what Minecraft servers can handle. By running logic **strictly asynchronously** on the gameservers, 
                        we maintain peak performance while keeping the central database constantly in sync for external API and tooling access.
                      </p>
                      <p className="text-xs sm:text-lg text-slate-400 leading-relaxed border-l-4 border-purple-500 pl-4 sm:pl-6 italic">
                        Complex problems require bespoke solutions. When existing software fails, we build our own 
                        ecosystem of external CLIs and monitoring tools.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 sm:gap-6">
                      <div className="p-4 sm:p-8 bg-white/5 rounded-3xl sm:rounded-[2.5rem] border border-white/10 group">
                        <span className="text-xl sm:text-4xl font-bold text-white block mb-1 sm:mb-2 tracking-tighter">Dual-Sync</span>
                        <span className="text-[8px] sm:text-xs text-slate-500 uppercase font-bold tracking-widest">Async Logic / DB Persistence</span>
                      </div>
                      <div className="p-4 sm:p-8 bg-white/5 rounded-3xl sm:rounded-[2.5rem] border border-white/10 group">
                        <span className="text-xl sm:text-4xl font-bold text-white block mb-1 sm:mb-2 tracking-tighter">Bespoke</span>
                        <span className="text-[8px] sm:text-xs text-slate-500 uppercase font-bold tracking-widest">Custom CLI & Tooling Ecosystem</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-5">
                    {techStack.map((tech) => (
                      <motion.div
                        key={tech.name}
                        whileHover={isMobile ? {} : { y: -5, backgroundColor: "rgba(139, 92, 246, 0.15)", borderColor: "rgba(139, 92, 246, 0.3)" }}
                        className="flex flex-col items-center justify-center p-4 sm:p-8 bg-slate-900/60 border border-slate-800 rounded-3xl sm:rounded-[2.5rem] transition-all"
                      >
                        <Icon icon={tech.icon} className="text-2xl sm:text-5xl mb-2 sm:mb-4" />
                        <span className="text-[8px] sm:text-xs font-black text-white text-center uppercase tracking-widest">{tech.name}</span>
                        <span className="text-[6px] sm:text-[8px] text-purple-400 uppercase font-black mt-1 sm:mt-2 tracking-tighter">{tech.category}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div 
                  className="mt-10 sm:mt-20 p-6 sm:p-12 bg-linear-to-r from-purple-900/30 to-blue-900/20 border border-white/10 rounded-4xl sm:rounded-[3.5rem] backdrop-blur-3xl text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-purple-500 to-transparent" />
                  <p className="text-sm sm:text-2xl text-slate-200 leading-relaxed italic max-w-5xl mx-auto">
                    &quot;We don&apos;t just write plugins; we architect a global mesh. Every gameserver operates as a 
                    high-speed async node, feeding a centralized data layer that empowers our entire 
                    web and CLI tooling infrastructure.&quot;
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
