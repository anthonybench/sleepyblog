"use client";

import { useState, type JSX, type ChangeEvent } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface PostSearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

/**
 * Search bar component for filtering posts by title or date
 */
export default function PostSearchBar({
    onSearch,
    placeholder = "Search posts by title or date...",
}: PostSearchBarProps): JSX.Element {
    const [query, setQuery] = useState("");

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const new_query = event.target.value;
        setQuery(new_query);
        onSearch(new_query);
    };

    return (
        <div className="post-search-bar">
            <div className="search-input-container">
                <MagnifyingGlassIcon className="search-icon" />
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="search-input"
                />
            </div>
        </div>
    );
}
