export const prerender = false;
import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import {
  deleteGalleryPhoto,
  getGalleryPhotoById,
  toggleGalleryPhotoPublished,
  upsertGalleryPhoto,
  validateEventPhoto,
} from "../../../lib/gallery";

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
    const photo = await getGalleryPhotoById(id);
    const session = photo && !photo.published ? await getSession(request) : null;
    if (!photo || (!photo.published && !session?.user)) {
      return new Response(JSON.stringify({ error: "Fotografía no encontrada" }), {
        status: 404,
        headers: JSON_HEADERS,
      });
    }
    return new Response(JSON.stringify(photo), { status: 200, headers: JSON_HEADERS });
  } catch (error) {
    console.error("Error al cargar la fotografía", error);
    return new Response(JSON.stringify({ error: "No se pudo cargar la fotografía." }), {
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
      return new Response(JSON.stringify({ error: "Los datos de la fotografía no son válidos." }), {
        status: 400,
        headers: JSON_HEADERS,
      });
    }

    if (Object.keys(body).length === 1 && typeof body.published === "boolean") {
      const updated = await toggleGalleryPhotoPublished(id, body.published);
      if (!updated) {
        return new Response(JSON.stringify({ error: "Fotografía no encontrada" }), {
          status: 404,
          headers: JSON_HEADERS,
        });
      }
      return new Response(JSON.stringify({ success: true, photo: updated }), {
        status: 200,
        headers: JSON_HEADERS,
      });
    }

    const data = { ...body, id };
    const error = validateEventPhoto(data);
    if (error) {
      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: JSON_HEADERS,
      });
    }

    const photo = await upsertGalleryPhoto(data);
    return new Response(JSON.stringify({ success: true, photo }), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch (error) {
    console.error("Error updating gallery photo", error);
    return new Response(JSON.stringify({ error: "No se pudo actualizar la fotografía." }), {
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
    const deleted = await deleteGalleryPhoto(id);
    if (!deleted) {
      return new Response(JSON.stringify({ error: "Fotografía no encontrada" }), {
        status: 404,
        headers: JSON_HEADERS,
      });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: JSON_HEADERS });
  } catch (error) {
    console.error("Error deleting gallery photo", error);
    return new Response(JSON.stringify({ error: "No se pudo eliminar la fotografía." }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }
};
