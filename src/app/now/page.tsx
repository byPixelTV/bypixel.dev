import type { Metadata } from "next";
import BackgroundLayout from "@/components/BackgroundLayout";
import Navbar from "@/components/Navbar";
import NowExperience, { type NextRace } from "@/components/now/NowExperience";

export const metadata: Metadata = {
  title: "Now | byPixelTV",
  description:
    "A quick snapshot of what byPixelTV is currently listening to, playing, watching, using, and coding with.",
  openGraph: {
    title: "Now | byPixelTV",
    description:
      "Music, games, tech, F1 and the languages currently shaping my day-to-day.",
    images: [
      {
        url: "/assets/logo/256x.png",
        width: 256,
        height: 256,
        alt: "byPixelTV Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Now | byPixelTV",
    description:
      "Music, games, tech, F1 and the languages currently shaping my day-to-day.",
    images: ["/assets/logo/256x.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface F1CalendarRace {
  name: string;
  location: string;
  round: number;
  slug: string;
  sessions: Record<string, string>;
}

const fallbackRace: NextRace = {
  name: "Austrian Grand Prix",
  location: "Spielberg",
  round: 8,
  date: "2026-06-28T13:00:00Z",
  trackImage: "/assets/f1/spielberg-3.svg",
};

const trackImages: Record<string, string> = {
  "austrian-grand-prix": "/assets/f1/spielberg-3.svg",
  "british-grand-prix": "/assets/f1/silverstone-8.svg",
  "belgian-grand-prix": "/assets/f1/spa-francorchamps-4.svg",
  "hungarian-grand-prix": "/assets/f1/hungaroring-3.svg",
  "dutch-grand-prix": "/assets/f1/zandvoort-5.svg",
  "italian-grand-prix": "/assets/f1/monza-7.svg",
  "spanish-grand-prix": "/assets/f1/madring-1.svg",
  "azerbaijan-grand-prix": "/assets/f1/baku-1.svg",
  "singapore-grand-prix": "/assets/f1/marina-bay-4.svg",
  "us-grand-prix": "/assets/f1/austin-1.svg",
  "mexican-grand-prix": "/assets/f1/mexico-city-3.svg",
  "brazilian-grand-prix": "/assets/f1/interlagos-2.svg",
  "las-vegas-grand-prix": "/assets/f1/las-vegas-1.svg",
  "qatar-grand-prix": "/assets/f1/lusail-1.svg",
  "abu-dhabi-grand-prix": "/assets/f1/yas-marina-2.svg",
};

export const revalidate = 21600;

async function getNextRace(): Promise<NextRace> {
  try {
    const res = await fetch("https://f1calendar.com/api/calendar", {
      next: { revalidate },
    });

    if (!res.ok) {
      return fallbackRace;
    }

    const data = (await res.json()) as { races?: F1CalendarRace[] };
    const now = Date.now();
    const next = data.races
      ?.map((race) => ({
        ...race,
        date: race.sessions["Grand Prix"],
      }))
      .filter((race) => race.date && new Date(race.date).getTime() > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

    if (!next) {
      return fallbackRace;
    }

    return {
      name: next.name,
      location: next.location,
      round: next.round,
      date: next.date,
      trackImage: trackImages[next.slug] ?? fallbackRace.trackImage,
    };
  } catch {
    return fallbackRace;
  }
}

export default async function NowPage() {
  const nextRace = await getNextRace();

  return (
    <BackgroundLayout>
      <Navbar />
      <NowExperience nextRace={nextRace} />
    </BackgroundLayout>
  );
}
