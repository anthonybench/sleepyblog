import { ImageResponse } from "next/og";
import { dataConfig } from "../_lib/utils/dataConfig";

// Image metadata
export const alt = `About ${dataConfig.author_name}`;
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
                {/* Main content container */}
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
                        border: "3px solid #50fa7b",
                    }}
                >
                    {/* About label */}
                    <div
                        style={{
                            fontSize: "32px",
                            color: "#50fa7b",
                            backgroundColor: "#50fa7b20",
                            padding: "12px 24px",
                            borderRadius: "20px",
                            marginBottom: "30px",
                            fontFamily: "system-ui, -apple-system, sans-serif",
                            fontWeight: "600",
                        }}
                    >
                        About
                    </div>

                    {/* Author name */}
                    <div
                        style={{
                            fontSize: "72px",
                            fontWeight: "900",
                            color: "#f8f8f2",
                            marginBottom: "20px",
                            textAlign: "center",
                            fontFamily: "system-ui, -apple-system, sans-serif",
                        }}
                    >
                        {dataConfig.author_name}
                    </div>

                    {/* Bio */}
                    <div
                        style={{
                            fontSize: "32px",
                            color: "#6272a4",
                            textAlign: "center",
                            maxWidth: "900px",
                            lineHeight: "1.4",
                            fontFamily: "system-ui, -apple-system, sans-serif",
                            marginBottom: "30px",
                        }}
                    >
                        {dataConfig.author_bio}
                    </div>

                    {/* Site name */}
                    <div
                        style={{
                            fontSize: "24px",
                            color: "#bd93f9",
                            textAlign: "center",
                            fontFamily: "system-ui, -apple-system, sans-serif",
                        }}
                    >
                        {dataConfig.site_name}
                    </div>
                </div>

                {/* Bottom accent */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        right: "0",
                        height: "8px",
                        background:
                            "linear-gradient(90deg, #ff79c6, #bd93f9, #8be9fd, #50fa7b, #ffb86c, #ff5555)",
                    }}
                />
            </div>
        ),
        {
            ...size,
        },
    );
}
