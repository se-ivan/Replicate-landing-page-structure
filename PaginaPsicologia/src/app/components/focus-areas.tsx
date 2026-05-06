import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { FadeIn } from "./fade-in";

const areas = [
  {
    title: "Ansiedad y Pánico",
    img: "https://images.unsplash.com/photo-1749325390269-b9764b27f613?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
  },
  {
    title: "Depresión y Tristeza",
    img: "https://images.unsplash.com/photo-1691520370009-f5bb5a6c202d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
  },
  {
    title: "Manejo del Estrés",
    img: "https://images.unsplash.com/photo-1603947856288-272b08a5feab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
  },
  {
    title: "Transiciones de Vida",
    img: "https://images.unsplash.com/photo-1764153365149-ffa4b66db6f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
  },
];

function ImageCard({ title, img }: { title: string; img: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="relative rounded-2xl overflow-hidden group w-full h-full"
    >
      <motion.div whileHover={{ scale: 1.08 }} transition={{ duration: 0.8 }} className="w-full h-full">
        <ImageWithFallback src={img} alt={title} className="w-full h-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <div style={{ fontSize: "0.95rem", fontWeight: 500 }}>{title}</div>
      </div>
    </motion.div>
  );
}

export function FocusAreas() {
  return (
    <section id="especialidades" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Desktop / tablet grid: 3 cols x 2 rows */}
        <div className="hidden md:grid grid-cols-3 grid-rows-4 gap-5" style={{ height: "680px" }}>
          {/* Col 1 rows 1-2: Text */}
          <FadeIn className="row-span-2 flex flex-col justify-center pr-4">
            <div className="text-[#5B7B53] mb-4" style={{ fontSize: "0.8rem", letterSpacing: "0.25em" }}>
              NUESTRO ENFOQUE
            </div>
            <h2 className="text-[#1C4432] mb-5" style={{ fontSize: "clamp(1.75rem, 3.2vw, 2.75rem)", fontWeight: 400, lineHeight: 1.15 }}>
              Áreas de <span className="italic">enfoque</span>.
            </h2>
            <p className="text-[#3a3a3a]/75" style={{ fontSize: "0.95rem", lineHeight: 1.7 }}>
              La salud mental requiere atención especializada según el síntoma. Cada área combina técnicas cognitivo-conductuales, humanistas y mindfulness.
            </p>
          </FadeIn>

          {/* Col 2 rows 1-2: Ansiedad */}
          <FadeIn delay={0.05} className="row-span-2">
            <ImageCard {...areas[0]} />
          </FadeIn>

          {/* Col 3 rows 1-3: Transiciones (tall, 1.5x) */}
          <FadeIn delay={0.1} className="row-span-3">
            <ImageCard {...areas[3]} />
          </FadeIn>

          {/* Col 1 rows 3-4: Depresión */}
          <FadeIn delay={0.15} className="row-span-2">
            <ImageCard {...areas[1]} />
          </FadeIn>

          {/* Col 2 rows 3-4: Estrés */}
          <FadeIn delay={0.2} className="row-span-2">
            <ImageCard {...areas[2]} />
          </FadeIn>

          {/* Col 3 row 4: button in whitespace */}
          <FadeIn delay={0.25} className="flex items-center justify-center">
            <a
              href="#contacto"
              className="group inline-flex items-center gap-3 border border-black/15 text-[#1C4432] rounded-full pl-6 pr-2 py-2 hover:bg-[#1C4432] hover:text-white hover:border-[#1C4432] transition-all"
            >
              <span style={{ fontSize: "0.95rem" }}>Contactar</span>
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1C4432] text-white group-hover:bg-white group-hover:text-[#1C4432] group-hover:rotate-45 transition-transform">
                <ArrowUpRight size={16} />
              </span>
            </a>
          </FadeIn>
        </div>

        {/* Mobile stacked layout */}
        <div className="md:hidden">
          <FadeIn>
            <div className="text-[#5B7B53] mb-4" style={{ fontSize: "0.75rem", letterSpacing: "0.25em" }}>
              NUESTRO ENFOQUE
            </div>
            <h2 className="text-[#1C4432] mb-5" style={{ fontSize: "2rem", fontWeight: 400, lineHeight: 1.15 }}>
              Áreas de <span className="italic">enfoque</span>.
            </h2>
            <p className="text-[#3a3a3a]/75 mb-8" style={{ fontSize: "0.95rem", lineHeight: 1.7 }}>
              La salud mental requiere atención especializada según el síntoma. Cada área combina técnicas cognitivo-conductuales, humanistas y mindfulness.
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 gap-4">
            {areas.map((a, i) => (
              <FadeIn key={a.title} delay={i * 0.08}>
                <div className="aspect-[3/4]">
                  <ImageCard {...a} />
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <a
              href="#contacto"
              className="inline-flex items-center gap-3 border border-black/15 text-[#1C4432] rounded-full pl-6 pr-2 py-2"
            >
              <span style={{ fontSize: "0.9rem" }}>Contactar</span>
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1C4432] text-white">
                <ArrowUpRight size={16} />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
