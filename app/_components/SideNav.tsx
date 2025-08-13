"use client";

import Link from "next/link";
import Image from "next/image";
import type { JSX } from "react";
import { useTheme } from "@/app/_lib/utils/themeContext";
import { dataConfig } from "@/app/_lib/utils/dataConfig";
import {
    HomeIcon,
    IdentificationIcon,
    CodeBracketIcon,
    WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

interface SideNavProps {
    is_mobile_open: boolean;
    onMobileClose: () => void;
}

/**
 * Side navigation component containing logo, nav links, and footer
 */
export default function SideNav({ is_mobile_open, onMobileClose }: SideNavProps): JSX.Element {
    const { current_theme } = useTheme();
    const image_path = current_theme.type === "dark" ? "/dark" : "/light";

    const handleLinkClick = (): void => {
        // Close mobile menu when a link is clicked
        onMobileClose();
    };

    return (
        <nav className={`sidenav ${is_mobile_open ? "mobile-open" : ""}`}>
            {/* Logo */}
            <div className="sidenav-logo">
                <Image
                    src={`${image_path}/sleepyboy_technologist.png`}
                    alt="SleepyBoy Technologist Logo"
                    width={1000}
                    height={1000}
                    priority
                />
            </div>

            {/* Navigation Links */}
            <div className="sidenav-links">
                <Link href="/" className="sidenav-link" onClick={handleLinkClick}>
                    <span className="sidenav-link-text">Home</span>
                    <HomeIcon className="sidenav-link-icon" />
                </Link>
                <Link href="/about" className="sidenav-link" onClick={handleLinkClick}>
                    <span className="sidenav-link-text">About</span>
                    <IdentificationIcon className="sidenav-link-icon" />
                </Link>
                <Link href="/software" className="sidenav-link" onClick={handleLinkClick}>
                    <span className="sidenav-link-text">Software</span>
                    <CodeBracketIcon className="sidenav-link-icon" />
                </Link>
                <Link href="/furniture" className="sidenav-link" onClick={handleLinkClick}>
                    <span className="sidenav-link-text">Furniture</span>
                    <WrenchScrewdriverIcon className="sidenav-link-icon" />
                </Link>
            </div>

            {/* Footer */}
            <div className="sidenav-footer">
                <div className="sidenav-footer-text">
                    <p>Authored by</p>
                    <p>
                        <em>Isaac Yep</em>
                    </p>
                    <br />
                    <p>Last updated</p>
                    <p>
                        <em>{dataConfig.last_updated}</em>
                    </p>
                </div>
                <Link
                    href={dataConfig.github_source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sidenav-github-link"
                >
                    <Image src={`${image_path}/github.png`} alt="GitHub" width={40} height={40} />
                </Link>
            </div>
        </nav>
    );
}
