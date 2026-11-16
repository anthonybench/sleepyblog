import type { ImageResponse } from "next/og";
import { dataConfig } from "@/app/_lib/utils/dataConfig";
import { OG_CONTENT_TYPE, OG_SIZE, ogColors, ogText, renderOgImage } from "@/app/_lib/og";

export const alt = `About ${dataConfig.author_name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * Open Graph image for /about: portrait beside the name and bio.
 */
export default async function OpenGraphImage(): Promise<ImageResponse> {
    return renderOgImage(
        <>
            <img
                src={`${dataConfig.site_url}/static/portrait.png`}
                alt={dataConfig.author_name}
                style={{
                    width: "240px",
                    height: "240px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: `3px solid ${ogColors.purple}`,
                    boxShadow: "0 8px 20px rgba(189, 147, 249, 0.3)",
                }}
            />

            <div style={{ display: "flex", flexDirection: "column", maxWidth: "560px" }}>
                <div
                    style={{
                        ...ogText,
                        fontSize: "28px",
                        fontWeight: "600",
                        color: ogColors.purple,
                        marginBottom: "8px",
                    }}
                >
                    About
                </div>
                <div
                    style={{
                        ...ogText,
                        fontSize: "72px",
                        fontWeight: "900",
                        color: ogColors.foreground,
                        lineHeight: "1.1",
                        marginBottom: "20px",
                    }}
                >
                    {dataConfig.author_name}
                </div>
                <div
                    style={{
                        ...ogText,
                        fontSize: "32px",
                        color: ogColors.comment,
                        lineHeight: "1.4",
                        marginBottom: "28px",
                    }}
                >
                    {dataConfig.author_bio}
                </div>
                <div style={{ ...ogText, fontSize: "24px", color: ogColors.pink }}>
                    {`${dataConfig.site_name} · ${dataConfig.site_url.replace("https://", "")}/about`}
                </div>
            </div>
        </>,
        {
            cardStyle: { padding: "60px 72px" },
            contentStyle: { flexDirection: "row", gap: "56px" },
        },
    );
}
