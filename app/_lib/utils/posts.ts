import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { type Post, type PostType } from "@/app/_lib/types/post";

/**
 * Get all posts from the _posts directory
 * @returns Array of parsed posts
 */
export function getAllPosts(): Post[] {
    const posts_directory = path.join(process.cwd(), "_posts");

    if (!fs.existsSync(posts_directory)) {
        return [];
    }

    const file_names = fs.readdirSync(posts_directory);

    const posts = file_names
        .filter((name) => name.endsWith(".md"))
        .map((name) => {
            const slug = name.replace(/\.md$/, "");
            return getPostBySlug(slug);
        })
        .filter((post) => post !== null) as Post[];

    // Sort by date (newest first)
    return posts.sort((a, b) => new Date(b.post_date).getTime() - new Date(a.post_date).getTime());
}

/**
 * Get a single post by its slug
 * @param slug - The post slug (filename without extension)
 * @returns Post object or null if not found
 */
export function getPostBySlug(slug: string): Post | null {
    try {
        const posts_directory = path.join(process.cwd(), "_posts");
        const file_path = path.join(posts_directory, `${slug}.md`);

        if (!fs.existsSync(file_path)) {
            return null;
        }

        const file_contents = fs.readFileSync(file_path, "utf8");
        const { data, content } = matter(file_contents);

        // Extract date from filename (yyyy-mm-dd format)
        const date_match = slug.match(/^(\d{4}-\d{2}-\d{2})/);
        const post_date = date_match ? date_match[1] : slug;

        // Extract excerpt from first h2
        const excerpt_match = content.match(/^## (.+)$/m);
        const excerpt = excerpt_match ? excerpt_match[1] : "";

        return {
            title: data.title || "Untitled",
            media: Array.isArray(data.media) ? data.media : [],
            type: (data.type as PostType) || "rant",
            post_date,
            excerpt,
            slug,
            content,
        };
    } catch (error) {
        console.error(`Error parsing post ${slug}:`, error);
        return null;
    }
}

/**
 * Get posts filtered by type
 * @param type - Post type to filter by
 * @returns Array of filtered posts
 */
export function getPostsByType(type: PostType): Post[] {
    return getAllPosts().filter((post) => post.type === type);
}

/**
 * Search posts by title or date
 * @param query - Search query
 * @returns Array of matching posts
 */
export function searchPosts(query: string): Post[] {
    const all_posts = getAllPosts();
    const lower_query = query.toLowerCase();

    return all_posts.filter(
        (post) =>
            post.title.toLowerCase().includes(lower_query) ||
            post.post_date.includes(query) ||
            post.excerpt.toLowerCase().includes(lower_query),
    );
}

/**
 * Get a random post
 * @returns Random post or null if no posts exist
 */
export function getRandomPost(): Post | null {
    const all_posts = getAllPosts();
    if (all_posts.length === 0) return null;

    const random_index = Math.floor(Math.random() * all_posts.length);
    return all_posts[random_index];
}

/**
 * Get the first (oldest) post
 * @returns First post or null if no posts exist
 */
export function getFirstPost(): Post | null {
    const all_posts = getAllPosts();
    if (all_posts.length === 0) return null;

    // Sort by date (oldest first) and return the first one
    const sorted_posts = [...all_posts].sort(
        (a, b) => new Date(a.post_date).getTime() - new Date(b.post_date).getTime(),
    );

    return sorted_posts[0];
}

/**
 * Get navigation posts (previous and next) for a given post
 */
export function getPostNavigation(current_slug: string): {
    previous: Post | null;
    next: Post | null;
} {
    try {
        const all_posts = getAllPosts(); // Already sorted by date descending (newest first)
        const current_index = all_posts.findIndex((post) => post.slug === current_slug);

        if (current_index === -1) {
            return { previous: null, next: null };
        }

        // Previous post is older (later in the array, going back in time)
        const previous = current_index < all_posts.length - 1 ? all_posts[current_index + 1] : null;

        // Next post is newer (earlier in the array, going forward in time)
        const next = current_index > 0 ? all_posts[current_index - 1] : null;

        return { previous, next };
    } catch (error) {
        console.error("Error getting post navigation:", error);
        return { previous: null, next: null };
    }
}
