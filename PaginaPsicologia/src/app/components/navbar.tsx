import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import logo from "../../imports/logo.svg";

const links = [
  { label: "Acerca de", href: "#acerca" },
  { label: "Terapia grupal", href: "#terapia-grupal" },
  { label: "Terapia individual", href: "#terapia-individual" },
  { label: "Psicología general", href: "#psicologia-general" },
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
            src={logo}
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
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`transition-colors hover:opacity-70 ${textColor}`}
              style={{ fontSize: "0.9rem" }}
            >
              {l.label}
            </a>
          ))}
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
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-[#1C4432]"
              >
                {l.label}
              </a>
            ))}
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
