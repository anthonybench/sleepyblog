"use client";

import type { JSX, ChangeEvent } from "react";
import { type PostType, postTypeDisplayNames } from "@/app/_lib/types/post";

interface PostTypeFilterProps {
    selectedType: PostType | "all";
    onTypeChange: (type: PostType | "all") => void;
}

/**
 * Dropdown filter component for filtering posts by type
 */
export default function PostTypeFilter({
    selectedType,
    onTypeChange,
}: PostTypeFilterProps): JSX.Element {
    const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
        const value = event.target.value as PostType | "all";
        onTypeChange(value);
    };

    return (
        <div className="post-type-filter">
            <select value={selectedType} onChange={handleChange} className="type-filter-select">
                <option value="all">All Types</option>
                {Object.entries(postTypeDisplayNames).map(([type, displayName]) => (
                    <option key={type} value={type}>
                        {displayName}
                    </option>
                ))}
            </select>
        </div>
    );
}
