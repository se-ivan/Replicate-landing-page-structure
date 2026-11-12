import type { EventPhoto } from "@prisma/client";
import { defaultGalleryPhotos, safePhotoUrl, type EventPhotoInput, type EventPhotoItem } from "../data/gallery";
import { prisma } from "./prisma";

// Sample data is available only for local development without a database.
const memoryMode = import.meta.env.DEV && !import.meta.env.DATABASE_URL;
let memoryPhotos: EventPhotoItem[] = [...defaultGalleryPhotos];

function serializePhoto(record: EventPhoto): EventPhotoItem {
  return {
    ...record,
    takenAt: record.takenAt.toISOString(),
    creadoEn: record.creadoEn.toISOString(),
    actualizadoEn: record.actualizadoEn.toISOString(),
  };
}

function isDisallowedGraphicUrl(url: string): boolean {
  try {
    const pathname = new URL(url, "https://local.invalid").pathname.toLowerCase();
    return pathname.endsWith(".gif") || pathname.endsWith(".svg");
  } catch {
    return false;
  }
}

export function validateEventPhoto(data: unknown): string | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return "Los datos de la fotografía no son válidos.";
  }
  const input = data as Record<string, unknown>;

  if (typeof input.imageUrl !== "string" || !input.imageUrl.trim()) {
    return "Sube una fotografía válida para la galería.";
  }
  const cleanUrl = safePhotoUrl(input.imageUrl);
  if (!cleanUrl || isDisallowedGraphicUrl(cleanUrl)) {
    return "El archivo debe ser una fotografía válida (JPG, PNG, WEBP o AVIF).";
  }

  for (const field of ["id", "title", "eventName", "caption", "takenAt"]) {
    if (input[field] !== undefined && typeof input[field] !== "string") {
      return "Los datos de la fotografía no son válidos.";
    }
  }
  if (typeof input.title === "string" && input.title.trim().length > 160) {
    return "El título no debe superar 160 caracteres.";
  }
  if (typeof input.eventName === "string" && input.eventName.trim().length > 120) {
    return "El nombre del evento no debe superar 120 caracteres.";
  }
  if (typeof input.caption === "string" && input.caption.trim().length > 500) {
    return "La descripción no debe superar 500 caracteres.";
  }
  for (const field of ["featured", "published"]) {
    if (input[field] !== undefined && typeof input[field] !== "boolean") {
      return "La visibilidad de la fotografía no es válida.";
    }
  }
  if (input.takenAt !== undefined && (!input.takenAt || Number.isNaN(new Date(input.takenAt as string).getTime()))) {
    return "La fecha del evento no es válida.";
  }
  return null;
}

export async function getGalleryPhotos(includeUnpublished = true): Promise<EventPhotoItem[]> {
  if (memoryMode) {
    return memoryPhotos
      .filter((item) => includeUnpublished || item.published)
      .sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime();
      });
  }
  const records = await prisma.eventPhoto.findMany({
    where: includeUnpublished ? undefined : { published: true },
    orderBy: [{ featured: "desc" }, { takenAt: "desc" }, { creadoEn: "desc" }],
  });
  return records.map(serializePhoto);
}

export async function getPublishedGalleryPhotos(): Promise<EventPhotoItem[]> {
  try {
    return await getGalleryPhotos(false);
  } catch (error) {
    console.error("No se pudieron cargar las fotografías de la galería", error);
    return [];
  }
}

export async function getGalleryPhotoById(id: string): Promise<EventPhotoItem | null> {
  if (memoryMode) return memoryPhotos.find((item) => item.id === id) ?? null;
  const record = await prisma.eventPhoto.findUnique({ where: { id } });
  return record ? serializePhoto(record) : null;
}

export async function upsertGalleryPhoto(data: EventPhotoInput): Promise<EventPhotoItem> {
  const error = validateEventPhoto(data);
  if (error) throw new Error(error);

  const imageUrl = safePhotoUrl(data.imageUrl);
  if (!imageUrl) throw new Error("La fotografía no tiene una URL válida.");

  const id = data.id?.trim() || crypto.randomUUID();
  const values = {
    title: data.title?.trim() || "",
    eventName: data.eventName?.trim() || "",
    caption: data.caption?.trim() || "",
    imageUrl,
    featured: Boolean(data.featured),
    published: data.published !== false,
    takenAt: data.takenAt ? new Date(data.takenAt) : new Date(),
  };

  if (!memoryMode) {
    const record = await prisma.eventPhoto.upsert({
      where: { id },
      create: { id, ...values },
      update: values,
    });
    return serializePhoto(record);
  }

  const now = new Date().toISOString();
  const existing = memoryPhotos.find((item) => item.id === id);
  const item: EventPhotoItem = {
    id,
    ...values,
    takenAt: values.takenAt.toISOString(),
    creadoEn: existing?.creadoEn || now,
    actualizadoEn: now,
  };
  memoryPhotos = [item, ...memoryPhotos.filter((current) => current.id !== id)];
  return item;
}

export async function deleteGalleryPhoto(id: string): Promise<boolean> {
  if (!memoryMode) {
    const deleted = await prisma.eventPhoto.deleteMany({ where: { id } });
    return deleted.count > 0;
  }
  const previousLength = memoryPhotos.length;
  memoryPhotos = memoryPhotos.filter((item) => item.id !== id);
  return memoryPhotos.length < previousLength;
}

export async function toggleGalleryPhotoPublished(id: string, published: boolean): Promise<EventPhotoItem | null> {
  if (!memoryMode) {
    const updated = await prisma.eventPhoto.updateMany({ where: { id }, data: { published } });
    return updated.count > 0 ? getGalleryPhotoById(id) : null;
  }
  const item = memoryPhotos.find((current) => current.id === id);
  if (!item) return null;
  item.published = published;
  item.actualizadoEn = new Date().toISOString();
  return { ...item };
}
