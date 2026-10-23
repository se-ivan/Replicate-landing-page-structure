export const prerender = false;
import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { deleteNews, getNewsById, toggleNewsPublished, upsertNews, validateNews } from "../../../lib/news";

const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };

export const GET: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: "ID requerido" }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  try {
    const news = await getNewsById(id);
    const session = news && !news.published ? await getSession(request) : null;
    if (!news || (!news.published && !session?.user)) {
      return new Response(JSON.stringify({ error: "Anuncio no encontrado" }), {
        status: 404,
        headers: JSON_HEADERS,
      });
    }
    return new Response(JSON.stringify(news), { status: 200, headers: JSON_HEADERS });
  } catch (error) {
    console.error("Error al cargar el anuncio", error);
    return new Response(JSON.stringify({ error: "No se pudo cargar el anuncio." }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }
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

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return new Response(JSON.stringify({ error: "Los datos del anuncio no son válidos." }), { status: 400, headers: JSON_HEADERS });
    }

    // Check if it's just a toggle of published status
    if (Object.keys(body).length === 1 && typeof body.published === "boolean") {
      const updated = await toggleNewsPublished(id, body.published);
      if (!updated) {
        return new Response(JSON.stringify({ error: "Anuncio no encontrado" }), {
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
    console.error("Error updating announcement", error);
    return new Response(JSON.stringify({ error: "No se pudo actualizar el anuncio." }), {
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

  try {
    const deleted = await deleteNews(id);
    if (!deleted) {
      return new Response(JSON.stringify({ error: "Anuncio no encontrado" }), {
        status: 404,
        headers: JSON_HEADERS,
      });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: JSON_HEADERS });
  } catch (error) {
    console.error("Error deleting announcement", error);
    return new Response(JSON.stringify({ error: "No se pudo eliminar el anuncio." }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }
};
