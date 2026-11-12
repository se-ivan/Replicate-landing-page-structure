export const prerender = false;
import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import {
  getGalleryPhotos,
  getPublishedGalleryPhotos,
  upsertGalleryPhoto,
  validateEventPhoto,
} from "../../lib/gallery";

const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };

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
    try {
      const photos = await getGalleryPhotos(true);
      return new Response(JSON.stringify(photos), { status: 200, headers: JSON_HEADERS });
    } catch (error) {
      console.error("Error al cargar la galería", error);
      return new Response(JSON.stringify({ error: "No se pudo cargar la galería." }), {
        status: 500,
        headers: JSON_HEADERS,
      });
    }
  }

  const photos = await getPublishedGalleryPhotos();
  return new Response(JSON.stringify(photos), {
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
    const error = validateEventPhoto(body);
    if (error) {
      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: JSON_HEADERS,
      });
    }

    const photo = await upsertGalleryPhoto(body);
    return new Response(JSON.stringify({ success: true, photo }), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch (error) {
    console.error("Error al guardar la fotografía", error);
    return new Response(JSON.stringify({ error: "No se pudo guardar la fotografía. Inténtalo de nuevo." }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }
};
