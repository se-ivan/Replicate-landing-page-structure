import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, ChevronLeft, ChevronRight, ImageIcon, Maximize2, Newspaper, X } from "lucide-react";
import { defaultNews, safeNewsUrl, type NewsItem } from "../../data/news";

type Props = {
  news?: NewsItem[];
};

function AnnouncementImage({ item, expanded = false }: { item: NewsItem; expanded?: boolean }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const imageUrl = safeNewsUrl(item.imageUrl);

  return imageUrl && failedUrl !== imageUrl ? (
    <img
      src={imageUrl}
      alt={item.title}
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setFailedUrl(imageUrl)}
      className={expanded ? "mx-auto max-h-[70vh] w-full object-contain" : "h-full w-full object-contain"}
    />
  ) : (
    <div className="flex h-full min-h-48 flex-col items-center justify-center gap-4 px-8 text-center text-[#1a2e1a]">
      <ImageIcon className="h-10 w-10 text-[#8aaf7e]" aria-hidden="true" />
      <span className="break-words font-['Playfair_Display'] text-2xl sm:text-3xl">{item.title}</span>
    </div>
  );
}

export function NewsSection({ news = defaultNews }: Props) {
  const items = useMemo(() => news.filter((item) => item.published).sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  }), [news]);
  const [carouselRef, api] = useEmblaCarousel({ loop: items.length > 1 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const selectedTrigger = useRef<HTMLButtonElement | null>(null);
  const onSelect = useCallback(() => setSelectedIndex(api?.selectedScrollSnap() ?? 0), [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  const currentIndex = Math.max(0, Math.min(selectedIndex, items.length - 1));
  const selectedLink = safeNewsUrl(selectedNews?.linkUrl);
  const arrowClass = "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d7dcd1] bg-white text-[#1a2e1a] transition hover:bg-[#edf1e8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2d5a27]";

  return (
    <section id="noticias" aria-labelledby="announcements-title" className="scroll-mt-24 bg-[#f5f2ec] px-5 py-10 md:px-12 md:py-14 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 font-['Inter'] text-xs font-semibold uppercase tracking-[1.8px] text-[#5a6b5a]">Mantente al día</p>
            <h2 id="announcements-title" className="font-['Playfair_Display'] text-3xl font-medium text-[#1a2e1a] sm:text-4xl">Noticias y anuncios</h2>
          </div>
          {items.length > 1 && (
            <div className="flex gap-2">
              <button type="button" onClick={() => api?.scrollPrev()} className={arrowClass} aria-label="Anuncio anterior"><ChevronLeft className="h-5 w-5" /></button>
              <button type="button" onClick={() => api?.scrollNext()} className={arrowClass} aria-label="Anuncio siguiente"><ChevronRight className="h-5 w-5" /></button>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-[#e5e0d8] bg-white px-6 py-10 text-center sm:py-12">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#edf0e8] text-[#2d5a27]">
              <Newspaper className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="font-['Inter'] text-lg font-semibold text-[#1a2e1a]">Próximamente, más noticias</h3>
            <p className="mt-2 max-w-md font-['Inter'] text-sm leading-relaxed text-[#5a6b5a]">Aquí compartiremos talleres, actividades y avisos para nuestra comunidad.</p>
          </div>
        ) : (
          <div
            role="region"
            aria-roledescription="carrusel"
            aria-label="Anuncios de Plenitud Emocional"
            tabIndex={items.length > 1 ? 0 : undefined}
            className="rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2d5a27]"
            onKeyDown={(event) => {
              if (event.target !== event.currentTarget) return;
              if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault();
                if (event.key === "ArrowLeft") api?.scrollPrev();
                else api?.scrollNext();
              }
            }}
          >
            <div ref={carouselRef} className="overflow-hidden rounded-2xl border border-[#e5e0d8] bg-white">
              <div className="flex touch-pan-y">
                {items.map((item, index) => {
                  const link = safeNewsUrl(item.linkUrl);
                  return (
                    <article
                      key={item.id}
                      role="group"
                      aria-roledescription="diapositiva"
                      aria-label={`${index + 1} de ${items.length}: ${item.title}`}
                      aria-hidden={index !== currentIndex}
                      className="min-w-0 flex-[0_0_100%]"
                    >
                      <button
                        type="button"
                        onClick={(event) => { selectedTrigger.current = event.currentTarget; setSelectedNews(item); }}
                        tabIndex={index === currentIndex ? 0 : -1}
                        aria-label={`Ampliar anuncio: ${item.title}`}
                        className="group relative block h-[320px] w-full cursor-zoom-in bg-[#edf0e8] p-3 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#2d5a27] sm:h-[420px] md:h-[480px] md:p-5"
                      >
                        <AnnouncementImage item={item} />
                        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-[#e5e0d8] bg-white/95 px-3 py-2 font-['Inter'] text-xs text-[#1a2e1a] shadow-sm"><Maximize2 className="h-3.5 w-3.5" aria-hidden="true" /> Ampliar</span>
                      </button>
                      <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
                        <div className="min-w-0">
                          <h3 className="break-words font-['Inter'] text-lg font-semibold leading-snug text-[#1a2e1a]">{item.title}</h3>
                          {item.summary && <p className="mt-2 line-clamp-2 break-words font-['Inter'] text-sm leading-relaxed text-[#5a6b5a]">{item.summary}</p>}
                        </div>
                        {link && (
                          <a href={link} tabIndex={index === currentIndex ? 0 : -1} target={link.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#1a2e1a] px-5 py-3 font-['Inter'] text-sm font-medium text-white transition hover:bg-[#2d5a27] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2d5a27]">
                            {item.linkText || "Más información"}<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
            {items.length > 1 && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-1">
                {items.map((item, index) => (
                  <button type="button" key={item.id} onClick={() => api?.scrollTo(index)} aria-label={`Ir al anuncio ${index + 1}: ${item.title}`} aria-current={index === currentIndex ? "true" : undefined} className="flex h-11 min-w-9 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-[#2d5a27]">
                    <span className={`h-2 rounded-full transition-all motion-reduce:transition-none ${index === currentIndex ? "w-6 bg-[#2d5a27]" : "w-2 bg-[#b9c3b4]"}`} />
                  </button>
                ))}
                <p aria-live="polite" aria-atomic="true" className="ml-3 font-['Inter'] text-xs text-[#5a6b5a]">{currentIndex + 1} / {items.length}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog.Root open={Boolean(selectedNews)} onOpenChange={(open) => { if (!open) setSelectedNews(null); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm" />
          <Dialog.Content onCloseAutoFocus={(event) => { event.preventDefault(); selectedTrigger.current?.focus(); }} className="fixed left-1/2 top-1/2 z-[91] max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-8">
            <Dialog.Title className="break-words pr-12 font-['Inter'] text-xl font-semibold text-[#1a2e1a]">{selectedNews?.title}</Dialog.Title>
            <Dialog.Description className="sr-only">Imagen y detalles del anuncio.</Dialog.Description>
            <Dialog.Close aria-label="Cerrar anuncio" className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#f5f2ec] text-[#1a2e1a] hover:bg-[#e5e0d8]"><X className="h-5 w-5" /></Dialog.Close>
            {selectedNews && <div className="mt-5 rounded-xl bg-[#edf0e8] p-2"><AnnouncementImage item={selectedNews} expanded /></div>}
            {selectedNews?.summary && <p className="mt-5 break-words font-['Inter'] text-sm leading-relaxed text-[#1a2e1a]">{selectedNews.summary}</p>}
            {selectedNews?.content && <p className="mt-4 whitespace-pre-line break-words font-['Inter'] text-sm leading-relaxed text-[#5a6b5a]">{selectedNews.content}</p>}
            {selectedLink && <a href={selectedLink} target={selectedLink.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1a2e1a] px-5 py-3 font-['Inter'] text-sm font-medium text-white hover:bg-[#2d5a27]">{selectedNews?.linkText || "Más información"}<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
