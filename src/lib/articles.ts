import type { Prisma } from "@prisma/client";
import { articles as defaultArticles, type Article, type ArticleAudience, type ArticleSection } from "../data/articles";
import { prisma } from "./prisma";

export type ArticleInput = Omit<Article, "id"> & {
  id?: string;
};

export const ARTICLE_AUDIENCES: ArticleAudience[] = ["ambos", "psicologia", "legal"];

function normalizeAudience(value: unknown): ArticleAudience {
  return ARTICLE_AUDIENCES.includes(value as ArticleAudience) ? value as ArticleAudience : "ambos";
}

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

function parseTags(value: Prisma.JsonValue): string[] {
  return Array.isArray(value) ? value.filter((tag): tag is string => typeof tag === "string") : [];
}

function parseSections(value: Prisma.JsonValue): ArticleSection[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((section) => {
      if (!section || typeof section !== "object" || Array.isArray(section)) return null;
      const record = section as Record<string, unknown>;
      const heading = typeof record.heading === "string" ? record.heading : "";
      const navLabel = typeof record.navLabel === "string" ? record.navLabel : undefined;
      const navLabels = Array.isArray(record.navLabels)
        ? record.navLabels.filter((label): label is string => typeof label === "string")
        : undefined;
      const paragraphs = Array.isArray(record.paragraphs)
        ? record.paragraphs.filter((paragraph): paragraph is string => typeof paragraph === "string")
        : [];

      return heading ? { heading, navLabel, navLabels, paragraphs } : null;
    })
    .filter((section): section is ArticleSection => Boolean(section));
}

function serializeArticle(article: {
  id: string;
  title: string;
  desc: string;
  audience: string;
  tags: Prisma.JsonValue;
  img: string;
  intro: string;
  readingTimeMinutes: number | null;
  headerMeta: string;
  tocTitle: string;
  sections: Prisma.JsonValue;
}): Article {
  return {
    id: article.id,
    title: article.title,
    desc: article.desc,
    audience: normalizeAudience(article.audience),
    tags: parseTags(article.tags),
    img: article.img,
    intro: article.intro,
    readingTimeMinutes: article.readingTimeMinutes,
    headerMeta: article.headerMeta,
    tocTitle: article.tocTitle,
    sections: parseSections(article.sections),
  };
}

function normalizeArticleInput(data: ArticleInput): Article {
  const title = data.title.trim();
  const id = (data.id?.trim() || slugify(title)).toLowerCase();

  return {
    id,
    title,
    desc: data.desc.trim(),
    audience: normalizeAudience(data.audience),
    tags: data.tags.map((tag) => tag.trim()).filter(Boolean),
    img: data.img.trim(),
    intro: data.intro.trim(),
    readingTimeMinutes: data.readingTimeMinutes ? Math.max(1, Math.round(data.readingTimeMinutes)) : null,
    headerMeta: data.headerMeta?.trim() || "Guia practica para Morelia, Michoacan",
    tocTitle: data.tocTitle?.trim() || "En este articulo",
    sections: data.sections
      .map((section) => ({
        heading: section.heading.trim(),
        navLabels: (
          section.navLabels?.length
            ? section.navLabels.map((label) => label.trim()).filter(Boolean)
            : section.navLabel?.split(/[,\n]/).map((label) => label.trim()).filter(Boolean)
        ) || undefined,
        paragraphs: section.paragraphs.map((paragraph) => paragraph.trim()).filter(Boolean),
      }))
      .filter((section) => section.heading && section.paragraphs.length > 0),
  };
}

export function validateArticle(data: ArticleInput): string | null {
  if (!data.title?.trim()) return "El titulo es requerido.";
  if (!data.desc?.trim()) return "La descripcion es requerida.";
  if (!ARTICLE_AUDIENCES.includes(data.audience)) return "Selecciona donde se mostrara el articulo.";
  if (!data.img?.trim()) return "La imagen principal es requerida.";
  if (!data.intro?.trim()) return "La introduccion es requerida.";
  if (!Array.isArray(data.tags) || data.tags.filter((tag) => tag.trim()).length === 0) {
    return "Agrega al menos una etiqueta.";
  }
  if (!Array.isArray(data.sections) || data.sections.length === 0) {
    return "Agrega al menos una seccion.";
  }
  if (data.sections.some((section) => !section.heading?.trim())) {
    return "Todas las secciones necesitan titulo.";
  }
  if (data.sections.some((section) => !Array.isArray(section.paragraphs) || section.paragraphs.filter((paragraph) => paragraph.trim()).length === 0)) {
    return "Todas las secciones necesitan al menos un parrafo.";
  }
  return null;
}

export function filterArticlesByAudience(articles: Article[], audience: ArticleAudience): Article[] {
  return articles.filter((article) => article.audience === "ambos" || article.audience === audience);
}

export function filterArticlesByExactAudience(articles: Article[], audience: ArticleAudience): Article[] {
  return articles.filter((article) => article.audience === audience);
}

export async function getArticles(): Promise<Article[]> {
  const dbArticles = await prisma.article.findMany({
    orderBy: { actualizadoEn: "desc" },
  });
  const overrides = new Map(dbArticles.map((article) => [article.id, serializeArticle(article)]));
  const baseArticles = defaultArticles.map((article) => overrides.get(article.id) ?? article);
  const createdArticles = dbArticles
    .map(serializeArticle)
    .filter((article) => !defaultArticles.some((defaultArticle) => defaultArticle.id === article.id));

  return [...createdArticles, ...baseArticles];
}

export async function getArticlesForAudience(audience: ArticleAudience): Promise<Article[]> {
  return filterArticlesByAudience(await getArticles(), audience);
}

export async function getArticlesForExactAudience(audience: ArticleAudience): Promise<Article[]> {
  return filterArticlesByExactAudience(await getArticles(), audience);
}

export async function getArticleById(id: string): Promise<Article | null> {
  const dbArticle = await prisma.article.findUnique({ where: { id } });
  if (dbArticle) return serializeArticle(dbArticle);

  return defaultArticles.find((article) => article.id === id) ?? null;
}

export async function upsertArticle(data: ArticleInput): Promise<Article> {
  const normalized = normalizeArticleInput(data);
  const article = await prisma.article.upsert({
    where: { id: normalized.id },
    create: {
      ...normalized,
      tags: normalized.tags,
      sections: normalized.sections,
    },
    update: {
      title: normalized.title,
      desc: normalized.desc,
      audience: normalized.audience,
      tags: normalized.tags,
      img: normalized.img,
      intro: normalized.intro,
      readingTimeMinutes: normalized.readingTimeMinutes,
      headerMeta: normalized.headerMeta,
      tocTitle: normalized.tocTitle,
      sections: normalized.sections,
    },
  });

  return serializeArticle(article);
}

export async function deleteArticle(id: string): Promise<boolean> {
  const deleted = await prisma.article.deleteMany({ where: { id } });
  return deleted.count > 0;
}
