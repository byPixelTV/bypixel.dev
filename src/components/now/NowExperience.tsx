import Image from "next/image";
import Link from "next/link";
import NowListening from "@/components/now/NowListening";
import NowArtists from "@/components/now/NowArtists";

export interface NextRace {
  name: string;
  location: string;
  round: number;
  date: string;
  trackImage?: string;
}

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
          <article className="personal-tile">
            <p className="simple-label">FORMULA 1</p>
            <h3>{nextRace?.name ?? "Race weekends"}</h3>
            {nextRace ? (
              <p>
                {nextRace.location} ·{" "}
                <time dateTime={nextRace.date}>{formatRaceDate(nextRace.date)}</time>
              </p>
            ) : (
              <p>The next race is currently unavailable.</p>
            )}
            {nextRace?.trackImage && (
              <Image
                className="personal-track"
                src={nextRace.trackImage}
                alt={`${nextRace.name} circuit`}
                width={180}
                height={110}
              />
            )}
            <a href="https://www.formula1.com/en/racing" target="_blank" rel="noopener noreferrer">
              Season calendar ↗
            </a>
            <details className="personal-easter">
              <summary>Radio check</summary>
              <p>Copy. The next lap starts after this one. 🏁</p>
            </details>
          </article>
          <article className="personal-tile">
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
            <details className="personal-easter">
              <summary>One more block</summary>
              <p>Just one more. Then it’s definitely finished. ⛏</p>
            </details>
          </article>
          <article className="personal-tile">
            <p className="simple-label">EVERYDAY TECH</p>
            <h3>Nothing Phone & Windows</h3>
            <p>My daily setup for coding, games and everything in between.</p>
            <details className="personal-easter">
              <summary>A small detail</summary>
              <p>The desktop cleanup is temporary. The tabs are forever.</p>
            </details>
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
            <strong>Kotlin</strong>
            <span>JVM backends</span>
          </li>
          <li>
            <strong>Java</strong>
            <span>Minecraft systems</span>
          </li>
          <li>
            <strong>Go</strong>
            <span>Services</span>
          </li>
          <li>
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
