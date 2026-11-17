import Link from "next/link";
import { notFound } from "next/navigation";
import type { JSX } from "react";
import type { Metadata } from "next";
import { getAllProjects, getProjectBySlug, getProjectNavigation } from "@/app/_lib/utils/projects";
import { dataConfig } from "@/app/_lib/utils/dataConfig";
import { renderMarkdownToHtml } from "@/app/_lib/utils/markdown";
import CopyCommand from "@/app/_components/CopyCommand";
import MediaGallery from "@/app/_components/MediaGallery";
import PrevNextNavigation from "@/app/_components/PrevNextNavigation";
import ProjectLinks from "@/app/_components/ProjectLinks";
import ProjectStatusBadge from "@/app/_components/ProjectStatusBadge";

interface ProjectPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Every project page is built ahead of time; unknown slugs 404
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
    return getAllProjects().map((project) => ({ slug: project.slug }));
}

/**
 * Title, description, and link preview text for a project page. The preview image
 * comes from ./opengraph-image.tsx.
 */
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
    const { slug } = await params;
    const project = getProjectBySlug(slug);

    if (!project) {
        return { title: "Project Not Found" };
    }

    return {
        title: project.name,
        description: project.tagline,
        keywords: [...dataConfig.keywords, project.name, ...project.tech],
        alternates: {
            canonical: `/software/${slug}`,
        },
        openGraph: {
            type: "website",
            url: `${dataConfig.site_url}/software/${slug}`,
            title: `${project.name} | ${dataConfig.site_name}`,
            description: project.tagline,
            siteName: dataConfig.site_name,
        },
    };
}

/**
 * A project's page: the pitch up top (name, tagline, install command, links), then
 * screenshots, the Markdown body, and buttons to the previous and next projects.
 */
export default async function ProjectPage({ params }: ProjectPageProps): Promise<JSX.Element> {
    const { slug } = await params;
    const project = getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    const { previous, next } = getProjectNavigation(slug);
    const htmlContent = await renderMarkdownToHtml(project.content);

    return (
        <article className="post-page project-page">
            <Link href="/software" className="project-back">
                ← all projects
            </Link>

            <header className="project-header">
                <div className="post-meta">
                    <ProjectStatusBadge status={project.status} />
                    <span className="post-date">since {project.year}</span>
                </div>
                <h1 className="post-title">{project.name}</h1>
                <p className="project-tagline">{project.tagline}</p>
                <CopyCommand command={project.install} />
                <ProjectLinks links={project.links} />
                <ul className="project-tech" aria-label="Built with">
                    {project.tech.map((tech) => (
                        <li key={tech}>{tech}</li>
                    ))}
                </ul>
            </header>

            <MediaGallery media={project.media} />

            <div className="post-content">
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>

            <PrevNextNavigation
                previous={previous && { href: `/software/${previous.slug}`, title: previous.name }}
                next={next && { href: `/software/${next.slug}`, title: next.name }}
                noun="project"
            />
        </article>
    );
}
