import type { JSX } from "react";
import { dataConfig } from "@/app/_lib/utils/dataConfig";
import type { Post } from "@/app/_lib/types/post";

interface StructuredDataProps {
    type: "website" | "article" | "profile";
    post?: Post;
}

/**
 * Component that generates JSON-LD structured data for SEO
 */
export default function StructuredData({ type, post }: StructuredDataProps): JSX.Element {
    const generateWebsiteSchema = () => ({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: dataConfig.site_name,
        description: dataConfig.site_description,
        url: dataConfig.site_url,
        author: {
            "@type": "Person",
            name: dataConfig.author_name,
            url: dataConfig.site_url,
            image: `${dataConfig.site_url}${dataConfig.author_image}`,
            sameAs: [dataConfig.github_url, dataConfig.linkedin_url],
        },
        publisher: {
            "@type": "Person",
            name: dataConfig.author_name,
            url: dataConfig.site_url,
            image: `${dataConfig.site_url}${dataConfig.author_image}`,
        },
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${dataConfig.site_url}/?search={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    });

    const generateArticleSchema = () => {
        if (!post) return {};

        const [year, month, day] = post.post_date.split("-").map(Number);
        const publishedDate = new Date(year, month - 1, day);

        return {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image:
                post.media && post.media.length > 0
                    ? post.media
                    : [`${dataConfig.site_url}/og-image.png`],
            datePublished: publishedDate.toISOString(),
            dateModified: publishedDate.toISOString(),
            author: {
                "@type": "Person",
                name: dataConfig.author_name,
                url: dataConfig.site_url,
                image: `${dataConfig.site_url}${dataConfig.author_image}`,
            },
            publisher: {
                "@type": "Person",
                name: dataConfig.author_name,
                url: dataConfig.site_url,
                image: `${dataConfig.site_url}${dataConfig.author_image}`,
            },
            mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `${dataConfig.site_url}/posts/${post.slug}`,
            },
            url: `${dataConfig.site_url}/posts/${post.slug}`,
            articleSection: post.type,
            keywords: [post.type, ...dataConfig.keywords],
            inLanguage: "en-US",
            isPartOf: {
                "@type": "Blog",
                name: dataConfig.site_name,
                url: dataConfig.site_url,
            },
        };
    };

    const generateProfileSchema = () => ({
        "@context": "https://schema.org",
        "@type": "Person",
        name: dataConfig.author_name,
        description: dataConfig.author_bio,
        image: `${dataConfig.site_url}${dataConfig.author_image}`,
        url: `${dataConfig.site_url}/about`,
        mainEntityOfPage: `${dataConfig.site_url}/about`,
        sameAs: [
            dataConfig.github_url,
            dataConfig.linkedin_url,
            dataConfig.duolingo_url,
            dataConfig.pypi_url,
            dataConfig.dockerhub_url,
        ],
        jobTitle: "Software Developer",
        worksFor: {
            "@type": "Organization",
            name: "Independent",
        },
        knowsAbout: dataConfig.keywords,
    });

    const getBreadcrumbSchema = () => {
        const breadcrumbs = [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: dataConfig.site_url,
            },
        ];

        if (type === "article" && post) {
            breadcrumbs.push({
                "@type": "ListItem",
                position: 2,
                name: "Posts",
                item: `${dataConfig.site_url}/#posts`,
            });
            breadcrumbs.push({
                "@type": "ListItem",
                position: 3,
                name: post.title,
                item: `${dataConfig.site_url}/posts/${post.slug}`,
            });
        } else if (type === "profile") {
            breadcrumbs.push({
                "@type": "ListItem",
                position: 2,
                name: "About",
                item: `${dataConfig.site_url}/about`,
            });
        }

        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbs,
        };
    };

    const getSchemaData = () => {
        const schemas = [];

        // Always include breadcrumb navigation
        schemas.push(getBreadcrumbSchema());

        // Add type-specific schema
        switch (type) {
            case "website":
                schemas.push(generateWebsiteSchema());
                break;
            case "article":
                schemas.push(generateArticleSchema());
                break;
            case "profile":
                schemas.push(generateProfileSchema());
                break;
        }

        return schemas;
    };

    const schemas = getSchemaData();

    return (
        <>
            {schemas.map((schema, index) => (
                <script
                    key={`schema-${type}-${index}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(schema, null, 0),
                    }}
                />
            ))}
        </>
    );
}
