import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { articles as defaultArticles, type Article } from "../../data/articles";

type Props = {
  articles?: Article[];
};

export function LatestWorksSection({ articles = defaultArticles }: Props) {
  const [selected, setSelected] = useState(0);
  const visibleArticles = articles;

  if (visibleArticles.length === 0) return null;

  return (
    <section id="blog" className="bg-[#f5f2ec] pt-20 pb-20 px-6 md:px-12 lg:px-20 sr" data-sr-delay="400">
      <div className="max-w-[1220px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <span className="font-['Inter'] text-sm text-[#1a2e1a]/70 tracking-[1.4px] uppercase">
            [ Artículos ]
          </span>
          <a
            href="/articulos"
            className="font-['Inter'] text-sm text-[#1a2e1a] underline underline-offset-4 hover:opacity-70 transition"
          >
            Ver Más Artículos
          </a>
        </div>

        {/* Desktop cards */}
        <div className="hidden md:flex gap-4 h-[65vh] min-h-[520px] max-h-[760px]">
          {visibleArticles.map((a, i) => {
            const isActive = selected === i;
            return (
              <div
                key={a.title}
                onClick={() => setSelected(i)}
                className="relative rounded-3xl overflow-hidden cursor-pointer group"
                style={{
                  flex: isActive ? 2.2 : 1,
                  transition: "flex 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {/* Image */}
                <img
                  src={a.img}
                  alt={a.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 via-50% to-transparent" />

                {/* Arrow button */}
                <a
                  href={`/articulos/${a.id}`}
                  onClick={(event) => event.stopPropagation()}
                  aria-label={`Abrir artículo: ${a.title}`}
                  className="absolute top-5 right-5 z-10"
                >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:bg-[#8aaf7e] transition">
                    <ArrowUpRight className="w-5 h-5 text-[#1a2e1a]" />
                  </div>
                </a>

                {/* Tags - only on active */}
                <div
                  className="absolute top-5 left-5 z-10 flex flex-wrap gap-2"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transition: "opacity 0.4s ease",
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  {a.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-['Inter'] text-xs text-white border border-white/50 rounded-full px-3 py-1 bg-white/10 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <h3
                    className="font-['Inter'] font-semibold text-white leading-tight"
                    style={{
                      fontSize: isActive ? "32px" : "20px",
                      lineHeight: isActive ? "40px" : "25px",
                      transition:
                        "font-size 0.5s cubic-bezier(0.4, 0, 0.2, 1), line-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {a.title}
                  </h3>
                  <div
                    className="overflow-hidden"
                    style={{
                      maxHeight: isActive ? "140px" : "0px",
                      opacity: isActive ? 1 : 0,
                      marginTop: isActive ? "8px" : "0px",
                      transition:
                        "max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease, margin-top 0.4s ease",
                    }}
                  >
                    <p className="font-['Inter'] text-white/70 text-sm leading-relaxed">
                      {a.desc}
                    </p>
                    <a
                      href={`/articulos/${a.id}`}
                      onClick={(event) => event.stopPropagation()}
                      className="mt-3 inline-flex items-center rounded-full border border-white/45 px-3 py-1.5 font-['Inter'] text-xs text-white hover:bg-white/15 transition"
                    >
                      Leer artículo
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile cards - vertical stack */}
        <div className="flex md:hidden flex-col gap-4">
          {visibleArticles.map((a, i) => {
            const isActive = selected === i;
            return (
              <div
                key={a.title}
                onClick={() => setSelected(i)}
                className="group relative rounded-3xl overflow-hidden cursor-pointer"
                style={{
                  height: isActive ? "460px" : "250px",
                  transition: "height 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <img
                  src={a.img}
                  alt={a.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 via-50% to-transparent" />

                {/* Arrow */}
                <a
                  href={`/articulos/${a.id}`}
                  onClick={(event) => event.stopPropagation()}
                  aria-label={`Abrir artículo: ${a.title}`}
                  className="absolute top-4 right-4 z-10"
                >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:bg-[#8aaf7e] transition">
                    <ArrowUpRight className="w-5 h-5 text-[#1a2e1a]" />
                  </div>
                </a>

                {/* Tags */}
                <div
                  className="absolute top-4 left-4 z-10 flex flex-wrap gap-2"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transition: "opacity 0.4s ease",
                  }}
                >
                  {a.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-['Inter'] text-xs text-white border border-white/50 rounded-full px-3 py-1 bg-white/10 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  <h3
                    className="font-['Inter'] font-semibold text-white"
                    style={{
                      fontSize: isActive ? "24px" : "18px",
                      lineHeight: isActive ? "32px" : "24px",
                      transition:
                        "font-size 0.5s cubic-bezier(0.4, 0, 0.2, 1), line-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {a.title}
                  </h3>
                  <div
                    className="overflow-hidden"
                    style={{
                      maxHeight: isActive ? "140px" : "0px",
                      opacity: isActive ? 1 : 0,
                      marginTop: isActive ? "8px" : "0px",
                      transition:
                        "max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease, margin-top 0.4s ease",
                    }}
                  >
                    <p className="font-['Inter'] text-white/70 text-sm leading-relaxed">
                      {a.desc}
                    </p>
                    <a
                      href={`/articulos/${a.id}`}
                      onClick={(event) => event.stopPropagation()}
                      className="mt-3 inline-flex items-center rounded-full border border-white/45 px-3 py-1.5 font-['Inter'] text-xs text-white hover:bg-white/15 transition"
                    >
                      Leer artículo
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
