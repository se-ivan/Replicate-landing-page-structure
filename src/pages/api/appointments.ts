export const prerender = false;
import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { getAll, create } from "../../lib/appointments";

export const GET: APIRoute = async ({ request }) => {
  // Only admin can list appointments
  const session = await getSession(request);
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const appointments = await getAll();
  return new Response(JSON.stringify(appointments), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Validate required fields
    const required = ["nombre", "apellido", "fechaNacimiento", "telefono", "email", "fechaPreferida", "horaPreferida", "tipoServicio"];
    for (const field of required) {
      if (!body[field] || String(body[field]).trim() === "") {
        return new Response(
          JSON.stringify({ error: `El campo "${field}" es requerido.` }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return new Response(
        JSON.stringify({ error: "El correo electrónico no es válido." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate phone (at least 10 digits)
    const phoneDigits = body.telefono.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      return new Response(
        JSON.stringify({ error: "El teléfono debe tener al menos 10 dígitos." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const appointment = await create({
      nombre: body.nombre.trim(),
      apellido: body.apellido.trim(),
      fechaNacimiento: body.fechaNacimiento,
      telefono: body.telefono.trim(),
      email: body.email.trim().toLowerCase(),
      fechaPreferida: body.fechaPreferida,
      horaPreferida: body.horaPreferida,
      tipoServicio: body.tipoServicio,
      notas: body.notas?.trim() || "",
    });

    return new Response(JSON.stringify({ success: true, appointment }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error al procesar la solicitud." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
