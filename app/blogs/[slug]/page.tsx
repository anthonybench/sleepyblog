//───────────────────────────┐
//         Imports           │
//───────────────────────────┘
// next
import type { Metadata } from "next";
import { notFound } from "next/navigation";
// 1st party
import { getPostBySlug } from "@/app/_lib/blogs";
import { markdownToHtml } from "@/app/_lib/markdowntohtml";
import { BlogBody } from "@/app/_components/blog-body";
import { BlogHeader } from "@/app/_components/blog-header";

//───────────────────────────┐
//         Params            │
//───────────────────────────┘
export const metadata: Metadata = {
  title: {
    template: "%s | SleepyBlog",
    default: "Sleepyblog",
  },
  description: "A blog most sleepy",
  metadataBase: new URL("http://sleepyblog.org"),
};

//───────────────────────────┐
//          View             │
//───────────────────────────┘
export default async function Page({ params }: { params: { slug: string } }) {
  const blog = getPostBySlug(params.slug);
  if (!blog.slug) {
    return notFound();
  }
  const content = await markdownToHtml(blog.content || "");
  return (
    <article>
      <BlogHeader title={blog.title} media={blog.media} date={new Date(`${blog.date}T00:00:00`)} />
      <BlogBody content={content} />
    </article>
  );
}
