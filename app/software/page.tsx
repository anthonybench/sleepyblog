import type { JSX } from "react";
import type { Metadata } from "next";
import { getAllProjects } from "@/app/_lib/utils/projects";
import { dataConfig } from "@/app/_lib/utils/dataConfig";
import ProjectCard from "@/app/_components/ProjectCard";

const DESCRIPTION = `Software projects by ${dataConfig.author_name}: CLI tools, packages, and self-hosted apps.`;

export const metadata: Metadata = {
    title: "Software",
    description: DESCRIPTION,
    alternates: {
        canonical: "/software",
    },
    openGraph: {
        type: "website",
        url: `${dataConfig.site_url}/software`,
        title: `Software | ${dataConfig.site_name}`,
        description: DESCRIPTION,
        siteName: dataConfig.site_name,
    },
};

/**
 * /software: a menu of terminal-window cards, one per project in `_projects/`.
 * Each card links to the project's own page at /software/<slug>.
 */
export default function SoftwarePage(): JSX.Element {
    const projects = getAllProjects();

    return (
        <div className="software-page">
            <header className="software-header">
                <h1>
                    <span className="terminal-prompt">$</span> ls ~/projects
                </h1>
                <p>Things I&apos;ve built and keep using. Poke one to check it out.</p>
            </header>

            {projects.length > 0 ? (
                <div className="project-grid">
                    {projects.map((project) => (
                        <ProjectCard key={project.slug} project={project} />
                    ))}
                </div>
            ) : (
                <p className="no-posts">No projects yet.</p>
            )}
        </div>
    );
}
