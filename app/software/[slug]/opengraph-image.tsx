import type { ImageResponse } from "next/og";
import { getAllProjects, getProjectBySlug } from "@/app/_lib/utils/projects";
import { dataConfig } from "@/app/_lib/utils/dataConfig";
import { OG_CONTENT_TYPE, OG_SIZE, ogColors, ogText, renderOgImage } from "@/app/_lib/og";

export const alt = "Software project";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Dracula green and cyan, matching the terminal look of the /software cards */
const PROMPT_COLOR = "#50fa7b";
const ACCENT_COLOR = "#8be9fd";

// Built ahead of time, one per project. The image route isn't bundled with _projects/,
// so rendering it on request would always come out "Project Not Found".
export function generateStaticParams(): { slug: string }[] {
    return getAllProjects().map((project) => ({ slug: project.slug }));
}

interface OpenGraphImageProps {
    params: Promise<{
        slug: string;
    }>;
}

/**
 * Open Graph image for a project: install command, name, tagline, and the page's URL
 */
export default async function OpenGraphImage({
    params,
}: OpenGraphImageProps): Promise<ImageResponse> {
    const { slug } = await params;
    const project = getProjectBySlug(slug);

    if (!project) {
        return renderOgImage(
            <div style={{ ...ogText, fontSize: "48px", color: ogColors.foreground }}>
                Project Not Found
            </div>,
        );
    }

    return renderOgImage(
        <>
            <div
                style={{
                    ...ogText,
                    fontSize: "28px",
                    color: ogColors.comment,
                    marginBottom: "28px",
                }}
            >
                <span style={{ color: PROMPT_COLOR, marginRight: "14px" }}>$</span>
                {project.install}
            </div>
            <div
                style={{
                    ...ogText,
                    fontSize: project.name.length > 20 ? "64px" : "80px",
                    fontWeight: "900",
                    color: ogColors.foreground,
                    lineHeight: "1.1",
                    marginBottom: "20px",
                }}
            >
                {project.name}
            </div>
            <div
                style={{
                    ...ogText,
                    fontSize: "32px",
                    color: ogColors.comment,
                    lineHeight: "1.4",
                    textAlign: "center",
                    justifyContent: "center",
                    marginBottom: "32px",
                }}
            >
                {project.tagline}
            </div>
            <div style={{ ...ogText, fontSize: "24px", color: ogColors.pink }}>
                {`${dataConfig.site_name} · ${dataConfig.site_url.replace("https://", "")}/software/${slug}`}
            </div>
        </>,
        { accent: ACCENT_COLOR, cardStyle: { maxWidth: "1040px" } },
    );
}
