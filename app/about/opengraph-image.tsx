import { ImageResponse } from "next/og";
import { dataConfig } from "@/app/_lib/utils/dataConfig";

// Image metadata
export const alt = `About ${dataConfig.author_name}`;
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

/**
 * Open Graph image for /about. Uses the same frame as the site-wide image in
 * app/opengraph-image.tsx (gradient background, dark card, purple border), with the
 * portrait, name, and bio inside.
 */
export default async function OpenGraphImage(): Promise<ImageResponse> {
    const fontFamily = "system-ui, -apple-system, sans-serif";

    return new ImageResponse(
        <div
            style={{
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "linear-gradient(135deg, #282a36 0%, #44475a 25%, #6272a4 50%, #bd93f9 75%, #ff79c6 100%)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "56px",
                    backgroundColor: "#282a36",
                    borderRadius: "24px",
                    padding: "60px 72px",
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
                    border: "3px solid #bd93f9",
                }}
            >
                <img
                    src={`${dataConfig.site_url}/static/portrait.png`}
                    alt={dataConfig.author_name}
                    style={{
                        width: "240px",
                        height: "240px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "3px solid #bd93f9",
                        boxShadow: "0 8px 20px rgba(189, 147, 249, 0.3)",
                    }}
                />

                <div style={{ display: "flex", flexDirection: "column", maxWidth: "560px" }}>
                    <div
                        style={{
                            display: "flex",
                            fontSize: "28px",
                            fontWeight: "600",
                            color: "#bd93f9",
                            marginBottom: "8px",
                            fontFamily,
                        }}
                    >
                        About
                    </div>
                    <div
                        style={{
                            display: "flex",
                            fontSize: "72px",
                            fontWeight: "900",
                            color: "#f8f8f2",
                            lineHeight: "1.1",
                            marginBottom: "20px",
                            fontFamily,
                        }}
                    >
                        {dataConfig.author_name}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            fontSize: "32px",
                            color: "#6272a4",
                            lineHeight: "1.4",
                            marginBottom: "28px",
                            fontFamily,
                        }}
                    >
                        {dataConfig.author_bio}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            fontSize: "24px",
                            color: "#ff79c6",
                            fontFamily,
                        }}
                    >
                        {`${dataConfig.site_name} · ${dataConfig.site_url.replace("https://", "")}/about`}
                    </div>
                </div>
            </div>
        </div>,
        {
            ...size,
        },
    );
}
