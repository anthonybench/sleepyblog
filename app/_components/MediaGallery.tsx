"use client";
import { useState, type JSX } from "react";
import Image from "next/image";

interface MediaGalleryProps {
    media: string[];
}

interface MediaItemProps {
    url: string;
    index: number;
}

/**
 * Determines if a URL is a video based on file extension
 */
function isVideoUrl(url: string): boolean {
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi"];
    return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
}

/**
 * Matches a photo on the site's media host: https://media.sleepyblog.org/<id>.<ext>
 * GIFs and videos have no resized copy.
 */
const MEDIA_IMAGE_URL = /^(https:\/\/media\.sleepyblog\.org\/[A-Za-z0-9]+)(\.(?:jpe?g|png))$/i;

/**
 * Returns the 1024px resized copy of a media-host photo ("h" suffix, made by
 * `add_media.py`), which is far smaller than the original; other URLs are returned
 * unchanged.
 */
function getThumbnailUrl(url: string): string {
    return url.replace(MEDIA_IMAGE_URL, "$1h$2");
}

/**
 * Individual media item component (image or video)
 */
function MediaItem({ url, index }: MediaItemProps): JSX.Element {
    const [hasError, setHasError] = useState(false);
    const [imageSrc, setImageSrc] = useState(getThumbnailUrl(url));
    const isVideo = isVideoUrl(url);

    // If the resized copy fails to load, fall back to the original before giving up
    const handleImageError = (): void => {
        if (imageSrc !== url) {
            setImageSrc(url);
        } else {
            setHasError(true);
        }
    };

    if (hasError) {
        return (
            <div className="media-error">
                <p>Failed to load media</p>
            </div>
        );
    }

    if (isVideo) {
        return (
            <div className="media-item video-item">
                <video
                    controls
                    preload="metadata"
                    className="media-video"
                    onError={() => setHasError(true)}
                >
                    <source src={url} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        );
    }

    return (
        <div className="media-item image-item">
            {/* Thumbnail shows the resized copy; clicking opens the full-size original */}
            <a href={url} target="_blank" rel="noopener noreferrer">
                <Image
                    src={imageSrc}
                    alt={`Media ${index + 1}`}
                    width={400}
                    height={300}
                    className="media-image"
                    onError={handleImageError}
                    unoptimized // For external URLs
                />
            </a>
        </div>
    );
}

/**
 * Media gallery component for displaying images and videos in a grid
 */
export default function MediaGallery({ media }: MediaGalleryProps): JSX.Element | null {
    if (!media || media.length === 0) {
        return null;
    }

    return (
        <div className="media-gallery">
            <div className="media-grid">
                {media.map((url, index) => (
                    <MediaItem key={`${url}-${index}`} url={url} index={index} />
                ))}
            </div>
        </div>
    );
}
