import Image from "next/image";
import { LiquidGlass } from "@vepando/liquid-glass-react";
import type { NextRace } from "./NowExperience";

export default function NowRaceCard({
  race,
  loading = false,
}: {
  race?: NextRace | null;
  loading?: boolean;
}) {
  const date = race
    ? new Intl.DateTimeFormat("en-GB", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Berlin",
        timeZoneName: "short",
      }).format(new Date(race.date))
    : "";
  return (
    <article className="personal-tile" aria-busy={loading}>
      <LiquidGlass radius={20} tint="dark" blur={4} specular={0.8} className="personal-tile-glass">
        <p className="simple-label">FORMULA 1</p>
        {loading ? (
          <div className="now-race-loading" role="status" aria-label="Loading next race">
            <span className="now-skeleton" />
            <span className="now-skeleton" />
            <span className="now-skeleton" />
          </div>
        ) : (
          <>
            <h3>{race?.name ?? "Race weekends"}</h3>
            {race ? (
              <p>
                {race.location} · <time dateTime={race.date}>{date}</time>
              </p>
            ) : (
              <p>The next race is currently unavailable.</p>
            )}
            {race?.trackImage && (
              <Image
                className="personal-track"
                src={race.trackImage}
                alt={`${race.name} circuit`}
                width={180}
                height={110}
              />
            )}
          </>
        )}
        <a href="https://www.formula1.com/en/racing" target="_blank" rel="noopener noreferrer">
          Season calendar ↗
        </a>
      </LiquidGlass>
    </article>
  );
}
