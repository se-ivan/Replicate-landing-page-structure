export const prerender = false;
import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { deleteNews, getNewsById, toggleNewsPublished, upsertNews, validateNews } from "../../../lib/news";

const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" };

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: "ID requerido" }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  const news = await getNewsById(id);
  if (!news) {
    return new Response(JSON.stringify({ error: "Noticia no encontrada" }), {
      status: 404,
      headers: JSON_HEADERS,
    });
  }

  return new Response(JSON.stringify(news), {
    status: 200,
    headers: JSON_HEADERS,
  });
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const session = await getSession(request);
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
      headers: JSON_HEADERS,
    });
  }

  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: "ID requerido" }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  try {
    const body = await request.json();

    // Check if it's just a toggle of published status
    if (Object.keys(body).length === 1 && typeof body.published === "boolean") {
      const updated = await toggleNewsPublished(id, body.published);
      if (!updated) {
        return new Response(JSON.stringify({ error: "Noticia no encontrada" }), {
          status: 404,
          headers: JSON_HEADERS,
        });
      }
      return new Response(JSON.stringify({ success: true, news: updated }), {
        status: 200,
        headers: JSON_HEADERS,
      });
    }

    const data = { ...body, id };
    const error = validateNews(data);
    if (error) {
      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: JSON_HEADERS,
      });
    }

    const news = await upsertNews(data);
    return new Response(JSON.stringify({ success: true, news }), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch (error) {
    console.error("Error updating news", error);
    return new Response(JSON.stringify({ error: "Error al actualizar la noticia." }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  const session = await getSession(request);
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
      headers: JSON_HEADERS,
    });
  }

  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: "ID requerido" }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  const deleted = await deleteNews(id);
  if (!deleted) {
    return new Response(JSON.stringify({ error: "Noticia no encontrada" }), {
      status: 404,
      headers: JSON_HEADERS,
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: JSON_HEADERS,
  });
};
