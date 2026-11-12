import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Camera, Eye, EyeOff, Pencil, Plus, Trash2, X } from "lucide-react";
import { safePhotoUrl, type EventPhotoItem } from "../../../data/gallery";
import { EventGallerySection } from "../EventGallerySection";
import { GalleryPhotoUploader, type UploadedPhotoFile } from "./GalleryPhotoUploader";

type StagedPhoto = {
  tempId: string;
  imageUrl: string;
  title: string;
};

type GalleryFormState = {
  title: string;
  eventName: string;
  caption: string;
  imageUrl: string;
  featured: boolean;
  published: boolean;
  takenAt: string;
};

const emptyForm = (): GalleryFormState => ({
  title: "",
  eventName: "",
  caption: "",
  imageUrl: "",
  featured: false,
  published: true,
  takenAt: new Date().toISOString().slice(0, 10),
});

const inputClass =
  "mt-1.5 w-full rounded-xl border border-[#e5e0d8] bg-[#fafaf8] px-4 py-3 text-sm text-[#1a2e1a] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20";
const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-[#e5e0d8] px-4 py-2.5 text-sm text-[#5a6b5a] transition hover:bg-[#edf1e8] disabled:opacity-50";

export function GalleryManager() {
  const [photos, setPhotos] = useState<EventPhotoItem[]>([]);
  const [form, setForm] = useState<GalleryFormState>(emptyForm);
  const [stagedPhotos, setStagedPhotos] = useState<StagedPhoto[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewTrigger = useRef<HTMLButtonElement>(null);
  const busy = saving || uploading || Boolean(busyId);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const response = await fetch("/api/gallery?all=true", { signal: controller.signal });
        if (!response.ok) {
          throw new Error("No se pudieron cargar las fotografías. Recarga la página para intentarlo de nuevo.");
        }
        setPhotos(await response.json());
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "No se pudieron cargar las fotografías.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    void load();
    return () => controller.abort();
  }, []);

  const filteredPhotos = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("es");
    return photos.filter((item) =>
      `${item.title} ${item.eventName} ${item.caption}`.toLocaleLowerCase("es").includes(query),
    );
  }, [photos, search]);

  const resetForm = () => {
    setForm(emptyForm());
    setStagedPhotos([]);
    setEditingId(null);
    setMessage("");
    setError("");
  };

  const editPhoto = (item: EventPhotoItem) => {
    setForm({
      title: item.title,
      eventName: item.eventName,
      caption: item.caption,
      imageUrl: item.imageUrl,
      featured: item.featured,
      published: item.published,
      takenAt: item.takenAt.slice(0, 10),
    });
    setStagedPhotos([]);
    setEditingId(item.id);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUploadedMany = (items: UploadedPhotoFile[]) => {
    setStagedPhotos((prev) => [
      ...prev,
      ...items.map((item) => ({
        tempId: crypto.randomUUID(),
        imageUrl: item.url,
        title: "",
      })),
    ]);
    setMessage("");
  };

  const saveSinglePhoto = async (payload: Record<string, unknown>, id?: string | null) => {
    const response = await fetch(id ? `/api/gallery/${encodeURIComponent(id)}` : "/api/gallery", {
      method: id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "No se pudo guardar la fotografía.");
    return result.photo as EventPhotoItem;
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setError("");
    setMessage("");

    if (editingId) {
      if (!form.imageUrl.trim() || !safePhotoUrl(form.imageUrl)) {
        setError("Sube una fotografía válida antes de guardar.");
        return;
      }
      setSaving(true);
      try {
        const saved = await saveSinglePhoto({ ...form, id: editingId }, editingId);
        setPhotos((items) => [saved, ...items.filter((item) => item.id !== saved.id)]);
        setMessage(
          form.published
            ? "Fotografía actualizada. Ya está visible en el carrusel de galería."
            : "Fotografía guardada como oculta.",
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error de conexión al guardar la fotografía.");
      } finally {
        setSaving(false);
      }
      return;
    }

    if (stagedPhotos.length === 0) {
      setError("Sube al menos una fotografía para agregarla a la galería del evento.");
      return;
    }

    setSaving(true);
    try {
      const savedItems: EventPhotoItem[] = [];
      for (const staged of stagedPhotos) {
        const saved = await saveSinglePhoto({
          title: staged.title.trim() || form.title.trim(),
          eventName: form.eventName.trim(),
          caption: form.caption.trim(),
          imageUrl: staged.imageUrl,
          featured: form.featured,
          published: form.published,
          takenAt: form.takenAt,
        });
        savedItems.push(saved);
      }

      setPhotos((items) => [...savedItems.reverse(), ...items]);
      setStagedPhotos([]);
      setForm(emptyForm());
      setMessage(
        savedItems.length === 1
          ? form.published
            ? "Fotografía publicada en el carrusel de galería."
            : "Fotografía guardada como oculta."
          : form.published
            ? `${savedItems.length} fotografías publicadas en el carrusel de galería.`
            : `${savedItems.length} fotografías guardadas como ocultas.`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron guardar las fotografías.");
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (item: EventPhotoItem) => {
    if (busy) return;
    setBusyId(item.id);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/gallery/${encodeURIComponent(item.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !item.published }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudo cambiar la visibilidad.");
      setPhotos((items) => items.map((current) => (current.id === item.id ? result.photo : current)));
      if (editingId === item.id) {
        setForm((current) => ({ ...current, published: result.photo.published }));
      }
      setMessage(
        result.photo.published
          ? "Fotografía visible en el carrusel de galería."
          : "Fotografía oculta de la galería.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cambiar la visibilidad.");
    } finally {
      setBusyId(null);
    }
  };

  const deletePhotoItem = async (item: EventPhotoItem) => {
    const label = item.title || item.eventName || "esta fotografía";
    if (busy || !confirm(`¿Eliminar “${label}” de la galería?`)) return;
    setBusyId(item.id);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/gallery/${encodeURIComponent(item.id)}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudo eliminar la fotografía.");
      setPhotos((items) => items.filter((current) => current.id !== item.id));
      if (editingId === item.id) resetForm();
      setMessage("Fotografía eliminada de la galería.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la fotografía.");
    } finally {
      setBusyId(null);
    }
  };

  const previewPhotos: EventPhotoItem[] = editingId
    ? [
        {
          id: editingId,
          title: form.title,
          eventName: form.eventName,
          caption: form.caption,
          imageUrl: form.imageUrl,
          featured: form.featured,
          published: true,
          takenAt: form.takenAt || new Date().toISOString(),
          creadoEn: new Date().toISOString(),
          actualizadoEn: new Date().toISOString(),
        },
      ]
    : stagedPhotos.map((staged) => ({
        id: staged.tempId,
        title: staged.title || form.title,
        eventName: form.eventName,
        caption: form.caption,
        imageUrl: staged.imageUrl,
        featured: form.featured,
        published: true,
        takenAt: form.takenAt || new Date().toISOString(),
        creadoEn: new Date().toISOString(),
        actualizadoEn: new Date().toISOString(),
      }));

  return (
    <div className="grid gap-6 font-['Inter'] lg:grid-cols-[minmax(0,1fr)_380px]">
      <form
        onSubmit={handleSave}
        className="min-w-0 rounded-2xl border border-[#e5e0d8] bg-white p-5 shadow-sm sm:p-6"
      >
        <fieldset disabled={busy} className="min-w-0">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-[#1a2e1a]">
                {editingId ? "Editar fotografía del evento" : "Subir fotografías de evento"}
              </h2>
              <p className="mt-1 max-w-md text-sm leading-relaxed text-[#5a6b5a]">
                Sube únicamente fotografías (JPG, PNG, WEBP o AVIF). Las fotografías publicadas aparecerán en el carrusel de galería del inicio.
              </p>
            </div>
            <button type="button" onClick={resetForm} className={secondaryButton}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              {editingId ? "Subir nuevas" : "Limpiar"}
            </button>
          </div>

          <p className="mb-2 text-sm font-medium text-[#3a4a3a]">
            {editingId ? "Fotografía *" : "Fotografías del evento *"}
          </p>
          <GalleryPhotoUploader
            value={editingId ? form.imageUrl : ""}
            allowMultiple={!editingId}
            disabled={busy}
            onUploadingChange={setUploading}
            onUploaded={(url) => {
              setForm((current) => ({ ...current, imageUrl: url }));
              setError("");
              setMessage("");
            }}
            onUploadedMany={handleUploadedMany}
            onError={(text) => {
              setError(text);
              setMessage("");
            }}
          />

          {!editingId && stagedPhotos.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-[#1a2e1a]">
                  Fotografías listas para publicar ({stagedPhotos.length})
                </p>
                <button
                  type="button"
                  onClick={() => setStagedPhotos([])}
                  className="text-xs text-[#5a6b5a] hover:text-red-600"
                >
                  Quitar todas
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {stagedPhotos.map((staged, index) => (
                  <div
                    key={staged.tempId}
                    className="overflow-hidden rounded-xl border border-[#e5e0d8] bg-[#fafaf8]"
                  >
                    <div className="relative aspect-[4/3] bg-[#edf0e8]">
                      <img
                        src={staged.imageUrl}
                        alt={`Fotografía ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setStagedPhotos((prev) => prev.filter((item) => item.tempId !== staged.tempId))
                        }
                        aria-label={`Quitar fotografía ${index + 1}`}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white transition hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-2.5">
                      <input
                        value={staged.title}
                        onChange={(event) => {
                          const value = event.target.value;
                          setStagedPhotos((prev) =>
                            prev.map((item) =>
                              item.tempId === staged.tempId ? { ...item, title: value } : item,
                            ),
                          );
                        }}
                        maxLength={160}
                        placeholder="Título breve (opcional)"
                        className="w-full rounded-lg border border-[#e5e0d8] bg-white px-2.5 py-1.5 text-xs text-[#1a2e1a] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-[#3a4a3a]">
              Nombre del evento (opcional)
              <input
                value={form.eventName}
                onChange={(event) => setForm((current) => ({ ...current, eventName: event.target.value }))}
                maxLength={120}
                placeholder="Ej. Taller de Jubilación Activa"
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium text-[#3a4a3a]">
              Fecha del evento
              <input
                type="date"
                required
                value={form.takenAt}
                onChange={(event) => setForm((current) => ({ ...current, takenAt: event.target.value }))}
                className={inputClass}
              />
            </label>
          </div>

          {(editingId || stagedPhotos.length <= 1) && (
            <label className="mt-4 block text-sm font-medium text-[#3a4a3a]">
              Título o pie de foto (opcional)
              <input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                maxLength={160}
                placeholder="Ej. Sesión de cierre con participantes"
                className={inputClass}
              />
            </label>
          )}

          <label className="mt-4 block text-sm font-medium text-[#3a4a3a]">
            Descripción breve (opcional)
            <textarea
              rows={2}
              maxLength={500}
              value={form.caption}
              onChange={(event) => setForm((current) => ({ ...current, caption: event.target.value }))}
              placeholder="Contexto breve sobre la actividad o el momento capturado."
              className={inputClass}
            />
          </label>

          <div className="mt-5 flex flex-wrap gap-5 text-sm text-[#1a2e1a]">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(event) => setForm((current) => ({ ...current, published: event.target.checked }))}
                className="h-4 w-4 accent-[#2d5a27]"
              />
              Publicar en el carrusel del sitio
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
                className="h-4 w-4 accent-[#2d5a27]"
              />
              Mostrar primero
            </label>
          </div>
        </fieldset>

        {(message || error) && (
          <p
            role={error ? "alert" : "status"}
            className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {error || message}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-[#1a2e1a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2d5a27] disabled:opacity-60"
          >
            {uploading
              ? "Subiendo fotografías…"
              : saving
                ? "Guardando…"
                : editingId
                  ? "Guardar cambios"
                  : form.published
                    ? stagedPhotos.length > 1
                      ? `Publicar ${stagedPhotos.length} fotografías`
                      : "Publicar fotografía"
                    : "Guardar oculta(s)"}
          </button>
          <button
            ref={previewTrigger}
            type="button"
            disabled={busy || previewPhotos.filter((item) => safePhotoUrl(item.imageUrl)).length === 0}
            onClick={() => setPreviewOpen(true)}
            className={secondaryButton}
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            Vista previa
          </button>
        </div>
      </form>

      <aside className="h-fit min-w-0 rounded-2xl border border-[#e5e0d8] bg-white p-5 shadow-sm lg:sticky lg:top-24">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#1a2e1a]">Galería publicada</h2>
          <span className="rounded-full bg-[#edf1e8] px-2.5 py-1 text-xs font-medium text-[#1a2e1a]">
            {photos.filter((item) => item.published).length} visibles
          </span>
        </div>

        <label className="block text-sm text-[#5a6b5a]">
          Buscar fotografías
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Evento, título o descripción…"
            className={inputClass}
          />
        </label>

        {loading ? (
          <p role="status" className="py-10 text-center text-sm text-[#5a6b5a]">
            Cargando galería…
          </p>
        ) : filteredPhotos.length === 0 ? (
          <div className="py-10 text-center text-sm text-[#5a6b5a]">
            <Camera className="mx-auto mb-3 h-8 w-8 text-[#8aaf7e]" aria-hidden="true" />
            {search
              ? "No hay fotografías que coincidan con tu búsqueda."
              : "Las fotografías que subas aparecerán aquí."}
          </div>
        ) : (
          <div className="mt-4 max-h-[75vh] space-y-3 overflow-y-auto pr-1">
            {filteredPhotos.map((item) => {
              const safeUrl = safePhotoUrl(item.imageUrl);
              return (
                <article
                  key={item.id}
                  className={`overflow-hidden rounded-xl border ${
                    editingId === item.id ? "border-[#2d5a27] bg-[#edf1e8]/50" : "border-[#e5e0d8]"
                  }`}
                >
                  {safeUrl && (
                    <img
                      src={safeUrl}
                      alt={item.title || item.eventName || "Fotografía de evento"}
                      loading="lazy"
                      className="h-36 w-full bg-[#f5f2ec] object-cover"
                    />
                  )}
                  <div className="p-3">
                    <div className="mb-2 flex flex-wrap gap-2 text-xs">
                      <span
                        className={`rounded-full px-2 py-1 ${
                          item.published ? "bg-emerald-50 text-emerald-800" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.published ? "Publicada" : "Oculta"}
                      </span>
                      {item.featured && (
                        <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-800">
                          Destacada
                        </span>
                      )}
                      {item.eventName && (
                        <span className="rounded-full bg-[#edf1e8] px-2 py-1 text-[#2d5a27]">
                          {item.eventName}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold leading-snug text-[#1a2e1a]">
                      {item.title || item.eventName || "Fotografía sin título"}
                    </h3>
                    {item.caption && (
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#5a6b5a]">{item.caption}</p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => editPhoto(item)}
                        className="flex items-center gap-1 rounded-lg border border-[#e5e0d8] px-2.5 py-2 text-xs text-[#1a2e1a] hover:bg-[#edf1e8] disabled:opacity-50"
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        Editar
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void togglePublished(item)}
                        className="flex items-center gap-1 rounded-lg border border-[#e5e0d8] px-2.5 py-2 text-xs text-[#1a2e1a] hover:bg-[#edf1e8] disabled:opacity-50"
                      >
                        {item.published ? (
                          <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        {item.published ? "Ocultar" : "Publicar"}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        aria-label={`Eliminar fotografía: ${item.title || item.eventName || item.id}`}
                        onClick={() => void deletePhotoItem(item)}
                        className="ml-auto rounded-lg px-2.5 py-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </aside>

      <Dialog.Root open={previewOpen} onOpenChange={setPreviewOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/55 backdrop-blur-sm" />
          <Dialog.Content
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              previewTrigger.current?.focus();
            }}
            className="fixed left-1/2 top-1/2 z-[81] max-h-[90dvh] w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-[#f5f2ec] shadow-2xl"
          >
            <div className="border-b border-[#e5e0d8] px-5 py-4 pr-16">
              <Dialog.Title className="font-['Inter'] text-lg font-semibold text-[#1a2e1a]">
                Vista previa de la galería de eventos
              </Dialog.Title>
              <Dialog.Description className="mt-1 font-['Inter'] text-sm text-[#5a6b5a]">
                Así aparecerán las fotografías en el carrusel de la página principal.
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Cerrar vista previa"
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-[#1a2e1a] hover:bg-[#e5e0d8]"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
            <EventGallerySection photos={previewPhotos} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
