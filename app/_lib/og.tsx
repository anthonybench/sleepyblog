import { Fragment, isValidElement, type CSSProperties, type ReactNode } from "react";
import { ImageResponse } from "next/og";

/**
 * Shared look for every Open Graph (link preview) image: a Dracula gradient background
 * with a dark rounded card in the middle. Each route's opengraph-image.tsx only
 * decides what goes inside the card.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/** Dracula colors used across the OG images */
export const ogColors = {
    background: "#282a36",
    foreground: "#f8f8f2",
    comment: "#6272a4",
    purple: "#bd93f9",
    pink: "#ff79c6",
};

/** Base text style; Satori (which renders these images) needs display: flex on text divs */
export const ogText: CSSProperties = {
    display: "flex",
    fontFamily: "system-ui, -apple-system, sans-serif",
};

interface OgFrameOptions {
    /** Card border color (default: purple) */
    accent?: string;
    /** Extra styles for the card itself, e.g. max width */
    cardStyle?: CSSProperties;
    /** Extra styles for the layout inside the card (default: centered column) */
    contentStyle?: CSSProperties;
}

/**
 * Satori (which renders these images) lays out a fragment as its own flex row, so a
 * fragment's children are pulled out and placed in the card's layout directly.
 */
function unwrapFragment(content: ReactNode): ReactNode {
    if (isValidElement<{ children?: ReactNode }>(content) && content.type === Fragment) {
        return content.props.children;
    }
    return content;
}

/**
 * Render an OG image: the shared background and card, with `content` inside the card.
 */
export function renderOgImage(
    content: ReactNode,
    { accent = ogColors.purple, cardStyle, contentStyle }: OgFrameOptions = {},
): ImageResponse {
    return new ImageResponse(
        <div
            style={{
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px",
                background: `linear-gradient(135deg, ${ogColors.background} 0%, #44475a 25%, ${ogColors.comment} 50%, ${ogColors.purple} 75%, ${ogColors.pink} 100%)`,
            }}
        >
            <div
                style={{
                    display: "flex",
                    backgroundColor: ogColors.background,
                    borderRadius: "24px",
                    padding: "60px",
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
                    border: `3px solid ${accent}`,
                    ...cardStyle,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        ...contentStyle,
                    }}
                >
                    {unwrapFragment(content)}
                </div>
            </div>
        </div>,
        { ...OG_SIZE },
    );
}
