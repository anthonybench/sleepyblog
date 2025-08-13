import type { JSX } from "react";

/**
 * Global loading component shown during navigation
 */
export default function Loading(): JSX.Element {
    return (
        <div
            className="flex flex-col items-center justify-center py-16 min-h-[200px]"
            aria-busy="true"
            aria-live="polite"
        >
            <div
                className="animate-spin rounded-full h-12 w-12 border-4"
                style={{
                    borderColor: "var(--content-border)",
                    borderTopColor: "var(--accent-primary)",
                }}
                role="status"
                aria-label="Loading"
            />
            <div className="mt-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                Loading...
            </div>
        </div>
    );
}
