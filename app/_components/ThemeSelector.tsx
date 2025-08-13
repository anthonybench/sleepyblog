"use client";

import { useState, useRef, useEffect, type JSX } from "react";
import { SunIcon, MoonIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../_lib/utils/themeContext";
import { themes, type Theme } from "../_lib/types/theme";

/**
 * Theme selector dropdown component with moon/sun icons
 */
export default function ThemeSelector(): JSX.Element {
    const { current_theme, setTheme } = useTheme();
    const [is_open, setIsOpen] = useState(false);
    const dropdown_ref = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (dropdown_ref.current && !dropdown_ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleThemeSelect = (theme: Theme): void => {
        setTheme(theme);
        setIsOpen(false);
    };

    const getThemeIcon = (theme_type: "light" | "dark"): JSX.Element => {
        return theme_type === "dark" ? (
            <MoonIcon className="w-4 h-4" />
        ) : (
            <SunIcon className="w-4 h-4" />
        );
    };

    return (
        <div className="theme-selector" ref={dropdown_ref}>
            <button
                type="button"
                className="theme-selector-button"
                onClick={() => setIsOpen(!is_open)}
                aria-haspopup="listbox"
                aria-expanded={is_open}
            >
                <span className="theme-selector-current">
                    <span className="theme-name">{current_theme.display_name}</span>
                    <span className="theme-icon">{getThemeIcon(current_theme.type)}</span>
                </span>
                <ChevronDownIcon className={`chevron-icon ${is_open ? "rotated" : ""}`} />
            </button>

            {is_open && (
                <div className="theme-dropdown">
                    {themes.map((theme) => (
                        <button
                            key={theme.alias}
                            type="button"
                            className={`theme-option ${theme.alias === current_theme.alias ? "selected" : ""}`}
                            onClick={() => handleThemeSelect(theme)}
                        >
                            <span className="theme-name">{theme.display_name}</span>
                            <span className="theme-icon">{getThemeIcon(theme.type)}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
