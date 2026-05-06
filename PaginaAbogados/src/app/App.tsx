import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import {
  Scale,
  Feather,
  ShieldCheck,
  Building2,
  Search,
  Swords,
  Gavel,
  Handshake,
  Lock,
  BadgeCheck,
  Accessibility,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const AUTHORITY_BLUE = "#0F2A47";
const TRUST_GRAY = "#6B7280";
const MUTED = "#9CA3AF";
const SECURITY_GREEN = "#3E6B53";
const WHITE = "#FFFFFF";
const SOFT = "#F7F8FA";
const LINE = "#E6E8EC";

const FONT = "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif";

const competencias = [
  {
    title: "Derechos pensionales",
    icon: Scale,
    text: "Reclamaciones de pensión, reliquidaciones y defensa ante la administración.",
  },
  {
    title: "Sucesiones y voluntad previa",
    icon: Feather,
    text: "Redacción de testamentos, procesos sucesorios y planeación patrimonial familiar.",
  },
  {
    title: "Protección ante el maltrato legal",
    icon: ShieldCheck,
    text: "Medidas de protección, defensa ante abuso patrimonial o físico, procesos de interdicción.",
  },
  {
    title: "Derechos de vivienda y salud",
    icon: Building2,
    text: "Contratos de arrendamiento, defensa ante desahucios, reclamaciones por negligencia médica.",
  },
];

const proceso = [
  { n: "01", title: "Evaluación de expediente", icon: Search, text: "Analizamos su caso con discreción y precisión." },
  { n: "02", title: "Diseño de estrategia legal", icon: Swords, text: "Construimos un plan jurídico a su medida." },
  { n: "03", title: "Representación y gestión", icon: Gavel, text: "Actuamos ante toda instancia administrativa o judicial." },
  { n: "04", title: "Resolución y seguimiento", icon: Handshake, text: "Acompañamiento posterior hasta el cierre completo." },
];

const garantias = [
  { icon: Lock, title: "Confidencialidad garantizada", text: "Su información permanece protegida en todo momento." },
  { icon: BadgeCheck, title: "Abogados colegiados", text: "Profesionales acreditados con trayectoria verificable." },
  { icon: Accessibility, title: "Atención prioritaria", text: "Procesos accesibles diseñados para adultos mayores." },
];

export default function App() {
  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: WHITE, color: AUTHORITY_BLUE, fontFamily: FONT }}
    >
      {/* Section 1 — Hero */}
      <section className="w-full px-4 lg:px-6 pt-4 lg:pt-6">
        <div
          className="relative w-full overflow-hidden rounded-3xl"
          style={{ backgroundColor: AUTHORITY_BLUE, minHeight: "min(88vh, 820px)" }}
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=2000&q=80"
            alt="Abogados con adultos mayores"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${AUTHORITY_BLUE}80 0%, ${AUTHORITY_BLUE}33 35%, ${AUTHORITY_BLUE}E6 100%)`,
            }}
          />

          <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-6 text-white">
            <div className="flex items-center gap-2" style={{ letterSpacing: "0.25em", fontWeight: 600 }}>
              <span>LEX</span>
              <span style={{ color: "#E9D9B8" }}>·</span>
              <span style={{ fontWeight: 400 }}>SENIOR</span>
            </div>
            <ul className="hidden md:flex items-center gap-10" style={{ fontSize: "0.9rem", fontWeight: 400 }}>
              <li className="opacity-90 hover:opacity-100 cursor-pointer">Inicio</li>
              <li className="opacity-90 hover:opacity-100 cursor-pointer">Áreas</li>
              <li className="opacity-90 hover:opacity-100 cursor-pointer">Proceso</li>
              <li className="opacity-90 hover:opacity-100 cursor-pointer">Contacto</li>
            </ul>
            <button
              className="hidden md:inline-flex items-center px-5 py-2.5 rounded-full border border-white/25 hover:bg-white/10 transition"
              style={{ fontSize: "0.85rem", fontWeight: 500 }}
            >
              Consulta
            </button>
          </nav>

          <div
            className="relative z-10 flex flex-col justify-end px-6 lg:px-12 pb-12 lg:pb-16"
            style={{ minHeight: "calc(min(88vh, 820px) - 88px)" }}
          >
            <div className="max-w-5xl">
              <p
                className="text-white/75 uppercase mb-6"
                style={{ letterSpacing: "0.35em", fontSize: "0.75rem", fontWeight: 500 }}
              >
                Bufete · Derecho de la Vejez
              </p>
              <h1
                className="text-white mb-8"
                style={{
                  fontWeight: 300,
                  lineHeight: 1.0,
                  fontSize: "clamp(2.5rem, 7vw, 5.75rem)",
                  letterSpacing: "-0.03em",
                }}
              >
                Defensa jurídica<br />
                <span style={{ fontWeight: 400, color: "#E9D9B8", fontStyle: "italic" }}>
                  para la edad de oro.
                </span>
              </h1>
              <p
                className="text-white/80 max-w-xl mb-10"
                style={{ lineHeight: 1.6, fontSize: "1.05rem", fontWeight: 300 }}
              >
                Protegemos sus derechos con discreción, experiencia y atención prioritaria.
                Su tranquilidad legal es nuestra misión.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-12">
                <button
                  style={{ backgroundColor: SECURITY_GREEN, fontWeight: 500 }}
                  className="text-white px-7 py-3.5 rounded-full hover:brightness-110 transition"
                >
                  Solicitar consulta confidencial
                </button>
                <button
                  className="px-7 py-3.5 rounded-full border border-white/25 text-white hover:bg-white/10 transition"
                  style={{ fontWeight: 500 }}
                >
                  Conocer áreas legales →
                </button>
              </div>

              <div className="flex flex-wrap gap-x-12 gap-y-6 pt-8 border-t border-white/15 text-white">
                {[
                  ["25+", "Años de experiencia"],
                  ["1.200", "Casos resueltos"],
                  ["98%", "Satisfacción"],
                  ["24h", "Respuesta inicial"],
                ].map(([k, v]) => (
                  <div key={v}>
                    <div style={{ fontSize: "1.85rem", fontWeight: 400, letterSpacing: "-0.02em" }}>{k}</div>
                    <div className="text-white/60" style={{ fontSize: "0.8rem", fontWeight: 400 }}>
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — Competencias */}
      <section className="w-full py-24 lg:py-32" style={{ backgroundColor: WHITE }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mb-16">
            <p
              className="uppercase mb-4"
              style={{ color: MUTED, letterSpacing: "0.25em", fontSize: "0.75rem", fontWeight: 500 }}
            >
              Áreas de práctica
            </p>
            <h2
              style={{
                color: AUTHORITY_BLUE,
                fontWeight: 400,
                fontSize: "clamp(1.85rem, 3.5vw, 3rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              Competencias jurídicas <span style={{ color: MUTED }}>especializadas en cada etapa de la vida.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {competencias.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.title}
                  className="p-10 lg:p-12 rounded-2xl transition hover:shadow-sm"
                  style={{ backgroundColor: SOFT, border: `1px solid ${LINE}` }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-6"
                    style={{ backgroundColor: WHITE, border: `1px solid ${LINE}` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: AUTHORITY_BLUE }} strokeWidth={1.5} />
                  </div>
                  <h3
                    style={{ color: AUTHORITY_BLUE, fontWeight: 500, fontSize: "1.25rem", letterSpacing: "-0.01em" }}
                    className="mb-3"
                  >
                    {c.title}
                  </h3>
                  <p style={{ color: TRUST_GRAY, lineHeight: 1.65, fontSize: "0.95rem", fontWeight: 400 }}>
                    {c.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3 — Proceso */}
      <section className="w-full py-24 lg:py-32" style={{ backgroundColor: SOFT }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mb-20">
            <p
              className="uppercase mb-4"
              style={{ color: MUTED, letterSpacing: "0.25em", fontSize: "0.75rem", fontWeight: 500 }}
            >
              Nuestro método
            </p>
            <h2
              style={{
                color: AUTHORITY_BLUE,
                fontWeight: 400,
                fontSize: "clamp(1.85rem, 3.5vw, 3rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              Un proceso transparente, <span style={{ color: MUTED }}>diseñado para acompañarle paso a paso.</span>
            </h2>
          </div>

          <div className="relative">
            <div
              className="hidden md:block absolute left-0 right-0 top-6 h-px"
              style={{ backgroundColor: LINE }}
            />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative">
              {proceso.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.n} className="flex flex-col">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white relative z-10 mb-6"
                      style={{ backgroundColor: AUTHORITY_BLUE }}
                    >
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div
                      style={{ color: MUTED, fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.1em" }}
                      className="mb-2"
                    >
                      {p.n}
                    </div>
                    <h4
                      style={{ color: AUTHORITY_BLUE, fontWeight: 500, fontSize: "1.1rem", letterSpacing: "-0.01em" }}
                      className="mb-3"
                    >
                      {p.title}
                    </h4>
                    <p style={{ color: TRUST_GRAY, lineHeight: 1.6, fontSize: "0.9rem", fontWeight: 400 }}>
                      {p.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 — Garantías + form */}
      <section className="w-full py-24 lg:py-32" style={{ backgroundColor: WHITE }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p
              className="uppercase mb-4"
              style={{ color: MUTED, letterSpacing: "0.25em", fontSize: "0.75rem", fontWeight: 500 }}
            >
              Garantías
            </p>
            <h2
              style={{
                color: AUTHORITY_BLUE,
                fontWeight: 400,
                fontSize: "clamp(1.85rem, 3.5vw, 2.75rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
              className="mb-12"
            >
              Tranquilidad <span style={{ fontStyle: "italic", color: SECURITY_GREEN }}>en cada decisión.</span>
            </h2>
            <ul className="space-y-8">
              {garantias.map((g) => {
                const Icon = g.icon;
                return (
                  <li key={g.title} className="flex items-start gap-5">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: SOFT, border: `1px solid ${LINE}` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: AUTHORITY_BLUE }} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, color: AUTHORITY_BLUE }} className="mb-1">
                        {g.title}
                      </div>
                      <div style={{ color: TRUST_GRAY, fontSize: "0.95rem", lineHeight: 1.6, fontWeight: 400 }}>
                        {g.text}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="p-8 lg:p-10 rounded-2xl"
            style={{ backgroundColor: SOFT, border: `1px solid ${LINE}` }}
          >
            <h3
              style={{ color: AUTHORITY_BLUE, fontWeight: 500, fontSize: "1.5rem", letterSpacing: "-0.01em" }}
              className="mb-2"
            >
              Inicie su consulta confidencial
            </h3>
            <p style={{ color: TRUST_GRAY, fontSize: "0.95rem", fontWeight: 400 }} className="mb-8">
              Le contactaremos en menos de 24 horas hábiles.
            </p>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre completo"
                className="w-full px-4 py-3.5 rounded-xl outline-none bg-white"
                style={{ border: `1px solid ${LINE}`, color: AUTHORITY_BLUE, fontFamily: FONT, fontSize: "0.95rem" }}
              />
              <input
                type="tel"
                placeholder="Teléfono"
                className="w-full px-4 py-3.5 rounded-xl outline-none bg-white"
                style={{ border: `1px solid ${LINE}`, color: AUTHORITY_BLUE, fontFamily: FONT, fontSize: "0.95rem" }}
              />
              <select
                className="w-full px-4 py-3.5 rounded-xl outline-none bg-white"
                style={{ border: `1px solid ${LINE}`, color: AUTHORITY_BLUE, fontFamily: FONT, fontSize: "0.95rem" }}
                defaultValue=""
              >
                <option value="" disabled>
                  Método de contacto preferido
                </option>
                <option>Llamada telefónica</option>
                <option>Email</option>
              </select>
              <textarea
                rows={3}
                placeholder="Tipo de consulta legal"
                className="w-full px-4 py-3.5 rounded-xl outline-none resize-none bg-white"
                style={{ border: `1px solid ${LINE}`, color: AUTHORITY_BLUE, fontFamily: FONT, fontSize: "0.95rem" }}
              />
              <button
                type="submit"
                style={{ backgroundColor: SECURITY_GREEN, fontWeight: 500 }}
                className="w-full text-white px-6 py-4 rounded-full hover:brightness-110 transition mt-2"
              >
                Empezar mi proceso jurídico hoy
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: WHITE, borderTop: `1px solid ${LINE}` }} className="w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div
              className="flex items-center gap-2 mb-3"
              style={{ letterSpacing: "0.25em", fontWeight: 600, color: AUTHORITY_BLUE }}
            >
              <span>LEX</span>
              <span style={{ color: SECURITY_GREEN }}>·</span>
              <span style={{ fontWeight: 400 }}>SENIOR</span>
            </div>
            <p style={{ color: TRUST_GRAY, fontSize: "0.9rem", lineHeight: 1.6, fontWeight: 400 }}>
              Defensa jurídica especializada en derechos de la edad de oro.
            </p>
          </div>
          <div className="flex items-start gap-3" style={{ color: TRUST_GRAY, fontSize: "0.9rem" }}>
            <MapPin className="w-4 h-4 mt-1 shrink-0" style={{ color: AUTHORITY_BLUE }} strokeWidth={1.5} />
            <span>Av. Reforma 1245, Piso 12<br />Despacho Jurídico</span>
          </div>
          <div className="flex items-center gap-3" style={{ color: TRUST_GRAY, fontSize: "0.9rem" }}>
            <Phone className="w-4 h-4 shrink-0" style={{ color: AUTHORITY_BLUE }} strokeWidth={1.5} />
            <span>+52 (55) 4521 8830</span>
          </div>
          <div className="flex items-center gap-3" style={{ color: TRUST_GRAY, fontSize: "0.9rem" }}>
            <Mail className="w-4 h-4 shrink-0" style={{ color: AUTHORITY_BLUE }} strokeWidth={1.5} />
            <span>contacto@lexsenior.legal</span>
          </div>
        </div>
        <div
          className="text-center py-6"
          style={{ borderTop: `1px solid ${LINE}`, color: MUTED, fontSize: "0.85rem", fontWeight: 400 }}
        >
          © 2026 Lex Senior. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
