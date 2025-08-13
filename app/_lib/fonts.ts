import { JetBrains_Mono, Comfortaa } from "next/font/google";

/**
 * JetBrains Mono font for code blocks and technical content
 */
export const jetBrainsMono = JetBrains_Mono({
    variable: "--font-jetbrains-mono",
    subsets: ["latin"],
    display: "swap",
});

/**
 * Comfortaa font for headings and decorative text
 */
export const comfortaa = Comfortaa({
    variable: "--font-comfortaa",
    subsets: ["latin"],
    display: "swap",
});

/**
 * Array of all font variables for easy CSS class application
 */
export const fontVariables = [jetBrainsMono.variable, comfortaa.variable].join(" ");
