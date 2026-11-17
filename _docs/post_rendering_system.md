# Post Rendering System Guide

This guide explains how blog posts are processed from markdown files in `_posts/*.md` to the final rendered content that users see in their browsers.

## Overview

SleepyBlog uses a comprehensive post rendering system that converts markdown files with frontmatter into fully rendered blog posts. The system handles everything from file parsing to HTML generation, with support for media galleries, search functionality, and navigation.

## System Architecture

### Processing Pipeline

```
_posts/2025-01-19.md
    ↓ (File System Read)
app/_lib/utils/posts.ts
    ↓ (Frontmatter Parsing)
gray-matter
    ↓ (Data Structure)
Post Interface (TypeScript)
    ↓ (Server Rendering)
app/posts/[slug]/page.tsx → remark-parse + remark-gfm → remark-rehype → rehype-raw → rehype-pretty-code → rehype-stringify
    ↓ (HTML Output)
Rendered HTML in Browser
```

## File Structure and Format

### Markdown File Location

All blog posts must be placed in the `_posts/` directory with the naming convention:

```
_posts/YYYY-MM-DD.md
```

Examples:

- `_posts/2025-01-19.md`
- `_posts/2024-12-25.md`
- `_posts/2025-03-15.md`

### Frontmatter Format

Each post file starts with YAML frontmatter containing metadata:

```markdown
---
title: "Your Post Title"
media:
    [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
        "https://example.com/video.mp4",
    ]
type: "software-development"
---

## This H2 becomes the excerpt

Your post content goes here...
```

#### Frontmatter Fields

| Field   | Type   | Required | Description                           |
| ------- | ------ | -------- | ------------------------------------- |
| `title` | string | Yes      | The post title displayed in the UI    |
| `media` | array  | No       | URLs of images/videos for the gallery |
| `type`  | string | Yes      | Post category (see types below)       |

#### Post Types

The `type` field must be one of:

- `"land-development"` - Posts about land/property development
- `"software-development"` - Technical programming posts
- `"build-things"` - DIY, maker, and building projects
- `"rant"` - Opinion pieces and rants

## Data Processing Flow

### Step 1: File System Reading

The system reads markdown files from `_posts/`:

```typescript
// app/_lib/utils/posts.ts
export function getAllPosts(): Post[] {
    const posts_directory = path.join(process.cwd(), "_posts");
    const file_names = fs.readdirSync(posts_directory);

    const posts = file_names
        .filter((name) => name.endsWith(".md"))
        .map((name) => {
            const slug = name.replace(/\.md$/, "");
            return getPostBySlug(slug);
        })
        .filter((post) => post !== null) as Post[];

    // Sort by date (newest first)
    return posts.sort((a, b) => new Date(b.post_date).getTime() - new Date(a.post_date).getTime());
}
```

### Step 2: Markdown Parsing

Each file is parsed using `gray-matter`:

```typescript
export function getPostBySlug(slug: string): Post | null {
    const file_contents = fs.readFileSync(file_path, "utf8");
    const { data, content } = matter(file_contents);

    // Extract date from filename (yyyy-mm-dd format)
    const date_match = slug.match(/^(\d{4}-\d{2}-\d{2})/);
    const post_date = date_match ? date_match[1] : slug;

    // Extract excerpt from first h2
    const excerpt_match = content.match(/^## (.+)$/m);
    const excerpt = excerpt_match ? excerpt_match[1] : "";

    return {
        title: data.title || "Untitled",
        media: Array.isArray(data.media) ? data.media : [],
        type: (data.type as PostType) || "rant",
        post_date,
        excerpt,
        slug,
        content,
    };
}
```

### Step 3: TypeScript Data Structure

Posts are converted to a strongly-typed TypeScript interface:

```typescript
// app/_lib/types/post.ts
export interface Post {
    /** Post title from frontmatter */
    title: string;
    /** List of media URLs for images and videos */
    media: string[];
    /** Post type for categorization and filtering */
    type: PostType;
    /** Date extracted from filename */
    post_date: string;
    /** Excerpt extracted from first h2 in content */
    excerpt: string;
    /** Post slug (filename without extension) */
    slug: string;
    /** Full markdown content */
    content: string;
}
```

## API Layer

### Server-Side API Routes

Posts are served through Next.js API routes:

```typescript
// app/api/posts/route.ts - Get all posts
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    switch (action) {
        case "all":
            return NextResponse.json(getAllPosts());
        case "search":
            return NextResponse.json(searchPosts(query));
        // ... other actions
    }
}

// app/api/posts/[slug]/route.ts - Get individual post
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
}
```

### Client-Side API Calls

Components fetch posts through client-side utilities:

```typescript
// app/_lib/utils/postsClient.ts
export async function getAllPosts(): Promise<Post[]> {
    const response = await fetch("/api/posts?action=all");
    return await response.json();
}

export async function searchPosts(query: string): Promise<Post[]> {
    const response = await fetch(`/api/posts?action=search&query=${encodeURIComponent(query)}`);
    return await response.json();
}
```

## Content Rendering

### Home Page (Post List)

The home page displays post previews:

```typescript
// app/page.tsx
export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      const allPosts = await getAllPosts();
      setPosts(allPosts);
    };
    loadPosts();
  }, []);

  return (
    <div className="home-page">
      {posts.map(post => (
        <PostListItem key={post.slug} post={post} />
      ))}
    </div>
  );
}
```

### Individual Post Pages

Individual posts are rendered with full content:

```typescript
// app/posts/[slug]/page.tsx
export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="post-page">
      <header className="post-header">
        <PostTypeChip type={post.type} />
        <h1 className="post-title">{post.title}</h1>
      </header>

      <MediaGallery media={post.media} />

      <div className="post-content">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>

      <PrevNextNavigation
        previous={previous && { href: `/posts/${previous.slug}`, title: previous.title }}
        next={next && { href: `/posts/${next.slug}`, title: next.title }}
        noun="post"
      />
    </article>
  );
}
```

## Markdown to HTML Conversion

### Remark-based Markdown Pipeline

Markdown is converted to HTML using the remark/rehype ecosystem. The reusable utility lives at `app/_lib/utils/markdown.ts`:

```typescript
// app/_lib/utils/markdown.ts
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";

export async function renderMarkdownToHtml(content: string): Promise<string> {
    const file = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypePrettyCode, { theme: CODE_THEMES, keepBackground: false })
        .use(rehypeStringify)
        .process(content);
    return String(file);
}
```

In the post page, markdown is rendered server-side and injected as HTML:

```typescript
// app/posts/[slug]/page.tsx
import { renderMarkdownToHtml } from "@/app/_lib/utils/markdown";

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const htmlContent = await renderMarkdownToHtml(post.content);

  return (
    <article className="post-page">
      {/* ... */}
      <div className="post-content">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </article>
  );
}
```

### Supported Markdown Features

Core Markdown and GitHub-Flavored Markdown (via `remark-gfm`):

| Feature             | Example                                          |
| ------------------- | ------------------------------------------------ |
| Headings            | `# H1`, `## H2`, `### H3`                        |
| Bold/Italic         | `**bold**`, `*italic*`                           |
| Inline code         | `` `code` ``                                     |
| Code fences         | a ` ```python ` block (syntax-highlighted)       |
| Blockquotes         | `> quoted text`                                  |
| Links               | `[text](https://example.com)`                    |
| Tables (GFM)        | `\| a \| b \|` rows with a `\| --- \|` separator |
| Strikethrough (GFM) | `~~deprecated~~`                                 |
| Task lists (GFM)    | `- [x] done` / `- [ ] todo`                      |
| Autolink literals   | `https://example.com`                            |
| Raw HTML            | `<span class="x">custom</span>`                  |

### Syntax Highlighting

Fenced code blocks are highlighted by [rehype-pretty-code](https://rehype-pretty.pages.dev/)
(which uses [Shiki](https://shiki.style/)) when the page is rendered, so no highlighting
JavaScript is sent to the browser. Put the language after the opening fence:
` ```python `, ` ```sh `, ` ```yaml `, ` ```tsx `, ` ```console ` (shell sessions), etc.

Each site theme has a matching code theme, set in `CODE_THEMES` in
`app/_lib/utils/markdown.ts`:

| Site theme | Code theme         |
| ---------- | ------------------ |
| dracula    | `dracula`          |
| overcast   | `github-light`     |
| sunset     | `vesper`           |
| mist       | `catppuccin-latte` |

Every token gets all four colors as CSS variables (`--shiki-dracula`,
`--shiki-overcast`, ...), and `main.css` applies the set for the active
`[data-theme]`, so switching themes recolors code instantly. The code block background
comes from the site theme (`keepBackground: false`). **When adding a site theme**, add
it to `CODE_THEMES` (any [Shiki theme](https://shiki.style/themes) name) and add a
matching `[data-theme="..."]` rule next to the others in `main.css`.

## Media Gallery System

### Media Detection

The system automatically detects media types:

```typescript
function isVideoUrl(url: string): boolean {
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi"];
    return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
}
```

### Gallery Rendering

Media is rendered in a responsive grid:

```typescript
// app/_components/MediaGallery.tsx
export default function MediaGallery({ media }: MediaGalleryProps) {
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
```

### Media Item Component

Individual media items are rendered based on type:

```typescript
function MediaItem({ url, index }: MediaItemProps) {
  const isVideo = isVideoUrl(url);

  if (isVideo) {
    return (
      <div className="media-item video-item">
        <video controls preload="metadata" className="media-video">
          <source src={url} type="video/mp4" />
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
        unoptimized // For external URLs
      />
    </div>
  );
}
```

## Search and Filtering

### Search Implementation

Posts can be searched by title, date, or excerpt:

```typescript
export function searchPosts(query: string): Post[] {
    const all_posts = getAllPosts();
    const lower_query = query.toLowerCase();

    return all_posts.filter(
        (post) =>
            post.title.toLowerCase().includes(lower_query) ||
            post.post_date.includes(query) ||
            post.excerpt.toLowerCase().includes(lower_query),
    );
}
```

### Type Filtering

Posts can be filtered by type:

```typescript
export function getPostsByType(type: PostType): Post[] {
    return getAllPosts().filter((post) => post.type === type);
}
```

### Client-Side Filtering

The home page implements real-time filtering:

```typescript
const applyFilters = async (query: string, type: PostType | "all") => {
    let filtered = allPosts;

    // Apply search filter
    if (query.trim()) {
        filtered = await searchPosts(query);
    }

    // Apply type filter
    if (type !== "all") {
        filtered = filtered.filter((post) => post.type === type);
    }

    setFilteredPosts(filtered);
};
```

## Navigation System

### Post Navigation

Posts include previous/next navigation:

```typescript
export function getPostNavigation(current_slug: string) {
    const all_posts = getAllPosts(); // Sorted by date descending
    const current_index = all_posts.findIndex((post) => post.slug === current_slug);

    // Previous post is older (later in array)
    const previous = current_index < all_posts.length - 1 ? all_posts[current_index + 1] : null;

    // Next post is newer (earlier in array)
    const next = current_index > 0 ? all_posts[current_index - 1] : null;

    return { previous, next };
}
```

### Navigation UI

Navigation is rendered at the bottom of posts:

```typescript
// app/_components/PrevNextNavigation.tsx (shared with /software project pages)
export default function PrevNextNavigation({ previous, next, noun }) {
  return (
    <nav className="post-navigation">
      <div className="nav-buttons">
        {previous && (
          <Link href={previous.href} className="nav-button">
            <span className="nav-arrow">◀</span>
            <div className="nav-content">
              <span className="nav-label">Previous</span>
              <span className="nav-title">{previous.title}</span>
            </div>
          </Link>
        )}

        {next && (
          <Link href={next.href} className="nav-button">
            <div className="nav-content">
              <span className="nav-label">Next</span>
              <span className="nav-title">{next.title}</span>
            </div>
            <span className="nav-arrow">▶</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
```

## Performance

- **Post pages are static.** `generateStaticParams` in `app/posts/[slug]/page.tsx` builds every post at build time, so Markdown parsing and syntax highlighting never run on request. Their link preview images are built the same way.
- **The home page list is fetched in the browser.** `app/page.tsx` is a client component that loads posts from `/api/posts` (via `postsClient.ts`) and filters them as you type.
- **Gallery images load smaller copies.** For imgur photos (`https://i.imgur.com/<id>.jpg|png`), `MediaGallery` loads imgur's 1024px version (the `h` suffix) and falls back to the original if that fails. Images are `unoptimized`, since they're external.

## Error Handling

### File System Errors

The system gracefully handles missing files:

```typescript
export function getPostBySlug(slug: string): Post | null {
    try {
        if (!fs.existsSync(file_path)) {
            return null;
        }
        // ... processing
    } catch (error) {
        console.error(`Error parsing post ${slug}:`, error);
        return null;
    }
}
```

### Malformed Content

Invalid frontmatter or content is handled:

- Missing fields get defaults: `title` becomes "Untitled", `media` an empty list, and `type` "rant"
- A post that fails to parse is logged and left out rather than breaking the build

### API Error Handling

API routes include comprehensive error handling:

```typescript
export async function GET(request: Request) {
    try {
        // ... processing
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in posts API:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
```

## Extending the System

### Adding New Post Fields

1. Update the frontmatter format
2. Modify the `Post` interface in `types/post.ts`
3. Update the parsing logic in `posts.ts`
4. Add rendering support in components

### Custom Markdown Features

Add or modify capabilities by composing remark/rehype plugins:

```typescript
import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug";

export async function renderMarkdownToHtml(content: string): Promise<string> {
    const file = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkToc, { heading: "Contents" })
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeSlug)
        .use(rehypeStringify)
        .process(content);
    return String(file);
}
```

### Additional Media Types

Support new media types by extending the detection logic:

```typescript
function isPdfUrl(url: string): boolean {
  return url.toLowerCase().includes('.pdf');
}

function MediaItem({ url, index }) {
  const isVideo = isVideoUrl(url);
  const isPdf = isPdfUrl(url);

  if (isPdf) {
    return (
      <div className="media-item pdf-item">
        <embed src={url} type="application/pdf" />
      </div>
    );
  }

  // ... existing logic
}
```

This comprehensive system provides a flexible, performant way to transform markdown files into fully-featured blog posts with rich media support, search capabilities, and smooth navigation.
