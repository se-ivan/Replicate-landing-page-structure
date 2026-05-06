import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { FadeIn } from "./fade-in";

function Counter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(end * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end]);

  return (
    <span ref={ref}>
      {prefix}{value}{suffix}
    </span>
  );
}

const stats = [
  { value: 12, suffix: "+", label: "Años de experiencia clínica" },
  { value: 100, suffix: "%", label: "Confidencialidad garantizada" },
  { value: 500, suffix: "+", label: "Pacientes acompañados" },
];

export function About() {
  return (
    <section id="acerca" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          <FadeIn>
            <div className="text-[#5B7B53] mb-4" style={{ fontSize: "0.8rem", letterSpacing: "0.25em" }}>
              ACERCA DE
            </div>
            <h2 className="text-[#1C4432] mb-8" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 400, lineHeight: 1.15 }}>
              Soy <span className="italic">Catalina Gallegos Mosqueda</span>, psicóloga clínica.
            </h2>
            <div className="space-y-5 text-[#3a3a3a]/75" style={{ fontSize: "1rem", lineHeight: 1.7 }}>
              <p>
                Mi enfoque es cálido, empático y basado en evidencia. Acompaño a personas que atraviesan episodios de <span className="text-[#1C4432]">depresión</span>, <span className="text-[#1C4432]">ansiedad</span> y <span className="text-[#1C4432]">estrés</span>, trabajando contigo desde la escucha profunda y sin juicios.
              </p>
              <p>
                Pedir ayuda es un acto de valentía. En cada sesión encontrarás un espacio donde tu historia importa, y donde construiremos juntos las herramientas para recuperar tu bienestar.
              </p>
            </div>
          </FadeIn>

          <div className="flex flex-col gap-6 md:border-l md:border-black/5 md:pl-12">
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.1}>
                <motion.div
                  whileHover={{ x: 6 }}
                  className="border-b border-black/10 pb-6 last:border-b-0"
                >
                  <div className="text-[#1C4432]" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 400, lineHeight: 1 }}>
                    <Counter end={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-3 text-[#3a3a3a]/70" style={{ fontSize: "0.95rem" }}>
                    {s.label}
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
