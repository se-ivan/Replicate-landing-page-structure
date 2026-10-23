import type { News } from "@prisma/client";
import { defaultNews, safeNewsUrl, type NewsItem, type NewsInput } from "../data/news";
import { prisma } from "./prisma";

// Sample data is available only for local development without a database.
// Production writes must reach the database before reporting success.
const memoryMode = import.meta.env.DEV && !import.meta.env.DATABASE_URL;
let memoryNews: NewsItem[] = [...defaultNews];

function serializeNews(record: News): NewsItem {
  return {
    ...record,
    publishedAt: record.publishedAt.toISOString(),
    creadoEn: record.creadoEn.toISOString(),
    actualizadoEn: record.actualizadoEn.toISOString(),
  };
}

export function validateNews(data: unknown): string | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) return "Los datos del anuncio no son válidos.";
  const input = data as Record<string, unknown>;
  if (typeof input.title !== "string" || !input.title.trim()) return "El título es obligatorio.";
  if (input.title.trim().length > 200) return "El título no debe superar 200 caracteres.";
  for (const field of ["id", "summary", "content", "category", "publishedAt"]) {
    if (input[field] !== undefined && typeof input[field] !== "string") return "Los datos del anuncio no son válidos.";
  }
  for (const field of ["imageUrl", "linkUrl", "linkText"]) {
    if (input[field] !== undefined && input[field] !== null && typeof input[field] !== "string") return "Los enlaces del anuncio no son válidos.";
  }
  for (const field of ["featured", "published"]) {
    if (input[field] !== undefined && typeof input[field] !== "boolean") return "La visibilidad del anuncio no es válida.";
  }
  if (!(input.imageUrl as string | undefined)?.trim() && !(input.summary as string | undefined)?.trim()) {
    return "Sube una imagen o escribe una descripción para el anuncio.";
  }
  for (const field of ["imageUrl", "linkUrl"]) {
    const value = input[field] as string | null | undefined;
    if (value?.trim() && !safeNewsUrl(value)) return "Usa enlaces http(s) o rutas del sitio para la imagen y el anuncio.";
  }
  if (input.publishedAt !== undefined && (!input.publishedAt || Number.isNaN(new Date(input.publishedAt as string).getTime()))) {
    return "La fecha del anuncio no es válida.";
  }
  return null;
}

export async function getNews(includeUnpublished = true): Promise<NewsItem[]> {
  if (memoryMode) {
    return memoryNews.filter((item) => includeUnpublished || item.published).sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }
  const records = await prisma.news.findMany({
    where: includeUnpublished ? undefined : { published: true },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });
  return records.map(serializeNews);
}

export async function getPublishedNews(): Promise<NewsItem[]> {
  try {
    return await getNews(false);
  } catch (error) {
    console.error("No se pudieron cargar los anuncios publicados", error);
    return [];
  }
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  if (memoryMode) return memoryNews.find((item) => item.id === id) ?? null;
  const record = await prisma.news.findUnique({ where: { id } });
  return record ? serializeNews(record) : null;
}

export async function upsertNews(data: NewsInput): Promise<NewsItem> {
  const error = validateNews(data);
  if (error) throw new Error(error);
  const id = data.id?.trim() || crypto.randomUUID();
  const values = {
    title: data.title.trim(),
    summary: data.summary?.trim() || "",
    content: data.content?.trim() || "",
    category: data.category?.trim() || "General",
    imageUrl: safeNewsUrl(data.imageUrl),
    linkUrl: safeNewsUrl(data.linkUrl),
    linkText: data.linkText?.trim() || "Más información",
    featured: Boolean(data.featured),
    published: data.published !== false,
    publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
  };

  if (!memoryMode) {
    const record = await prisma.news.upsert({
      where: { id },
      create: { id, ...values },
      update: values,
    });
    return serializeNews(record);
  }

  const now = new Date().toISOString();
  const existing = memoryNews.find((item) => item.id === id);
  const item: NewsItem = {
    id,
    ...values,
    publishedAt: values.publishedAt.toISOString(),
    creadoEn: existing?.creadoEn || now,
    actualizadoEn: now,
  };
  memoryNews = [item, ...memoryNews.filter((current) => current.id !== id)];
  return item;
}

export async function deleteNews(id: string): Promise<boolean> {
  if (!memoryMode) {
    const deleted = await prisma.news.deleteMany({ where: { id } });
    return deleted.count > 0;
  }
  const previousLength = memoryNews.length;
  memoryNews = memoryNews.filter((item) => item.id !== id);
  return memoryNews.length < previousLength;
}

export async function toggleNewsPublished(id: string, published: boolean): Promise<NewsItem | null> {
  if (!memoryMode) {
    const updated = await prisma.news.updateMany({ where: { id }, data: { published } });
    return updated.count > 0 ? getNewsById(id) : null;
  }
  const item = memoryNews.find((current) => current.id === id);
  if (!item) return null;
  item.published = published;
  item.actualizadoEn = new Date().toISOString();
  return { ...item };
}
