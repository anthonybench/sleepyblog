import type { JSX } from "react";
import { type PostType, postTypeDisplayNames, postTypeClasses } from "@/app/_lib/types/post";

interface PostTypeChipProps {
    type: PostType;
}

/**
 * Post type chip component for displaying post categories
 */
export default function PostTypeChip({ type }: PostTypeChipProps): JSX.Element {
    const display_name = postTypeDisplayNames[type];
    const chip_class = postTypeClasses[type];

    return <span className={`post-type-chip ${chip_class}`}>{display_name}</span>;
}
