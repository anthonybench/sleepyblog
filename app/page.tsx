//───────────────────────────┐
//         Imports           │
//───────────────────────────┘
// react
import React from "react";
// 1st party
import { getFilteredBlogs } from "@/app/_lib/blogs";
import { BlogPreview } from "@/app/_components/blog-preview";
import Search from "@/app/_components/search";

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
  const blogs = getFilteredBlogs(query);
  return (
    <div className={``}>
      <div className={`pb-10`}>
        <Search placeholder="Search by date or title..." />
      </div>
      {blogs.map((blog) => (
        <div key={blog.slug} className={`pb-5`}>
          <BlogPreview
            title={blog.title}
            date={new Date(blog.date)}
            excerpt={blog.excerpt}
            slug={blog.slug}
          />
        </div>
      ))}
    </div>
  );
}
