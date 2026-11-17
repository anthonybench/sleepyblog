"use client";

import { useState, type JSX } from "react";

const COPIED_RESET_MS = 2000;

/**
 * A terminal-style install command with a button that copies it to the clipboard
 */
export default function CopyCommand({ command }: { command: string }): JSX.Element {
    const [copied, setCopied] = useState(false);

    const copy = async (): Promise<void> => {
        try {
            await navigator.clipboard.writeText(command);
            setCopied(true);
            setTimeout(() => setCopied(false), COPIED_RESET_MS);
        } catch {
            // clipboard blocked (e.g. insecure context); the command is still selectable
        }
    };

    return (
        <div className="copy-command">
            <code>
                <span className="terminal-prompt">$</span> {command}
            </code>
            <button type="button" onClick={copy} aria-label={`Copy "${command}"`}>
                {copied ? "copied ✓" : "copy"}
            </button>
        </div>
    );
}
