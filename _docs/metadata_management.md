# Metadata Management Guide

This guide explains how to manage and customize metadata in SleepyBlog for optimal SEO, social sharing, and search engine visibility.

## Overview

SleepyBlog implements comprehensive metadata management using Next.js 13+ best practices, including:

- **Static & Dynamic Metadata**: Configured per page and route
- **OpenGraph Images**: Auto-generated social sharing images
- **Structured Data**: JSON-LD for enhanced search results
- **Social Media Cards**: Facebook and LinkedIn optimization
- **SEO Optimization**: Complete meta tags and search engine directives

## Metadata Architecture

### Configuration Source

All metadata originates from `app/_lib/data.yml`:

```yaml
# Site Metadata
site_name: "SleepyBlog"
site_description: "Personal blog covering software development, land development, building projects, and occasional rants"
site_url: "https://sleepyblog.com"
author_name: "Isaac Yep"
author_bio: "Software developer, land developer, and maker building things that matter"
author_image: "/light/sleepyboy_technologist.png"
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
        images: [{ url: "/og-image.png", width: 1200, height: 630 }],
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
};
```

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
            images: [{ url: post.media[0] || "/og-image.png" }],
        },
    };
}
```

### Static Page Metadata (`app/about/page.tsx`)

Static pages can export metadata directly:

```typescript
export const metadata: Metadata = {
    title: "About",
    description: `Learn more about ${dataConfig.author_name}`,
    openGraph: {
        type: "profile",
        title: `About ${dataConfig.author_name}`,
        images: [{ url: dataConfig.author_image }],
    },
};
```

## OpenGraph Image Generation

SleepyBlog automatically generates OpenGraph images using Next.js's `ImageResponse` API.

### Site-wide Image (`app/opengraph-image.tsx`)

```typescript
export default async function OpenGraphImage(): Promise<ImageResponse> {
  return new ImageResponse(
    (
      <div style={{ /* Dracula-themed design */ }}>
        <div>{dataConfig.site_name}</div>
        <div>{dataConfig.site_description}</div>
        <div>by {dataConfig.author_name}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

### Dynamic Post Images (`app/posts/[slug]/opengraph-image.tsx`)

Each post generates a custom OpenGraph image:

```typescript
export default async function OpenGraphImage({ params }: OpenGraphImageProps): Promise<ImageResponse> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  return new ImageResponse(
    (
      <div style={{ /* Post-specific design */ }}>
        <div>{postTypeDisplayNames[post.type]}</div>
        <div>{post.title}</div>
        <div>{post.excerpt}</div>
        <div>{dataConfig.site_name} • {formatDate(post.post_date)}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

### Favicon (`app/favicon.ico`)

This project uses a static favicon. Place your icon at `app/favicon.ico`. Next.js will automatically serve it at `/favicon.ico` and use it across pages.

Note: Dynamic icon components like `app/icon.tsx` and `app/apple-icon.tsx` are not used here. If you want Apple touch icons, add static PNGs such as `app/apple-touch-icon.png` (recommended 180×180) instead.

## Structured Data (JSON-LD)

The `StructuredData` component generates rich snippets for search engines.

### Website Schema

```json
{
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SleepyBlog",
    "description": "Personal blog covering...",
    "url": "https://sleepyblog.com",
    "author": {
        "@type": "Person",
        "name": "Isaac Yep",
        "sameAs": ["https://github.com/anthonybench", "https://linkedin.com/in/anthonybench"]
    },
    "potentialAction": {
        "@type": "SearchAction",
        "target": "https://sleepyblog.com/?search={search_term_string}"
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
    "articleSection": "Software Development",
    "keywords": ["software-development", "blog"],
    "isPartOf": {
        "@type": "Blog",
        "name": "SleepyBlog",
        "url": "https://sleepyblog.com"
    }
}
```

### Person Schema

```json
{
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Isaac Yep",
    "description": "Software developer, land developer...",
    "sameAs": [
        "https://github.com/anthonybench",
        "https://linkedin.com/in/anthonybench",
        "https://duolingo.com/profile/thesleepyboy",
        "https://pypi.org/user/sleepyboy",
        "https://hub.docker.com/u/sleepyboy"
    ],
    "knowsAbout": ["software development", "land development"]
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
import { dataConfig } from "../_lib/utils/dataConfig";

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

- OpenGraph images are generated at build time
- Use caching for frequently accessed images
- Optimize image generation code for performance

### 2. Structured Data

- JSON-LD is preferred over microdata for performance
- Minimize schema complexity
- Cache structured data when possible

### 3. Metadata Size

- Keep metadata concise but descriptive
- Avoid excessive keywords
- Optimize for both SEO and user experience

## Advanced Customization

### 1. Theme-Aware Metadata

```typescript
// Use theme data in metadata
const { currentTheme } = useTheme();
const themeColor = currentTheme.type === "dark" ? "#282a36" : "#ffffff";

export const metadata: Metadata = {
    themeColor,
    other: {
        "color-scheme": currentTheme.type,
    },
};
```

### 2. Internationalization

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

### 3. Custom Robots Directives

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
