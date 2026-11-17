import type { JSX } from "react";
import { type ProjectStatus, projectStatusDisplayNames } from "@/app/_lib/types/project";

/**
 * A colored dot plus the project's status ("active", "archived", ...)
 */
export default function ProjectStatusBadge({ status }: { status: ProjectStatus }): JSX.Element {
    return (
        <span className={`project-status project-status--${status}`}>
            <span className="project-status-dot" aria-hidden="true" />
            {projectStatusDisplayNames[status]}
        </span>
    );
}
