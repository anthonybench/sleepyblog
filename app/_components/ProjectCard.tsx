import Link from "next/link";
import type { JSX } from "react";
import { type Project } from "@/app/_lib/types/project";
import ProjectStatusBadge from "@/app/_components/ProjectStatusBadge";

/**
 * A /software menu card, drawn as a small terminal window: the title bar shows the
 * project's path, and the body shows its name, status, pitch, tech, and install
 * command. Featured projects get a full-width card.
 */
export default function ProjectCard({ project }: { project: Project }): JSX.Element {
    return (
        <Link
            href={`/software/${project.slug}`}
            className={`project-card${project.featured ? " project-card--featured" : ""}`}
        >
            <div className="project-card-titlebar" aria-hidden="true">
                <span className="terminal-dots">
                    <span />
                    <span />
                    <span />
                </span>
                <span className="project-card-path">~/projects/{project.slug}</span>
                {project.featured && <span className="project-card-featured">★ featured</span>}
            </div>

            <div className="project-card-body">
                <div className="project-card-heading">
                    <h2 className="project-card-name">{project.name}</h2>
                    <ProjectStatusBadge status={project.status} />
                </div>
                <p className="project-card-tagline">{project.tagline}</p>

                <ul className="project-tech" aria-label="Built with">
                    {project.tech.map((tech) => (
                        <li key={tech}>{tech}</li>
                    ))}
                </ul>

                {/* Last line of the "terminal", so every card's command lines up at the bottom */}
                <code className="project-card-command">
                    <span className="terminal-prompt">$</span> {project.install}
                    <span className="terminal-cursor" aria-hidden="true" />
                </code>
            </div>
        </Link>
    );
}
