"use client";

import { useEffect } from "react";
import type { JSX } from "react";

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

/**
 * Global error boundary component for handling application errors
 */
export default function ErrorPage({ error }: ErrorPageProps): JSX.Element {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Application error:", error);
    }, [error]);

    return (
        <div>
            <p>Application Error 😩</p>
            <p>Tell SleepyBoy to fix it.</p>
        </div>
    );
}
