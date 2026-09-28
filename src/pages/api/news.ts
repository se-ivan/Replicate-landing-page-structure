export const prerender = false;
import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { getNews, getPublishedNews, upsertNews, validateNews } from "../../lib/news";

const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" };

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const showAll = url.searchParams.get("all") === "true";

  if (showAll) {
    const session = await getSession(request);
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: JSON_HEADERS,
      });
    }
    const news = await getNews(true);
    return new Response(JSON.stringify(news), {
      status: 200,
      headers: JSON_HEADERS,
    });
  }

  const news = await getPublishedNews();
  return new Response(JSON.stringify(news), {
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
    const error = validateNews(body);

    if (error) {
      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: JSON_HEADERS,
      });
    }

    const news = await upsertNews(body);
    return new Response(JSON.stringify({ success: true, news }), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch (error) {
    console.error("Error al guardar la noticia", error);
    return new Response(JSON.stringify({ error: "Error al guardar la noticia." }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }
};
