import ChapterTitle from "@/components/portfolio/ChapterTitle";
import { ScrollScene, SceneRibbon } from "@/components/portfolio/ScrollScene";
import { NowCardDetail } from "@/components/now/NowAccents";
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
    <Reveal className="now-editorial overflow-clip now-flow">
      <main className="now-content">
        <header className="now-opening flex flex-col justify-between">
          <div className="now-opening-index flex justify-between gap-5 pt-5 eyebrow font-medium tracking-[0.13em] uppercase">
            <span>byPixelTV / Beyond the code</span>
            <span>A little life update</span>
          </div>
          <div className="now-opening-grid grid items-center">
            <div>
              <ChapterTitle as="h1" lines={["OFF THE", "CLOCK."]} />
              <p className="now-opening-copy leading-[1.7] mt-[30px]">
                Code. Headphones. One more round.
                <br />
                The person behind the projects.
              </p>
            </div>
            <ScrollScene className="now-opening-art w-full" travel={24} turn={3} zoom={0.88}>
              <div className="now-orbit-art grid place-items-center" aria-hidden="true">
                <i />
                <i />
                <i />
                <span>✳</span>
                <small>ALWAYS CURIOUS / EVEN OFFLINE</small>
              </div>
              <p>
                Usually building something.
                <br />
                Otherwise, probably here.
              </p>
            </ScrollScene>
          </div>
          <nav className="experience-index" aria-label="On this page">
            <a href="#rotation">
              <small>01</small>
              <strong>The soundtrack</strong>
              <span>↘</span>
            </a>
            <a href="#off-screen">
              <small>02</small>
              <strong>A change of pace</strong>
              <span>↘</span>
            </a>
            <a href="#working-with">
              <small>03</small>
              <strong>Back to building</strong>
              <span>↘</span>
            </a>
          </nav>
        </header>

        <section id="rotation" className="now-soundtrack" aria-labelledby="rotation-heading">
          <div className="now-chapter-heading grid items-end">
            <p className="eyebrow font-medium tracking-[0.13em] uppercase">01 / The soundtrack</p>
            <ChapterTitle id="rotation-heading" lines={["LIFE HAS A", "SOUNDTRACK."]} />
            <p>
              Usually something playing.
              <br />
              Usually a little too loud.
            </p>
          </div>
          <div className="now-soundtrack-grid grid items-start">
            <div className="now-record-sticky">
              <ScrollScene travel={12} zoom={0.94}>
                <NowListening />
              </ScrollScene>
            </div>
            <div className="now-rotation-list">
              <p className="now-margin-note leading-[1.25] tracking-[-0.04em] font-semibold">
                A few familiar voices.
                <br />
                <span>A lot of repeat plays.</span>
              </p>
              <NowArtists />
            </div>
          </div>
        </section>

        <SceneRibbon words="A CHANGE OF PACE" />

        <section id="off-screen" className="now-downtime" aria-labelledby="off-heading">
          <div className="now-chapter-heading grid items-end">
            <p className="eyebrow font-medium tracking-[0.13em] uppercase">
              02 / Away from the editor
            </p>
            <ChapterTitle id="off-heading" lines={["ONE MORE", "ROUND."]} />
            <p>
              Race weekends. Familiar worlds.
              <br />A few things I keep coming back to.
            </p>
          </div>
          <div className="now-life-story grid items-start">
            <article className="now-race overflow-hidden relative now-race-feature">
              <div className="now-card-top">
                <span className="eyebrow font-medium tracking-[0.13em] uppercase">
                  Weekend plans / Formula 1
                </span>
                <NowCardDetail kind="race" />
              </div>
              <span
                className="now-race-word block font-black tracking-[-0.075em] leading-none whitespace-nowrap"
                aria-hidden="true"
              >
                LIGHTS OUT.
              </span>
              <div className="now-circuit-viewport">
                <ScrollScene travel={12} turn={2} zoom={0.86}>
                  <div className="now-track">
                    {nextRace?.trackImage ? (
                      <Image
                        src={nextRace.trackImage}
                        alt={`${nextRace.name} circuit`}
                        width={500}
                        height={300}
                      />
                    ) : (
                      <span
                        className="now-f1-word text-[76px] italic leading-[0.8] font-[950] tracking-[-0.08em]"
                        aria-hidden="true"
                      >
                        F1
                      </span>
                    )}
                  </div>
                </ScrollScene>
              </div>
              <p className="eyebrow font-medium tracking-[0.13em] uppercase">
                {nextRace ? `Up next / Round ${nextRace.round}` : "Following the season"}
              </p>
              <h3>{nextRace?.name ?? "Race weekends."}</h3>
              {nextRace ? (
                <p className="now-race-date flex flex-wrap justify-between gap-2 text-[11px] mt-[18px] pb-4">
                  {nextRace.location}
                  <time dateTime={nextRace.date}>{formatRaceDate(nextRace.date)}</time>
                </p>
              ) : (
                <p className="now-race-date flex flex-wrap justify-between gap-2 text-[11px] mt-[18px] pb-4">
                  The next race is currently unavailable.
                </p>
              )}
              <p className="now-copy">
                The speed, the strategy, the tiny decisions that change an entire weekend. I’m here
                for all of it.
              </p>
              <a
                className="now-text-link flex justify-between items-center gap-4 text-[12px] font-semibold mt-6 pb-[6px]"
                href="https://www.formula1.com/en/racing/2026"
                target="_blank"
                rel="noopener noreferrer"
              >
                Season calendar <span>↗</span>
              </a>
            </article>
            <div className="now-offline-stories">
              {games.map((game) => (
                <article className="now-minecraft-story" key={game.name} data-enter>
                  <p className="eyebrow font-medium tracking-[0.13em] uppercase">
                    A familiar world / {game.label}
                  </p>
                  <ScrollScene travel={12} turn={3} zoom={0.9}>
                    <div className="now-minecraft-art flex items-center justify-between gap-[14px]">
                      <span aria-hidden="true">
                        PLAY.
                        <br />
                        BUILD.
                        <br />
                        REPEAT.
                      </span>
                      <NowCardDetail kind="minecraft">
                        <Image src={game.logo} alt="" width={130} height={130} />
                      </NowCardDetail>
                    </div>
                  </ScrollScene>
                  <h3>{game.name}</h3>
                  <p className="now-copy">{game.detail}</p>
                  <Link
                    className="now-text-link flex justify-between items-center gap-4 text-[12px] font-semibold mt-6 pb-[6px]"
                    href="/#projects"
                  >
                    Where playing turns into building <span>↗</span>
                  </Link>
                </article>
              ))}
              <div className="now-daily-tools">
                <p className="eyebrow font-medium tracking-[0.13em] uppercase">
                  The everyday essentials
                </p>
                {setupCards.map((item) => (
                  <article key={item.name} data-enter>
                    <Image
                      src={item.logo}
                      alt=""
                      width={40}
                      height={40}
                      className={item.logoClassName}
                    />
                    <div>
                      <p className="eyebrow font-medium tracking-[0.13em] uppercase">
                        {item.label}
                      </p>
                      <h3>{item.name}</h3>
                      <p className="now-copy">{item.detail}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SceneRibbon words="CURIOSITY NEVER CLOCKS OUT" />

        <section
          id="working-with"
          className="now-return grid items-start"
          aria-labelledby="code-heading"
        >
          <div className="now-return-intro">
            <p className="eyebrow font-medium tracking-[0.13em] uppercase">
              03 / Back in the editor
            </p>
            <ChapterTitle id="code-heading" lines={["AND BACK", "TO BUILDING."]} />
            <p className="now-copy">
              Backend systems, Minecraft projects and web interfaces. These are the languages I keep
              reaching for.
            </p>
            <Link
              href="/#projects"
              className="now-text-link flex justify-between items-center gap-4 text-[12px] font-semibold mt-6 pb-[6px]"
            >
              Explore my projects <span>↗</span>
            </Link>
          </div>
          <ol className="now-language-stack">
            {stack.map((language, index) => (
              <li key={language.name} data-enter data-enter-delay={index * 70}>
                <span className="eyebrow font-medium tracking-[0.13em] uppercase">
                  0{index + 1} / In the toolkit
                </span>
                <strong>{language.name}</strong>
                <p>{language.note}</p>
                <span
                  className="now-language-symbol absolute right-[15px] bottom-[-20px] pointer-events-none"
                  aria-hidden="true"
                >
                  {index % 2 ? "{ }" : "</>"}
                </span>
              </li>
            ))}
          </ol>
        </section>
        <div className="now-closing text-center">
          <span className="eyebrow font-medium tracking-[0.13em] uppercase">
            That's where I'm at.
          </span>
          <p>
            Still figuring things out.
            <br />
            <em>Still building.</em>
          </p>
          <Link href="/blog">
            Notes from along the way <span>↗</span>
          </Link>
        </div>
      </main>
    </Reveal>
  );
}
