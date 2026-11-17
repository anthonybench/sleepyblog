import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";

/**
 * Syntax highlighting theme for each site theme. Code is highlighted once, when the page
 * is rendered, with every theme's colors stored as CSS variables (--shiki-<site theme>);
 * main.css picks the set that matches the active site theme. Keep the keys in sync with
 * the themes in app/_lib/types/theme.ts.
 */
const CODE_THEMES: PrettyCodeOptions["theme"] = {
    dracula: "dracula",
    overcast: "github-light",
    sunset: "vesper",
    mist: "catppuccin-latte",
};

/**
 * Convert Markdown content to HTML using remark/rehype.
 * Supports GitHub-Flavored Markdown, allows raw HTML in markdown, and syntax-highlights
 * fenced code blocks (```sh, ```python, ...).
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
        // keepBackground: false lets code blocks keep the site theme's background
        .use(rehypePrettyCode, { theme: CODE_THEMES, keepBackground: false })
        .use(rehypeStringify)
        .process(content);

    return String(file);
}
