import { ArrowUpRight } from "lucide-react";
import type { Article } from "../../data/articles";

type Variant = "general" | "legal" | "psicologia";

type Props = {
  articles: Article[];
  eyebrow: string;
  title: string;
  description: string;
  variant?: Variant;
};

const variantStyles: Record<Variant, { bg: string; text: string; muted: string; accent: string; card: string }> = {
  general: {
    bg: "#f5f2ec",
    text: "#1a2e1a",
    muted: "rgba(26, 46, 26, 0.72)",
    accent: "#2d5a27",
    card: "#ffffff",
  },
  legal: {
    bg: "#F7F8FA",
    text: "#0F2A47",
    muted: "#6B7280",
    accent: "#3E6B53",
    card: "#ffffff",
  },
  psicologia: {
    bg: "#ffffff",
    text: "#1f3528",
    muted: "#5f6f64",
    accent: "#7b9f76",
    card: "#fbfaf7",
  },
};

function audienceLabel(article: Article) {
  if (article.audience === "legal") return "Abogados";
  if (article.audience === "psicologia") return "Psicologia";
  return "General";
}

export function ArticleHighlights({ articles, eyebrow, title, description, variant = "general" }: Props) {
  if (articles.length === 0) return null;

  const styles = variantStyles[variant];
  const visibleArticles = articles.slice(0, 3);

  return (
    <section id="articulos" className="w-full py-20 lg:py-28" style={{ backgroundColor: styles.bg }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p
              className="mb-3 uppercase"
              style={{ color: styles.muted, letterSpacing: "0.18em", fontSize: "0.75rem", fontWeight: 600 }}
            >
              {eyebrow}
            </p>
            <h2
              style={{
                color: styles.text,
                fontFamily: "'Playfair_Display', Georgia, serif",
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                lineHeight: 1.08,
                fontWeight: 500,
              }}
            >
              {title}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7" style={{ color: styles.muted }}>
              {description}
            </p>
          </div>
          <a
            href="/articulos"
            className="inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white transition hover:brightness-110"
            style={{ backgroundColor: styles.accent }}
          >
            Ver biblioteca
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {visibleArticles.map((article) => (
            <a
              key={article.id}
              href={`/articulos/${article.id}`}
              className="group overflow-hidden rounded-2xl border transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ backgroundColor: styles.card, borderColor: "rgba(15, 42, 71, 0.12)" }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={article.img}
                  alt={article.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium" style={{ color: styles.text }}>
                  {audienceLabel(article)}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold leading-tight" style={{ color: styles.text }}>
                  {article.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6" style={{ color: styles.muted }}>
                  {article.desc}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full px-3 py-1 text-xs" style={{ backgroundColor: `${styles.accent}18`, color: styles.text }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
