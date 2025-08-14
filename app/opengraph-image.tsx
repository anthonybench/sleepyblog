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
                    background: "linear-gradient(135deg, #282a36 0%, #44475a 25%, #6272a4 50%, #bd93f9 75%, #ff79c6 100%)",
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

                    <img
                        src="/dark/sleepyboy_technologist.png"
                        alt="SleepyBoy Technologist"
                        style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            marginBottom: "30px",
                            border: "3px solid #bd93f9",
                            boxShadow: "0 8px 20px rgba(189, 147, 249, 0.3)",
                        }}
                    />

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


                </div>
            </div>
        ),
        {
            ...size,
        },
    );
}
