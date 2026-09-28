import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { NewsItem, NewsInput } from "../../../data/news";

const CATEGORIES = [
  "General",
  "Aviso",
  "Taller",
  "Legal",
  "Salud Emocional",
  "Comunidad",
  "Evento",
];

const PRESET_IMAGES = [
  {
    label: "Taller / Grupo",
    url: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
  },
  {
    label: "Legal / Asesoría",
    url: "https://images.unsplash.com/photo-1768839722927-df0ef3188f6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
  },
  {
    label: "Psicología / Emocional",
    url: "https://images.unsplash.com/photo-1714976694664-4293ac04138e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
  },
  {
    label: "Bienestar / Adultos",
    url: "https://images.unsplash.com/photo-1632685236331-42a5a6913025?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
  },
];

const EMPTY_FORM: NewsInput = {
  id: "",
  title: "",
  summary: "",
  content: "",
  category: "General",
  imageUrl: PRESET_IMAGES[0].url,
  linkUrl: "",
  linkText: "Más información",
  featured: false,
  published: true,
  publishedAt: new Date().toISOString().slice(0, 10),
};

export function NewsManager() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [form, setForm] = useState<NewsInput>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");
  const [previewItem, setPreviewItem] = useState<NewsItem | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/news?all=true");
      if (res.ok) {
        const data = await res.json();
        setNewsList(data);
      } else {
        setError("No se pudieron cargar las noticias.");
      }
    } catch {
      setError("Error de conexión al cargar noticias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredNews = useMemo(() => {
    return newsList.filter((item) => {
      if (selectedCategory !== "todas" && item.category !== selectedCategory) {
        return false;
      }
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [newsList, search, selectedCategory]);

  const resetForm = () => {
    setForm({
      ...EMPTY_FORM,
      publishedAt: new Date().toISOString().slice(0, 10),
    });
    setEditingId(null);
    setMessage("");
    setError("");
  };

  const editNews = (item: NewsItem) => {
    setForm({
      id: item.id,
      title: item.title,
      summary: item.summary,
      content: item.content || "",
      category: item.category || "General",
      imageUrl: item.imageUrl || "",
      linkUrl: item.linkUrl || "",
      linkText: item.linkText || "Más información",
      featured: item.featured,
      published: item.published,
      publishedAt: item.publishedAt ? item.publishedAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
    });
    setEditingId(item.id);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    if (!form.title.trim()) {
      setError("El título es obligatorio.");
      setSaving(false);
      return;
    }
    if (!form.summary.trim()) {
      setError("El resumen es obligatorio.");
      setSaving(false);
      return;
    }

    const payload = {
      ...form,
      id: editingId || undefined,
    };

    const url = editingId ? `/api/news/${editingId}` : "/api/news";
    const method = editingId ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se pudo guardar la noticia.");
        return;
      }

      setMessage(editingId ? "Noticia actualizada correctamente." : "Noticia publicada con éxito.");
      await fetchNews();
      if (!editingId) resetForm();
    } catch {
      setError("Error de red al guardar la noticia.");
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (item: NewsItem) => {
    try {
      const res = await fetch(`/api/news/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !item.published }),
      });
      if (res.ok) {
        await fetchNews();
      }
    } catch {
      setError("No se pudo actualizar el estado de la noticia.");
    }
  };

  const deleteNewsItem = async (item: NewsItem) => {
    if (!confirm(`¿Eliminar la noticia "${item.title}"?`)) return;

    try {
      const res = await fetch(`/api/news/${item.id}`, { method: "DELETE" });
      if (res.ok) {
        if (editingId === item.id) resetForm();
        await fetchNews();
        setMessage("Noticia eliminada.");
      } else {
        setError("No se pudo eliminar la noticia.");
      }
    } catch {
      setError("Error al comunicarse con el servidor.");
    }
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Form Column */}
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#e5e0d8] p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-[#1a2e1a] font-['Inter']">
                {editingId ? "Editar Noticia" : "Publicar Nueva Noticia"}
              </h2>
              <p className="text-sm text-[#5a6b5a] font-['Inter'] mt-1">
                Las noticias activas se mostrarán en la página principal bajo el Hero.
              </p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-xl border border-[#e5e0d8] text-[#5a6b5a] text-sm font-['Inter'] hover:border-[#2d5a27]/30 transition-colors"
            >
              Limpiar
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-[#3a4a3a] font-['Inter']">Título *</span>
              <input
                value={form.title}
                onChange={(e) => setForm((curr) => ({ ...curr, title: e.target.value }))}
                required
                placeholder="Ej. Nuevo Taller de Bienestar Emocional..."
                className="mt-1.5 w-full rounded-xl border border-[#e5e0d8] bg-[#fafaf8] px-4 py-3 text-sm text-[#1a2e1a] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-[#3a4a3a] font-['Inter']">Categoría</span>
              <select
                value={form.category}
                onChange={(e) => setForm((curr) => ({ ...curr, category: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-[#e5e0d8] bg-[#fafaf8] px-4 py-3 text-sm text-[#1a2e1a] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block mt-4">
            <span className="text-sm font-medium text-[#3a4a3a] font-['Inter']">
              Resumen Breve (Visible en la tarjeta de inicio) *
            </span>
            <textarea
              value={form.summary}
              onChange={(e) => setForm((curr) => ({ ...curr, summary: e.target.value }))}
              required
              rows={2}
              placeholder="Breve introducción o extracto para captar el interés..."
              className="mt-1.5 w-full rounded-xl border border-[#e5e0d8] bg-[#fafaf8] px-4 py-3 text-sm text-[#1a2e1a] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20"
            />
          </label>

          <label className="block mt-4">
            <span className="text-sm font-medium text-[#3a4a3a] font-['Inter']">
              Contenido Completo (Visible al pulsar 'Leer noticia')
            </span>
            <textarea
              value={form.content}
              onChange={(e) => setForm((curr) => ({ ...curr, content: e.target.value }))}
              rows={5}
              placeholder="Desarrollo completo de la noticia, fechas, detalles, instrucciones, etc..."
              className="mt-1.5 w-full rounded-xl border border-[#e5e0d8] bg-[#fafaf8] px-4 py-3 text-sm text-[#1a2e1a] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20"
            />
          </label>

          {/* Image selection */}
          <div className="mt-4 p-4 rounded-xl border border-[#e5e0d8] bg-[#fafaf8]">
            <span className="text-sm font-medium text-[#3a4a3a] font-['Inter'] block mb-2">
              Imagen de la Noticia (URL)
            </span>
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <input
                value={form.imageUrl || ""}
                onChange={(e) => setForm((curr) => ({ ...curr, imageUrl: e.target.value }))}
                placeholder="https://images.unsplash.com/..."
                className="w-full flex-1 rounded-xl border border-[#e5e0d8] bg-white px-4 py-2.5 text-sm text-[#1a2e1a] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20"
              />
              {form.imageUrl && (
                <div className="h-16 w-24 rounded-lg overflow-hidden border border-[#e5e0d8] shrink-0 bg-white">
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="mt-3">
              <span className="text-xs text-[#5a6b5a] font-['Inter'] block mb-1.5">
                Imágenes sugeridas de apoyo:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setForm((curr) => ({ ...curr, imageUrl: preset.url }))}
                    className="text-xs font-['Inter'] px-2.5 py-1 rounded-lg border border-[#e5e0d8] bg-white text-[#5a6b5a] hover:bg-[#edf1e8] hover:text-[#1a2e1a] transition"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <label className="block">
              <span className="text-sm font-medium text-[#3a4a3a] font-['Inter']">Enlace de acción (opcional)</span>
              <input
                value={form.linkUrl || ""}
                onChange={(e) => setForm((curr) => ({ ...curr, linkUrl: e.target.value }))}
                placeholder="/agendar o https://wa.me/..."
                className="mt-1.5 w-full rounded-xl border border-[#e5e0d8] bg-[#fafaf8] px-4 py-3 text-sm text-[#1a2e1a] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-[#3a4a3a] font-['Inter']">Texto del botón de enlace</span>
              <input
                value={form.linkText || ""}
                onChange={(e) => setForm((curr) => ({ ...curr, linkText: e.target.value }))}
                placeholder="Ej. Inscribirme al taller"
                className="mt-1.5 w-full rounded-xl border border-[#e5e0d8] bg-[#fafaf8] px-4 py-3 text-sm text-[#1a2e1a] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mt-4 items-center">
            <label className="block">
              <span className="text-sm font-medium text-[#3a4a3a] font-['Inter']">Fecha de Publicación</span>
              <input
                type="date"
                value={form.publishedAt ? form.publishedAt.slice(0, 10) : ""}
                onChange={(e) => setForm((curr) => ({ ...curr, publishedAt: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-[#e5e0d8] bg-[#fafaf8] px-4 py-2.5 text-sm text-[#1a2e1a] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20"
              />
            </label>

            <label className="flex items-center gap-2 cursor-pointer mt-5 sm:mt-6">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm((curr) => ({ ...curr, published: e.target.checked }))}
                className="h-4 w-4 rounded text-[#2d5a27] focus:ring-[#2d5a27]"
              />
              <span className="text-sm text-[#1a2e1a] font-medium font-['Inter']">
                Publicada (visible en el sitio)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer mt-2 sm:mt-6">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((curr) => ({ ...curr, featured: e.target.checked }))}
                className="h-4 w-4 rounded text-[#2d5a27] focus:ring-[#2d5a27]"
              />
              <span className="text-sm text-[#1a2e1a] font-medium font-['Inter']">
                Destacada (tarjeta principal)
              </span>
            </label>
          </div>

          <AnimatePresence>
            {(message || error) && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className={`mt-5 rounded-xl border px-4 py-3 text-sm font-['Inter'] ${
                  error ? "bg-red-50 border-red-200 text-red-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"
                }`}
              >
                {error || message}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-3 rounded-xl bg-[#1a2e1a] text-white text-sm font-semibold font-['Inter'] hover:bg-[#2d5a27] disabled:opacity-60 transition-colors shadow-sm"
            >
              {saving ? "Guardando..." : editingId ? "Actualizar Noticia" : "Publicar Noticia"}
            </button>
            <button
              type="button"
              onClick={() =>
                setPreviewItem({
                  id: form.id || "preview",
                  title: form.title || "Título de ejemplo",
                  summary: form.summary || "Resumen de ejemplo...",
                  content: form.content || "Contenido completo de la noticia...",
                  category: form.category || "General",
                  imageUrl: form.imageUrl,
                  linkUrl: form.linkUrl,
                  linkText: form.linkText,
                  featured: Boolean(form.featured),
                  published: Boolean(form.published),
                  publishedAt: form.publishedAt || new Date().toISOString(),
                  creadoEn: new Date().toISOString(),
                  actualizadoEn: new Date().toISOString(),
                })
              }
              className="px-5 py-3 rounded-xl border border-[#e5e0d8] text-[#5a6b5a] text-sm font-['Inter'] hover:border-[#2d5a27]/30 transition"
            >
              Previsualizar Tarjeta
            </button>
          </div>
        </form>

        {/* List Column */}
        <aside className="bg-white rounded-2xl border border-[#e5e0d8] p-5 shadow-sm h-fit lg:sticky lg:top-24">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-[#1a2e1a] font-['Inter']">Noticias Publicadas</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#edf1e8] text-[#1a2e1a] font-['Inter']">
              {newsList.length}
            </span>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título o resumen..."
            className="w-full rounded-xl border border-[#e5e0d8] bg-[#fafaf8] px-4 py-2.5 text-sm text-[#1a2e1a] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 mb-3"
          />

          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2">
            {["todas", ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] font-['Inter'] px-2.5 py-1 rounded-full whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-[#1a2e1a] text-white"
                    : "bg-[#fafaf8] border border-[#e5e0d8] text-[#5a6b5a] hover:bg-[#edf1e8]"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <svg className="animate-spin h-6 w-6 text-[#2d5a27]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-10 text-sm text-[#5a6b5a] font-['Inter']">
              No hay noticias que coincidan con la búsqueda.
            </div>
          ) : (
            <div className="mt-2 space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {filteredNews.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-4 transition-all ${
                    editingId === item.id ? "border-[#2d5a27] bg-[#edf1e8]/60" : "border-[#e5e0d8] bg-white hover:border-[#2d5a27]/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-['Inter'] text-xs font-semibold px-2 py-0.5 rounded-full bg-[#f5f2ec] text-[#1a2e1a]">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1">
                      {item.featured && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-['Inter']">
                          Destacada
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full font-['Inter'] ${
                          item.published
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {item.published ? "Activa" : "Oculta"}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-[#1a2e1a] text-sm font-['Inter'] leading-snug mt-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#5a6b5a] font-['Inter'] line-clamp-2">
                    {item.summary}
                  </p>

                  <div className="mt-3 flex gap-1.5 pt-2 border-t border-[#f0ede6]">
                    <button
                      type="button"
                      onClick={() => editNews(item)}
                      className="flex-1 rounded-xl bg-[#1a2e1a] px-3 py-1.5 text-xs text-white font-['Inter'] hover:bg-[#2d5a27] transition"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => togglePublished(item)}
                      title={item.published ? "Ocultar de la página principal" : "Mostrar en la página principal"}
                      className="rounded-xl border border-[#e5e0d8] px-2.5 py-1.5 text-xs text-[#5a6b5a] font-['Inter'] hover:bg-[#fafaf8]"
                    >
                      {item.published ? "Despublicar" : "Publicar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewItem(item)}
                      className="rounded-xl border border-[#e5e0d8] px-2.5 py-1.5 text-xs text-[#5a6b5a] font-['Inter'] hover:bg-[#fafaf8]"
                    >
                      Ver
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteNewsItem(item)}
                      className="rounded-xl border border-red-200 px-2.5 py-1.5 text-xs text-red-600 font-['Inter'] hover:bg-red-50"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setPreviewItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#e5e0d8]">
                <span className="font-['Inter'] text-xs font-semibold px-3 py-1 rounded-full bg-[#1a2e1a] text-white">
                  {previewItem.category}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="p-1.5 rounded-full hover:bg-[#f5f2ec] text-[#5a6b5a]"
                >
                  ✕
                </button>
              </div>

              {previewItem.imageUrl && (
                <div className="mt-4 rounded-2xl overflow-hidden aspect-[16/9] w-full bg-[#f5f2ec]">
                  <img
                    src={previewItem.imageUrl}
                    alt={previewItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#1a2e1a] font-bold mt-4 leading-tight">
                {previewItem.title}
              </h2>

              <p className="font-['Inter'] text-sm text-[#1a2e1a]/80 font-medium mt-3 leading-relaxed">
                {previewItem.summary}
              </p>

              {previewItem.content && (
                <div className="font-['Inter'] text-sm text-[#5a6b5a] mt-4 leading-relaxed whitespace-pre-line border-t border-[#f0ede6] pt-4">
                  {previewItem.content}
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-[#e5e0d8] flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-[#5a6b5a] font-['Inter']">
                  Fecha: {new Date(previewItem.publishedAt).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                {previewItem.linkUrl && (
                  <a
                    href={previewItem.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#1a2e1a] px-4 py-2 text-xs font-medium text-white font-['Inter'] hover:bg-[#2d5a27]"
                  >
                    {previewItem.linkText || "Más información"} →
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
