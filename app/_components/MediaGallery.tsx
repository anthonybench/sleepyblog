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
 * Individual media item component (image or video)
 */
function MediaItem({ url, index }: MediaItemProps): JSX.Element {
    const [hasError, setHasError] = useState(false);
    const isVideo = isVideoUrl(url);

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
            <Image
                src={url}
                alt={`Media ${index + 1}`}
                width={400}
                height={300}
                className="media-image"
                onError={() => setHasError(true)}
                unoptimized // For external URLs
            />
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
