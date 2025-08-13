import { ImageResponse } from "next/og";
import { dataConfig } from "@/app/_lib/utils/dataConfig";

// Image metadata
export const alt = `${dataConfig.site_name} - ${dataConfig.site_description}`;
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

// Image generation
export default async function OpenGraphImage(): Promise<ImageResponse> {
    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#282a36",
                    backgroundImage:
                        "linear-gradient(45deg, #282a36 25%, #44475a 25%, #44475a 50%, #282a36 50%, #282a36 75%, #44475a 75%)",
                    backgroundSize: "60px 60px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#282a36",
                        borderRadius: "24px",
                        padding: "60px",
                        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
                        border: "3px solid #bd93f9",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            fontSize: "72px",
                            fontWeight: "900",
                            color: "#f8f8f2",
                            marginBottom: "20px",
                            textAlign: "center",
                            fontFamily: "system-ui, -apple-system, sans-serif",
                        }}
                    >
                        {dataConfig.site_name}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            fontSize: "32px",
                            color: "#6272a4",
                            textAlign: "center",
                            maxWidth: "900px",
                            lineHeight: "1.4",
                            fontFamily: "system-ui, -apple-system, sans-serif",
                        }}
                    >
                        {dataConfig.site_description}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            fontSize: "24px",
                            color: "#50fa7b",
                            marginTop: "40px",
                            textAlign: "center",
                            fontFamily: "system-ui, -apple-system, sans-serif",
                        }}
                    >
                        by {dataConfig.author_name}
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        },
    );
}
