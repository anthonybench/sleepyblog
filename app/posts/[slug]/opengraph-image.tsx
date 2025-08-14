import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/app/_lib/utils/posts";
import { dataConfig } from "@/app/_lib/utils/dataConfig";
import { postTypeDisplayNames, type PostType } from "@/app/_lib/types/post";

// Image metadata
export const alt = "Blog Post";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

interface OpenGraphImageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Image generation
export default async function OpenGraphImage({
    params,
}: OpenGraphImageProps): Promise<ImageResponse> {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        // Fallback image for non-existent posts
        return new ImageResponse(
            (
                <div
                    style={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#282a36",
                        color: "#f8f8f2",
                        fontSize: "48px",
                        fontFamily: "system-ui, -apple-system, sans-serif",
                    }}
                >
                    Post Not Found
                </div>
            ),
            { ...size },
        );
    }

    // const postTypeDisplay = postTypeDisplayNames[post.type];
    // const typeColor = postTypeColors[post.type];

    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#282a36",
                    backgroundImage:
                        "linear-gradient(45deg, #282a36 25%, #44475a 25%, #44475a 50%, #282a36 50%, #282a36 75%, #44475a 75%)",
                    backgroundSize: "40px 40px",
                    padding: "60px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#282a36",
                        borderRadius: "24px",
                        padding: "60px",
                        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
                        border: `3px solid ${typeColor}`,
                        maxWidth: "1000px",
                        textAlign: "center",
                    }}
                >
                    {/* Post type chip */}
                    {/* <div
                        style={{
                            fontSize: "24px",
                            color: typeColor,
                            backgroundColor: `${typeColor}20`,
                            padding: "12px 24px",
                            borderRadius: "20px",
                            marginBottom: "30px",
                            fontFamily: "system-ui, -apple-system, sans-serif",
                            fontWeight: "600",
                        }}
                    >
                        {postTypeDisplay}
                    </div> */}

                    {/* Post title */}
                    <div
                        style={{
                            fontSize: post.title.length > 50 ? "48px" : "56px",
                            fontWeight: "900",
                            color: "#f8f8f2",
                            marginBottom: "20px",
                            textAlign: "center",
                            fontFamily: "system-ui, -apple-system, sans-serif",
                            lineHeight: "1.2",
                            maxWidth: "900px",
                        }}
                    >
                        {post.title}
                    </div>

                    {/* Post excerpt */}
                    {post.excerpt && (
                        <div
                            style={{
                                fontSize: "28px",
                                color: "#6272a4",
                                textAlign: "center",
                                maxWidth: "800px",
                                lineHeight: "1.4",
                                fontFamily: "system-ui, -apple-system, sans-serif",
                                marginBottom: "30px",
                            }}
                        >
                            {post.excerpt.length > 100
                                ? `${post.excerpt.substring(0, 100)}...`
                                : post.excerpt}
                        </div>
                    )}

                    {/* Site name and date */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                            fontSize: "20px",
                            color: "#50fa7b",
                            fontFamily: "system-ui, -apple-system, sans-serif",
                        }}
                    >
                        <span>{dataConfig.site_name}</span>
                        <span style={{ color: "#6272a4" }}>•</span>
                        <span>
                            {new Date(post.post_date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        },
    );
}

// const postTypeColors: Record<PostType, string> = {
//     "land-development": "#50fa7b",
//     "software-development": "#8be9fd",
//     "build-things": "#ffb86c",
//     rant: "#ff5555",
// };
