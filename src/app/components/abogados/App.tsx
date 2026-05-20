import { useEffect, useState } from "react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { ArticleHighlights } from "../ArticleHighlights";
import type { Article } from "../../../data/articles";
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
  CalendarCheck,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
} from "lucide-react";

const AUTHORITY_BLUE = "#0F2A47";
const TRUST_GRAY = "#6B7280";
const MUTED = "#9CA3AF";
const SECURITY_GREEN = "#3E6B53";
const WHITE = "#FFFFFF";
const SOFT = "#F7F8FA";
const LINE = "#E6E8EC";

const FONT = "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "QuiÃ©nes Somos", href: "/#quienes-somos" },
  { label: "Servicios", href: "/#servicios" },
  { label: "PsicologÃ­a", href: "/psicologia" },
  { label: "Abogados", href: "/abogados", active: true },
  { label: "Blog", href: "/articulos" },
  { label: "Contacto", href: "#contacto" },
];

const competencias = [
  {
    title: "Derechos pensionales",
    icon: Scale,
    text: "Reclamaciones de pensiÃ³n, reliquidaciones y defensa ante la administraciÃ³n.",
  },
  {
    title: "Sucesiones y voluntad previa",
    icon: Feather,
    text: "RedacciÃ³n de testamentos, procesos sucesorios y planeaciÃ³n patrimonial familiar.",
  },
  {
    title: "ProtecciÃ³n ante el maltrato legal",
    icon: ShieldCheck,
    text: "Medidas de protecciÃ³n, defensa ante abuso patrimonial o fÃ­sico, procesos de interdicciÃ³n.",
  },
  {
    title: "Derechos de vivienda y salud",
    icon: Building2,
    text: "Contratos de arrendamiento, defensa ante desahucios, reclamaciones por negligencia mÃ©dica.",
  },
];

const proceso = [
  { n: "01", title: "EvaluaciÃ³n de expediente", icon: Search, text: "Analizamos su caso con discreciÃ³n y precisiÃ³n." },
  { n: "02", title: "DiseÃ±o de estrategia legal", icon: Swords, text: "Construimos un plan jurÃ­dico a su medida." },
  { n: "03", title: "RepresentaciÃ³n y gestiÃ³n", icon: Gavel, text: "Actuamos ante toda instancia administrativa o judicial." },
  { n: "04", title: "ResoluciÃ³n y seguimiento", icon: Handshake, text: "AcompaÃ±amiento posterior hasta el cierre completo." },
];

const garantias = [
  { icon: Lock, title: "Confidencialidad garantizada", text: "Su informaciÃ³n permanece protegida en todo momento." },
  { icon: BadgeCheck, title: "Abogados colegiados", text: "Profesionales acreditados con trayectoria verificable." },
  { icon: Accessibility, title: "AtenciÃ³n prioritaria", text: "Procesos accesibles diseÃ±ados para adultos mayores." },
];

function LegalNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 transition-all duration-500 md:px-12 lg:px-20 ${
        scrolled
          ? "bg-[#f5f2ec]/92 py-3 text-[#1a2e1a] shadow-sm backdrop-blur-sm border-b border-[#1a2e1a]/10"
          : "bg-transparent py-5 text-white"
      }`}
    >
      <a href="/" className="flex items-center gap-3" aria-label="Ir al inicio de Plenitud Emocional">
        <img
          src="/logo.svg"
          alt="Plenitud Emocional"
          className={`h-8 w-auto md:h-12 ${scrolled ? "" : "filter brightness-0 invert"}`}
        />
      </a>

      <div className="hidden items-center gap-7 font-['Inter'] text-sm md:flex">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={`transition hover:opacity-100 ${link.active ? "opacity-100 font-medium" : "opacity-80"}`}
          >
            {link.label}
          </a>
        ))}
      </div>

      <a
        href="/agendar"
        className={`hidden rounded-full border px-5 py-2 font-['Inter'] text-sm transition md:block ${
          scrolled ? "border-[#1a2e1a]/30 hover:bg-[#1a2e1a]/10" : "border-white/40 hover:bg-white/10"
        }`}
      >
        Agenda tu Cita
      </a>

      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-current/25 md:hidden"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Cerrar menÃº" : "Abrir menÃº"}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {open && (
        <div
          className={`absolute left-0 top-full flex w-full flex-col items-center gap-4 py-6 font-['Inter'] text-sm backdrop-blur-md md:hidden ${
            scrolled ? "bg-[#f5f2ec]/98 text-[#1a2e1a]" : "bg-[#1a2e1a]/95 text-white"
          }`}
        >
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a
            href="/agendar"
            className={`rounded-full border px-5 py-2 ${scrolled ? "border-[#1a2e1a]/25" : "border-white/40"}`}
            onClick={() => setOpen(false)}
          >
            Agenda tu Cita
          </a>
        </div>
      )}
    </nav>
  );
}

type Props = {
  articles?: Article[];
};

export default function App({ articles = [] }: Props) {
  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "#f5f2ec", color: AUTHORITY_BLUE, fontFamily: FONT }}
    >
      <LegalNavbar />
      {/* Section 1 â€” Hero */}
      <section id="inicio" className="w-full">
        <div
          className="relative w-full overflow-hidden"
          style={{ backgroundColor: AUTHORITY_BLUE, minHeight: "min(100vh, 880px)" }}
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=2000&q=80"
            alt="Abogados con adultos mayores"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(26,46,26,0.76) 0%, rgba(23,58,79,0.50) 44%, rgba(26,46,26,0.94) 100%)",
            }}
          />


          <div
            className="relative z-10 mx-auto flex max-w-[1220px] flex-col justify-end px-6 pb-12 pt-32 text-white md:px-12 lg:px-20 lg:pb-16"
            style={{ minHeight: "min(100vh, 880px)" }}
          >
            <div className="max-w-4xl">
              <p
                className="mb-5 uppercase text-white/78"
                style={{ letterSpacing: "0.28em", fontSize: "0.75rem", fontWeight: 500 }}
              >
                Plenitud Emocional Â· Defensa jurÃ­dica
              </p>
              <h1
                className="mb-8 text-white"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 400,
                  lineHeight: 1.05,
                  fontSize: "clamp(2.85rem, 6vw, 5.8rem)",
                }}
              >
                Defensa jurÃ­dica para vivir con <span style={{ color: "#E9D9B8", fontStyle: "italic" }}>dignidad.</span>
              </h1>
              <p
                className="mb-9 max-w-2xl text-white/88"
                style={{ lineHeight: 1.7, fontSize: "1.05rem", fontWeight: 400 }}
              >
                Espinoza Mosqueda Abogadas acompaÃ±a a personas adultas mayores y sus familias con orientaciÃ³n legal clara, trato humano y protecciÃ³n de sus derechos.
              </p>

              <div className="mb-12 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/agendar"
                  className="rounded-full bg-white px-7 py-3.5 text-center text-sm font-medium text-[#1a2e1a] transition hover:bg-white/90"
                >
                  Solicitar consulta confidencial
                </a>
                <a
                  href="#areas"
                  className="rounded-full border border-white/45 px-7 py-3.5 text-center text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Conocer Ã¡reas legales
                </a>
              </div>

              <div className="flex flex-wrap gap-x-10 gap-y-5 border-t border-white/18 pt-7 text-white">
                {[
                  ["01", "EvaluaciÃ³n clara"],
                  ["02", "Estrategia legal"],
                  ["03", "AcompaÃ±amiento"],
                  ["04", "Seguimiento"],
                ].map(([k, v]) => (
                  <div key={v}>
                    <div style={{ fontSize: "1.35rem", fontWeight: 500 }}>{k}</div>
                    <div className="text-white/68" style={{ fontSize: "0.84rem", fontWeight: 400 }}>
                      {v}
                    </div>
                  </div>
                ))}
              </div>

          </div>
        </div>
        </div>
      </section>

      {/* Section 2 â€” Competencias */}
      <section id="areas" className="w-full py-24 lg:py-32" style={{ backgroundColor: WHITE }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mb-16">
            <p
              className="uppercase mb-4"
              style={{ color: MUTED, letterSpacing: "0.25em", fontSize: "0.75rem", fontWeight: 500 }}
            >
              Ãreas de prÃ¡ctica
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
              Competencias jurÃ­dicas <span style={{ color: MUTED }}>especializadas en cada etapa de la vida.</span>
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

      {/* Section 3 â€” Proceso */}
      <section id="proceso" className="w-full py-24 lg:py-32" style={{ backgroundColor: SOFT }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mb-20">
            <p
              className="uppercase mb-4"
              style={{ color: MUTED, letterSpacing: "0.25em", fontSize: "0.75rem", fontWeight: 500 }}
            >
              Nuestro mÃ©todo
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
              Un proceso transparente, <span style={{ color: MUTED }}>diseÃ±ado para acompaÃ±arle paso a paso.</span>
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

      {/* Section 4 â€” GarantÃ­as + form */}
      <section id="contacto" className="w-full py-24 lg:py-32" style={{ backgroundColor: WHITE }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p
              className="uppercase mb-4"
              style={{ color: MUTED, letterSpacing: "0.25em", fontSize: "0.75rem", fontWeight: 500 }}
            >
              GarantÃ­as
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
              Tranquilidad <span style={{ fontStyle: "italic", color: SECURITY_GREEN }}>en cada decisiÃ³n.</span>
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

          <div
            className="p-8 lg:p-10 rounded-2xl"
            style={{ backgroundColor: SOFT, border: `1px solid ${LINE}` }}
          >
            <div
              className="mb-8 flex h-14 w-14 items-center justify-center rounded-full"
              style={{ backgroundColor: WHITE, border: `1px solid ${LINE}` }}
            >
              <CalendarCheck className="h-6 w-6" style={{ color: SECURITY_GREEN }} strokeWidth={1.5} />
            </div>
            <h3
              style={{ color: AUTHORITY_BLUE, fontWeight: 500, fontSize: "1.5rem", letterSpacing: "-0.01em" }}
              className="mb-2"
            >
              Inicie su consulta confidencial
            </h3>
            <p style={{ color: TRUST_GRAY, fontSize: "0.95rem", fontWeight: 400 }} className="mb-8">
              Agenda una cita desde el formulario general para que podamos revisar tu caso legal y contactarte con la informacion necesaria.
            </p>

            <div className="space-y-4">
              {[
                "Selecciona asesoria legal o servicio integral.",
                "Describe brevemente tu situacion.",
                "Te contactaremos para confirmar la cita.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full" style={{ backgroundColor: SECURITY_GREEN }} />
                  <p style={{ color: TRUST_GRAY, fontSize: "0.95rem", lineHeight: 1.6, fontWeight: 400 }}>{item}</p>
                </div>
              ))}
              <a
                href="/agendar"
                style={{ backgroundColor: SECURITY_GREEN, fontWeight: 500 }}
                className="inline-flex w-full items-center justify-center px-6 py-4 rounded-full text-white hover:brightness-110 transition mt-2"
              >
                Agendar una cita
              </a>
            </div>
          </div>
        </div>
      </section>

      <ArticleHighlights
        articles={articles}
        eyebrow="Articulos legales"
        title="Lecturas para tomar decisiones juridicas con calma."
        description="Guias y recursos pensados para adultos mayores, familias y cuidadores que necesitan claridad legal antes de dar el siguiente paso."
        variant="legal"
      />

      {/* Footer */}
      <footer style={{ backgroundColor: WHITE, borderTop: `1px solid ${LINE}` }} className="w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="min-w-0">
            <div
              className="mb-3 flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 break-words text-sm sm:text-base"
              style={{ letterSpacing: "0.12em", fontWeight: 600, color: AUTHORITY_BLUE }}
            >
              <span>ESPINOZA</span>
              <span style={{ color: SECURITY_GREEN }}>MOSQUEDA</span>
              <span style={{ fontWeight: 400 }}>ABOGADAS</span>
            </div>
            <p style={{ color: TRUST_GRAY, fontSize: "0.9rem", lineHeight: 1.6, fontWeight: 400 }}>
              Defensa jurÃ­dica especializada en derechos de la edad de oro.
            </p>
          </div>
          <div className="flex items-start gap-3" style={{ color: TRUST_GRAY, fontSize: "0.9rem" }}>
            <MapPin className="w-4 h-4 mt-1 shrink-0" style={{ color: AUTHORITY_BLUE }} strokeWidth={1.5} />
            <span>Av. Reforma 1245, Piso 12<br />Despacho JurÃ­dico</span>
          </div>
          <div className="flex items-center gap-3" style={{ color: TRUST_GRAY, fontSize: "0.9rem" }}>
            <Phone className="w-4 h-4 shrink-0" style={{ color: AUTHORITY_BLUE }} strokeWidth={1.5} />
            <span>+52 (55) 4521 8830</span>
          </div>
          <div className="flex min-w-0 items-center gap-3" style={{ color: TRUST_GRAY, fontSize: "0.9rem" }}>
            <Mail className="w-4 h-4 shrink-0" style={{ color: AUTHORITY_BLUE }} strokeWidth={1.5} />
            <span className="break-all">contacto@espinozamosqueda.legal</span>
          </div>
        </div>
        <div
          className="text-center py-6"
          style={{ borderTop: `1px solid ${LINE}`, color: MUTED, fontSize: "0.85rem", fontWeight: 400 }}
        >
          Â© 2026 Espinoza Mosqueda Abogadas. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
