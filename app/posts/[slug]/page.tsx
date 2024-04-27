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
import { dateFormatterAlt } from "@/app/_lib/dateformatteralt";

//───────────────────────────┐
//         Params            │
//───────────────────────────┘
export const metadata: Metadata = {
  title: {
    template: "Blog Post | %s",
    default: "Blog Post",
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
        mediaPrefix={`/assets/posts/${post.date}`}
        formattedDate={dateFormatterAlt(post.date)}
      />
      <PostBody content={content} />
    </article>
  );
}
