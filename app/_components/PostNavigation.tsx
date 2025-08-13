import Link from "next/link";
import type { JSX } from "react";
import { type Post } from "../_lib/types/post";

interface PostNavigationProps {
    previous: Post | null;
    next: Post | null;
}

/**
 * Post navigation component with Previous and Next buttons
 */
export default function PostNavigation({ previous, next }: PostNavigationProps): JSX.Element {
    return (
        <nav className="post-navigation">
            <div className="nav-buttons">
                {previous ? (
                    <Link href={`/posts/${previous.slug}`} className="nav-button nav-previous">
                        <span className="nav-arrow">◀</span>
                        <div className="nav-content">
                            <span className="nav-label">Previous</span>
                            <span className="nav-title">{previous.title}</span>
                        </div>
                    </Link>
                ) : (
                    <div className="nav-button nav-disabled">
                        <span className="nav-arrow">◀</span>
                        <div className="nav-content">
                            <span className="nav-label">Previous</span>
                            <span className="nav-title">No previous post</span>
                        </div>
                    </div>
                )}

                {next ? (
                    <Link href={`/posts/${next.slug}`} className="nav-button nav-next">
                        <div className="nav-content">
                            <span className="nav-label">Next</span>
                            <span className="nav-title">{next.title}</span>
                        </div>
                        <span className="nav-arrow">▶</span>
                    </Link>
                ) : (
                    <div className="nav-button nav-disabled">
                        <div className="nav-content">
                            <span className="nav-label">Next</span>
                            <span className="nav-title">No next post</span>
                        </div>
                        <span className="nav-arrow">▶</span>
                    </div>
                )}
            </div>
        </nav>
    );
}
