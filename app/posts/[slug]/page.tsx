import { notFound } from "next/navigation";
import type { JSX } from "react";
import type { Metadata } from "next";
import { getPostBySlug, getPostNavigation } from "@/app/_lib/utils/posts";
import MediaGallery from "@/app/_components/MediaGallery";
import PostTypeChip from "@/app/_components/PostTypeChip";
import PostNavigation from "@/app/_components/PostNavigation";
import StructuredData from "@/app/_components/StructuredData";
import { dataConfig } from "@/app/_lib/utils/dataConfig";
import { renderMarkdownToHtml } from "@/app/_lib/utils/markdown";
import { postTypeDisplayNames } from "@/app/_lib/types/post";

interface PostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

/**
 * Generate metadata for individual post pages
 */
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return {
            title: "Post Not Found",
            description: "The requested blog post could not be found.",
        };
    }

    const postUrl = `${dataConfig.site_url}/posts/${slug}`;
    const postTypeDisplay = postTypeDisplayNames[post.type];
    const fullTitle = `${post.title} - ${postTypeDisplay}`;

    // Use first image from media as OG image, fallback to default
    const ogImage = post.media && post.media.length > 0 ? post.media[0] : "/og-image.png";

    // Format date for structured data
    const [year, month, day] = post.post_date.split("-").map(Number);
    const publishedDate = new Date(year, month - 1, day);

    return {
        title: post.title,
        description: post.excerpt || `${postTypeDisplay} post: ${post.title}`,
        keywords: [...dataConfig.keywords, post.type, postTypeDisplay.toLowerCase()],
        authors: [
            {
                name: dataConfig.author_name,
                url: dataConfig.site_url,
            },
        ],
        alternates: {
            canonical: `/posts/${slug}`,
        },
        openGraph: {
            type: "article",
            locale: "en_US",
            url: postUrl,
            title: fullTitle,
            description: post.excerpt || `${postTypeDisplay} post by ${dataConfig.author_name}`,
            siteName: dataConfig.site_name,
            publishedTime: publishedDate.toISOString(),
            authors: [dataConfig.author_name],
            section: postTypeDisplay,
            tags: [post.type, postTypeDisplay.toLowerCase()],
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },

        other: {
            "article:published_time": publishedDate.toISOString(),
            "article:author": dataConfig.author_name,
            "article:section": postTypeDisplay,
            "article:tag": post.type,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

/**
 * Individual post page displaying full post content with media gallery
 */
export default async function PostPage({ params }: PostPageProps): Promise<JSX.Element> {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    // Format date for display
    const formatDate = (dateString: string): string => {
        const [year, month, day] = dateString.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatted_date = formatDate(post.post_date);

    // Get navigation posts
    const { previous, next } = getPostNavigation(slug);

    const htmlContent = await renderMarkdownToHtml(post.content);

    return (
        <>
            <StructuredData type="article" post={post} />
            <article className="post-page">
                {/* Post Header */}
                <header className="post-header">
                    <div className="post-meta">
                        <PostTypeChip type={post.type} />
                        <span className="post-date">{formatted_date}</span>
                    </div>
                    <h1 className="post-title">{post.title}</h1>
                </header>

                {/* Media Gallery */}
                <MediaGallery media={post.media} />

                {/* Post Content */}
                <div className="post-content">
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </div>

                {/* Post Navigation */}
                <PostNavigation previous={previous} next={next} />
            </article>
        </>
    );
}
