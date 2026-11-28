import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import {
    type FurnitureCategory,
    type FurniturePhoto,
    furnitureCategories,
} from "@/app/_lib/types/furniture";

const GALLERY_FILE = path.join(process.cwd(), "_furniture", "gallery.yml");

/**
 * Get every photo in `_furniture/gallery.yml`, in file order. Mistakes throw instead
 * of being skipped, so a broken entry fails the build rather than vanishing.
 */
export function getFurniturePhotos(): FurniturePhoto[] {
    if (!fs.existsSync(GALLERY_FILE)) {
        return [];
    }
    const data = yaml.load(fs.readFileSync(GALLERY_FILE, "utf8")) as {
        photos?: unknown[] | null;
    } | null;

    return (data?.photos ?? []).map((entry, index) => {
        const photo = (entry ?? {}) as Record<string, unknown>;
        const fail = (problem: string): never => {
            throw new Error(`_furniture/gallery.yml: photos[${index}] ${problem}`);
        };

        if (typeof photo.url !== "string" || !photo.url.startsWith("https://")) {
            fail(`needs a "url" starting with https://`);
        }
        for (const field of ["width", "height"]) {
            if (!Number.isInteger(photo[field]) || (photo[field] as number) <= 0) {
                fail(`needs "${field}" as a whole number of pixels`);
            }
        }
        if (!furnitureCategories.includes(photo.category as FurnitureCategory)) {
            fail(`"category" must be one of: ${furnitureCategories.join(", ")}`);
        }
        const caption = photo.caption == null ? "" : String(photo.caption).trim();

        return {
            url: photo.url as string,
            width: photo.width as number,
            height: photo.height as number,
            category: photo.category as FurnitureCategory,
            ...(caption && { caption }),
            featured: photo.featured === true,
        };
    });
}
