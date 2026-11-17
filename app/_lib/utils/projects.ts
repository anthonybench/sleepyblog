import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { type Project, type ProjectLink, projectStatuses } from "@/app/_lib/types/project";

const PROJECTS_DIRECTORY = path.join(process.cwd(), "_projects");

/**
 * Parse and check one project file. Mistakes throw instead of being skipped, so a
 * broken project fails the build (and publish.py) rather than vanishing from the site.
 *
 * @param slug - Filename without extension
 * @param source - The file's contents
 * @returns The parsed project
 */
function parseProject(slug: string, source: string): Project {
    const { data, content } = matter(source);
    const fail = (problem: string): never => {
        throw new Error(`_projects/${slug}.md: ${problem}`);
    };

    for (const field of ["name", "tagline", "install"]) {
        if (typeof data[field] !== "string" || !data[field].trim()) {
            fail(`"${field}" is required`);
        }
    }
    if (!projectStatuses.includes(data.status)) {
        fail(`"status" must be one of: ${projectStatuses.join(", ")}`);
    }

    const links: ProjectLink[] = (data.links ?? []).map(
        (link: Partial<ProjectLink>, index: number) => {
            if (!link?.display_text || !link?.url) {
                fail(`links[${index}] needs both "display_text" and "url"`);
            }
            return { display_text: String(link.display_text), url: String(link.url) };
        },
    );

    return {
        slug,
        name: data.name,
        tagline: data.tagline,
        status: data.status,
        year: Number(data.year) || new Date().getFullYear(),
        order: Number(data.order) || 0,
        featured: Boolean(data.featured),
        tech: (data.tech ?? []).map(String),
        install: data.install,
        links,
        media: data.media ?? [],
        content,
    };
}

/**
 * Get every project in `_projects/`, in menu order (by `order`, then name)
 */
export function getAllProjects(): Project[] {
    if (!fs.existsSync(PROJECTS_DIRECTORY)) {
        return [];
    }

    return fs
        .readdirSync(PROJECTS_DIRECTORY)
        .filter((name) => name.endsWith(".md"))
        .map((name) => {
            const slug = name.replace(/\.md$/, "");
            const source = fs.readFileSync(path.join(PROJECTS_DIRECTORY, name), "utf8");
            return parseProject(slug, source);
        })
        .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

/**
 * Get one project by its slug, or null if there's no such project
 */
export function getProjectBySlug(slug: string): Project | null {
    return getAllProjects().find((project) => project.slug === slug) ?? null;
}

/**
 * Get the projects before and after this one in menu order, for prev/next buttons
 */
export function getProjectNavigation(slug: string): {
    previous: Project | null;
    next: Project | null;
} {
    const projects = getAllProjects();
    const index = projects.findIndex((project) => project.slug === slug);
    return {
        previous: index > 0 ? projects[index - 1] : null,
        next: index >= 0 && index < projects.length - 1 ? projects[index + 1] : null,
    };
}
