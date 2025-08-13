import Link from "next/link";
import type { JSX } from "react";
import ThemeSelector from "@/app/_components/ThemeSelector";
import HamburgerMenu from "@/app/_components/HamburgerMenu";

interface HeaderProps {
    is_mobile_menu_open: boolean;
    onMobileMenuToggle: () => void;
}

/**
 * Header component containing hamburger menu, title/home link and theme selector
 */
export default function Header({
    is_mobile_menu_open,
    onMobileMenuToggle,
}: HeaderProps): JSX.Element {
    return (
        <header className="header">
            <div className="header-left">
                <HamburgerMenu is_open={is_mobile_menu_open} onToggle={onMobileMenuToggle} />
                <Link href="/" className="header-title">
                    <h1 className="text-2xl md:text-4xl lg:text-6xl">SleepyBlog</h1>
                </Link>
            </div>
            <ThemeSelector />
        </header>
    );
}
