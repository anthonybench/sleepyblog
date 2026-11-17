/**
 * Theme type definition for SleepyBlog themes
 */
export interface Theme {
    /** Human-readable display name (e.g., "Dracula") */
    display_name: string;
    /** URL-safe alias (e.g., "dracula") */
    alias: string;
    /** Theme type for image selection */
    type: "light" | "dark";
}

/**
 * Available themes for the application
 */
export const themes: Theme[] = [
    {
        display_name: "Dracula",
        alias: "dracula",
        type: "dark",
    },
    {
        display_name: "Overcast",
        alias: "overcast",
        type: "light",
    },
    {
        display_name: "Sunset",
        alias: "sunset",
        type: "dark",
    },
    {
        display_name: "Mist",
        alias: "mist",
        type: "light",
    },
    {
        display_name: "Nord",
        alias: "nord",
        type: "dark",
    },
    {
        display_name: "Monokai",
        alias: "monokai",
        type: "dark",
    },
    {
        display_name: "Ocean",
        alias: "ocean",
        type: "dark",
    },
    {
        display_name: "Solarized Dark",
        alias: "solarized-dark",
        type: "dark",
    },
    {
        display_name: "Day One",
        alias: "day-one",
        type: "light",
    },
    {
        display_name: "Gruvbox",
        alias: "gruvbox",
        type: "light",
    },
    {
        display_name: "Solarized Light",
        alias: "solarized-light",
        type: "light",
    },
    {
        display_name: "Dream",
        alias: "dream",
        type: "light",
    },
];

import { dataConfig } from "@/app/_lib/utils/dataConfig";

/**
 * Get default theme based on configuration
 */
export function getDefaultTheme(): Theme {
    const found_theme = themes.find((theme) => theme.alias === dataConfig.default_theme);
    return found_theme || themes[0];
}

/**
 * Default theme
 */
export const defaultTheme: Theme = getDefaultTheme();
