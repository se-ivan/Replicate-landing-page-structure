import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { FadeIn } from "./fade-in";

const services = [
  {
    id: "terapia-grupal",
    title: "Terapia Grupal",
    desc: "Grupos de apoyo profesionales —incluyendo acompañamiento para la jubilación— donde encontrarás escucha, perspectivas compartidas y crecimiento conjunto.",
    img: "https://images.unsplash.com/photo-1753362594001-60c847cab56a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
    points: ["Acompañamiento jubilación", "Grupos de duelo", "Habilidades sociales"],
  },
  {
    id: "terapia-individual",
    title: "Terapia Individual",
    desc: "Sesiones uno a uno enfocadas en tu proceso personal: niños, adolescentes, adultos y parejas. Un espacio íntimo y confidencial, adaptado a tu etapa de vida.",
    img: "https://images.unsplash.com/photo-1765447041709-9f1efbc81606?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
    points: ["Niños y adolescentes", "Adultos", "Pareja"],
  },
  {
    id: "psicologia-general",
    title: "Psicología en General",
    desc: "Atención clínica integral para ansiedad, depresión, estrés, transiciones de vida y más. Enfoque cognitivo-conductual, humanista y basado en evidencia.",
    img: "https://images.unsplash.com/photo-1749325390269-b9764b27f613?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
    points: ["Ansiedad y pánico", "Depresión", "Manejo del estrés"],
  },
];

const serviceArticleLinks: Record<string, string> = {
  "terapia-grupal": "/articulos/terapia-grupal-adultez-mayor",
  "terapia-individual": "/articulos/terapia-individual-adultez-mayor",
  "psicologia-general": "/articulos/depresion-no-es-normal-envejecimiento",
};

export function Services() {
  return (
    <section id="servicios" className="py-24 md:py-32 bg-[#F7F5F0]">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">
            <div>
              <div className="text-[#5B7B53] mb-4" style={{ fontSize: "0.8rem", letterSpacing: "0.25em" }}>
                SERVICIOS
              </div>
              <h2 className="text-[#1C4432] max-w-2xl" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 400, lineHeight: 1.15 }}>
                Acompañamiento <span className="italic">diseñado</span> para cada etapa de la vida.
              </h2>
            </div>
            <p className="text-[#3a3a3a]/70 max-w-sm" style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>
              Cada proceso es único. Elegimos el enfoque que mejor acompañe tu momento actual.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <FadeIn key={s.id} delay={i * 0.1}>
              <motion.article
                id={s.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="group bg-white rounded-3xl overflow-hidden border border-black/5 h-full flex flex-col"
              >
                <div className="overflow-hidden aspect-[4/3]">
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.6 }} className="h-full">
                    <ImageWithFallback src={s.img} alt={s.title} className="w-full h-full object-cover" />
                  </motion.div>
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <h3 className="text-[#1C4432]" style={{ fontSize: "1.35rem", fontWeight: 500 }}>
                    {s.title}
                  </h3>
                  <p className="mt-3 text-[#3a3a3a]/70" style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>
                    {s.desc}
                  </p>
                  <ul className="mt-5 space-y-2 flex-1">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-[#3a3a3a]/80" style={{ fontSize: "0.9rem" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5B7B53]" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={serviceArticleLinks[s.id] ?? "#contacto"}
                    className="mt-6 inline-flex items-center gap-2 text-[#1C4432] group-hover:gap-3 transition-all"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Conocer más <ArrowUpRight size={16} />
                  </a>
                </div>
              </motion.article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
