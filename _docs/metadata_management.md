# Metadata Management Guide

This guide explains how to manage and customize metadata in SleepyBlog for optimal SEO, social sharing, and search engine visibility.

## Overview

SleepyBlog implements comprehensive metadata management using the Next.js App Router metadata API, including:

- **Static & Dynamic Metadata**: Configured per page and route
- **OpenGraph Images**: Auto-generated social sharing images
- **Structured Data**: JSON-LD for enhanced search results
- **Social Media Cards**: Facebook and LinkedIn optimization
- **SEO Optimization**: Complete meta tags and search engine directives

## Metadata Architecture

### Configuration Source

All metadata originates from `app/_lib/data.yml`:

```yaml
# site metadata
site_name: "SleepyBlog"
site_description: "A blog most sleepy."
site_url: "https://sleepyblog.org"
author_name: "Isaac Yep"
author_bio: "Lifelong engineer, professional kid."
author_image: "/dark/sleepyboy_technologist.png"
keywords: ["blog", "software development", "land development", "building", "technology"]
```

### Metadata Flow

1. **Configuration**: Values defined in `data.yml`
2. **Build-time Generation**: `loadConfig.js` creates TypeScript config
3. **Runtime Usage**: Components import from `dataConfig.ts`
4. **Page-level Application**: Each page exports metadata

## Page-Level Metadata

### Root Layout (`app/layout.tsx`)

The root layout defines site-wide metadata:

```typescript
export const metadata: Metadata = {
    title: {
        default: dataConfig.site_name,
        template: `%s | ${dataConfig.site_name}`, // Page Title | Site Name
    },
    description: dataConfig.site_description,
    keywords: dataConfig.keywords,
    authors: [{ name: dataConfig.author_name, url: dataConfig.site_url }],
    creator: dataConfig.author_name,
    publisher: dataConfig.author_name,
    metadataBase: new URL(dataConfig.site_url),

    // OpenGraph for social sharing
    openGraph: {
        type: "website",
        locale: "en_US",
        url: dataConfig.site_url,
        title: dataConfig.site_name,
        description: dataConfig.site_description,
        siteName: dataConfig.site_name,
        // the image comes from ./opengraph-image.tsx
    },

    // Search Engine Directives
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    verification: {
        google: "TODO", // placeholder; see TODO.md (Google Search Console)
    },
};
```

`robots` here is the per-page meta tag. Which paths crawlers may visit is decided by `app/robots.txt` (see [Sitemap and robots.txt](#sitemap-and-robotstxt)).

### Dynamic Post Metadata (`app/posts/[slug]/page.tsx`)

Individual posts generate dynamic metadata:

```typescript
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return { title: "Post Not Found" };
    }

    const postUrl = `${dataConfig.site_url}/posts/${slug}`;
    const postTypeDisplay = postTypeDisplayNames[post.type];

    return {
        title: post.title, // Uses template from layout
        description: post.excerpt,
        keywords: [...dataConfig.keywords, post.type],

        openGraph: {
            type: "article",
            url: postUrl,
            title: `${post.title} - ${postTypeDisplay}`,
            description: post.excerpt,
            publishedTime: new Date(post.post_date).toISOString(),
            authors: [dataConfig.author_name],
            section: postTypeDisplay,
            // first photo in media, if any; otherwise ./opengraph-image.tsx is used
            ...(firstPhoto && { images: [{ url: firstPhoto, alt: post.title }] }),
        },
    };
}
```

Project pages (`app/software/[slug]/page.tsx`) do the same with the project's name and tagline, and always use their generated preview image.

### Static Page Metadata (`app/about/layout.tsx`)

Server pages export `metadata` directly (e.g. `app/software/page.tsx`). `app/about/page.tsx` is a client component, which can't, so its metadata lives in `app/about/layout.tsx`:

```typescript
export const metadata: Metadata = {
    title: "About",
    description: `Learn more about ${dataConfig.author_name} - ${dataConfig.author_bio}`,
    openGraph: {
        type: "profile",
        title: `About ${dataConfig.author_name}`,
        description: dataConfig.author_bio,
        // the image comes from ./opengraph-image.tsx
    },
};
```

## OpenGraph Image Generation

Link preview images (1200×630) are generated with Next.js's `ImageResponse`. Every route draws its card through the shared `renderOgImage` helper in `app/_lib/og.tsx`, which provides the striped Dracula frame, the card, the colors (`ogColors`), and the size and content type exports.

| Route                                     | Shows                                                    |
| ----------------------------------------- | -------------------------------------------------------- |
| `app/opengraph-image.tsx`                 | Site name, logo, description (the default for all pages) |
| `app/about/opengraph-image.tsx`           | Portrait beside the name and bio                         |
| `app/posts/[slug]/opengraph-image.tsx`    | Post type chip, title, excerpt, date                     |
| `app/software/[slug]/opengraph-image.tsx` | Install command, name, tagline, URL                      |

```tsx
// app/posts/[slug]/opengraph-image.tsx (simplified)
export function generateStaticParams(): { slug: string }[] {
    return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function OpenGraphImage({ params }) {
    const post = getPostBySlug((await params).slug);
    return renderOgImage(
        <>
            <div>{postTypeDisplayNames[post.type]}</div>
            <div>{post.title}</div>
            <div>{post.excerpt}</div>
        </>,
        { accent: postTypeColors[post.type] },
    );
}
```

**The `[slug]` image routes must keep `generateStaticParams`.** It makes them render at build time. Rendered on request instead, they'd run on Vercel without `_posts/` or `_projects/` bundled and come out "Not Found".

Posts with photos use their first photo as the preview instead (set in `generateMetadata`), so the generated post card only shows up for posts without photos.

### Icons and Manifest

The icons are static files: `app/favicon.ico` and `app/apple-touch-icon.png` (180×180), referenced from `icons` in the root layout's metadata. `app/manifest.json` is the web app manifest and uses `public/icon-192.png` and `public/icon-512.png`.

## Sitemap and robots.txt

- `app/robots.txt` decides what crawlers may visit. It currently blocks `/test`, `/furniture`, and all posts (`/posts/*`), and allows `/about` and `/software`.
- `app/sitemap.ts` generates `/sitemap.xml`: the home page, `/about`, `/software`, and each project page.

Keep the two in step: when a section is opened to crawlers in `robots.txt`, add its pages to `sitemap.ts`.

## Structured Data (JSON-LD)

The `StructuredData` component generates rich snippets for search engines.

### Website Schema

```json
{
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SleepyBlog",
    "description": "Personal blog covering...",
    "url": "https://sleepyblog.org",
    "author": {
        "@type": "Person",
        "name": "Isaac Yep",
        "sameAs": ["https://github.com/anthonybench", "https://linkedin.com/in/anthonybench"]
    },
    "potentialAction": {
        "@type": "SearchAction",
        "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://sleepyblog.org/?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
    }
}
```

### Article Schema

```json
{
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "Post Title",
    "description": "Post excerpt",
    "datePublished": "2025-01-19T00:00:00.000Z",
    "author": { "@type": "Person", "name": "Isaac Yep" },
    "articleSection": "software-development",
    "keywords": ["software-development", "blog", "..."],
    "isPartOf": {
        "@type": "Blog",
        "name": "SleepyBlog",
        "url": "https://sleepyblog.org"
    }
}
```

### Person Schema

```json
{
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Isaac Yep",
    "description": "Lifelong engineer, professional kid.",
    "sameAs": [
        "https://github.com/anthonybench",
        "https://linkedin.com/in/anthonybench",
        "https://duolingo.com/profile/thesleepyboy",
        "https://pypi.org/user/sleepyboy",
        "https://hub.docker.com/u/sleepyboy"
    ],
    "knowsAbout": ["blog", "software development", "land development", "building", "technology"]
}
```

## Customizing Metadata

### 1. Update Site Information

Edit `app/_lib/data.yml`:

```yaml
site_name: "Your Blog Name"
site_description: "Your blog description"
site_url: "https://yourdomain.com"
author_name: "Your Name"
author_bio: "Your bio"
keywords: ["your", "keywords", "here"]
```

Run configuration generator:

```bash
npm run config:generate
```

### 2. Add Custom Metadata Fields

**Step 1**: Add to `data.yml`:

```yaml
custom_field: "Custom Value"
```

**Step 2**: Update `loadConfig.js` interface:

```typescript
export interface DataConfig {
    // ... existing fields
    custom_field: string;
}
```

**Step 3**: Update config generation:

```typescript
export const dataConfig: DataConfig = {
    // ... existing fields
    custom_field: "${config.custom_field || 'Default Value'}",
};
```

**Step 4**: Use in metadata:

```typescript
export const metadata: Metadata = {
    other: {
        "custom-meta": dataConfig.custom_field,
    },
};
```

### 3. Customize OpenGraph Images

**Modify Colors/Styling**:

```typescript
// In app/opengraph-image.tsx
<div style={{
  backgroundColor: '#your-color',
  backgroundImage: 'your-gradient',
  // ... other styles
}}>
```

**Add Custom Elements**:

```typescript
// Add logos, patterns, or custom graphics
<div style={{ position: 'absolute', top: '20px' }}>
  <YourLogoComponent />
</div>
```

### 4. Add Page-Specific Metadata

Create metadata for new pages:

```typescript
// app/your-page/page.tsx
import type { Metadata } from "next";
import { dataConfig } from "@/app/_lib/utils/dataConfig";

export const metadata: Metadata = {
    title: "Your Page Title",
    description: "Your page description",
    keywords: [...dataConfig.keywords, "page-specific", "keywords"],
    openGraph: {
        type: "website",
        title: "Your Page Title",
        description: "Your page description",
        url: `${dataConfig.site_url}/your-page`,
    },
};
```

### 5. Add Custom Structured Data

Extend the `StructuredData` component:

```typescript
// In app/_components/StructuredData.tsx
const generateCustomSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'YourType',
  // ... your custom schema
});

// Add to getSchemaData() switch statement
case 'custom':
  schemas.push(generateCustomSchema());
  break;
```

## SEO Best Practices

### 1. Title Optimization

- Keep titles under 60 characters
- Include primary keywords
- Use descriptive, unique titles per page
- Leverage the template system: `Page Title | Site Name`

### 2. Description Optimization

- Keep descriptions between 150-160 characters
- Include relevant keywords naturally
- Write compelling copy that encourages clicks
- Ensure each page has a unique description

### 3. Keyword Strategy

- Use long-tail keywords
- Include semantic variations
- Don't keyword stuff
- Match user search intent

### 4. Image Optimization

- Use descriptive alt text
- Optimize image file sizes
- Use proper aspect ratios (1200x630 for OG images)
- Include relevant images in OpenGraph

### 5. Structured Data Benefits

- Enhanced search result snippets
- Rich cards in social media
- Better content understanding by search engines
- Potential for featured snippets

## Validation and Testing

### 1. OpenGraph Testing

- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **LinkedIn Inspector**: https://www.linkedin.com/post-inspector/

### 2. Schema Validation

- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Schema.org Validator**: https://validator.schema.org/
- **JSON-LD Playground**: https://json-ld.org/playground/

### 3. SEO Analysis

- **Google Search Console**: Monitor search performance
- **PageSpeed Insights**: Check Core Web Vitals
- **Lighthouse**: Comprehensive SEO audit

### 4. Local Testing

Test metadata locally:

```bash
# Start development server
npm run dev

# Check generated HTML
curl http://localhost:3000 | grep -E '<meta|<title'

# Validate OpenGraph images
open http://localhost:3000/opengraph-image
```

## Common Issues and Solutions

### 1. Metadata Not Updating

**Problem**: Changes not reflected in social sharing
**Solution**:

- Clear social platform caches using their debugging tools
- Ensure `npm run config:generate` was run after `data.yml` changes
- Check browser cache and hard refresh

### 2. OpenGraph Images Not Generating

**Problem**: Default images showing instead of custom ones
**Solution**:

- Verify file paths in `opengraph-image.tsx`
- Check console for generation errors
- Ensure image dimensions are correct (1200x630)

### 3. Structured Data Errors

**Problem**: Schema validation failures
**Solution**:

- Use Schema.org validator to identify issues
- Ensure required properties are present
- Check data types match schema requirements

### 4. Dynamic Metadata Issues

**Problem**: Post metadata not generating correctly
**Solution**:

- Verify `generateMetadata` function is async
- Check that post data is available
- Ensure proper error handling for missing posts

## Performance Considerations

### 1. Image Generation

- All OpenGraph images are generated at build time, so none are rendered on request

### 2. Structured Data

- JSON-LD is preferred over microdata for performance
- Minimize schema complexity
- Cache structured data when possible

### 3. Metadata Size

- Keep metadata concise but descriptive
- Avoid excessive keywords
- Optimize for both SEO and user experience

## Advanced Customization

### 1. Internationalization

```typescript
// Multi-language metadata
export const metadata: Metadata = {
    alternates: {
        languages: {
            "en-US": "/en",
            "es-ES": "/es",
        },
    },
};
```

### 2. Custom Robots Directives

```typescript
export const metadata: Metadata = {
    robots: {
        index: true,
        follow: true,
        noarchive: true,
        nosnippet: false,
        noimageindex: false,
        nocache: false,
    },
};
```

This comprehensive metadata system ensures SleepyBlog has excellent SEO performance, rich social sharing, and enhanced search engine visibility while remaining easy to customize and maintain.
