import { matchesImageSignature } from "./image-signatures";

export const NEWS_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
// Leave room for multipart headers within the hosting provider's request limit.
export const MAX_NEWS_IMAGE_SIZE = 4 * 1024 * 1024;

export function validateNewsImage(type: string, size: number): string | null {
  if (!NEWS_IMAGE_TYPES.includes(type)) return "Usa una imagen JPG, PNG, WEBP, GIF o AVIF.";
  if (size === 0) return "La imagen está vacía. Selecciona otro archivo.";
  if (size > MAX_NEWS_IMAGE_SIZE) return "La imagen no debe superar 4 MB.";
  return null;
}

export function matchesNewsImageType(bytes: Uint8Array, type: string): boolean {
  return NEWS_IMAGE_TYPES.includes(type) && matchesImageSignature(bytes, type);
}
