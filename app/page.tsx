//───────────────────────────┐
//         Imports           │
//───────────────────────────┘
// next
import type { Metadata } from "next";
// react
import React from "react";
// 1st party
import { getFilteredPosts } from "@/app/_lib/posts";
import { PostPreview } from "@/app/_components/post-preview";
import Search from "@/app/_components/search";
import { ThemeContext } from "@/app/_lib/themes";

//───────────────────────────┐
//         Params            │
//───────────────────────────┘
export const metadata: Metadata = {
  title: "SleepyBlog",
  description: "Home | Blog Posts",
  metadataBase: new URL("http://sleepyblog.org"),
};

//───────────────────────────┐
//          View             │
//───────────────────────────┘
export default function Home({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || "";
  const posts = getFilteredPosts(query);
  return (
    <div className={``}>
      <div className={`pb-10`}>
        <Search placeholder="Search by date or title..." />
      </div>
      {posts.map((post) => (
        <div key={post.slug} className={`pb-5`}>
          <PostPreview
            title={post.title}
            date={new Date(post.date)}
            excerpt={post.excerpt}
            slug={post.slug}
          />
        </div>
      ))}
    </div>
  );
}
