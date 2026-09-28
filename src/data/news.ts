export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  imageUrl?: string | null;
  linkUrl?: string | null;
  linkText?: string | null;
  featured: boolean;
  published: boolean;
  publishedAt: string;
  creadoEn: string;
  actualizadoEn: string;
}

export type NewsInput = {
  id?: string;
  title: string;
  summary: string;
  content?: string;
  category?: string;
  imageUrl?: string | null;
  linkUrl?: string | null;
  linkText?: string | null;
  featured?: boolean;
  published?: boolean;
  publishedAt?: string;
};

export const defaultNews: NewsItem[] = [
  {
    id: "taller-bienestar-emocional-jubilacion",
    title: "Nuevo Taller de Bienestar Emocional y Adaptación a la Jubilación",
    summary:
      "Abrimos inscripciones para nuestro ciclo de talleres vivenciales dirigidos a personas adultas mayores que inician su etapa de retiro en Morelia.",
    content:
      "El paso a la jubilación implica un cambio profundo en la rutina, el sentido de propósito y la dinámica cotidiana. En este taller de cuatro semanas trabajaremos herramientas prácticas para la gestión del tiempo libre, el fortalecimiento de la autoestima y el reencuentro con nuevos proyectos personales en un ambiente cálido, seguro y guiado por especialistas en psicología.",
    category: "Taller",
    imageUrl:
      "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
    linkUrl: "/agendar",
    linkText: "Inscribirme al taller",
    featured: true,
    published: true,
    publishedAt: new Date().toISOString(),
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  },
  {
    id: "jornada-orientacion-legal-patrimonio",
    title: "Jornada de Orientación Legal sobre Testamentos y Protección Patrimonial",
    summary:
      "Acompañamiento especializado para resolver dudas sobre certeza patrimonial, donaciones y prevención de conflictos familiares en Morelia.",
    content:
      "Proteger el patrimonio familiar que tomó años construir brinda paz mental duradera. Durante esta jornada, nuestro equipo jurídico ofrecerá asesorías personalizadas para explicar los alcances del testamento, donaciones con usufructo vitalicio y los mecanismos legales necesarios para garantizar la tranquilidad de las personas mayores.",
    category: "Legal",
    imageUrl:
      "https://images.unsplash.com/photo-1768839722927-df0ef3188f6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
    linkUrl: "https://wa.me/524439446738",
    linkText: "Agendar por WhatsApp",
    featured: false,
    published: true,
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    creadoEn: new Date(Date.now() - 86400000 * 2).toISOString(),
    actualizadoEn: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "grupo-apoyo-familiares-cuidadores",
    title: "Círculo de Acompañamiento para Familiares y Cuidadores",
    summary:
      "Un espacio de contención psicológica quincenal para prevenir el agotamiento y promover el autocuidado de quienes cuidan a adultos mayores.",
    content:
      "Cuidar a un ser querido mayor es un acto de amor y dedicación, pero puede generar desgaste físico y emocional significativo si no se cuenta con apoyo. Nuestro círculo ofrece orientación psicológica, escucha activa y estrategias efectivas para establecer límites saludables y cuidar de la propia salud mental.",
    category: "Salud Emocional",
    imageUrl:
      "https://images.unsplash.com/photo-1714976694664-4293ac04138e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
    linkUrl: "/agendar",
    linkText: "Más información",
    featured: false,
    published: true,
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    creadoEn: new Date(Date.now() - 86400000 * 5).toISOString(),
    actualizadoEn: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];
