import "server-only";

export type ContributionDay = {
  contributionCount: number;
  date: string;
  color: string;
  weekday: number;
};

export type ContributionWeek = {
  contributionDays: ContributionDay[];
};

export type ContributionsResponse = {
  username: string;
  totalContributions: number;
  restrictedContributionsCount: number;
  privateContributionsIncluded: boolean;
  weeks: ContributionWeek[];
};

type GitHubGraphQLResponse = {
  data?: {
    viewer: {
      login: string;
    };
    user: {
      contributionsCollection: {
        restrictedContributionsCount: number;
        contributionCalendar: {
          totalContributions: number;
          weeks: Array<{
            contributionDays: ContributionDay[];
          }>;
        };
      };
    } | null;
  };
  errors?: Array<{ message: string }>;
};

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

function padWeekDays(days: ContributionDay[]) {
  const padded = [...days];
  const seenWeekdays = new Set(days.map((day) => day.weekday));

  for (let weekday = 0; weekday < 7; weekday++) {
    if (!seenWeekdays.has(weekday)) {
      padded.push({
        contributionCount: 0,
        date: "",
        color: "rgba(63, 63, 70, 0.55)",
        weekday,
      });
    }
  }

  return padded.sort((a, b) => a.weekday - b.weekday);
}

function parsePublicContributionsFromSvg(svg: string) {
  const weekMatches = svg.matchAll(/<g[^>]*>[\s\S]*?<\/g>/g);
  const weeks: Array<{ contributionDays: ContributionDay[] }> = [];
  let totalContributions = 0;

  for (const match of weekMatches) {
    const group = match[0];
    const dayMatches = group.matchAll(/<rect[^>]*data-date="([^"]+)"[^>]*>/g);
    const contributionDays: ContributionDay[] = [];

    for (const dayMatch of dayMatches) {
      const rect = dayMatch[0];
      const date = dayMatch[1];
      const countMatch = rect.match(/data-count="(\d+)"/);

      if (!countMatch || !date) continue;

      const contributionCount = Number(countMatch[1]);
      const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();

      totalContributions += contributionCount;

      contributionDays.push({
        contributionCount,
        date,
        color: "",
        weekday,
      });
    }

    if (contributionDays.length > 0) {
      weeks.push({ contributionDays: padWeekDays(contributionDays) });
    }
  }

  return {
    totalContributions,
    weeks,
  };
}

async function fetchPublicContributions(username: string): Promise<ContributionsResponse> {
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const from = oneYearAgo.toISOString().slice(0, 10);
  const to = now.toISOString().slice(0, 10);
  const url = `https://github.com/users/${username}/contributions?from=${from}&to=${to}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "bypixel.dev",
      Accept: "text/html",
    },
    next: { revalidate: 60 * 30 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch public contributions");
  }

  const svg = await response.text();
  const parsed = parsePublicContributionsFromSvg(svg);

  return {
    username,
    totalContributions: parsed.totalContributions,
    restrictedContributionsCount: 0,
    privateContributionsIncluded: false,
    weeks: parsed.weeks,
  };
}

export async function fetchGithubContributions(): Promise<ContributionsResponse | null> {
  const username = process.env.GITHUB_USERNAME || "bypixeltv";
  const token =
    process.env.GITHUB_CONTRIBUTIONS_TOKEN ||
    process.env.GITHUB_TOKEN ||
    process.env.GH_TOKEN;

  if (!token) {
    try {
      return await fetchPublicContributions(username);
    } catch {
      return null;
    }
  }

  const query = `
    query Contributions($username: String!) {
      viewer {
        login
      }
      user(login: $username) {
        contributionsCollection {
          restrictedContributionsCount
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
                weekday
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
      next: { revalidate: 60 * 30 },
    });

    if (!response.ok) {
      return null;
    }

    const json = (await response.json()) as GitHubGraphQLResponse;

    if (json.errors?.length || !json.data?.user) {
      return null;
    }

    const contributionCalendar =
      json.data.user.contributionsCollection.contributionCalendar;
    const restrictedContributionsCount =
      json.data.user.contributionsCollection.restrictedContributionsCount;

    const privateContributionsIncluded =
      json.data.viewer.login.toLowerCase() === username.toLowerCase();

    return {
      username,
      totalContributions: contributionCalendar.totalContributions,
      restrictedContributionsCount,
      privateContributionsIncluded,
      weeks: contributionCalendar.weeks,
    };
  } catch {
    return null;
  }
}
