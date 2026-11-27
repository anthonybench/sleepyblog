import type { JSX } from "react";
import type { Metadata } from "next";
import { dataConfig } from "@/app/_lib/utils/dataConfig";
import { getFurniturePhotos } from "@/app/_lib/utils/furniture";
import FurnitureGallery from "@/app/_components/FurnitureGallery";

const DESCRIPTION = `Furniture and other woodworking by ${dataConfig.author_name}.`;

export const metadata: Metadata = {
    title: "Furniture",
    description: DESCRIPTION,
    alternates: {
        canonical: "/furniture",
    },
    openGraph: {
        type: "website",
        url: `${dataConfig.site_url}/furniture`,
        title: `Furniture | ${dataConfig.site_name}`,
        description: DESCRIPTION,
        siteName: dataConfig.site_name,
    },
};

/**
 * /furniture: a photo gallery of woodworking, one tab per category.
 * Photos come from `_furniture/gallery.yml` (see _docs/furniture_gallery.md).
 */
export default function FurniturePage(): JSX.Element {
    return (
        <div className="furniture-page">
            <header className="furniture-header">
                <h1>Furniture</h1>
                <p>Things I&apos;ve built out of (mostly) wood.</p>
            </header>
            <FurnitureGallery photos={getFurniturePhotos()} />
        </div>
    );
}
