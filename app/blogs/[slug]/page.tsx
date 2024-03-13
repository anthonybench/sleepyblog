import Image from 'next/image';
import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import type { Metadata } from "next";
import { BlogBody } from "@/app/_components/blogbody";
import { BlogHeader } from "@/app/_components/blogheader";
import { getAllBlogs, getPostBySlug } from "@/app/_lib/blogs";
import { markdownToHtml } from "@/app/_lib/markdowntohtml";
import { notFound } from "next/navigation";



export const metadata: Metadata = {
  title: {
    template: '%s | SleepyBlog',
    default: 'Acme Dashboard',
  },
  description: "A blog so sleepy.",
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default async function Page({
  params
}:{
  params:{slug:string}
}) {
  const blog = getPostBySlug(params.slug);
  if (!blog) {
    return notFound();
  }
  const content = await markdownToHtml(blog.content || "");
  const today = new Date()
  return (
    <article>
      {/* blog :: ({params.slug}) */}
      <BlogHeader
        title={blog.title}
        media={blog.media}
        date={today}
      />
      <BlogBody
        content={content}
      />
    </article>
  );
}
