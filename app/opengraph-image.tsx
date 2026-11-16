import type { ImageResponse } from "next/og";
import { dataConfig } from "@/app/_lib/utils/dataConfig";
import { OG_CONTENT_TYPE, OG_SIZE, ogColors, ogText, renderOgImage } from "@/app/_lib/og";

export const alt = `${dataConfig.site_name} - ${dataConfig.site_description}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * Site-wide Open Graph image: site name, logo, and description.
 */
export default async function OpenGraphImage(): Promise<ImageResponse> {
    return renderOgImage(
        <>
            <div
                style={{
                    ...ogText,
                    fontSize: "72px",
                    fontWeight: "900",
                    color: ogColors.foreground,
                    marginBottom: "20px",
                }}
            >
                {dataConfig.site_name}
            </div>

            <img
                src={`${dataConfig.site_url}${dataConfig.author_image}`}
                alt="SleepyBoy Technologist"
                style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    marginBottom: "30px",
                    border: `3px solid ${ogColors.purple}`,
                    boxShadow: "0 8px 20px rgba(189, 147, 249, 0.3)",
                }}
            />

            <div style={{ ...ogText, fontSize: "32px", color: ogColors.comment }}>
                {dataConfig.site_description}
            </div>
        </>,
    );
}
