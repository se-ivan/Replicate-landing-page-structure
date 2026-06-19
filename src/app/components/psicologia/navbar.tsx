import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";

const links: { label: string; href: string; dropdown?: { label: string; href: string }[] }[] = [
  { label: "Inicio", href: "/" },
  { label: "Acerca de", href: "#acerca" },
  {
    label: "Servicios",
    href: "#servicios",
    dropdown: [
      { label: "Terapia individual", href: "/articulos/terapia-individual-adultez-mayor" },
      { label: "Terapia grupal", href: "/articulos/terapia-grupal-adultez-mayor" },
      { label: "Psicología general", href: "/articulos/depresion-no-es-normal-envejecimiento" },
    ],
  },
  { label: "Contacto", href: "#contacto" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const textColor = scrolled ? "text-[#1C4432]" : "text-white";
  const subColor = scrolled ? "text-[#5B7B53]" : "text-white/75";

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/85 backdrop-blur-md border-b border-black/5 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#inicio" className="flex items-center gap-3">
          <img
            src="/logo.svg"
            alt="Logo"
            className={`transition-all duration-500 ${scrolled ? "h-9" : "h-11 brightness-0 invert"}`}
          />
          <div className="hidden sm:block leading-tight">
            <div className={`tracking-wide transition-colors ${textColor}`} style={{ fontSize: "0.95rem", fontWeight: 500 }}>
              Catalina Gallegos
            </div>
            <div className={`transition-colors ${subColor}`} style={{ fontSize: "0.7rem", letterSpacing: "0.15em" }}>
              PSICÓLOGA CLÍNICA
            </div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-9">
          {links.map((l) => {
            if (l.dropdown) {
              return (
                <div key={l.label} className="relative group py-2">
                  <a
                    href={l.href}
                    className={`flex items-center gap-1 transition-colors hover:opacity-70 ${textColor}`}
                    style={{ fontSize: "0.9rem" }}
                  >
                    {l.label}
                    <svg
                      className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180 opacity-70"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </a>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-56 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300">
                    <div className="bg-white rounded-2xl shadow-xl border border-black/5 overflow-hidden py-2">
                      {l.dropdown.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          className="block px-5 py-3 text-sm text-[#1C4432] hover:bg-[#F7F5F0] transition-colors"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <a
                key={l.label}
                href={l.href}
                className={`transition-colors hover:opacity-70 ${textColor}`}
                style={{ fontSize: "0.9rem" }}
              >
                {l.label}
              </a>
            );
          })}
        </nav>

        <a
          href="#contacto"
          className={`hidden md:inline-flex items-center gap-2 rounded-full px-5 py-2.5 transition-all ${
            scrolled
              ? "bg-[#1C4432] text-white hover:bg-[#2a5c44]"
              : "bg-white/10 text-white border border-white/40 backdrop-blur-sm hover:bg-white hover:text-[#1C4432]"
          }`}
          style={{ fontSize: "0.85rem" }}
        >
          Agendar cita
        </a>

        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden transition-colors ${textColor}`}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="md:hidden bg-white border-t border-black/5 overflow-hidden"
        >
          <div className="px-6 py-4 flex flex-col gap-4">
            {links.map((l) => {
              if (l.dropdown) {
                return (
                  <div key={l.label} className="flex flex-col gap-2">
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="text-[#1C4432] font-semibold"
                    >
                      {l.label}
                    </a>
                    <div className="pl-4 flex flex-col gap-2.5 border-l border-[#1C4432]/10">
                      {l.dropdown.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="text-[#1C4432]/75 text-sm hover:text-[#1C4432] transition-colors"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-[#1C4432]"
                >
                  {l.label}
                </a>
              );
            })}
            <a
              href="#contacto"
              onClick={() => setOpen(false)}
              className="rounded-full bg-[#1C4432] text-white px-5 py-2.5 text-center"
            >
              Agendar cita
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
