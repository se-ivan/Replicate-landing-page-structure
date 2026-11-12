import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Calendar, Camera, ChevronLeft, ChevronRight, ImageIcon, Maximize2, X } from "lucide-react";
import { defaultGalleryPhotos, safePhotoUrl, type EventPhotoItem } from "../../data/gallery";

type Props = {
  photos?: EventPhotoItem[];
  isAdmin?: boolean;
};

function formatEventDate(iso: string): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function GalleryPhotoImage({
  item,
  expanded = false,
}: {
  item: EventPhotoItem;
  expanded?: boolean;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const imageUrl = safePhotoUrl(item.imageUrl);
  const altText = item.title || item.eventName || "Fotografía de evento de Plenitud Emocional";

  return imageUrl && failedUrl !== imageUrl ? (
    <img
      src={imageUrl}
      alt={altText}
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setFailedUrl(imageUrl)}
      className={
        expanded
          ? "mx-auto max-h-[72vh] w-full rounded-xl object-contain"
          : "h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      }
    />
  ) : (
    <div className="flex h-full min-h-48 flex-col items-center justify-center gap-3 px-6 text-center text-[#1a2e1a]">
      <ImageIcon className="h-9 w-9 text-[#8aaf7e]" aria-hidden="true" />
      <span className="font-['Inter'] text-sm text-[#5a6b5a]">Fotografía no disponible</span>
    </div>
  );
}

export function EventGallerySection({ photos = defaultGalleryPhotos, isAdmin = false }: Props) {
  const items = useMemo(
    () =>
      photos
        .filter((item) => item.published && safePhotoUrl(item.imageUrl))
        .sort((a, b) => {
          if (a.featured !== b.featured) return a.featured ? -1 : 1;
          return new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime();
        }),
    [photos],
  );

  const [carouselRef, api] = useEmblaCarousel({
    align: "start",
    loop: items.length > 1,
    containScroll: "trimSnaps",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const selectedTrigger = useRef<HTMLButtonElement | null>(null);

  const onSelect = useCallback(() => {
    setSelectedIndex(api?.selectedScrollSnap() ?? 0);
  }, [api]);

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

  const currentIndex = Math.max(0, Math.min(selectedIndex, Math.max(items.length - 1, 0)));
  const activeLightboxItem = lightboxIndex !== null ? items[lightboxIndex] ?? null : null;

  const stepLightbox = useCallback(
    (delta: number) => {
      setLightboxIndex((prev) => {
        if (prev === null || items.length === 0) return null;
        return (prev + delta + items.length) % items.length;
      });
    },
    [items.length],
  );

  const arrowClass =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d7dcd1] bg-white text-[#1a2e1a] transition hover:bg-[#edf1e8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2d5a27]";

  const slideBasisClass =
    items.length === 1
      ? "flex-[0_0_100%]"
      : items.length === 2
        ? "flex-[0_0_100%] sm:flex-[0_0_50%]"
        : "flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.3333%]";

  return (
    <section
      id="galeria"
      aria-labelledby="event-gallery-title"
      className="scroll-mt-24 border-y border-[#e5e0d8]/80 bg-[#f9f7f3] px-5 py-16 md:px-12 md:py-20 lg:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 font-['Inter'] text-xs font-semibold uppercase tracking-[1.8px] text-[#5a6b5a]">
              Momentos compartidos
            </p>
            <h2
              id="event-gallery-title"
              className="font-['Playfair_Display'] text-3xl font-medium text-[#1a2e1a] sm:text-4xl md:text-5xl"
            >
              Galería de eventos
            </h2>
            <p className="mt-2 max-w-xl font-['Inter'] text-sm leading-relaxed text-[#5a6b5a]">
              Fotografías de nuestros talleres, jornadas informativas y encuentros comunitarios en Morelia.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <a
                href="/admin?tab=galeria"
                className="mr-1 inline-flex items-center gap-2 rounded-full border border-[#d7dcd1] bg-white px-4 py-2.5 font-['Inter'] text-xs font-medium text-[#1a2e1a] transition hover:bg-[#edf1e8]"
              >
                <Camera className="h-3.5 w-3.5 text-[#2d5a27]" aria-hidden="true" />
                Subir fotografías
              </a>
            )}
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => api?.scrollPrev()}
                  className={arrowClass}
                  aria-label="Fotografía anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => api?.scrollNext()}
                  className={arrowClass}
                  aria-label="Fotografía siguiente"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-[#e5e0d8] bg-white px-6 py-12 text-center">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#edf0e8] text-[#2d5a27]">
              <Camera className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="font-['Inter'] text-lg font-semibold text-[#1a2e1a]">
              Próximamente, fotografías de nuestros eventos
            </h3>
            <p className="mt-2 max-w-md font-['Inter'] text-sm leading-relaxed text-[#5a6b5a]">
              Aquí compartiremos recuerdos de nuestros talleres, charlas y actividades con la comunidad.
            </p>
          </div>
        ) : (
          <div
            role="region"
            aria-roledescription="carrusel"
            aria-label="Galería fotográfica de eventos de Plenitud Emocional"
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
            <div
              ref={carouselRef}
              className={`overflow-hidden ${items.length === 1 ? "mx-auto max-w-3xl" : ""}`}
            >
              <div className="-ml-4 flex touch-pan-y">
                {items.map((item, index) => {
                  const dateLabel = formatEventDate(item.takenAt);
                  const hasDetails = Boolean(item.title || item.caption || item.eventName || dateLabel);
                  return (
                    <article
                      key={item.id}
                      role="group"
                      aria-roledescription="diapositiva"
                      aria-label={`Fotografía ${index + 1} de ${items.length}${item.title ? `: ${item.title}` : ""}`}
                      className={`min-w-0 pl-4 ${slideBasisClass}`}
                    >
                      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#e5e0d8] bg-white shadow-sm transition hover:border-[#2d5a27]/30 hover:shadow-md">
                        <button
                          type="button"
                          onClick={(event) => {
                            selectedTrigger.current = event.currentTarget;
                            setLightboxIndex(index);
                          }}
                          aria-label={`Ver fotografía ampliada${item.title ? `: ${item.title}` : ""}`}
                          className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-[#edf0e8] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#2d5a27]"
                        >
                          <GalleryPhotoImage item={item} />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          {item.eventName && (
                            <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-white/95 px-3 py-1 font-['Inter'] text-xs font-medium text-[#1a2e1a] shadow-sm">
                              {item.eventName}
                            </span>
                          )}
                          <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-[#e5e0d8] bg-white/95 px-3 py-1.5 font-['Inter'] text-xs text-[#1a2e1a] shadow-sm transition group-hover:bg-white">
                            <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                            Ampliar
                          </span>
                        </button>

                        {hasDetails && (
                          <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                            <div>
                              {item.title && (
                                <h3 className="break-words font-['Inter'] text-base font-semibold leading-snug text-[#1a2e1a]">
                                  {item.title}
                                </h3>
                              )}
                              {item.caption && (
                                <p className="mt-1.5 line-clamp-2 break-words font-['Inter'] text-sm leading-relaxed text-[#5a6b5a]">
                                  {item.caption}
                                </p>
                              )}
                            </div>
                            {dateLabel && (
                              <p className="mt-3 flex items-center gap-1.5 font-['Inter'] text-xs text-[#5a6b5a]">
                                <Calendar className="h-3.5 w-3.5 text-[#2d5a27]" aria-hidden="true" />
                                <span>{dateLabel}</span>
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {items.length > 1 && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-1">
                {items.map((item, index) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => api?.scrollTo(index)}
                    aria-label={`Ir a la fotografía ${index + 1}${item.title ? `: ${item.title}` : ""}`}
                    aria-current={index === currentIndex ? "true" : undefined}
                    className="flex h-11 min-w-9 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-[#2d5a27]"
                  >
                    <span
                      className={`h-2 rounded-full transition-all motion-reduce:transition-none ${
                        index === currentIndex ? "w-6 bg-[#2d5a27]" : "w-2 bg-[#b9c3b4]"
                      }`}
                    />
                  </button>
                ))}
                <p aria-live="polite" aria-atomic="true" className="ml-3 font-['Inter'] text-xs text-[#5a6b5a]">
                  {currentIndex + 1} / {items.length}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog.Root
        open={Boolean(activeLightboxItem)}
        onOpenChange={(open) => {
          if (!open) setLightboxIndex(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[90] bg-black/75 backdrop-blur-sm" />
          <Dialog.Content
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              selectedTrigger.current?.focus();
            }}
            onKeyDown={(event) => {
              if (items.length <= 1) return;
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                stepLightbox(-1);
              } else if (event.key === "ArrowRight") {
                event.preventDefault();
                stepLightbox(1);
              }
            }}
            className="fixed left-1/2 top-1/2 z-[91] max-h-[92dvh] w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4 pr-12">
              <div className="min-w-0">
                {activeLightboxItem?.eventName && (
                  <p className="font-['Inter'] text-xs font-semibold uppercase tracking-[1.4px] text-[#2d5a27]">
                    {activeLightboxItem.eventName}
                  </p>
                )}
                <Dialog.Title className="mt-1 break-words font-['Inter'] text-lg font-semibold text-[#1a2e1a] sm:text-xl">
                  {activeLightboxItem?.title || activeLightboxItem?.eventName || "Fotografía del evento"}
                </Dialog.Title>
                <Dialog.Description className="sr-only">
                  Vista ampliada de la fotografía de evento.
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close
              aria-label="Cerrar fotografía"
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#f5f2ec] text-[#1a2e1a] hover:bg-[#e5e0d8]"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>

            {activeLightboxItem && (
              <div className="relative mt-4 rounded-xl bg-[#141f14] p-2">
                <GalleryPhotoImage item={activeLightboxItem} expanded />
                {items.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => stepLightbox(-1)}
                      aria-label="Fotografía anterior"
                      className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1a2e1a] shadow-md transition hover:bg-white"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => stepLightbox(1)}
                      aria-label="Fotografía siguiente"
                      className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1a2e1a] shadow-md transition hover:bg-white"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                {activeLightboxItem?.caption && (
                  <p className="break-words font-['Inter'] text-sm leading-relaxed text-[#3a4a3a]">
                    {activeLightboxItem.caption}
                  </p>
                )}
                {activeLightboxItem?.takenAt && (
                  <p className="mt-1.5 flex items-center gap-1.5 font-['Inter'] text-xs text-[#5a6b5a]">
                    <Calendar className="h-3.5 w-3.5 text-[#2d5a27]" aria-hidden="true" />
                    <span>{formatEventDate(activeLightboxItem.takenAt)}</span>
                  </p>
                )}
              </div>
              {items.length > 1 && lightboxIndex !== null && (
                <span className="rounded-full bg-[#f5f2ec] px-3 py-1 font-['Inter'] text-xs font-medium text-[#5a6b5a]">
                  {lightboxIndex + 1} / {items.length}
                </span>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
