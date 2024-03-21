import { Post } from "@/app/_lib/schemas";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import { dateFormatter } from "./utils";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  try {
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    return { ...data, slug: realSlug, content } as Post;
  } catch {
    return {
      slug: "",
      title: "",
      date: "",
      media: [],
      excerpt: "",
      content: "",
    } as Post;
  }
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

export function getFilteredPosts(searchString: string): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter(
      (post) =>
        post.title.toLowerCase().includes(searchString.toLowerCase()) ||
        dateFormatter(new Date(post.date))
          .toLowerCase()
          .includes(searchString.toLowerCase()),
    )
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
