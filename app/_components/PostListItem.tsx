import Link from "next/link";
import type { JSX } from "react";
import { type Post } from "@/app/_lib/types/post";
import PostTypeChip from "@/app/_components/PostTypeChip";

interface PostListItemProps {
    post: Post;
}

/**
 * Individual post list item component
 */
export default function PostListItem({ post }: PostListItemProps): JSX.Element {
    // Format date for display - parse manually to avoid timezone issues
    const formatDate = (dateString: string): string => {
        const [year, month, day] = dateString.split("-").map(Number);
        const date = new Date(year, month - 1, day); // month is 0-indexed
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatted_date = formatDate(post.post_date);

    return (
        <Link href={`/posts/${post.slug}`} className="post-list-item">
            <div className="post-item-header">
                <h3 className="post-item-title">{post.title}</h3>
                <PostTypeChip type={post.type} />
            </div>

            <div className="post-item-meta">
                <span className="post-item-date">{formatted_date}</span>
            </div>

            {post.excerpt && <p className="post-item-excerpt">{post.excerpt}</p>}
        </Link>
    );
}
