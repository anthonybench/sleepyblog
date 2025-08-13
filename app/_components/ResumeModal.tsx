"use client";

import { useEffect, type JSX, type ReactNode } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ResumeModalProps {
    is_open: boolean;
    onClose: () => void;
    resume_url: string;
    children?: ReactNode;
}

/**
 * Modal component that displays resume in an iframe
 */
export default function ResumeModal({
    is_open,
    onClose,
    resume_url,
}: ResumeModalProps): JSX.Element | null {
    // Close modal on escape key
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent): void => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (is_open) {
            document.addEventListener("keydown", handleEscapeKey);
            // Prevent body scroll when modal is open
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscapeKey);
            document.body.style.overflow = "unset";
        };
    }, [is_open, onClose]);

    if (!is_open) return null;

    return (
        <div className="resume-modal-overlay" onClick={onClose}>
            <div className="resume-modal" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="resume-modal-header">
                    <h3 className="text-2xl font-bold">My Personal Resume</h3>
                    <p className="text-sm">Looking forward to speaking with you 😊</p>
                    <button
                        type="button"
                        className="resume-modal-close"
                        onClick={onClose}
                        aria-label="Close resume modal"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="resume-modal-content">
                    <iframe
                        src={resume_url}
                        className="resume-iframe"
                        title="Isaac Yep Resume"
                        loading="lazy"
                    />
                </div>

                {/* Modal Footer */}
                <div className="resume-modal-footer">
                    <a
                        href={resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resume-download-link"
                    >
                        Open in New Tab
                    </a>
                </div>
            </div>
        </div>
    );
}
