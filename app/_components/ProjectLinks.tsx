"use client";

import Image from "next/image";
import type { JSX } from "react";
import { type ProjectLink } from "@/app/_lib/types/project";
import { useTheme } from "@/app/_lib/utils/themeContext";

/**
 * Pick an icon from the link's host, so project files only need display_text and url.
 * Returns null for hosts without an icon. The GitHub icon has light and dark versions.
 */
function getLinkIcon(url: string, themeImagePath: string): string | null {
    let host: string;
    try {
        host = new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return null;
    }
    if (host === "github.com") return `${themeImagePath}/github.png`;
    if (host === "pypi.org") return "/static/pypi.png";
    if (host === "npmjs.com") return "/static/npm.svg";
    if (host === "hub.docker.com") return "/static/docker.png";
    return null;
}

/**
 * A project's links (GitHub, PyPI, npm, ...), each shown as its display_text
 */
export default function ProjectLinks({ links }: { links: ProjectLink[] }): JSX.Element | null {
    const { current_theme } = useTheme();
    const themeImagePath = current_theme.type === "dark" ? "/dark" : "/light";

    if (links.length === 0) {
        return null;
    }

    return (
        <ul className="project-links">
            {links.map((link) => {
                const icon = getLinkIcon(link.url, themeImagePath);
                return (
                    <li key={link.url}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                            {icon ? (
                                <Image src={icon} alt="" width={20} height={20} />
                            ) : (
                                <span aria-hidden="true">🔗</span>
                            )}
                            {link.display_text}
                        </a>
                    </li>
                );
            })}
        </ul>
    );
}
