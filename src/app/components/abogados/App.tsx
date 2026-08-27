import { useEffect, useState } from "react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { ArticleHighlights } from "../ArticleHighlights";
import { Footer } from "../Footer";
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
  Menu,
  X,
  Phone,
  MapPin,
  Mail,
  MessageCircle,
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
  { label: "Quiénes Somos", href: "/#quienes-somos" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Psicología", href: "/psicologia" },
  { label: "Abogados", href: "/abogados", active: true },
  { label: "Blog", href: "/articulos" },
  { label: "Contacto", href: "#contacto" },
];

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
          : "bg-transparent py-[30px] text-white"
      }`}
    >
      <a href="/" className="flex items-center gap-3" aria-label="Ir al inicio de Plenitud Emocional">
        <img
          src="/logo.svg"
          alt="Plenitud Emocional"
          className={`w-auto transition-all duration-500 ${
            scrolled
              ? "h-8 md:h-12"
              : "h-12 md:h-[72px] filter brightness-0 invert"
          }`}
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
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
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
      {/* Section 1 — Hero */}
      <section id="inicio" className="w-full">
        <div
          className="relative w-full overflow-hidden"
          style={{ backgroundColor: AUTHORITY_BLUE, minHeight: "min(100vh, 880px)" }}
        >
          <ImageWithFallback
            src="/images/hero/hero-abogados.jpg"
            alt="Orientación Legal Plenitud Emocional"
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
                Plenitud Emocional · Defensa jurídica
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
                Defensa jurídica para vivir con <span style={{ color: "#E9D9B8", fontStyle: "italic" }}>dignidad.</span>
              </h1>
              <p
                className="mb-9 max-w-2xl text-white/88"
                style={{ lineHeight: 1.7, fontSize: "1.05rem", fontWeight: 400 }}
              >
                En Plenitud Emocional acompañamos a personas adultas mayores y sus familias con orientación legal clara, trato humano y protección de sus derechos.
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
                  Conocer áreas legales
                </a>
              </div>

              <div className="flex flex-wrap gap-x-10 gap-y-5 border-t border-white/18 pt-7 text-white">
                {[
                  ["01", "Evaluación clara"],
                  ["02", "Estrategia legal"],
                  ["03", "Acompañamiento"],
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

      {/* Section 2 — Competencias */}
      <section id="areas" className="w-full py-24 lg:py-32" style={{ backgroundColor: WHITE }}>
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
      <section id="proceso" className="w-full py-24 lg:py-32" style={{ backgroundColor: SOFT }}>
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

      {/* Section 4 — Garantías */}
      <section id="garantias" className="w-full py-24 lg:py-32" style={{ backgroundColor: WHITE }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
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

          <figure
            className="relative min-h-[380px] overflow-hidden rounded-2xl lg:min-h-[560px]"
            style={{ backgroundColor: SOFT, border: `1px solid ${LINE}` }}
          >
            <ImageWithFallback
              src="/images/hero/imagen-silla.png"
              alt="Adultos mayores conversando en una banca"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </figure>
        </div>
      </section>

      {/* Section 5 — Contacto */}
      <section id="contacto" className="w-full py-20 lg:py-24" style={{ backgroundColor: AUTHORITY_BLUE }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <p
              className="uppercase mb-3 text-white/70"
              style={{ letterSpacing: "0.25em", fontSize: "0.75rem", fontWeight: 500 }}
            >
              Plenitud Emocional · Orientación Legal
            </p>
            <h2
              className="mb-6 font-['Playfair_Display'] text-3xl md:text-5xl text-white leading-tight"
            >
              ¿Tienes dudas sobre tus derechos o trámites legales?
            </h2>
            <p className="text-white/80 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Te brindamos asesoría jurídica clara y personalizada en Morelia, protegiendo lo que más valoras con absoluta confidencialidad.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 text-left">
              <a
                href="tel:+524439446738"
                className="p-6 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/15 transition flex flex-col gap-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition">
                  <Phone className="w-5 h-5 text-[#E9D9B8]" />
                </div>
                <div className="text-xs text-white/60 font-medium">Llámanos o WhatsApp</div>
                <div className="text-sm font-semibold text-white">+52 443 944 6738</div>
              </a>

              <div className="p-6 rounded-2xl bg-white/10 border border-white/15 flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#E9D9B8]" />
                </div>
                <div className="text-xs text-white/60 font-medium">Ubicación</div>
                <div className="text-sm text-white/90">Calle Corregidora 1156 Int. 2 Centro, Morelia</div>
              </div>

              <a
                href="mailto:contacto@plenitudemocional.com"
                className="p-6 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/15 transition flex flex-col gap-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition">
                  <Mail className="w-5 h-5 text-[#E9D9B8]" />
                </div>
                <div className="text-xs text-white/60 font-medium">Correo Electrónico</div>
                <div className="text-sm font-semibold text-white break-all">contacto@plenitudemocional.com</div>
              </a>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://wa.me/524439446738"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#0F2A47] hover:bg-white/90 transition shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                Consulta por WhatsApp
              </a>
              <a
                href="/agendar"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-3.5 text-sm font-medium text-white hover:bg-white/10 transition"
              >
                Agendar Cita en Línea
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

      <Footer sectionPrefix="/" />
    </div>
  );
}
