import { Blog } from "@/app/_lib/schemas";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import { dateFormatter } from "./dateformatter";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, slug: realSlug, content } as Blog;
}

export function getAllBlogs(): Blog[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

export function getFilteredBlogs(searchString: string): Blog[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchString.toLowerCase()) ||
        dateFormatter(new Date(blog.date))
          .toLowerCase()
          .includes(searchString.toLowerCase()),
    )
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
