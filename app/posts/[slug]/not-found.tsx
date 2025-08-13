import type { JSX } from "react";
import Link from "next/link";

/**
 * Not found page for blog posts that don't exist
 */
export default function BlogPostNotFound(): JSX.Element {
    return (
        <article className="post-page">
            <header className="post-header">
                <h1 className="post-title">Post Not Found</h1>
            </header>
            <div className="no-posts">
                The post you are looking for does not exist, was removed, or the URL is incorrect.
            </div>
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
