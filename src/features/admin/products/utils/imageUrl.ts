/**
 * A small, compressed copy of a Cloudinary image (for table thumbnails).
 * Other image URLs are returned unchanged.
 */
export function cloudinaryThumb(url: string | undefined, width: number): string {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_limit/`);
}