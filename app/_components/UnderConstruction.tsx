import Image from "next/image";
import type { JSX } from "react";

/**
 * Under construction component for pages that are not yet ready
 */
export function UnderConstruction(): JSX.Element {
    return (
        <div className="flex justify-center">
            <Image
                src="/static/sleepyboy_under_construction.gif"
                width={750}
                height={750}
                className="p-20"
                alt="Under Construction"
            />
        </div>
    );
}
