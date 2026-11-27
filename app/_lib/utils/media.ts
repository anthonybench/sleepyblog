/**
 * Matches a photo on the site's media host: https://media.sleepyblog.org/<id>.<ext>
 * GIFs and videos have no resized copy.
 */
const MEDIA_IMAGE_URL = /^(https:\/\/media\.sleepyblog\.org\/[A-Za-z0-9]+)(\.(?:jpe?g|png))$/i;

/**
 * Returns the 1024px resized copy of a media-host photo ("h" suffix, made by
 * `add_media.py`), which is far smaller than the original; other URLs are returned
 * unchanged.
 */
export function getThumbnailUrl(url: string): string {
    return url.replace(MEDIA_IMAGE_URL, "$1h$2");
}
