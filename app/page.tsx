// next
import type { Metadata } from "next";
// react
import React from "react";
// 1st party
import { getFilteredPosts } from "@/app/_lib/posts";
import { PostPreview } from "@/app/_components/post-preview";
import Search from "@/app/_components/search";
import { dateFormatter } from "./_lib/utils";

// params
export const metadata: Metadata = {
  title: "SleepyBlog",
  description: "Home | Blog Posts",
  applicationName: "SleepyBlog",
  creator: "Isaac Yep",
  authors: [{ name: "Isaac Yep" }],
  metadataBase: new URL("http://sleepyblog.org"),
};

// view
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
            date={dateFormatter(post.date)}
            excerpt={post.excerpt}
            slug={post.slug}
          />
        </div>
      ))}
    </div>
  );
}
