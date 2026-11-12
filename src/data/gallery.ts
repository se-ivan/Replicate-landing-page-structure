import { safeSiteOrHttpUrl } from "./url";

export interface EventPhotoItem {
  id: string;
  title: string;
  eventName: string;
  caption: string;
  imageUrl: string;
  featured: boolean;
  published: boolean;
  takenAt: string;
  creadoEn: string;
  actualizadoEn: string;
}

export type EventPhotoInput = {
  id?: string;
  title?: string;
  eventName?: string;
  caption?: string;
  imageUrl: string;
  featured?: boolean;
  published?: boolean;
  takenAt?: string;
};

export const safePhotoUrl = safeSiteOrHttpUrl;

export const defaultGalleryPhotos: EventPhotoItem[] = [
  {
    id: "taller-bienestar-morelia-1",
    title: "Círculo de diálogo y bienestar",
    eventName: "Taller de Jubilación Activa",
    caption: "Encuentro presencial en Morelia compartiendo herramientas emocionales para la etapa del retiro.",
    imageUrl:
      "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
    featured: true,
    published: true,
    takenAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    creadoEn: new Date(Date.now() - 86400000 * 3).toISOString(),
    actualizadoEn: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "jornada-patrimonio-morelia-2",
    title: "Asesoría y orientación patrimonial",
    eventName: "Jornada de Derechos Mayores",
    caption: "Espacio cercano para resolver dudas sobre testamentos, pensiones y protección familiar.",
    imageUrl:
      "https://images.unsplash.com/photo-1768839722927-df0ef3188f6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
    featured: false,
    published: true,
    takenAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    creadoEn: new Date(Date.now() - 86400000 * 7).toISOString(),
    actualizadoEn: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: "acompanamiento-grupal-morelia-3",
    title: "Sesión de escucha y comunidad",
    eventName: "Encuentro de Cuidadores y Familias",
    caption: "Acompañamiento grupal enfocado en el autocuidado y la tranquilidad cotidiana.",
    imageUrl:
      "https://images.unsplash.com/photo-1714976694664-4293ac04138e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
    featured: false,
    published: true,
    takenAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    creadoEn: new Date(Date.now() - 86400000 * 12).toISOString(),
    actualizadoEn: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
  {
    id: "actividad-aire-libre-morelia-4",
    title: "Convivencia al aire libre",
    eventName: "Mañana de Bienestar Integral",
    caption: "Actividades recreativas y fortalecimiento de redes de apoyo entre participantes.",
    imageUrl:
      "https://images.unsplash.com/photo-1774537617358-3614ba7e8aa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
    featured: false,
    published: true,
    takenAt: new Date(Date.now() - 86400000 * 18).toISOString(),
    creadoEn: new Date(Date.now() - 86400000 * 18).toISOString(),
    actualizadoEn: new Date(Date.now() - 86400000 * 18).toISOString(),
  },
];
