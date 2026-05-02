"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { Post } from "@/lib/mongo";
import { LuCalendar, LuEye, LuUser } from "react-icons/lu";

interface Props {
  post: Omit<Post, "_id"> & { _id: string };
  authorName: string;
}

export default function BlogPostCard({ post, authorName }: Props) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md hover:bg-white/10 transition-colors duration-300"
    >
      <Link href={`/blog/post/${post.slug || post._id.toString()}`} className="flex flex-col h-full">
        {/* Thumbnail Container */}
        {post.thumbnail && (
          <div className="relative w-full aspect-video overflow-hidden">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-[#0c0618]/60 to-transparent opacity-60" />
            
            {/* Date Badge */}
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] font-medium text-white/90">
                <LuCalendar className="size-3 text-purple-400" />
                {dayjs(post.creationDate).format("MMM D, YYYY")}
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex flex-col grow p-6">
          <h2 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300 line-clamp-2">
            {post.title}
          </h2>
          
          <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-3">
            {post.shortDescription || "No description available."}
          </p>

          {/* Footer Area */}
          <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-xs font-medium text-white/40">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 hover:text-white/60 transition-colors">
                <LuUser className="size-3.5 text-purple-500/80" />
                {authorName}
              </span>
              <span className="flex items-center gap-1.5">
                <LuEye className="size-3.5 text-purple-500/80" />
                {post.views || 0}
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-purple-400 group-hover:translate-x-1 transition-transform duration-300 font-semibold uppercase tracking-wider text-[10px]">
              Read More
              <svg 
                className="size-3" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
