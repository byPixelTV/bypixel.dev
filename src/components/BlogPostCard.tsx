"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { Posts } from "../../types/appwrite";
interface PostCardProps {
  post: Posts;
  authorName: string;
}

export default function BlogPostCard({ post, authorName }: PostCardProps) {
  return (
    <Card className="bg-white/5 border-white/10 border overflow-hidden">
      {post.thumbnail && (
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={post.thumbnail}
            alt="Post thumbnail"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover rounded-t-xl"
          />
        </div>
      )}
      <CardContent className="p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">{post.title}</h2>
          <Badge variant="secondary">
            {dayjs(post.creationDate).format("MMM D, YYYY")}
          </Badge>
        </div>
        <p className="text-gray-300 text-sm">
          {post.shortDescription || "No description available."}
        </p>
        {post.updateDate && (
          <div className="text-xs text-gray-400">
            Updated {dayjs(post.updateDate).format("MMM D, YYYY")}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center px-5 pb-5">
        <div className="flex flex-col">
          <span className="text-sm text-gray-400">Written by {authorName}</span>
          <span className="text-xs text-gray-500">
            {post.views || 0} {post.views === 1 ? "view" : "views"}
          </span>
        </div>
        <Button asChild variant="secondary">
          <Link href={`/blog/post/${post.slug || post.$id}`} prefetch={true}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
