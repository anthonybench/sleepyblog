import Image from "next/image";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { Blog } from "@/app/_lib/schemas";
import { BlogPreview } from "@/app/_components/blogpreview";
import { getAllBlogs, getFilteredBlogs } from "@/app/_lib/blogs";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Search from "@/app/_components/search";

type Props = {
  blogs: Blog[];
};

export default function Home(
  { className, searchParams }: { className: string, searchParams?: {
    query?: string;
  } }
) {
  const query = searchParams?.query || '';
  const blogs = getFilteredBlogs(query);
  return (
    <div className={`${className} `}>
      <div className={`pb-10`}>
        <Search placeholder="Search by date or title..." />
      </div>
      {blogs.map((blog) => (
        <div className={`pb-5`}>
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
