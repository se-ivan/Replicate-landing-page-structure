import { matchesImageSignature } from "./image-signatures";

// Only still photograph raster formats are allowed (no videos, GIFs, SVGs, or documents).
export const GALLERY_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;
export const GALLERY_PHOTO_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "avif"]);
export const MAX_GALLERY_PHOTO_SIZE = 4 * 1024 * 1024;

export function validateGalleryPhoto(type: string, size: number, fileName?: string): string | null {
  const normalizedType = type.trim().toLowerCase();

  if (fileName) {
    const parts = fileName.trim().toLowerCase().split(".");
    if (parts.length > 1) {
      const ext = parts.pop() || "";
      if (!GALLERY_PHOTO_EXTENSIONS.has(ext)) {
        return "Solo se permiten fotografías (JPG, PNG, WEBP o AVIF). No se admiten videos, GIFs ni otros archivos.";
      }
    }
  }

  if (normalizedType.startsWith("video/")) {
    return "No se permiten videos. Sube únicamente fotografías (JPG, PNG, WEBP o AVIF).";
  }
  if (normalizedType === "image/gif") {
    return "No se permiten imágenes animadas GIF. Sube únicamente fotografías (JPG, PNG, WEBP o AVIF).";
  }
  if (normalizedType === "image/svg+xml") {
    return "No se permiten archivos SVG. Sube únicamente fotografías (JPG, PNG, WEBP o AVIF).";
  }
  if (!GALLERY_PHOTO_TYPES.includes(normalizedType as (typeof GALLERY_PHOTO_TYPES)[number])) {
    return "Solo se permiten fotografías en formato JPG, PNG, WEBP o AVIF.";
  }
  if (size === 0) return "La fotografía está vacía. Selecciona otro archivo.";
  if (size > MAX_GALLERY_PHOTO_SIZE) return "Cada fotografía no debe superar 4 MB.";
  return null;
}

export function matchesGalleryPhotoType(bytes: Uint8Array, type: string): boolean {
  const normalizedType = type.trim().toLowerCase();
  if (!GALLERY_PHOTO_TYPES.includes(normalizedType as (typeof GALLERY_PHOTO_TYPES)[number])) {
    return false;
  }
  return matchesImageSignature(bytes, normalizedType);
}
