import { ImageResponse } from "next/og";
import { dataConfig } from "@/app/_lib/utils/dataConfig";
import Image from "next/image";

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
                        "radial-gradient(ellipse at top left, #4a287d 0%, #2e1a4d 50%, #1a1a1a 100%)",
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
                    {/* <div
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
                    </div> */}
                    <Image
                        src={`${image_path}/sleepyboy_technologist.png`}
                        alt="SleepyBoy Technologist Logo"
                        width={1000}
                        height={1000}
                        priority
                        className=""
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
