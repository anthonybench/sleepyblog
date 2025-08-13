import type { JSX } from "react";
import Link from "next/link";

/**
 * Global not found page for routes that don't exist
 */
export default function NotFound(): JSX.Element {
    return (
        <article className="post-page">
            <header className="post-header">
                <h1 className="post-title">Page Not Found</h1>
            </header>
            <div className="no-posts">The page you requested could not be found.</div>
            <nav className="post-navigation">
                <div className="nav-buttons">
                    <Link href="/" className="nav-button">
                        ← Back to Home
                    </Link>
                    <Link href="/" className="nav-button">
                        Browse Posts
                    </Link>
                </div>
            </nav>
        </article>
    );
}
