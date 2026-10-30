import Image from "next/image";
import Link from "next/link";
import { LiquidGlass } from "@vepando/liquid-glass-react";
import type { ReactNode } from "react";
import { FaJava } from "react-icons/fa";
import { SiGo, SiKotlin, SiTypescript } from "react-icons/si";
import NowListening from "@/components/now/NowListening";
import NowArtists from "@/components/now/NowArtists";

export interface NextRace {
  name: string;
  location: string;
  round: number;
  date: string;
  trackImage?: string;
}

export default function NowExperience({ raceCard }: { raceCard: ReactNode }) {
  return (
    <main className="personal-now">
      <header className="personal-now-header">
        <p className="simple-label">A LITTLE LIFE UPDATE</p>
        <h1>
          Beyond the code<span>.</span>
        </h1>
        <p>A few things I’m listening to, playing and building with.</p>
        <nav aria-label="On this page">
          <a href="#rotation">Music</a>
          <a href="#off-screen">Offline</a>
          <a href="#working-with">Toolkit</a>
        </nav>
      </header>
      <section id="rotation" className="personal-section">
        <div className="personal-heading">
          <div>
            <p className="simple-label">01 / MUSIC</p>
            <h2>On repeat</h2>
          </div>
          <p>What’s playing and a few familiar artists.</p>
        </div>
        <div className="personal-music-grid">
          <NowListening />
          <NowArtists />
        </div>
      </section>
      <section id="off-screen" className="personal-section">
        <div className="personal-heading">
          <div>
            <p className="simple-label">02 / OFFLINE</p>
            <h2>Outside the editor</h2>
          </div>
          <p>Games, race weekends and everyday tech.</p>
        </div>
        <div className="personal-tiles">
          {raceCard}
          <article className="personal-tile">
            <LiquidGlass
              radius={20}
              tint="dark"
              blur={4}
              specular={0.8}
              className="personal-tile-glass"
            >
              <p className="simple-label">MINECRAFT</p>
              <Image
                src="/assets/logo/minecraft.svg"
                alt=""
                width={44}
                height={44}
                className="personal-logo"
              />
              <h3>Still playing. Still building.</h3>
              <p>Servers, plugins and the occasional reason to stay up too late.</p>
              <Link href="/#projects">See the projects ↗</Link>
            </LiquidGlass>
          </article>
          <article className="personal-tile">
            <LiquidGlass
              radius={20}
              tint="dark"
              blur={4}
              specular={0.8}
              className="personal-tile-glass"
            >
              <p className="simple-label">EVERYDAY TECH</p>
              <h3>Nothing Phone & Windows</h3>
              <p>My daily setup for coding, games and everything in between.</p>
            </LiquidGlass>
          </article>
        </div>
      </section>
      <section id="working-with" className="personal-section personal-toolkit">
        <div className="personal-heading">
          <div>
            <p className="simple-label">03 / IN THE TOOLKIT</p>
            <h2>Back to building</h2>
          </div>
          <p>A few languages I keep coming back to.</p>
        </div>
        <ul>
          <li>
            <SiKotlin aria-hidden="true" className="toolkit-icon toolkit-kotlin" />
            <strong>Kotlin</strong>
            <span>JVM backends</span>
          </li>
          <li>
            <FaJava aria-hidden="true" className="toolkit-icon toolkit-java" />
            <strong>Java</strong>
            <span>Minecraft systems</span>
          </li>
          <li>
            <SiGo aria-hidden="true" className="toolkit-icon toolkit-go" />
            <strong>Go</strong>
            <span>Services</span>
          </li>
          <li>
            <SiTypescript aria-hidden="true" className="toolkit-icon toolkit-typescript" />
            <strong>TypeScript</strong>
            <span>Web apps</span>
          </li>
        </ul>
        <Link href="/blog" className="personal-blog-link">
          Read the blog ↗
        </Link>
      </section>
    </main>
  );
}
