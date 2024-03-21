//───────────────────────────┐
//         Imports           │
//───────────────────────────┘
// next
import type { Metadata } from "next";
import { notFound } from "next/navigation";
// 1st party
import { getPostBySlug } from "@/app/_lib/posts";
import { markdownToHtml } from "@/app/_lib/markdowntohtml";
import { PostBody } from "@/app/_components/post-body";
import { PostHeader } from "@/app/_components/post-header";

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
  const post = getPostBySlug(params.slug);
  if (!post.slug) {
    return notFound();
  }
  const content = await markdownToHtml(post.content || "");
  return (
    <article>
      <PostHeader
        title={post.title}
        media={post.media}
        date={new Date(`${post.date}T00:00:00`)}
      />
      <PostBody content={content} />
    </article>
  );
}
