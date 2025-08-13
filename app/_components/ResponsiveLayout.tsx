"use client";

import { useState, useEffect, type ReactNode, type JSX } from "react";
import Header from "./Header";
import SideNav from "./SideNav";

interface ResponsiveLayoutProps {
    children: ReactNode;
}

/**
 * Responsive layout component that handles mobile navigation state
 */
export default function ResponsiveLayout({ children }: ResponsiveLayoutProps): JSX.Element {
    const [is_mobile_menu_open, setIsMobileMenuOpen] = useState(false);

    const handleMobileMenuToggle = (): void => {
        setIsMobileMenuOpen(!is_mobile_menu_open);
    };

    const handleMobileMenuClose = (): void => {
        setIsMobileMenuOpen(false);
    };

    // Close mobile menu when clicking overlay
    const handleOverlayClick = (): void => {
        setIsMobileMenuOpen(false);
    };

    // Close mobile menu on escape key
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent): void => {
            if (event.key === "Escape") {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener("keydown", handleEscapeKey);
        return () => document.removeEventListener("keydown", handleEscapeKey);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (is_mobile_menu_open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [is_mobile_menu_open]);

    return (
        <>
            <div className="layout-container">
                <SideNav
                    is_mobile_open={is_mobile_menu_open}
                    onMobileClose={handleMobileMenuClose}
                />
                <div className="main-content">
                    <Header
                        is_mobile_menu_open={is_mobile_menu_open}
                        onMobileMenuToggle={handleMobileMenuToggle}
                    />
                    <main className="content">{children}</main>
                </div>
            </div>

            {/* Mobile overlay */}
            <div
                className={`mobile-overlay ${is_mobile_menu_open ? "active" : ""}`}
                onClick={handleOverlayClick}
                aria-hidden="true"
            />
        </>
    );
}
