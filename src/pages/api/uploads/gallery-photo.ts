import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import {
  MAX_GALLERY_PHOTO_SIZE,
  matchesGalleryPhotoType,
  validateGalleryPhoto,
} from "../../../data/gallery-photos";

export const prerender = false;

const json = (body: object, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

export const POST: APIRoute = async ({ request }) => {
  const session = await getSession(request);
  if (!session?.user) return json({ error: "No autorizado" }, 401);

  if (Number(request.headers.get("content-length")) > MAX_GALLERY_PHOTO_SIZE + 64 * 1024) {
    return json({ error: "Cada fotografía no debe superar 4 MB." }, 413);
  }

  let file: File;
  try {
    const formData = await request.formData();
    const photo = formData.get("photo") ?? formData.get("image");
    if (!(photo instanceof File)) {
      return json({ error: "Selecciona una fotografía para subir." }, 400);
    }
    file = photo;
  } catch {
    return json({ error: "No se pudo leer el archivo. Vuelve a seleccionarlo." }, 400);
  }

  const validationError = validateGalleryPhoto(file.type, file.size, file.name);
  if (validationError) {
    return json({ error: validationError }, file.size > MAX_GALLERY_PHOTO_SIZE ? 413 : 400);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!matchesGalleryPhotoType(buffer, file.type)) {
    return json(
      { error: "El archivo no corresponde a una fotografía válida (JPG, PNG, WEBP o AVIF)." },
      400,
    );
  }

  if (
    !import.meta.env.FIREBASE_PROJECT_ID ||
    !import.meta.env.FIREBASE_CLIENT_EMAIL ||
    !import.meta.env.FIREBASE_PRIVATE_KEY
  ) {
    return json(
      { error: "La carga de fotografías no está configurada. Contacta al administrador del sitio." },
      503,
    );
  }

  try {
    const { firebaseBucket } = await import("../../../lib/firebase-admin");
    const token = crypto.randomUUID();
    const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
    const objectPath = `gallery/${token}.${extension}`;

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
    console.error("Error uploading event photo", error);
    return json({ error: "No se pudo subir la fotografía. Inténtalo de nuevo." }, 500);
  }
};
