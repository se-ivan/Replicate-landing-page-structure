export const prerender = false;
import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { deleteArticle, getArticleById, upsertArticle, validateArticle } from "../../../lib/articles";

export const GET: APIRoute = async ({ params, request }) => {
  const session = await getSession(request);
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: "ID requerido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const article = await getArticleById(id);
  if (!article) {
    return new Response(JSON.stringify({ error: "Articulo no encontrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(article), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const session = await getSession(request);
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: "ID requerido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const data = { ...body, id };
    const error = validateArticle(data);

    if (error) {
      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const article = await upsertArticle(data);
    return new Response(JSON.stringify({ success: true, article }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating article", error);
    return new Response(JSON.stringify({ error: "Error al actualizar el articulo." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  const session = await getSession(request);
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: "ID requerido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const deleted = await deleteArticle(id);
  if (!deleted) {
    return new Response(JSON.stringify({ error: "Articulo no encontrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
