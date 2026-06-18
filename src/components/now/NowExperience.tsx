"use client";

import SpotifyNowPlaying from "@/components/SpotifyNowPlaying";
import { getTopArtists, type TopArtistResult } from "@/lib/actions/spotify";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  LuCalendarDays,
  LuCode,
  LuHeadphones,
  LuMusic,
  LuRadio,
  LuSparkles,
  LuTrophy,
} from "react-icons/lu";

export interface NextRace {
  name: string;
  location: string;
  round: number;
  date: string;
  trackImage: string;
}

const fallbackArtists: TopArtistResult[] = [
  { id: "raf-camora", name: "RAF Camora", genres: ["german hip hop"] },
  { id: "travis-scott", name: "Travis Scott", genres: ["rap", "trap"] },
  { id: "yeat", name: "Yeat", genres: ["rage rap"] },
  { id: "nf", name: "NF", genres: ["hip hop"] },
  { id: "don-toliver", name: "Don Toliver", genres: ["melodic rap"] },
];

const stack = [
  { name: "Kotlin", accent: "from-purple-400 to-fuchsia-300", note: "JVM backends" },
  { name: "Java", accent: "from-orange-300 to-red-300", note: "Minecraft systems" },
  { name: "Go", accent: "from-cyan-300 to-sky-300", note: "fast services" },
  { name: "TypeScript", accent: "from-blue-300 to-indigo-300", note: "web apps" },
];

const games = [
  {
    name: "VALORANT",
    label: "Tactical chaos",
    logo: "/assets/logo/valorant.png",
    detail:
      "I am not pretending to be radiant. I just like the tension, the clean aim moments and the occasional round that makes the whole session worth it.",
    accent: "from-red-500/28 to-rose-300/10",
  },
  {
    name: "Minecraft",
    label: "Long-term obsession",
    logo: "/assets/logo/minecraft.svg",
    detail:
      "Minecraft is less just a game for me and more a playground for servers, plugins, systems and ideas that keep turning into real projects.",
    accent: "from-emerald-500/25 to-lime-300/10",
  },
];

const setupCards = [
  {
    name: "Nothing Phone",
    label: "Daily driver",
    logo: "/assets/logo/nothing.png",
    detail:
      "Clean hardware, weird little design choices and a UI that feels different enough to actually have taste.",
    accent: "from-white/18 to-zinc-400/8",
  },
  {
    name: "Windows",
    label: "Main setup",
    logo: "/assets/logo/windows.webp",
    detail:
      "Where most of the day happens: code, tools, games, debugging sessions and the occasional desktop cleanup that lasts five minutes.",
    accent: "from-sky-400/22 to-blue-500/10",
  },
];

function formatRaceDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(date));
}

export default function NowExperience({ nextRace }: { nextRace: NextRace }) {
  const [artists, setArtists] = useState<TopArtistResult[]>(fallbackArtists);
  const [artistsLoaded, setArtistsLoaded] = useState(false);

  useEffect(() => {
    let disposed = false;

    getTopArtists().then((result) => {
      if (disposed) return;
      if (result.length > 0) {
        setArtists(result);
      }
      setArtistsLoaded(true);
    });

    return () => {
      disposed = true;
    };
  }, []);

  return (
    <main className="relative z-10 w-full pb-16 pt-28 md:pt-32">
      <div className="mx-auto w-full max-w-395 space-y-6 px-4 sm:px-7 lg:px-12">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/4 px-5 py-8 shadow-2xl backdrop-blur-2xl sm:px-8 md:px-10 md:py-12">
          <div className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-purple-300/40 to-transparent" />
          <motion.div
            aria-hidden="true"
            className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-purple-500/14 blur-[92px]"
            animate={{ scale: [1, 1.14, 1], x: [0, -16, 0], y: [0, 12, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative grid gap-8 lg:grid-cols-[1.04fr_0.96fr] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.34em] text-purple-200/80">
                <LuSparkles className="h-3.5 w-3.5" />
                Now
              </div>
              <h1 className="max-w-4xl text-4xl font-black leading-[0.95] tracking-tighter text-white sm:text-6xl md:text-7xl">
                The current rotation.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Music, games, racing, devices and code. Not a perfectly curated
                moodboard, more like the stuff I actually keep coming back to.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/24 p-5">
              <div className="flex items-center gap-3 text-white">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#1DB954]/25 bg-[#1DB954]/10">
                  <LuHeadphones className="h-5 w-5 text-[#1DB954]" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.26em] text-slate-500">
                    Spotify
                  </p>
                  <p className="text-lg font-bold">Now playing</p>
                </div>
              </div>
              <SpotifyNowPlaying />
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/4 p-5 backdrop-blur-xl md:p-7">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
                  Top artists
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
                  Heavy rotation
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-400 sm:self-auto">
                <LuMusic className="h-3.5 w-3.5 text-[#1DB954]" />
                {artistsLoaded ? "from Spotify" : "loading Spotify"}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <AnimatePresence mode="popLayout">
                {artists.map((artist, index) => {
                  const content = (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.28, delay: index * 0.04 }}
                      className="group relative min-h-56 overflow-hidden rounded-[1.35rem] border border-white/10 bg-black/24 p-4 transition duration-300 hover:-translate-y-1 hover:border-[#1DB954]/35 hover:bg-white/7"
                    >
                      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#1DB954] via-purple-300 to-sky-300 opacity-80" />
                      <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-white/7">
                        {artist.imageUrl ? (
                          <Image
                            src={artist.imageUrl}
                            alt={artist.name}
                            fill
                            sizes="(min-width: 1024px) 160px, 45vw"
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-linear-to-br from-purple-500/30 to-[#1DB954]/20">
                            <LuRadio className="h-9 w-9 text-white/70" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/45 to-transparent" />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                        #{index + 1}
                      </p>
                      <h3 className="mt-1 truncate text-lg font-black text-white">
                        {artist.name}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">
                        {artist.genres.slice(0, 2).join(" / ") || "on repeat"}
                      </p>
                    </motion.div>
                  );

                  return artist.spotifyUrl ? (
                    <a
                      key={artist.id}
                      href={artist.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={artist.id}>{content}</div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          <motion.article
            className="group relative min-h-96 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/4 p-6 backdrop-blur-xl"
            whileHover="hover"
            initial="rest"
            animate="rest"
          >
            <div className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-red-300/45 to-transparent" />
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-300/20 bg-red-400/10 text-red-200">
                <LuTrophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
                  Formula 1
                </p>
                <h2 className="text-2xl font-black tracking-tight text-white">
                  Next race
                </h2>
              </div>
            </div>

            <div className="relative mb-5 flex h-44 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-black/28">
              <motion.div
                aria-hidden="true"
                className="absolute left-0 top-1/2 h-px w-full bg-linear-to-r from-transparent via-red-300/60 to-transparent"
                variants={{
                  rest: { opacity: 0.28, x: "-18%" },
                  hover: { opacity: 0.85, x: "18%" },
                }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.div
                aria-hidden="true"
                className="absolute left-8 top-10 h-1 w-28 rounded-full bg-red-400/50 blur-sm"
                variants={{
                  rest: { opacity: 0.2, x: 0 },
                  hover: { opacity: 0.85, x: 180 },
                }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
              <Image
                src={nextRace.trackImage}
                alt={`${nextRace.name} circuit`}
                width={220}
                height={160}
                className="relative z-10 h-30 w-42 object-contain opacity-85 drop-shadow-[0_0_24px_rgba(255,255,255,0.22)] transition duration-300 group-hover:scale-105 group-hover:opacity-100"
              />
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-200/70">
              Round {nextRace.round}
            </p>
            <h3 className="mt-2 text-3xl font-black tracking-tight text-white">
              {nextRace.name}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
                {nextRace.location}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
                <LuCalendarDays className="h-3.5 w-3.5 text-red-200" />
                {formatRaceDate(nextRace.date)}
              </span>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-400">
              I watch F1 for the mix of speed and systems thinking: tire
              strategy, tiny setup choices, pressure, radio calls and how one
              decision can flip a whole weekend. It scratches the same part of
              my brain as debugging a hard problem, just louder.
            </p>
          </motion.article>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {games.map((item) => {
            return (
              <motion.article
                key={item.name}
                className="group relative min-h-64 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/4 p-6 backdrop-blur-xl transition duration-300 hover:border-purple-300/25 hover:bg-white/7"
                whileHover={{ y: -5 }}
              >
                <div className={`absolute inset-0 bg-linear-to-br ${item.accent} opacity-0 transition duration-300 group-hover:opacity-100`} />
                <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-black/28 p-3">
                  <Image
                    src={item.logo}
                    alt={`${item.name} logo`}
                    width={52}
                    height={52}
                    className="max-h-11 max-w-11 object-contain transition duration-300 group-hover:scale-110"
                  />
                </div>
                <p className="relative text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
                  {item.label}
                </p>
                <h2 className="relative mt-2 text-2xl font-black tracking-tight text-white">
                  {item.name}
                </h2>
                <p className="relative mt-4 text-sm leading-6 text-slate-400">{item.detail}</p>
              </motion.article>
            );
          })}

          {setupCards.map((item) => (
            <motion.article
              key={item.name}
              className="group relative min-h-64 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/4 p-6 backdrop-blur-xl transition duration-300 hover:border-purple-300/25 hover:bg-white/7"
              whileHover={{ y: -5 }}
            >
              <div className={`absolute inset-0 bg-linear-to-br ${item.accent} opacity-0 transition duration-300 group-hover:opacity-100`} />
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-black/28 p-3">
                <Image
                  src={item.logo}
                  alt={`${item.name} logo`}
                  width={52}
                  height={52}
                  className="max-h-11 max-w-11 object-contain transition duration-300 group-hover:scale-110"
                />
              </div>
              <p className="relative text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
                {item.label}
              </p>
              <h2 className="relative mt-2 text-2xl font-black tracking-tight text-white">
                {item.name}
              </h2>
              <p className="relative mt-4 text-sm leading-6 text-slate-400">{item.detail}</p>
            </motion.article>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/4 p-6 backdrop-blur-xl md:p-8">
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/22 text-purple-200">
                <LuCode className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
                  Coding
                </p>
                <h2 className="text-2xl font-black tracking-tight text-white">
                  JVM, services and web.
                </h2>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-400">
              Kotlin, Java, Go and TypeScript are the languages I spend the most
              time in right now. Backend systems, Minecraft projects, tools and
              polished interfaces all live somewhere in that mix.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {stack.map((language) => (
              <motion.div
                key={language.name}
                className="relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-black/24 p-5"
                whileHover={{ y: -4, scale: 1.015 }}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${language.accent}`}
                />
                <p className="font-mono text-sm text-slate-500">{language.note}</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-white">
                  {language.name}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
