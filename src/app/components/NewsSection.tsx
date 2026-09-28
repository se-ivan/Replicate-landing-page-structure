import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Calendar, Sparkles, Tag, X } from "lucide-react";
import { defaultNews, type NewsItem } from "../../data/news";

type Props = {
  news?: NewsItem[];
};

function formatDisplayDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function NewsSection({ news = defaultNews }: Props) {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // Filter only published news
  const activeNews = news.filter((n) => n.published);

  if (activeNews.length === 0) {
    return null;
  }

  // Sort: featured first, then newest
  const sortedNews = [...activeNews].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const featured = sortedNews.find((n) => n.featured) || sortedNews[0];
  const others = sortedNews.filter((n) => n.id !== featured.id).slice(0, 4);

  return (
    <section id="noticias" className="bg-[#f5f2ec] py-16 md:py-24 px-6 md:px-12 lg:px-20 sr" data-sr-delay="60">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-[#e5e0d8] pb-8">
          <div>
            <span className="font-['Inter'] text-xs md:text-sm text-[#1a2e1a]/70 tracking-[1.4px] uppercase font-semibold block mb-2">
              [ Novedades y Avisos ]
            </span>
            <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl text-[#1a2e1a] leading-tight font-medium">
              ACTUALIDAD EN <span className="italic font-normal">PLENITUD</span>
            </h2>
            <p className="font-['Inter'] text-sm text-[#1a2e1a]/70 mt-3 max-w-xl leading-relaxed">
              Comunicados, jornadas informativas, talleres y avisos relevantes para personas adultas mayores y sus familias en Morelia.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-['Inter'] text-[#5a6b5a] bg-white border border-[#e5e0d8] px-3.5 py-1.5 rounded-full shadow-xs">
              {activeNews.length} {activeNews.length === 1 ? "publicación activa" : "publicaciones activas"}
            </span>
          </div>
        </div>

        {/* Featured + Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Featured Card */}
          {featured && (
            <div
              onClick={() => setSelectedNews(featured)}
              className="lg:col-span-7 bg-white rounded-3xl border border-[#e5e0d8] overflow-hidden flex flex-col cursor-pointer group shadow-sm hover:shadow-xl hover:border-[#2d5a27]/30 transition-all duration-300"
            >
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-[#e5e0d8]">
                {featured.imageUrl ? (
                  <img
                    src={featured.imageUrl}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#1a2e1a] text-white">
                    <Sparkles className="w-12 h-12 opacity-40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Badge Category & Featured */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 font-['Inter'] text-xs font-medium text-white bg-[#1a2e1a]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                    <Tag className="w-3 h-3" /> {featured.category}
                  </span>
                  {featured.featured && (
                    <span className="inline-flex items-center gap-1 font-['Inter'] text-xs font-medium text-[#1a2e1a] bg-[#8aaf7e] px-3 py-1.5 rounded-full shadow-xs">
                      <Sparkles className="w-3 h-3" /> Destacada
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-['Inter'] opacity-90">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDisplayDate(featured.publishedAt)}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#1a2e1a] group-hover:text-[#2d5a27] transition font-bold leading-snug">
                    {featured.title}
                  </h3>
                  <p className="font-['Inter'] text-sm sm:text-base text-[#1a2e1a]/70 mt-3 leading-relaxed">
                    {featured.summary}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-[#f0ede6] flex items-center justify-between">
                  <span className="text-xs font-semibold font-['Inter'] text-[#1a2e1a] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    Leer comunicado completo
                    <ArrowUpRight className="w-4 h-4 text-[#2d5a27]" />
                  </span>

                  {featured.linkUrl && (
                    <a
                      href={featured.linkUrl}
                      onClick={(e) => e.stopPropagation()}
                      target={featured.linkUrl.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="text-xs font-medium font-['Inter'] bg-[#1a2e1a] text-white px-4 py-2 rounded-full hover:bg-[#2d5a27] transition"
                    >
                      {featured.linkText || "Participar"}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Companion Cards List */}
          <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
            {others.length > 0 ? (
              others.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedNews(item)}
                  className="bg-white rounded-2xl border border-[#e5e0d8] p-5 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between cursor-pointer group shadow-xs hover:shadow-md hover:border-[#2d5a27]/30 transition-all"
                >
                  {item.imageUrl && (
                    <div className="w-full sm:w-28 sm:h-24 h-40 rounded-xl overflow-hidden shrink-0 bg-[#e5e0d8]">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-['Inter'] text-[11px] font-semibold text-[#1a2e1a] bg-[#f5f2ec] px-2.5 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      <span className="font-['Inter'] text-[11px] text-[#5a6b5a]">
                        {formatDisplayDate(item.publishedAt)}
                      </span>
                    </div>

                    <h4 className="font-['Inter'] font-semibold text-[#1a2e1a] text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-[#2d5a27] transition">
                      {item.title}
                    </h4>

                    <p className="font-['Inter'] text-xs text-[#1a2e1a]/60 line-clamp-2 mt-1">
                      {item.summary}
                    </p>
                  </div>

                  <div className="hidden sm:flex w-9 h-9 rounded-full bg-[#f5f2ec] group-hover:bg-[#8aaf7e] items-center justify-center transition shrink-0">
                    <ArrowUpRight className="w-4 h-4 text-[#1a2e1a]" />
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl border border-[#e5e0d8] p-8 flex flex-col items-center justify-center text-center h-full">
                <Sparkles className="w-10 h-10 text-[#8aaf7e] mb-3" />
                <h4 className="font-['Playfair_Display'] text-xl text-[#1a2e1a] font-semibold">
                  Más noticias próximamente
                </h4>
                <p className="font-['Inter'] text-xs text-[#5a6b5a] mt-2 max-w-xs leading-relaxed">
                  Mantente informado sobre nuestros próximos talleres y jornadas legales en Morelia.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reader Modal */}
      <AnimatePresence>
        {selectedNews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm"
            onClick={() => setSelectedNews(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] overflow-y-auto shadow-2xl p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#e5e0d8]">
                <div className="flex items-center gap-2">
                  <span className="font-['Inter'] text-xs font-semibold px-3 py-1 rounded-full bg-[#1a2e1a] text-white">
                    {selectedNews.category}
                  </span>
                  <span className="font-['Inter'] text-xs text-[#5a6b5a] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDisplayDate(selectedNews.publishedAt)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedNews(null)}
                  className="w-8 h-8 rounded-full bg-[#f5f2ec] hover:bg-[#e5e0d8] flex items-center justify-center text-[#1a2e1a] transition"
                  aria-label="Cerrar modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Image */}
              {selectedNews.imageUrl && (
                <div className="mt-5 rounded-2xl overflow-hidden aspect-[16/9] w-full bg-[#f5f2ec]">
                  <img
                    src={selectedNews.imageUrl}
                    alt={selectedNews.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Title */}
              <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#1a2e1a] font-bold mt-5 leading-tight">
                {selectedNews.title}
              </h2>

              {/* Summary Lead */}
              <p className="font-['Inter'] text-sm sm:text-base text-[#1a2e1a]/80 font-medium mt-3 leading-relaxed bg-[#f5f2ec]/60 p-4 rounded-xl border border-[#e5e0d8]">
                {selectedNews.summary}
              </p>

              {/* Content paragraphs */}
              {selectedNews.content && (
                <div className="font-['Inter'] text-sm text-[#3a4a3a] mt-5 leading-relaxed whitespace-pre-line space-y-3">
                  {selectedNews.content}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 pt-5 border-t border-[#e5e0d8] flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-[#5a6b5a] font-['Inter']">
                  Plenitud Emocional · Morelia, Michoacán
                </span>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedNews(null)}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-full border border-[#e5e0d8] text-[#5a6b5a] text-xs font-['Inter'] hover:bg-[#f5f2ec] transition"
                  >
                    Cerrar
                  </button>

                  {selectedNews.linkUrl && (
                    <a
                      href={selectedNews.linkUrl}
                      target={selectedNews.linkUrl.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-full bg-[#1a2e1a] px-6 py-2.5 text-xs font-medium text-white font-['Inter'] hover:bg-[#2d5a27] transition shadow-xs"
                    >
                      {selectedNews.linkText || "Más información"}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
