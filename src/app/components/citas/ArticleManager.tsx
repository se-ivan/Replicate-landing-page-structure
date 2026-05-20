import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArticleImageUploader } from "./ArticleImageUploader";

interface ArticleSection {
  heading: string;
  navLabel?: string;
  navLabels?: string[];
  paragraphs: string[];
}

interface Article {
  id: string;
  title: string;
  desc: string;
  audience: "ambos" | "psicologia" | "legal";
  tags: string[];
  img: string;
  intro: string;
  readingTimeMinutes?: number | null;
  headerMeta?: string;
  tocTitle?: string;
  sections: ArticleSection[];
}

interface ArticleFormState {
  id: string;
  title: string;
  desc: string;
  audience: "ambos" | "psicologia" | "legal";
  tags: string;
  img: string;
  intro: string;
  readingTimeMinutes: string;
  headerMeta: string;
  tocTitle: string;
  sections: ArticleSection[];
}

const EMPTY_FORM: ArticleFormState = {
  id: "",
  title: "",
  desc: "",
  audience: "ambos",
  tags: "",
  img: "/images/articles/derechos-salud.png",
  intro: "",
  readingTimeMinutes: "",
  headerMeta: "Guía práctica para Morelia, Michoacán",
  tocTitle: "En este artículo",
  sections: [
    {
      heading: "",
      paragraphs: [""],
    },
  ],
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s_-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

function splitList(value: string) {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinIndexLabels(section: ArticleSection) {
  return section.navLabels?.length ? section.navLabels.join("\n") : section.navLabel || "";
}

function audienceLabel(audience: Article["audience"]) {
  if (audience === "legal") return "/abogados";
  if (audience === "psicologia") return "/psicologia";
  return "index";
}

function toForm(article: Article): ArticleFormState {
  return {
    id: article.id,
    title: article.title,
    desc: article.desc,
    audience: article.audience || "ambos",
    tags: article.tags.join(", "),
    img: article.img,
    intro: article.intro,
    readingTimeMinutes: article.readingTimeMinutes ? String(article.readingTimeMinutes) : "",
    headerMeta: article.headerMeta || "Guía práctica para Morelia, Michoacán",
    tocTitle: article.tocTitle || "En este artículo",
    sections: article.sections.length ? article.sections : EMPTY_FORM.sections,
  };
}

function toPayload(form: ArticleFormState) {
  return {
    id: form.id.trim() || slugify(form.title),
    title: form.title.trim(),
    desc: form.desc.trim(),
    audience: form.audience,
    tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    img: form.img.trim(),
    intro: form.intro.trim(),
    readingTimeMinutes: form.readingTimeMinutes ? Number(form.readingTimeMinutes) : null,
    headerMeta: form.headerMeta.trim(),
    tocTitle: form.tocTitle.trim(),
    sections: form.sections.map((section) => ({
      heading: section.heading.trim(),
      navLabels: splitList(joinIndexLabels(section)),
      paragraphs: section.paragraphs.map((paragraph) => paragraph.trim()).filter(Boolean),
    })),
  };
}

export function ArticleManager() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [form, setForm] = useState<ArticleFormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [previewArticleId, setPreviewArticleId] = useState<string | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/articles");
      if (res.ok) setArticles(await res.json());
    } catch {
      setError("No se pudieron cargar los articulos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const filteredArticles = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter((article) =>
      `${article.title} ${article.desc} ${article.audience} ${article.tags.join(" ")}`
        .toLowerCase()
        .includes(q)
    );
  }, [articles, search]);

  const updateSection = (index: number, value: Partial<ArticleSection>) => {
    setForm((current) => ({
      ...current,
      sections: current.sections.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, ...value } : section
      ),
    }));
  };

  const updateParagraph = (sectionIndex: number, paragraphIndex: number, value: string) => {
    setForm((current) => ({
      ...current,
      sections: current.sections.map((section, currentSectionIndex) => {
        if (currentSectionIndex !== sectionIndex) return section;
        return {
          ...section,
          paragraphs: section.paragraphs.map((paragraph, currentParagraphIndex) =>
            currentParagraphIndex === paragraphIndex ? value : paragraph
          ),
        };
      }),
    }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setMessage("");
    setError("");
  };

  const editArticle = (article: Article) => {
    setForm(toForm(article));
    setEditingId(article.id);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const persistArticle = async (): Promise<Article | null> => {
    setSaving(true);
    setMessage("");
    setError("");

    const payload = toPayload(form);
    const url = editingId ? `/api/articles/${editingId}` : "/api/articles";
    const method = editingId ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "No se pudo guardar el articulo.");
        return;
      }

      setMessage("Articulo guardado.");
      setEditingId(result.article.id);
      setForm(toForm(result.article));
      fetchArticles();
      return result.article;
    } catch {
      setError("Error de conexion al guardar.");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const saveArticle = async (event: React.FormEvent) => {
    event.preventDefault();
    await persistArticle();
  };

  const saveAndPreview = async () => {
    const article = await persistArticle();
    if (article) {
      setPreviewArticleId(article.id);
    }
  };

  const deleteArticle = async (article: Article) => {
    if (!confirm(`Eliminar "${article.title}"?`)) return;

    const res = await fetch(`/api/articles/${article.id}`, { method: "DELETE" });
    if (res.ok) {
      if (editingId === article.id) resetForm();
      fetchArticles();
      setMessage("Articulo eliminado.");
    } else {
      setError("No se pudo eliminar el articulo.");
    }
  };

  return (
    <>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <form onSubmit={saveArticle} className="bg-white rounded-2xl border border-[#e5e0d8] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#1a2e1a] font-['Inter']">
              {editingId ? "Editar articulo" : "Nuevo articulo"}
            </h2>
            <p className="text-sm text-[#5a6b5a] font-['Inter'] mt-1">
              Plantilla de articulos
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

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-[#3a4a3a] font-['Inter']">Slug</span>
            <input
              value={form.id}
              onChange={(e) => setForm((current) => ({ ...current, id: slugify(e.target.value) }))}
              placeholder="apoyo-a-familiares-y-cuidadores"
              className="mt-1.5 w-full rounded-xl border border-[#e5e0d8] bg-[#fafaf8] px-4 py-3 text-sm text-[#1a2e1a] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[#3a4a3a] font-['Inter']">Titulo</span>
            <input
              value={form.title}
              onChange={(e) => setForm((current) => ({ ...current, title: e.target.value, id: current.id || slugify(e.target.value) }))}
              required
              className="mt-1.5 w-full rounded-xl border border-[#e5e0d8] bg-[#fafaf8] px-4 py-3 text-sm text-[#1a2e1a] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20"
            />
          </label>
        </div>

        <label className="block mt-4">
          <span className="text-sm font-medium text-[#3a4a3a] font-['Inter']">Descripcion</span>
          <textarea
            value={form.desc}
            onChange={(e) => setForm((current) => ({ ...current, desc: e.target.value }))}
            required
            rows={3}
            className="mt-1.5 w-full rounded-xl border border-[#e5e0d8] bg-[#fafaf8] px-4 py-3 text-sm text-[#1a2e1a] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <label className="block">
            <span className="text-sm font-medium text-[#3a4a3a] font-['Inter']">Mostrar en ruta</span>
            <select
              value={form.audience}
              onChange={(e) => setForm((current) => ({ ...current, audience: e.target.value as ArticleFormState["audience"] }))}
              className="mt-1.5 w-full rounded-xl border border-[#e5e0d8] bg-[#fafaf8] px-4 py-3 text-sm text-[#1a2e1a] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20"
            >
              <option value="ambos">index</option>
              <option value="legal">/abogados</option>
              <option value="psicologia">/psicologia</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[#3a4a3a] font-['Inter']">Etiquetas</span>
            <input
              value={form.tags}
              onChange={(e) => setForm((current) => ({ ...current, tags: e.target.value }))}
              required
              placeholder="Cuidadores, Familia, Autocuidado"
              className="mt-1.5 w-full rounded-xl border border-[#e5e0d8] bg-[#fafaf8] px-4 py-3 text-sm text-[#1a2e1a] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20"
            />
          </label>
        </div>

        <div className="mt-4">
          <ArticleImageUploader
            articleId={form.id || slugify(form.title) || "nuevo-articulo"}
            value={form.img}
            onUploaded={(url) => setForm((current) => ({ ...current, img: url }))}
            onError={setError}
            onMessage={setMessage}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mt-4">
          <label className="block">
            <span className="text-sm font-medium text-[#3a4a3a] font-['Inter']">Tiempo de lectura (minutos)</span>
            <input
              value={form.readingTimeMinutes}
              onChange={(e) => setForm((current) => ({ ...current, readingTimeMinutes: e.target.value.replace(/\D/g, "") }))}
              inputMode="numeric"
              placeholder="3"
              className="mt-1.5 w-full rounded-xl border border-[#e5e0d8] bg-[#fafaf8] px-4 py-3 text-sm text-[#1a2e1a] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-[#3a4a3a] font-['Inter']">Texto de apoyo del encabezado</span>
            <input
              value={form.headerMeta}
              onChange={(e) => setForm((current) => ({ ...current, headerMeta: e.target.value }))}
              placeholder="Guía práctica para Morelia, Michoacán"
              className="mt-1.5 w-full rounded-xl border border-[#e5e0d8] bg-[#fafaf8] px-4 py-3 text-sm text-[#1a2e1a] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20"
            />
          </label>
        </div>

        <label className="block mt-4">
          <span className="text-sm font-medium text-[#3a4a3a] font-['Inter']">Titulo del indice</span>
          <input
            value={form.tocTitle}
            onChange={(e) => setForm((current) => ({ ...current, tocTitle: e.target.value }))}
            placeholder="En este artículo"
            className="mt-1.5 w-full rounded-xl border border-[#e5e0d8] bg-[#fafaf8] px-4 py-3 text-sm text-[#1a2e1a] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20"
          />
        </label>

        <label className="block mt-4">
          <span className="text-sm font-medium text-[#3a4a3a] font-['Inter']">Introduccion</span>
          <textarea
            value={form.intro}
            onChange={(e) => setForm((current) => ({ ...current, intro: e.target.value }))}
            required
            rows={4}
            className="mt-1.5 w-full rounded-xl border border-[#e5e0d8] bg-[#fafaf8] px-4 py-3 text-sm text-[#1a2e1a] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20"
          />
        </label>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#1a2e1a] font-['Inter']">Secciones</h3>
            <button
              type="button"
              onClick={() => setForm((current) => ({ ...current, sections: [...current.sections, { heading: "", paragraphs: [""] }] }))}
              className="px-3 py-2 rounded-xl bg-[#edf1e8] text-[#1a2e1a] text-sm font-['Inter'] hover:bg-[#dfe8d7] transition-colors"
            >
              Agregar seccion
            </button>
          </div>

          {form.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="rounded-2xl border border-[#e5e0d8] bg-[#fafaf8] p-4">
              <div className="flex items-start gap-2">
                <label className="block flex-1">
                  <span className="text-sm font-medium text-[#3a4a3a] font-['Inter']">Titulo de seccion</span>
                  <input
                    value={section.heading}
                    onChange={(e) => updateSection(sectionIndex, { heading: e.target.value })}
                    required
                    className="mt-1.5 w-full rounded-xl border border-[#e5e0d8] bg-white px-4 py-3 text-sm text-[#1a2e1a] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, sections: current.sections.filter((_, index) => index !== sectionIndex) }))}
                  disabled={form.sections.length === 1}
                  className="mt-7 px-3 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-['Inter'] disabled:opacity-40"
                >
                  Quitar
                </button>
              </div>
              <label className="block mt-3">
                <span className="text-sm font-medium text-[#3a4a3a] font-['Inter']">Etiquetas del indice</span>
                <textarea
                  value={joinIndexLabels(section)}
                  onChange={(e) => updateSection(sectionIndex, { navLabel: e.target.value })}
                  rows={2}
                  placeholder="Opcional: separa por comas o saltos de linea"
                  className="mt-1.5 w-full rounded-xl border border-[#e5e0d8] bg-white px-4 py-3 text-sm text-[#1a2e1a] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20"
                />
              </label>

              <div className="mt-3 space-y-3">
                {section.paragraphs.map((paragraph, paragraphIndex) => (
                  <div key={paragraphIndex} className="flex items-start gap-2">
                    <textarea
                      value={paragraph}
                      onChange={(e) => updateParagraph(sectionIndex, paragraphIndex, e.target.value)}
                      required
                      rows={3}
                      placeholder={`Parrafo ${paragraphIndex + 1}`}
                      className="w-full rounded-xl border border-[#e5e0d8] bg-white px-4 py-3 text-sm text-[#1a2e1a] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20"
                    />
                    <button
                      type="button"
                      onClick={() => updateSection(sectionIndex, { paragraphs: section.paragraphs.filter((_, index) => index !== paragraphIndex) })}
                      disabled={section.paragraphs.length === 1}
                      className="px-3 py-2 rounded-xl border border-[#e5e0d8] text-[#5a6b5a] text-sm font-['Inter'] disabled:opacity-40"
                    >
                      -
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => updateSection(sectionIndex, { paragraphs: [...section.paragraphs, ""] })}
                  className="px-3 py-2 rounded-xl border border-[#e5e0d8] text-[#5a6b5a] text-sm font-['Inter'] hover:border-[#2d5a27]/30"
                >
                  Agregar parrafo
                </button>
              </div>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {(message || error) && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={`mt-5 rounded-xl border px-4 py-3 text-sm font-['Inter'] ${error ? "bg-red-50 border-red-200 text-red-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}
            >
              {error || message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-3 rounded-xl bg-[#1a2e1a] text-white text-sm font-semibold font-['Inter'] hover:bg-[#2d5a27] disabled:opacity-60 transition-colors"
          >
            {saving ? "Guardando..." : "Guardar articulo"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => setPreviewArticleId(editingId)}
              className="px-5 py-3 rounded-xl border border-[#e5e0d8] text-[#5a6b5a] text-sm font-['Inter'] hover:border-[#2d5a27]/30"
            >
              Previsualizar
            </button>
          )}
          <button
            type="button"
            onClick={saveAndPreview}
            disabled={saving}
            className="px-5 py-3 rounded-xl border border-[#2d5a27]/30 bg-[#edf1e8] text-[#1a2e1a] text-sm font-['Inter'] hover:bg-[#dfe8d7] disabled:opacity-60"
          >
            Guardar y previsualizar
          </button>
        </div>
      </form>

      <aside className="bg-white rounded-2xl border border-[#e5e0d8] p-5 shadow-sm h-fit lg:sticky lg:top-24">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-[#1a2e1a] font-['Inter']">Articulos</h2>
          <span className="text-xs text-[#5a6b5a] font-['Inter']">{articles.length}</span>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar articulo"
          className="w-full rounded-xl border border-[#e5e0d8] bg-[#fafaf8] px-4 py-3 text-sm text-[#1a2e1a] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20"
        />

        {loading ? (
          <div className="flex justify-center py-10">
            <svg className="animate-spin h-6 w-6 text-[#2d5a27]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : (
          <div className="mt-4 space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className={`rounded-2xl border p-4 transition-colors ${editingId === article.id ? "border-[#2d5a27] bg-[#edf1e8]" : "border-[#e5e0d8] bg-white"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-[#1a2e1a] text-sm font-['Inter'] leading-snug">{article.title}</p>
                  <span className="shrink-0 rounded-full bg-[#edf1e8] px-2 py-1 text-[10px] uppercase tracking-[0.8px] text-[#1a2e1a] font-['Inter']">
                    {audienceLabel(article.audience)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#5a6b5a] font-['Inter'] line-clamp-2">{article.desc}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-[#f5f2ec] px-2 py-1 text-[11px] text-[#5a6b5a] font-['Inter']">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => editArticle(article)}
                    className="flex-1 rounded-xl bg-[#1a2e1a] px-3 py-2 text-xs text-white font-['Inter'] hover:bg-[#2d5a27]"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewArticleId(article.id)}
                    className="rounded-xl border border-[#e5e0d8] px-3 py-2 text-xs text-[#5a6b5a] font-['Inter'] hover:border-[#2d5a27]/30"
                  >
                    Vista
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteArticle(article)}
                    className="rounded-xl border border-red-200 px-3 py-2 text-xs text-red-600 font-['Inter'] hover:bg-red-50"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
    <AnimatePresence>
      {previewArticleId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-[#f5f2ec]"
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between gap-3 border-b border-[#e5e0d8] bg-white px-4 sm:px-6 py-3 shadow-sm">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1a2e1a] font-['Inter']">Previsualizacion del articulo</p>
                <p className="text-xs text-[#5a6b5a] font-['Inter'] truncate">/articulos/{previewArticleId}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`/articulos/${previewArticleId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:inline-flex rounded-xl border border-[#e5e0d8] px-4 py-2 text-sm text-[#5a6b5a] font-['Inter'] hover:border-[#2d5a27]/30"
                >
                  Abrir
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewArticleId(null)}
                  className="rounded-xl bg-[#1a2e1a] px-4 py-2 text-sm text-white font-['Inter'] hover:bg-[#2d5a27]"
                >
                  Volver al panel
                </button>
              </div>
            </div>
            <iframe
              title="Previsualizacion del articulo"
              src={`/articulos/${previewArticleId}`}
              className="h-full w-full border-0 bg-white"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
