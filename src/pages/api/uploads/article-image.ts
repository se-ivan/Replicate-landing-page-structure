export const prerender = false;
import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { firebaseBucket } from "../../../lib/firebase-admin";

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const MAX_SIZE = 8 * 1024 * 1024;

function getExtension(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  if (type === "image/avif") return "avif";
  return "jpg";
}

export const POST: APIRoute = async ({ request }) => {
  const session = await getSession(request);
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("image");
    const articleId = String(formData.get("articleId") || "nuevo-articulo")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!(file instanceof File)) {
      return new Response(JSON.stringify({ error: "Selecciona una imagen." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!ACCEPTED_TYPES.has(file.type)) {
      return new Response(JSON.stringify({ error: "Formato no permitido. Usa PNG, JPG, WEBP, GIF o AVIF." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (file.size > MAX_SIZE) {
      return new Response(JSON.stringify({ error: "La imagen no debe superar 8 MB." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = crypto.randomUUID();
    const extension = getExtension(file.type);
    const objectPath = `articles/${articleId || "nuevo-articulo"}/${Date.now()}-${token}.${extension}`;
    const storageFile = firebaseBucket.file(objectPath);
    const buffer = Buffer.from(await file.arrayBuffer());

    await storageFile.save(buffer, {
      resumable: false,
      metadata: {
        contentType: file.type,
        cacheControl: "public, max-age=31536000, immutable",
        metadata: {
          firebaseStorageDownloadTokens: token,
        },
      },
    });

    const encodedPath = encodeURIComponent(objectPath);
    const url = `https://firebasestorage.googleapis.com/v0/b/${firebaseBucket.name}/o/${encodedPath}?alt=media&token=${token}`;

    return new Response(JSON.stringify({ success: true, url, path: objectPath }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error uploading article image", error);
    return new Response(JSON.stringify({ error: "No se pudo subir la imagen." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
