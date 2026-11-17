import Link from "next/link";
import type { JSX } from "react";

/** A page the Previous or Next button links to */
export interface NavTarget {
    href: string;
    title: string;
}

interface PrevNextNavigationProps {
    previous: NavTarget | null;
    next: NavTarget | null;
    /** What's being paged through, for the disabled text ("No previous post") */
    noun: string;
}

/**
 * Previous / Next buttons at the bottom of a post or project page
 */
export default function PrevNextNavigation({
    previous,
    next,
    noun,
}: PrevNextNavigationProps): JSX.Element {
    return (
        <nav className="post-navigation">
            <div className="nav-buttons">
                {previous ? (
                    <Link href={previous.href} className="nav-button nav-previous">
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
                            <span className="nav-title">No previous {noun}</span>
                        </div>
                    </div>
                )}

                {next ? (
                    <Link href={next.href} className="nav-button nav-next">
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
                            <span className="nav-title">No next {noun}</span>
                        </div>
                        <span className="nav-arrow">▶</span>
                    </div>
                )}
            </div>
        </nav>
    );
}
