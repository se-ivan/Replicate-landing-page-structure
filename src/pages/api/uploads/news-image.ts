import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { MAX_NEWS_IMAGE_SIZE, matchesNewsImageType, validateNewsImage } from "../../../data/news-images";

export const prerender = false;

const json = (body: object, status: number) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8" },
});

export const POST: APIRoute = async ({ request }) => {
  const session = await getSession(request);
  if (!session?.user) return json({ error: "No autorizado" }, 401);

  if (Number(request.headers.get("content-length")) > MAX_NEWS_IMAGE_SIZE + 64 * 1024) {
    return json({ error: "La imagen no debe superar 4 MB." }, 413);
  }

  let file: File;
  try {
    const formData = await request.formData();
    const image = formData.get("image");
    if (!(image instanceof File)) return json({ error: "Selecciona una imagen o cartel." }, 400);
    file = image;
  } catch {
    return json({ error: "No se pudo leer el archivo. Vuelve a seleccionarlo." }, 400);
  }

  const validationError = validateNewsImage(file.type, file.size);
  if (validationError) return json({ error: validationError }, file.size > MAX_NEWS_IMAGE_SIZE ? 413 : 400);

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!matchesNewsImageType(buffer, file.type)) {
    return json({ error: "El archivo no corresponde a una imagen válida en el formato indicado." }, 400);
  }

  if (!import.meta.env.FIREBASE_PROJECT_ID || !import.meta.env.FIREBASE_CLIENT_EMAIL || !import.meta.env.FIREBASE_PRIVATE_KEY) {
    return json({ error: "La carga de imágenes no está configurada. Contacta al administrador del sitio." }, 503);
  }

  try {
    // Initialize storage only after authentication and file validation succeed.
    const { firebaseBucket } = await import("../../../lib/firebase-admin");
    const token = crypto.randomUUID();
    const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
    const objectPath = `announcements/${token}.${extension}`;

    await firebaseBucket.file(objectPath).save(buffer, {
      resumable: false,
      metadata: {
        contentType: file.type,
        cacheControl: "public, max-age=31536000, immutable",
        metadata: { firebaseStorageDownloadTokens: token },
      },
    });

    const url = `https://firebasestorage.googleapis.com/v0/b/${firebaseBucket.name}/o/${encodeURIComponent(objectPath)}?alt=media&token=${token}`;
    return json({ success: true, url }, 201);
  } catch (error) {
    console.error("Error uploading announcement image", error);
    return json({ error: "No se pudo subir la imagen. Inténtalo de nuevo." }, 500);
  }
};
