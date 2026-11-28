"use client";
import { useEffect, useState, type JSX } from "react";
import Image from "next/image";
import {
    type FurnitureCategory,
    type FurniturePhoto,
    furnitureCategories,
} from "@/app/_lib/types/furniture";
import { getThumbnailUrl } from "@/app/_lib/utils/media";

/**
 * Featured photos: one per row, full width, loaded full size. Height is capped so tall
 * photos don't fill several screens; the leftover space shows a blurred copy of the
 * same photo, so nothing is cropped.
 */
function Featured({ photos }: { photos: FurniturePhoto[] }): JSX.Element {
    return (
        <div className="furniture-featured">
            {photos.map((photo) => (
                <figure key={photo.url}>
                    <a href={photo.url} target="_blank" rel="noopener noreferrer">
                        <div className="furniture-featured-frame">
                            <div
                                className="furniture-featured-backdrop"
                                style={{ backgroundImage: `url(${getThumbnailUrl(photo.url)})` }}
                                aria-hidden
                            />
                            <Image
                                src={photo.url}
                                alt={photo.caption ?? `${photo.category} photo`}
                                width={photo.width}
                                height={photo.height}
                                unoptimized // served from R2, already sized
                            />
                        </div>
                    </a>
                    {photo.caption && <figcaption>{photo.caption}</figcaption>}
                </figure>
            ))}
        </div>
    );
}

/**
 * The rest of a category: columns of the 1024px copies at their natural heights.
 * Clicking one opens the full-size photo.
 */
function Masonry({ photos }: { photos: FurniturePhoto[] }): JSX.Element {
    return (
        <div className="furniture-masonry">
            {photos.map((photo) => (
                <figure key={photo.url}>
                    <a href={photo.url} target="_blank" rel="noopener noreferrer">
                        <Image
                            src={getThumbnailUrl(photo.url)}
                            alt={photo.caption ?? `${photo.category} photo`}
                            width={photo.width}
                            height={photo.height}
                            loading="lazy"
                            unoptimized // served from R2, already sized
                        />
                    </a>
                    {photo.caption && <figcaption>{photo.caption}</figcaption>}
                </figure>
            ))}
        </div>
    );
}

/**
 * /furniture's category tabs and the selected category's photos. The selected category
 * lives in the URL hash (#shelving), so reloads and shared links keep it.
 */
export default function FurnitureGallery({ photos }: { photos: FurniturePhoto[] }): JSX.Element {
    // open on the first category that has photos
    const [category, setCategory] = useState<FurnitureCategory>(
        furnitureCategories.find((c) => photos.some((p) => p.category === c)) ??
            furnitureCategories[0],
    );

    useEffect(() => {
        const fromHash = window.location.hash.slice(1) as FurnitureCategory;
        if (furnitureCategories.includes(fromHash)) setCategory(fromHash);
    }, []);

    useEffect(() => {
        history.replaceState(null, "", `#${category}`);
        document
            .querySelector(".furniture-categories .selected")
            ?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }, [category]);

    const shown = photos.filter((p) => p.category === category);
    const featured = shown.filter((p) => p.featured);
    const rest = shown.filter((p) => !p.featured);

    return (
        <>
            <nav className="furniture-categories" role="tablist" aria-label="Category">
                {furnitureCategories.map((c) => (
                    <button
                        key={c}
                        role="tab"
                        aria-selected={c === category}
                        className={c === category ? "selected" : ""}
                        onClick={() => setCategory(c)}
                    >
                        {c}
                    </button>
                ))}
            </nav>

            {/* keyed so each switch re-mounts and plays the fade-in */}
            <div key={category} className="furniture-view" role="tabpanel">
                {featured.length > 0 && <Featured photos={featured} />}
                {rest.length > 0 && <Masonry photos={rest} />}
                {shown.length === 0 && <p className="no-posts">Nothing here yet.</p>}
            </div>
        </>
    );
}
