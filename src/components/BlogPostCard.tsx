import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { LiquidGlass } from "@vepando/liquid-glass-react";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/mongo";

interface Props {
  post: Omit<Post, "_id" | "content"> & { _id: string };
  authorName: string;
}
export default function BlogPostCard({ post, authorName }: Props) {
  return (
    <article className="simple-post">
      <LiquidGlass radius={20} tint="dark" blur={4} specular={0.8} className="blog-post-glass">
        <Link className="simple-post-link" href={`/blog/post/${post.slug || post._id}`}>
          <div className="simple-post-copy">
            <div className="simple-post-meta">
              <time>{dayjs(post.creationDate).format("MMM D, YYYY")}</time>
              <span>·</span>
              <span>{authorName}</span>
              {post.draft && <span className="simple-draft">Draft</span>}
            </div>
            <h3>{post.title}</h3>
            <p>{post.shortDescription || ""}</p>
          </div>
          {post.thumbnail && (
            <div className="simple-post-image">
              <Image src={post.thumbnail} alt="" fill sizes="112px" />
            </div>
          )}
          <span className="simple-post-arrow" aria-hidden="true">
            <ArrowUpRight size={19} />
          </span>
        </Link>
      </LiquidGlass>
    </article>
  );
}
