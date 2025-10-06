"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RepoInfo } from "@/lib/github/github_util";
import { Star, Link2 } from "lucide-react";

interface ProjectsCardProps {
  repo: RepoInfo;
}

export default function ProjectsCard({ repo }: ProjectsCardProps) {
  const languages = Object.entries(repo.languages);
  const topLanguages = languages.slice(0, 3);
  const extraLanguages = languages.length - topLanguages.length;

  return (
    <Card className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] flex flex-col min-h-[320px] will-change-transform border border-[#333] bg-[#111111]">
      <CardContent className="p-6 flex flex-col flex-1">
        {/* Title + Stars */}
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-lg font-semibold text-white leading-tight break-words">
            {repo.name}
          </h2>
          <div className="flex items-center gap-1 text-yellow-400 shrink-0">
            <Star className="w-4 h-4 fill-yellow-400" />
            <span className="text-sm">{repo.stars}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm line-clamp-3 mb-4">
          {repo.description || "No description available."}
        </p>

        {/* Languages */}
        {languages.length > 0 && (
          <div className="flex items-center gap-2 mt-auto mb-4 flex-wrap">
            {topLanguages.map(([lang, data]) => (
              <div
                key={lang}
                className="flex items-center gap-2 text-xs bg-white/10 px-2 py-1 rounded-full text-gray-300"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: data.color }}
                />
                {lang}
              </div>
            ))}
            {extraLanguages > 0 && (
              <span className="text-xs text-gray-400">+{extraLanguages} more</span>
            )}
          </div>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-6 pt-0">
        <Button
          asChild
          variant="secondary"
          className="w-full bg-white/10 hover:bg-white/20 text-white text-sm"
        >
          <Link href={repo.url} target="_blank" rel="noopener noreferrer">
            {/* link icon */}
            <Link2 className="w-4 h-4 mr-2" />
            View on GitHub
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
