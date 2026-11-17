/**
 * Project status, shown as a badge on the card and the project page.
 * Keep in sync with PROJECT_STATUSES in _tools/new_project.py.
 */
export type ProjectStatus = "active" | "maintained" | "wip" | "archived";

export const projectStatuses: ProjectStatus[] = ["active", "maintained", "wip", "archived"];

/** Status badge labels for the UI */
export const projectStatusDisplayNames: Record<ProjectStatus, string> = {
    active: "active",
    maintained: "maintained",
    wip: "work in progress",
    archived: "archived",
};

/**
 * A link to one of the project's homes (GitHub, PyPI, npm, Docker Hub, docs, ...).
 * The icon is picked from the URL's host, so only the text needs choosing.
 */
export interface ProjectLink {
    display_text: string;
    url: string;
}

/**
 * A software project, parsed from `_projects/<slug>.md`
 */
export interface Project {
    /** Filename without extension; the URL is /software/<slug> */
    slug: string;
    /** Project name as it should be displayed */
    name: string;
    /** One sentence that sells the project */
    tagline: string;
    status: ProjectStatus;
    /** Year the project started */
    year: number;
    /** Position in the menu, lowest first */
    order: number;
    /** Featured projects get a wide card at the top of the menu */
    featured: boolean;
    /** Languages and tools, shown as chips */
    tech: string[];
    /** One-line install or run command, shown on the card with a copy button on the page */
    install: string;
    links: ProjectLink[];
    /** Screenshots, GIFs, or videos, shown like a post's media */
    media: string[];
    /** Markdown body: the pitch, features, and quick start */
    content: string;
}
