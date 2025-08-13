/**
 * Post type definition based on SPEC.md requirements
 */
export type PostType = "land-development" | "software-development" | "build-things" | "rant";

/**
 * Post interface for blog posts
 */
export interface Post {
    /** Post title from frontmatter */
    title: string;
    /** List of media URLs for images and videos */
    media: string[];
    /** Post type for categorization and filtering */
    type: PostType;
    /** Date extracted from filename */
    post_date: string;
    /** Excerpt extracted from first h2 in content */
    excerpt: string;
    /** Post slug (filename without extension) */
    slug: string;
    /** Full markdown content */
    content: string;
}

/**
 * Post type display names for UI
 */
export const postTypeDisplayNames: Record<PostType, string> = {
    "land-development": "Land Development",
    "software-development": "Software Development",
    "build-things": "Build Things",
    rant: "Rant",
};

/**
 * Post type CSS classes for chips
 */
export const postTypeClasses: Record<PostType, string> = {
    "land-development": "post-type-chip--land-development",
    "software-development": "post-type-chip--software-development",
    "build-things": "post-type-chip--build-things",
    rant: "post-type-chip--rant",
};
