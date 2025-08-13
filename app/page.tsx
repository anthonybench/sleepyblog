"use client";

import { useState, useEffect, type JSX } from "react";
import { useRouter } from "next/navigation";
import { type Post, type PostType } from "./_lib/types/post";
import { getAllPosts, searchPosts, getFirstPost, getRandomPost } from "./_lib/utils/postsClient";
import PostSearchBar from "./_components/PostSearchBar";
import PostTypeFilter from "./_components/PostTypeFilter";
import PostListItem from "./_components/PostListItem";

/**
 * Home page with blog post listing, search, and filters
 */
export default function HomePage(): JSX.Element {
    const router = useRouter();
    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [selectedType, setSelectedType] = useState<PostType | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Load posts on mount
    useEffect(() => {
        const loadPosts = async () => {
            const posts = await getAllPosts();
            setAllPosts(posts);
            setFilteredPosts(posts);
        };
        loadPosts();
    }, []);

    // Handle search
    const handleSearch = (query: string): void => {
        setSearchQuery(query);
        applyFilters(query, selectedType);
    };

    // Handle type filter
    const handleTypeChange = (type: PostType | "all"): void => {
        setSelectedType(type);
        applyFilters(searchQuery, type);
    };

    // Apply both search and type filters
    const applyFilters = async (query: string, type: PostType | "all"): Promise<void> => {
        let filtered = allPosts;

        // Apply search filter
        if (query.trim()) {
            filtered = await searchPosts(query);
        }

        // Apply type filter
        if (type !== "all") {
            filtered = filtered.filter((post) => post.type === type);
        }

        setFilteredPosts(filtered);
    };

    // Handle navigation buttons
    const handleFirstPost = async (): Promise<void> => {
        const first_post = await getFirstPost();
        if (first_post) {
            router.push(`/posts/${first_post.slug}`);
        }
    };

    const handleRandomPost = async (): Promise<void> => {
        const random_post = await getRandomPost();
        if (random_post) {
            router.push(`/posts/${random_post.slug}`);
        }
    };

    return (
        <div className="home-page">
            {/* Controls Section */}
            <div className="blog-controls">
                <div className="search-and-filter">
                    <PostSearchBar onSearch={handleSearch} />
                    <PostTypeFilter selectedType={selectedType} onTypeChange={handleTypeChange} />
                </div>

                <div className="navigation-buttons">
                    <button
                        onClick={handleFirstPost}
                        className="nav-button first-post-button"
                        disabled={allPosts.length === 0}
                    >
                        First Post
                    </button>
                    <button
                        onClick={handleRandomPost}
                        className="nav-button random-post-button"
                        disabled={allPosts.length === 0}
                    >
                        Random Post 🎲
                    </button>
                </div>
            </div>

            {/* Posts List */}
            <div className="posts-list">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => <PostListItem key={post.slug} post={post} />)
                ) : (
                    <div className="no-posts">
                        {searchQuery || selectedType !== "all" ? (
                            <p>No posts found matching your criteria.</p>
                        ) : (
                            <p>No posts available yet. Check back soon!</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
