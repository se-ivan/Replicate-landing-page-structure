import type { APIRoute } from "astro";
import { getArticles } from "../lib/articles";

export const prerender = false;

export const GET: APIRoute = async () => {
  const articles = await getArticles();
  const baseUrl = "https://plenitudemocional.com";

  const staticPages = [
    "",
    "/psicologia",
    "/abogados",
    "/articulos",
    "/agendar"
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (path) => `
  <url>
    <loc>${baseUrl}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path === "" ? "1.0" : "0.8"}</priority>
  </url>`
    )
    .join("")}
  ${articles
    .map(
      (article) => `
  <url>
    <loc>${baseUrl}/articulos/${article.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join("")}
</urlset>`.trim();

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
