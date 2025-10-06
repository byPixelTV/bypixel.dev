import fetch from "node-fetch";

interface RepoLanguage {
  color: string;
}

export interface RepoInfo {
  name: string;
  description: string | null;
  tags: string[];
  stars: number;
  languages: Record<string, RepoLanguage>;
  url: string;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  url: string;
  html_url: string;
  languages_url: string;
}

/**
 * Get all public repos for a GitHub user with details like:
 * - name
 * - description
 * - topics (tags)
 * - stars
 * - languages (with hex colors)
 * - repo URL
 */
export async function fetchReposUser(
  username: string,
  filterTag?: string,
  token?: string
): Promise<RepoInfo[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // 1. Fetch repos
  const repoRes = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    { headers }
  );

  if (!repoRes.ok) throw new Error(`Failed to fetch repos for ${username}`);
  const repos = (await repoRes.json()) as GitHubRepo[];

  // 2. Process repos
  const result: RepoInfo[] = await Promise.all(
    repos.map(async (repo) => {
      // Fetch topics
      const topicsRes = await fetch(`${repo.url}/topics`, {
        headers: { ...headers, Accept: "application/vnd.github.mercy-preview+json" },
      });
      const topicsData = (await topicsRes.json()) as { names: string[] };

      // Fetch languages
      const langRes = await fetch(repo.languages_url, { headers });
      const languages = (await langRes.json()) as Record<string, number>;

      // Get language hex colors
      const langHex = await fetchLanguageColors(Object.keys(languages));

      return {
        name: repo.name,
        description: repo.description,
        tags: topicsData.names || [],
        stars: repo.stargazers_count,
        languages: langHex,
        url: repo.html_url,
      };
    })
  );

  // 3. Filter if tag provided
  return filterTag
    ? result.filter((repo) => repo.tags.includes(filterTag))
    : result;
}

/**
 * Fetch hex colors for a list of languages using GitHub's public colors.json
 */
async function fetchLanguageColors(
  languages: string[]
): Promise<Record<string, RepoLanguage>> {
  const colorRes = await fetch(
    "https://raw.githubusercontent.com/ozh/github-colors/master/colors.json"
  );

  if (!colorRes.ok) throw new Error("Failed to fetch language colors");
  const colorData = (await colorRes.json()) as Record<
    string,
    { color?: string }
  >;

  const result: Record<string, RepoLanguage> = {};
  for (const lang of languages) {
    result[lang] = {
      color: colorData[lang]?.color || "#000000",
    };
  }
  return result;
}
