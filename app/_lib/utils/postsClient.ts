import { type Post, type PostType } from "@/app/_lib/types/post";

/**
 * Client-side utilities for fetching posts from the API
 */

/**
 * Get all posts from the API
 */
export async function getAllPosts(): Promise<Post[]> {
    try {
        const response = await fetch("/api/posts?action=all");
        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

/**
 * Search posts by query
 */
export async function searchPosts(query: string): Promise<Post[]> {
    try {
        const response = await fetch(`/api/posts?action=search&query=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error("Failed to search posts");
        }
        return await response.json();
    } catch (error) {
        console.error("Error searching posts:", error);
        return [];
    }
}

/**
 * Get posts by type
 */
export async function getPostsByType(type: PostType): Promise<Post[]> {
    try {
        const response = await fetch(`/api/posts?action=by-type&type=${type}`);
        if (!response.ok) {
            throw new Error("Failed to fetch posts by type");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching posts by type:", error);
        return [];
    }
}

/**
 * Get the first post
 */
export async function getFirstPost(): Promise<Post | null> {
    try {
        const response = await fetch("/api/posts?action=first");
        if (!response.ok) {
            throw new Error("Failed to fetch first post");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching first post:", error);
        return null;
    }
}

/**
 * Get a random post
 */
export async function getRandomPost(): Promise<Post | null> {
    try {
        const response = await fetch("/api/posts?action=random");
        if (!response.ok) {
            throw new Error("Failed to fetch random post");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching random post:", error);
        return null;
    }
}
