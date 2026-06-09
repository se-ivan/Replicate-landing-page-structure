import { useEffect, useState } from "react";

type NavbarProps = {
  sectionPrefix?: string;
};

export function Navbar({ sectionPrefix = "" }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sectionHref = (hash: string) => `${sectionPrefix}${hash}`;
  const blogHref = sectionPrefix ? "/articulos" : "#blog";
  const whatsappHref = "https://wa.me/524431399471";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 px-6 md:px-12 lg:px-20 flex items-center justify-between transition-all duration-500 ${
        scrolled
          ? "py-3 bg-[#f5f2ec]/92 backdrop-blur-sm text-[#1a2e1a] border-b border-[#1a2e1a]/10 shadow-sm"
          : "py-[30px] bg-transparent text-white"
      }`}
    >
      <div className="flex items-center gap-2">
        <img
          src="/logo.svg"
          alt="Plenitud Emocional"
          className={`w-auto transition-all duration-500 ${
            scrolled
              ? "h-8 md:h-12"
              : "h-12 md:h-[72px] filter brightness-0 invert"
          }`}
        />
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-['Inter']">
        <a href={sectionHref("#inicio")} className="opacity-80 hover:opacity-100">Inicio</a>
        <a href={sectionHref("#quienes-somos")} className="opacity-80 hover:opacity-100">Quiénes Somos</a>
        <a href={sectionHref("#servicios")} className="opacity-80 hover:opacity-100">Servicios</a>
        <a href="/psicologia" className="opacity-80 hover:opacity-100">Psicología</a>
        <a href="/abogados" className="opacity-80 hover:opacity-100">Abogados</a>
        <a href={blogHref} className="opacity-80 hover:opacity-100">Blog</a>
        <a href={sectionHref("#contacto")} className="opacity-80 hover:opacity-100">Contacto</a>
      </div>
      <a
        href="/agendar"
        className={`hidden md:block rounded-full px-5 py-2 text-sm font-['Inter'] transition border ${
          scrolled
            ? "border-[#1a2e1a]/30 hover:bg-[#1a2e1a]/10"
            : "border-white/40 hover:bg-white/10"
        }`}
      >
        Agenda tu Cita
      </a>
      <button
        className="md:hidden"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
      >
        <img
          src="/logo.svg"
          alt="Abrir menú"
          className={`transition-all duration-500 ${
            scrolled
              ? "h-6 w-6"
              : "h-9 w-9 filter brightness-0 invert"
          }`}
        />
      </button>
      {open && (
        <div
          className={`absolute top-full left-0 w-full backdrop-blur-md flex flex-col items-center gap-4 py-6 md:hidden font-['Inter'] text-sm ${
            scrolled
              ? "bg-[#f5f2ec]/98 text-[#1a2e1a]"
              : "bg-[#1a2e1a]/95 text-white"
          }`}
        >
          <a href={sectionHref("#inicio")} onClick={() => setOpen(false)}>Inicio</a>
          <a href={sectionHref("#quienes-somos")} onClick={() => setOpen(false)}>Quiénes Somos</a>
          <a href={sectionHref("#servicios")} onClick={() => setOpen(false)}>Servicios</a>
          <a href="/psicologia" onClick={() => setOpen(false)}>Psicología</a>
          <a href="/abogados" onClick={() => setOpen(false)}>Abogados</a>
          <a href={blogHref} onClick={() => setOpen(false)}>Blog</a>
          <a href={sectionHref("#contacto")} onClick={() => setOpen(false)}>Contacto</a>
          <a href="/agendar" onClick={() => setOpen(false)}>Agendar Cita</a>
          <a
            href="/agendar"
            className={`rounded-full px-5 py-2 border ${
              scrolled ? "border-[#1a2e1a]/25" : "border-white/40"
            }`}
            onClick={() => setOpen(false)}
          >
            Agenda tu Cita
          </a>
        </div>
      )}
    </nav>
  );
}
