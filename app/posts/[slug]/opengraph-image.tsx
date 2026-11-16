import type { ImageResponse } from "next/og";
import { getPostBySlug } from "@/app/_lib/utils/posts";
import { dataConfig } from "@/app/_lib/utils/dataConfig";
import { postTypeDisplayNames, type PostType } from "@/app/_lib/types/post";
import { OG_CONTENT_TYPE, OG_SIZE, ogColors, ogText, renderOgImage } from "@/app/_lib/og";

export const alt = "Blog Post";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Card border and chip color for each post type (Dracula palette) */
const postTypeColors: Record<PostType, string> = {
    "land-development": "#50fa7b",
    "software-development": "#8be9fd",
    "build-things": "#ffb86c",
    rant: "#ff5555",
};

const MAX_EXCERPT_LENGTH = 100;

interface OpenGraphImageProps {
    params: Promise<{
        slug: string;
    }>;
}

/**
 * Format a yyyy-mm-dd post date as e.g. "November 19, 2025". The date is built from
 * its parts so it can't shift a day in timezones behind UTC.
 */
function formatPostDate(post_date: string): string {
    const [year, month, day] = post_date.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

/**
 * Open Graph image for a post: type chip, title, excerpt, and date, in a card bordered
 * with the post type's color.
 */
export default async function OpenGraphImage({
    params,
}: OpenGraphImageProps): Promise<ImageResponse> {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return renderOgImage(
            <div style={{ ...ogText, fontSize: "48px", color: ogColors.foreground }}>
                Post Not Found
            </div>,
        );
    }

    const typeColor = postTypeColors[post.type];
    const excerpt =
        post.excerpt.length > MAX_EXCERPT_LENGTH
            ? `${post.excerpt.substring(0, MAX_EXCERPT_LENGTH)}...`
            : post.excerpt;

    return renderOgImage(
        <>
            <div
                style={{
                    ...ogText,
                    fontSize: "24px",
                    fontWeight: "600",
                    color: typeColor,
                    backgroundColor: `${typeColor}20`,
                    padding: "12px 24px",
                    borderRadius: "20px",
                    marginBottom: "30px",
                }}
            >
                {postTypeDisplayNames[post.type]}
            </div>

            <div
                style={{
                    ...ogText,
                    fontSize: post.title.length > 50 ? "48px" : "64px",
                    fontWeight: "900",
                    color: ogColors.foreground,
                    lineHeight: "1.2",
                    textAlign: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                }}
            >
                {post.title}
            </div>

            {excerpt && (
                <div
                    style={{
                        ...ogText,
                        fontSize: "28px",
                        color: ogColors.comment,
                        lineHeight: "1.4",
                        textAlign: "center",
                        justifyContent: "center",
                        marginBottom: "30px",
                    }}
                >
                    {excerpt}
                </div>
            )}

            <div style={{ ...ogText, fontSize: "24px", color: ogColors.pink }}>
                {`${dataConfig.site_name} · ${formatPostDate(post.post_date)}`}
            </div>
        </>,
        { accent: typeColor, cardStyle: { maxWidth: "1000px" } },
    );
}
