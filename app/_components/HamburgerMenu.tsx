"use client";

import type { JSX } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

interface HamburgerMenuProps {
    is_open: boolean;
    onToggle: () => void;
}

/**
 * Hamburger menu button component for mobile navigation
 */
export default function HamburgerMenu({ is_open, onToggle }: HamburgerMenuProps): JSX.Element {
    return (
        <button
            type="button"
            className="hamburger-button"
            onClick={onToggle}
            aria-label={is_open ? "Close menu" : "Open menu"}
            aria-expanded={is_open}
        >
            {is_open ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
    );
}
