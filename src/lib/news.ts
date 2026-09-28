import { defaultNews, type NewsItem, type NewsInput } from "../data/news";
import { prisma } from "./prisma";

// In-memory fallback cache for development or when database is not connected
let memoryNews: NewsItem[] = [...defaultNews];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function serializeNews(record: {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  imageUrl: string | null;
  linkUrl: string | null;
  linkText: string | null;
  featured: boolean;
  published: boolean;
  publishedAt: Date;
  creadoEn: Date;
  actualizadoEn: Date;
}): NewsItem {
  return {
    id: record.id,
    title: record.title,
    summary: record.summary,
    content: record.content,
    category: record.category,
    imageUrl: record.imageUrl,
    linkUrl: record.linkUrl,
    linkText: record.linkText,
    featured: record.featured,
    published: record.published,
    publishedAt: record.publishedAt.toISOString(),
    creadoEn: record.creadoEn.toISOString(),
    actualizadoEn: record.actualizadoEn.toISOString(),
  };
}

export function validateNews(data: NewsInput): string | null {
  if (!data.title?.trim()) return "El título es obligatorio.";
  if (!data.summary?.trim()) return "El resumen es obligatorio.";
  return null;
}

export async function getNews(includeUnpublished = true): Promise<NewsItem[]> {
  try {
    // Attempt to query from Prisma
    const query = includeUnpublished ? {} : { where: { published: true } };
    // @ts-expect-error news might be generated dynamically by prisma client
    if (prisma.news) {
      // @ts-expect-error dynamic access
      const dbNews = await prisma.news.findMany({
        ...query,
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      });
      if (Array.isArray(dbNews)) {
        return dbNews.map(serializeNews);
      }
    }
  } catch (err) {
    console.warn("Prisma news query fallback to in-memory/default news:", err);
  }

  // Fallback to in-memory news
  const items = includeUnpublished ? memoryNews : memoryNews.filter((n) => n.published);
  return [...items].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export async function getPublishedNews(): Promise<NewsItem[]> {
  return getNews(false);
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  try {
    // @ts-expect-error dynamic access
    if (prisma.news) {
      // @ts-expect-error dynamic access
      const dbNews = await prisma.news.findUnique({ where: { id } });
      if (dbNews) return serializeNews(dbNews);
    }
  } catch (err) {
    console.warn("Prisma getNewsById fallback:", err);
  }

  return memoryNews.find((n) => n.id === id) ?? null;
}

export async function upsertNews(data: NewsInput): Promise<NewsItem> {
  const title = data.title.trim();
  const id = (data.id?.trim() || slugify(title) || crypto.randomUUID()).toLowerCase();
  const summary = data.summary.trim();
  const content = data.content?.trim() || "";
  const category = data.category?.trim() || "General";
  const imageUrl = data.imageUrl?.trim() || null;
  const linkUrl = data.linkUrl?.trim() || null;
  const linkText = data.linkText?.trim() || "Más información";
  const featured = Boolean(data.featured);
  const published = data.published !== false;
  const publishedAt = data.publishedAt ? new Date(data.publishedAt) : new Date();

  try {
    // @ts-expect-error dynamic access
    if (prisma.news) {
      // @ts-expect-error dynamic access
      const record = await prisma.news.upsert({
        where: { id },
        create: {
          id,
          title,
          summary,
          content,
          category,
          imageUrl,
          linkUrl,
          linkText,
          featured,
          published,
          publishedAt,
        },
        update: {
          title,
          summary,
          content,
          category,
          imageUrl,
          linkUrl,
          linkText,
          featured,
          published,
          publishedAt,
        },
      });
      return serializeNews(record);
    }
  } catch (err) {
    console.warn("Prisma upsertNews fallback to memory:", err);
  }

  // In-memory fallback
  const now = new Date().toISOString();
  const existingIndex = memoryNews.findIndex((n) => n.id === id);
  const item: NewsItem = {
    id,
    title,
    summary,
    content,
    category,
    imageUrl,
    linkUrl,
    linkText,
    featured,
    published,
    publishedAt: publishedAt.toISOString(),
    creadoEn: existingIndex >= 0 ? memoryNews[existingIndex].creadoEn : now,
    actualizadoEn: now,
  };

  if (existingIndex >= 0) {
    memoryNews[existingIndex] = item;
  } else {
    memoryNews = [item, ...memoryNews];
  }

  return item;
}

export async function deleteNews(id: string): Promise<boolean> {
  try {
    // @ts-expect-error dynamic access
    if (prisma.news) {
      // @ts-expect-error dynamic access
      const deleted = await prisma.news.deleteMany({ where: { id } });
      if (deleted.count > 0) return true;
    }
  } catch (err) {
    console.warn("Prisma deleteNews fallback to memory:", err);
  }

  const prevLen = memoryNews.length;
  memoryNews = memoryNews.filter((n) => n.id !== id);
  return memoryNews.length < prevLen;
}

export async function toggleNewsPublished(id: string, published: boolean): Promise<NewsItem | null> {
  try {
    // @ts-expect-error dynamic access
    if (prisma.news) {
      // @ts-expect-error dynamic access
      const updated = await prisma.news.update({
        where: { id },
        data: { published },
      });
      return serializeNews(updated);
    }
  } catch (err) {
    console.warn("Prisma toggleNewsPublished fallback to memory:", err);
  }

  const index = memoryNews.findIndex((n) => n.id === id);
  if (index >= 0) {
    memoryNews[index] = {
      ...memoryNews[index],
      published,
      actualizadoEn: new Date().toISOString(),
    };
    return memoryNews[index];
  }

  return null;
}
