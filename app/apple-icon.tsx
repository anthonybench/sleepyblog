import { ImageResponse } from "next/og";

// Image metadata
export const size = {
    width: 180,
    height: 180,
};
export const contentType = "image/png";

// Image generation
export default function AppleIcon(): ImageResponse {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#282a36",
                    borderRadius: "32px",
                }}
            >
                <div
                    style={{
                        fontSize: "80px",
                        fontWeight: "900",
                        color: "#bd93f9",
                        fontFamily: "system-ui, -apple-system, sans-serif",
                    }}
                >
                    S
                </div>
            </div>
        ),
        {
            ...size,
        },
    );
}
