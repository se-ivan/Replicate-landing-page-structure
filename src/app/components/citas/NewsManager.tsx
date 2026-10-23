import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Eye, EyeOff, ImageIcon, Pencil, Plus, Trash2, X } from "lucide-react";
import { safeNewsUrl, type NewsItem, type NewsInput } from "../../../data/news";
import { NewsSection } from "../NewsSection";
import { NewsImageUploader } from "./NewsImageUploader";

const CATEGORIES = ["General", "Aviso", "Taller", "Legal", "Salud Emocional", "Comunidad", "Evento"];

const emptyForm = (): NewsInput => ({
  title: "",
  summary: "",
  content: "",
  category: "General",
  imageUrl: "",
  linkUrl: "",
  linkText: "Más información",
  featured: false,
  published: true,
  publishedAt: new Date().toISOString().slice(0, 10),
});

const inputClass = "mt-1.5 w-full rounded-xl border border-[#e5e0d8] bg-[#fafaf8] px-4 py-3 text-sm text-[#1a2e1a] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20";
const secondaryButton = "inline-flex items-center justify-center gap-2 rounded-xl border border-[#e5e0d8] px-4 py-2.5 text-sm text-[#5a6b5a] transition hover:bg-[#edf1e8] disabled:opacity-50";

export function NewsManager() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [form, setForm] = useState<NewsInput>(emptyForm);
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
        const response = await fetch("/api/news?all=true", { signal: controller.signal });
        if (!response.ok) throw new Error("No se pudieron cargar los anuncios. Recarga la página para intentarlo de nuevo.");
        setNewsList(await response.json());
      } catch (error) {
        if (!controller.signal.aborted) setError(error instanceof Error ? error.message : "No se pudieron cargar los anuncios.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    void load();
    return () => controller.abort();
  }, []);

  const filteredNews = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("es");
    return newsList.filter((item) => `${item.title} ${item.summary} ${item.category}`.toLocaleLowerCase("es").includes(query));
  }, [newsList, search]);

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
    setMessage("");
    setError("");
  };

  const editNews = (item: NewsItem) => {
    setForm({ ...item, publishedAt: item.publishedAt.slice(0, 10) });
    setEditingId(item.id);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setError("");
    setMessage("");
    if (!form.title.trim()) { setError("El título es obligatorio."); return; }
    if (!form.imageUrl?.trim() && !form.summary?.trim()) { setError("Sube una imagen o escribe una descripción para el anuncio."); return; }
    if (form.imageUrl?.trim() && !safeNewsUrl(form.imageUrl)) { setError("La imagen debe tener un enlace válido del sitio o una URL http(s)."); return; }
    if (form.linkUrl?.trim() && !safeNewsUrl(form.linkUrl)) { setError("El enlace debe ser una ruta del sitio o una URL http(s)."); return; }

    setSaving(true);
    try {
      const response = await fetch(editingId ? `/api/news/${encodeURIComponent(editingId)}` : "/api/news", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: editingId || undefined }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudo guardar el anuncio.");
      setNewsList((items) => [result.news, ...items.filter((item) => item.id !== result.news.id)]);
      if (!editingId) setForm(emptyForm());
      setMessage(form.published ? "Anuncio guardado. Ya está visible en el carrusel del inicio." : "Anuncio guardado como oculto.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error de conexión al guardar el anuncio.");
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (item: NewsItem) => {
    if (busy) return;
    setBusyId(item.id);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/news/${encodeURIComponent(item.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !item.published }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudo cambiar la visibilidad.");
      setNewsList((items) => items.map((current) => current.id === item.id ? result.news : current));
      if (editingId === item.id) setForm((current) => ({ ...current, published: result.news.published }));
      setMessage(result.news.published ? "Anuncio visible en el carrusel." : "Anuncio oculto del carrusel.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "No se pudo cambiar la visibilidad.");
    } finally {
      setBusyId(null);
    }
  };

  const deleteNewsItem = async (item: NewsItem) => {
    if (busy || !confirm(`¿Eliminar el anuncio “${item.title}”?`)) return;
    setBusyId(item.id);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/news/${encodeURIComponent(item.id)}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudo eliminar el anuncio.");
      setNewsList((items) => items.filter((current) => current.id !== item.id));
      if (editingId === item.id) resetForm();
      setMessage("Anuncio eliminado.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "No se pudo eliminar el anuncio.");
    } finally {
      setBusyId(null);
    }
  };

  const previewItem: NewsItem = {
    ...form,
    id: editingId || "preview",
    title: form.title || "Título del anuncio",
    summary: form.summary || "",
    content: form.content || "",
    category: form.category || "General",
    featured: Boolean(form.featured),
    published: true,
    publishedAt: form.publishedAt || new Date().toISOString(),
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };

  return (
    <div className="grid gap-6 font-['Inter'] lg:grid-cols-[minmax(0,1fr)_380px]">
      <form onSubmit={handleSave} className="min-w-0 rounded-2xl border border-[#e5e0d8] bg-white p-5 shadow-sm sm:p-6">
        <fieldset disabled={busy} className="min-w-0">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-[#1a2e1a]">{editingId ? "Editar anuncio" : "Nuevo anuncio"}</h2>
              <p className="mt-1 max-w-md text-sm leading-relaxed text-[#5a6b5a]">Sube una imagen o cartel. Los anuncios publicados aparecen en el carrusel debajo de la portada.</p>
            </div>
            <button type="button" onClick={resetForm} className={secondaryButton}><Plus className="h-4 w-4" aria-hidden="true" />{editingId ? "Nuevo anuncio" : "Limpiar"}</button>
          </div>

          <label className="mb-4 block text-sm font-medium text-[#3a4a3a]">
            Título del anuncio *
            <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required maxLength={200} placeholder="Ej. Taller de bienestar emocional" className={inputClass} />
          </label>

          <p className="mb-2 text-sm font-medium text-[#3a4a3a]">Imagen o cartel</p>
          <NewsImageUploader
            value={form.imageUrl || ""}
            disabled={busy}
            onUploadingChange={setUploading}
            onUploaded={(url) => { setForm((current) => ({ ...current, imageUrl: url })); setError(""); setMessage(""); }}
            onError={(text) => { setError(text); setMessage(""); }}
          />
          <details className="mt-3 text-sm text-[#5a6b5a]">
            <summary className="cursor-pointer py-1">Usar una imagen desde un enlace</summary>
            <label className="mt-2 block">Enlace de la imagen
              <input value={form.imageUrl || ""} onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))} placeholder="https://… o /images/…" className={inputClass} />
            </label>
          </details>

          <label className="mt-5 block text-sm font-medium text-[#3a4a3a]">
            Descripción (opcional)
            <textarea value={form.summary || ""} onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))} rows={2} placeholder="Puedes dejarla vacía si el cartel ya incluye la información." className={inputClass} />
          </label>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-[#3a4a3a]">Enlace del anuncio (opcional)
              <input value={form.linkUrl || ""} onChange={(event) => setForm((current) => ({ ...current, linkUrl: event.target.value }))} placeholder="/agendar o https://wa.me/…" className={inputClass} />
            </label>
            <label className="block text-sm font-medium text-[#3a4a3a]">Texto del botón
              <input value={form.linkText || ""} onChange={(event) => setForm((current) => ({ ...current, linkText: event.target.value }))} placeholder="Más información" className={inputClass} />
            </label>
          </div>

          <details className="mt-5 rounded-xl border border-[#e5e0d8] p-4 text-sm text-[#5a6b5a]">
            <summary className="cursor-pointer font-medium text-[#3a4a3a]">Más opciones</summary>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label>Categoría
                <select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} className={inputClass}>
                  {Array.from(new Set([...CATEGORIES, form.category || "General"])).map((category) => <option key={category}>{category}</option>)}
                </select>
              </label>
              <label>Fecha del anuncio
                <input type="date" required value={form.publishedAt?.slice(0, 10) || ""} onChange={(event) => setForm((current) => ({ ...current, publishedAt: event.target.value }))} className={inputClass} />
              </label>
            </div>
            <p className="mt-2 text-xs">Los destacados aparecen primero; después, los más recientes.</p>
            <label className="mt-4 block">Información adicional (al ampliar el anuncio)
              <textarea rows={4} value={form.content || ""} onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} className={inputClass} />
            </label>
          </details>

          <div className="mt-5 flex flex-wrap gap-5 text-sm text-[#1a2e1a]">
            <label className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={Boolean(form.published)} onChange={(event) => setForm((current) => ({ ...current, published: event.target.checked }))} className="h-4 w-4 accent-[#2d5a27]" />Publicado en el sitio</label>
            <label className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={Boolean(form.featured)} onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))} className="h-4 w-4 accent-[#2d5a27]" />Mostrar primero</label>
          </div>
        </fieldset>

        {(message || error) && <p role={error ? "alert" : "status"} className={`mt-5 rounded-xl border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{error || message}</p>}

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="submit" disabled={busy} className="rounded-xl bg-[#1a2e1a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2d5a27] disabled:opacity-60">{uploading ? "Subiendo imagen…" : saving ? "Guardando…" : editingId ? "Guardar cambios" : form.published ? "Publicar anuncio" : "Guardar oculto"}</button>
          <button ref={previewTrigger} type="button" disabled={busy} onClick={() => setPreviewOpen(true)} className={secondaryButton}><Eye className="h-4 w-4" aria-hidden="true" />Vista previa</button>
        </div>
      </form>

      <aside className="h-fit min-w-0 rounded-2xl border border-[#e5e0d8] bg-white p-5 shadow-sm lg:sticky lg:top-24">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#1a2e1a]">Tus anuncios</h2>
          <span className="rounded-full bg-[#edf1e8] px-2.5 py-1 text-xs font-medium text-[#1a2e1a]">{newsList.filter((item) => item.published).length} visibles</span>
        </div>
        <label className="block text-sm text-[#5a6b5a]">Buscar anuncios
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Título o descripción…" className={inputClass} />
        </label>
        {loading ? <p role="status" className="py-10 text-center text-sm text-[#5a6b5a]">Cargando anuncios…</p> : filteredNews.length === 0 ? <div className="py-10 text-center text-sm text-[#5a6b5a]"><ImageIcon className="mx-auto mb-3 h-8 w-8 text-[#8aaf7e]" aria-hidden="true" />{search ? "No hay anuncios que coincidan con tu búsqueda." : "Tus anuncios aparecerán aquí cuando los guardes."}</div> : (
          <div className="mt-4 max-h-[75vh] space-y-3 overflow-y-auto pr-1">
            {filteredNews.map((item) => (
              <article key={item.id} className={`overflow-hidden rounded-xl border ${editingId === item.id ? "border-[#2d5a27] bg-[#edf1e8]/50" : "border-[#e5e0d8]"}`}>
                {safeNewsUrl(item.imageUrl) && <img src={safeNewsUrl(item.imageUrl)!} alt={item.title} loading="lazy" className="h-36 w-full bg-[#f5f2ec] object-contain p-2" />}
                <div className="p-3">
                  <div className="mb-2 flex flex-wrap gap-2 text-xs">
                    <span className={`rounded-full px-2 py-1 ${item.published ? "bg-emerald-50 text-emerald-800" : "bg-gray-100 text-gray-600"}`}>{item.published ? "Publicado" : "Oculto"}</span>
                    {item.featured && <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-800">Primero en el carrusel</span>}
                  </div>
                  <h3 className="text-sm font-semibold leading-snug text-[#1a2e1a]">{item.title}</h3>
                  {item.summary && <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#5a6b5a]">{item.summary}</p>}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" disabled={busy} onClick={() => editNews(item)} className="flex items-center gap-1 rounded-lg border border-[#e5e0d8] px-2.5 py-2 text-xs text-[#1a2e1a] hover:bg-[#edf1e8] disabled:opacity-50"><Pencil className="h-3.5 w-3.5" aria-hidden="true" />Editar</button>
                    <button type="button" disabled={busy} onClick={() => void togglePublished(item)} className="flex items-center gap-1 rounded-lg border border-[#e5e0d8] px-2.5 py-2 text-xs text-[#1a2e1a] hover:bg-[#edf1e8] disabled:opacity-50">{item.published ? <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> : <Eye className="h-3.5 w-3.5" aria-hidden="true" />}{item.published ? "Ocultar" : "Publicar"}</button>
                    <button type="button" disabled={busy} aria-label={`Eliminar anuncio: ${item.title}`} onClick={() => void deleteNewsItem(item)} className="ml-auto rounded-lg px-2.5 py-2 text-red-600 hover:bg-red-50 disabled:opacity-50"><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </aside>

      <Dialog.Root open={previewOpen} onOpenChange={setPreviewOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/55 backdrop-blur-sm" />
          <Dialog.Content onCloseAutoFocus={(event) => { event.preventDefault(); previewTrigger.current?.focus(); }} className="fixed left-1/2 top-1/2 z-[81] max-h-[90dvh] w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-[#f5f2ec] shadow-2xl">
            <div className="border-b border-[#e5e0d8] px-5 py-4 pr-16">
              <Dialog.Title className="font-['Inter'] text-lg font-semibold text-[#1a2e1a]">Vista previa del anuncio</Dialog.Title>
              <Dialog.Description className="mt-1 font-['Inter'] text-sm text-[#5a6b5a]">Así aparecerá en el carrusel cuando lo publiques.</Dialog.Description>
            </div>
            <Dialog.Close aria-label="Cerrar vista previa" className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-[#1a2e1a] hover:bg-[#e5e0d8]"><X className="h-5 w-5" /></Dialog.Close>
            <NewsSection news={[previewItem]} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
