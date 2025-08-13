"use client";

import { createContext, useContext, useEffect, useState, type ReactNode, type JSX } from "react";
import { type Theme, themes, defaultTheme } from "@/app/_lib/types/theme";

interface ThemeContextType {
    current_theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Hook to access theme context
 */
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
}

/**
 * Theme provider component that manages theme state and applies theme to document
 */
export function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
    const [current_theme, setCurrent_theme] = useState<Theme>(defaultTheme);

    useEffect(() => {
        // Apply theme to document root
        document.documentElement.setAttribute("data-theme", current_theme.alias);
    }, [current_theme]);

    const setTheme = (theme: Theme): void => {
        setCurrent_theme(theme);
        localStorage.setItem("sleepyblog-theme", theme.alias);
    };

    useEffect(() => {
        // Load saved theme from localStorage
        const saved_theme_alias = localStorage.getItem("sleepyblog-theme");
        if (saved_theme_alias) {
            const found_theme = themes.find((theme) => theme.alias === saved_theme_alias);
            if (found_theme) {
                setCurrent_theme(found_theme);
            }
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ current_theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
