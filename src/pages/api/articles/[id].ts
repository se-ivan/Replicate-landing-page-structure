export const prerender = false;
import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { deleteArticle, getArticleById, upsertArticle, validateArticle } from "../../../lib/articles";

const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" };

export const GET: APIRoute = async ({ params, request }) => {
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

  const article = await getArticleById(id);
  if (!article) {
    return new Response(JSON.stringify({ error: "Articulo no encontrado" }), {
      status: 404,
      headers: JSON_HEADERS,
    });
  }

  return new Response(JSON.stringify(article), {
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
    const data = { ...body, id };
    const error = validateArticle(data);

    if (error) {
      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: JSON_HEADERS,
      });
    }

    const article = await upsertArticle(data);
    return new Response(JSON.stringify({ success: true, article }), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch (error) {
    console.error("Error updating article", error);
    return new Response(JSON.stringify({ error: "Error al actualizar el articulo." }), {
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

  const deleted = await deleteArticle(id);
  if (!deleted) {
    return new Response(JSON.stringify({ error: "Articulo no encontrado" }), {
      status: 404,
      headers: JSON_HEADERS,
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: JSON_HEADERS,
  });
};
