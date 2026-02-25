"use client";

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import type { ContributionsResponse } from "@/lib/github/contributions";

type ContributionDay = {
  contributionCount: number;
  date: string;
  color: string;
  weekday: number;
};

function formatDate(date: string) {
  if (!date) return "unknown date";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function tooltipText(day: ContributionDay) {
  const amount = day.contributionCount;
  const label = amount === 1 ? "contribution" : "contributions";
  return `${amount} ${label} on ${formatDate(day.date)}`;
}

function getContributionColor(contributionCount: number) {
  if (contributionCount <= 0) return "rgba(39, 44, 56, 0.85)";
  if (contributionCount <= 2) return "#0e4429";
  if (contributionCount <= 4) return "#006d32";
  if (contributionCount <= 7) return "#26a641";
  return "#39d353";
}

type GithubStatsCardProps = {
  data: ContributionsResponse | null;
};

export default function GithubStatsCard({ data }: GithubStatsCardProps) {

  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);

  const normalizedWeeks = useMemo(() => {
    if (!data?.weeks) return [];

    return data.weeks.map((week) => {
      const byWeekday = new Map(week.contributionDays.map((day) => [day.weekday, day]));
      return Array.from({ length: 7 }, (_, weekday) => byWeekday.get(weekday) ?? null);
    });
  }, [data]);

  return (
    <section className="mt-6">
      <div className="rounded-3xl border border-white/80 bg-black px-6 py-7 sm:px-7 sm:py-8 shadow-2xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-base sm:text-[1.05rem] font-semibold tracking-wide uppercase text-white/95">
            <Icon icon="mdi:github" className="h-5 w-5" />
            GitHub Activity
          </h2>

          {data ? (
            <p className="text-xs sm:text-sm text-white/65">
              {data.totalContributions} contributions · {data.privateContributionsIncluded ? "private included" : "public only"}
            </p>
          ) : null}
        </div>

        {!data ? (
          <div className="rounded-xl border border-border bg-card/60 p-4 text-sm text-muted-foreground">
            Could not load GitHub contributions right now.
          </div>
        ) : null}

        {data ? (
          <>
            <div
              className="grid w-full pb-1"
              style={{
                gridTemplateColumns: `repeat(${Math.max(normalizedWeeks.length, 1)}, minmax(0, 1fr))`,
                gap: "3px",
              }}
            >
              {Array.from({ length: 7 }).flatMap((_, weekday) =>
                normalizedWeeks.map((week, weekIndex) => {
                  const day = week[weekday];

                  if (!day || !day.date) {
                    return (
                      <div
                        key={`week-${weekIndex}-empty-${weekday}`}
                        className="w-full aspect-square rounded-sm"
                        style={{ backgroundColor: "rgba(39, 44, 56, 0.85)" }}
                      />
                    );
                  }

                  return (
                    <button
                      key={`${day.date}-${weekday}`}
                      type="button"
                      className="w-full aspect-square rounded-sm transition-[filter] duration-150 hover:brightness-110"
                      style={{
                        backgroundColor: getContributionColor(day.contributionCount),
                      }}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      title={tooltipText(day)}
                      aria-label={tooltipText(day)}
                    />
                  );
                })
              )}
            </div>

            <div className="mt-5 min-h-6 text-sm font-medium text-white/70">
              {hoveredDay ? tooltipText(hoveredDay) : "Hover a day to view contributions"}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
