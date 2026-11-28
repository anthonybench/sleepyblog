/**
 * The /furniture gallery's tabs, in display order.
 * Keep in sync with FURNITURE_CATEGORIES in _tools/add_media.py.
 */
export const furnitureCategories = [
    "tables",
    "shelving",
    "cabinetry",
    "trim",
    "seating",
    "not-furniture",
] as const;

export type FurnitureCategory = (typeof furnitureCategories)[number];

/**
 * One photo in the gallery, parsed from `_furniture/gallery.yml`
 */
export interface FurniturePhoto {
    /** The full-size photo on the media host */
    url: string;
    /** Pixel size of the full-size photo, so the layout doesn't jump while loading */
    width: number;
    height: number;
    category: FurnitureCategory;
    caption?: string;
    /** Shown full width at the top of its category */
    featured: boolean;
}
