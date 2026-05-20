export const prerender = false;
import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { getArticles, upsertArticle, validateArticle } from "../../lib/articles";

const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" };

export const GET: APIRoute = async ({ request }) => {
  const session = await getSession(request);
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
      headers: JSON_HEADERS,
    });
  }

  const articles = await getArticles();
  return new Response(JSON.stringify(articles), {
    status: 200,
    headers: JSON_HEADERS,
  });
};

export const POST: APIRoute = async ({ request }) => {
  const session = await getSession(request);
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
      headers: JSON_HEADERS,
    });
  }

  try {
    const body = await request.json();
    const error = validateArticle(body);

    if (error) {
      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: JSON_HEADERS,
      });
    }

    const article = await upsertArticle(body);
    return new Response(JSON.stringify({ success: true, article }), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch (error) {
    console.error("Error saving article", error);
    return new Response(JSON.stringify({ error: "Error al guardar el articulo." }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }
};
