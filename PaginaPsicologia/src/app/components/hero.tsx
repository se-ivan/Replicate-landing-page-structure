import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  const marginX = useTransform(scrollY, [0, 500], [0, 48]);
  const marginTop = useTransform(scrollY, [0, 500], [0, 96]);
  const radius = useTransform(scrollY, [0, 500], [0, 32]);
  const height = useTransform(scrollY, [0, 500], ["100vh", "78vh"]);

  return (
    <section ref={ref} id="inicio" className="relative" style={{ height: "100vh" }}>
      <motion.div
        style={{
          marginLeft: marginX,
          marginRight: marginX,
          marginTop,
          borderRadius: radius,
          height,
        }}
        className="relative overflow-hidden"
      >
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1765447041709-9f1efbc81606?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=2400&q=80"
          alt="Espacio cálido y sereno"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-black/10" />

        <div className="absolute inset-0 flex items-center">
          <div className="px-8 md:px-20 max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="text-white tracking-tight"
              style={{
                fontSize: "clamp(2.5rem, 6.5vw, 5.5rem)",
                fontWeight: 500,
                lineHeight: 1.05,
              }}
            >
              Tu espacio seguro <br />
              para encontrar <span className="italic">el equilibrio.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="mt-6 text-white/85 max-w-xl"
              style={{ fontSize: "1.05rem", lineHeight: 1.6 }}
            >
              Te ayudamos a transitar los retos de la vida, cuidar tu salud mental y fortalecer tu bienestar emocional en un entorno confidencial.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.65 }}
              className="mt-9"
            >
              <a
                href="#contacto"
                className="group inline-flex items-center gap-3 bg-[#1C2A22] text-white rounded-full pl-6 pr-2 py-2 hover:bg-[#2a4435] transition-colors"
              >
                <span style={{ fontSize: "0.95rem" }}>Agendar una cita</span>
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-[#1C2A22] group-hover:rotate-45 transition-transform">
                  <ArrowUpRight size={16} />
                </span>
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
