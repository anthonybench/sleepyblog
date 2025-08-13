import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";

/**
 * Convert Markdown content to HTML using remark/rehype.
 * Supports GitHub-Flavored Markdown and allows raw HTML in markdown.
 *
 * @param content - Markdown source string
 * @returns Promise resolving to HTML string
 */
export async function renderMarkdownToHtml(content: string): Promise<string> {
    const file = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeStringify)
        .process(content);

    return String(file);
}
