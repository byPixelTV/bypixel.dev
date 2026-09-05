import { NowStar, NowCardDetail } from "@/components/now/NowAccents";
import Image from "next/image";
import Link from "next/link";
import NowListening from "@/components/now/NowListening";
import NowArtists from "@/components/now/NowArtists";
import Reveal from "@/components/portfolio/Reveal";

export interface NextRace {
  name: string;
  location: string;
  round: number;
  date: string;
  trackImage?: string;
}
const stack = [
  { name: "Kotlin", accent: "from-purple-400 to-fuchsia-300", note: "JVM backends" },
  { name: "Java", accent: "from-orange-300 to-red-300", note: "Minecraft systems" },
  { name: "Go", accent: "from-cyan-300 to-sky-300", note: "fast services" },
  { name: "TypeScript", accent: "from-blue-300 to-indigo-300", note: "web apps" },
];

const games = [
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
    logoClassName: "brightness-0 invert",
    detail:
      "Clean hardware, weird little design choices and a UI that feels different enough to actually have taste.",
    accent: "from-white/18 to-zinc-400/8",
  },
  {
    name: "Windows",
    label: "Main setup",
    logo: "/assets/logo/windows.webp",
    logoClassName: "",
    detail:
      "Where most of the day happens: code, tools, games, debugging sessions and the occasional desktop cleanup that lasts five minutes.",
    accent: "from-sky-400/22 to-blue-500/10",
  },
];

function formatRaceDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Berlin",
    timeZoneName: "short",
  }).format(new Date(date));
}

export default function NowExperience({ nextRace }: { nextRace: NextRace | null }) {
  return (
    <Reveal className="now-editorial">
      <main className="now-content">
        <header className="now-hero">
          <div className="now-index" data-intro="0">
            <span className="eyebrow">byPixelTV / Off the clock</span>
            <span className="eyebrow">A little life update ↙</span>
          </div>
          <h1 data-intro="1">
            RIGHT
            <br />
            <span>NOW</span>
            <NowStar />
            <span className="now-period">.</span>
          </h1>
          <div className="now-intro" data-intro="2">
            <p>
              Code. Headphones.
              <br />
              One more round.
            </p>
            <p>
              A snapshot of what I’m building, listening to and spending time with. The person
              behind the projects.
            </p>
          </div>
          <nav data-intro="3" className="now-jump" aria-label="On this page">
            <a href="#rotation">01 / On repeat ↘</a>
            <a href="#off-screen">02 / Off the clock ↘</a>
            <a href="#working-with">03 / In the editor ↘</a>
          </nav>
        </header>

        <section id="rotation" className="now-music" aria-labelledby="rotation-heading" data-enter>
          <div className="now-section-heading">
            <p className="eyebrow">01 / The soundtrack</p>
            <h2 id="rotation-heading">
              ON <em>REPEAT.</em>
            </h2>
            <p>
              Usually something playing.
              <br />
              Usually a little too loud.
            </p>
          </div>
          <div className="now-music-layout">
            <NowListening />
            <NowArtists />
          </div>
        </section>

        <section id="off-screen" aria-labelledby="off-heading" data-enter>
          <div className="now-section-heading">
            <p className="eyebrow">02 / A change of pace</p>
            <h2 id="off-heading">
              OFF THE <em>CLOCK.</em>
            </h2>
            <p>
              A few things I keep
              <br />
              coming back to.
            </p>
          </div>
          <div className="now-life-grid">
            <article className="now-race">
              <div className="now-card-top">
                <span className="eyebrow">Weekend plans / Formula 1</span>
                <NowCardDetail kind="race" />
              </div>
              <div className="now-track">
                {nextRace?.trackImage ? (
                  <Image
                    src={nextRace.trackImage}
                    alt={`${nextRace.name} circuit`}
                    width={400}
                    height={240}
                  />
                ) : (
                  <span className="now-f1-word" aria-hidden="true">
                    LIGHTS
                    <br />
                    OUT.
                  </span>
                )}
              </div>
              <p className="eyebrow">
                {nextRace ? `Up next / Round ${nextRace.round}` : "Following the season"}
              </p>
              <h3>{nextRace?.name ?? "Race weekends."}</h3>
              {nextRace ? (
                <p className="now-race-date">
                  {nextRace.location}{" "}
                  <time dateTime={nextRace.date}>{formatRaceDate(nextRace.date)}</time>
                </p>
              ) : (
                <p className="now-race-date">The next race is currently unavailable.</p>
              )}
              <p className="now-copy">
                The speed, the strategy, the tiny decisions that change an entire weekend. I’m here
                for all of it.
              </p>
              <a
                className="now-text-link"
                href="https://www.formula1.com/en/racing/2026"
                target="_blank"
                rel="noopener noreferrer"
              >
                Season calendar <span>↗</span>
              </a>
            </article>
            <div className="now-games">
              {games.map((game, index) => (
                <article className="now-game" key={game.name}>
                  <div>
                    <p className="eyebrow">
                      0{index + 1} / {game.label}
                    </p>
                    <h3>{game.name}</h3>
                    <p className="now-copy">{game.detail}</p>
                  </div>
                  <NowCardDetail kind="minecraft">
                    <Image src={game.logo} alt="" width={100} height={100} />
                  </NowCardDetail>
                </article>
              ))}
            </div>
          </div>
          <div className="now-setup">
            {setupCards.map((item) => (
              <article key={item.name}>
                <Image
                  src={item.logo}
                  alt=""
                  width={40}
                  height={40}
                  className={item.logoClassName}
                />
                <div>
                  <p className="eyebrow">{item.label}</p>
                  <h3>{item.name}</h3>
                  <p className="now-copy">{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="working-with" className="now-code" aria-labelledby="code-heading" data-enter>
          <div>
            <p className="eyebrow">03 / In the editor</p>
            <h2 id="code-heading">
              ALWAYS
              <br />
              <em>BUILDING.</em>
            </h2>
            <p className="now-copy">
              Backend systems, Minecraft projects and web interfaces. These are the languages I keep
              reaching for.
            </p>
            <Link href="/#projects" className="now-text-link">
              Explore my projects <span>↗</span>
            </Link>
          </div>
          <ol>
            {stack.map((language, index) => (
              <li key={language.name}>
                <span className="eyebrow">0{index + 1}</span>
                <strong>{language.name}</strong>
                <span>{language.note}</span>
              </li>
            ))}
          </ol>
        </section>
        <footer className="now-end">
          <Link href="/">
            Back to the projects <span>↖</span>
          </Link>
          <span className="eyebrow">Still figuring things out. Still building.</span>
        </footer>
      </main>
    </Reveal>
  );
}
