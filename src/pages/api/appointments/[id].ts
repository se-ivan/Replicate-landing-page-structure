export const prerender = false;
import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { update, remove } from "../../../lib/appointments";

export const PATCH: APIRoute = async ({ params, request }) => {
  const session = await getSession(request);
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: "ID requerido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const updated = await update(id, body);

    if (!updated) {
      return new Response(JSON.stringify({ error: "Cita no encontrada" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, appointment: updated }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Error al actualizar la cita." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
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

  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: "ID requerido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const deleted = await remove(id);
  if (!deleted) {
    return new Response(JSON.stringify({ error: "Cita no encontrada" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
