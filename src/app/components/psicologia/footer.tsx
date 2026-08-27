import { Facebook, Instagram, Twitter, Phone, MapPin, Mail } from "lucide-react";
import { FadeIn } from "./fade-in";

export function Footer() {
  return (
    <footer id="contacto" className="bg-[#1C4432] text-white">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <FadeIn>
          <div className="grid md:grid-cols-12 gap-10 mb-16">
            <div className="md:col-span-6">
              <div className="text-white/60 mb-4" style={{ fontSize: "0.8rem", letterSpacing: "0.25em" }}>
                CONTACTO
              </div>
              <h2 className="tracking-tight" style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)", fontWeight: 400, lineHeight: 1.05 }}>
                ¿Listo para dar <br />
                <span className="italic text-[#a8c4a0]">el primer paso?</span>
              </h2>
              <p className="mt-6 text-white/70 max-w-md" style={{ fontSize: "1rem", lineHeight: 1.7 }}>
                Escríbenos y agendemos tu consulta. En Plenitud Emocional estamos aquí para acompañarte con calidez y profesionalismo.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <a
                  href="https://wa.me/524439446738"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white text-[#1C4432] rounded-full pl-6 pr-2 py-2 hover:bg-[#a8c4a0] transition-colors"
                >
                  <span style={{ fontSize: "0.9rem" }}>Agendar por WhatsApp</span>
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#1C4432] text-white">
                    <Phone size={15} />
                  </span>
                </a>
                <a
                  href="/agendar"
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-white text-sm hover:bg-white/10 transition-colors"
                >
                  Agendar en línea
                </a>
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="text-white/60 mb-4" style={{ fontSize: "0.75rem", letterSpacing: "0.2em" }}>
                UBICACIÓN Y ATENCIÓN
              </div>
              <ul className="space-y-4 text-white/85" style={{ fontSize: "0.92rem" }}>
                <li className="flex gap-3">
                  <MapPin size={16} className="mt-1 shrink-0 text-[#a8c4a0]" />
                  <span>Calle Corregidora 1156 Int. 2 Centro<br />Morelia, Michoacán</span>
                </li>
                <li className="flex gap-3">
                  <Phone size={16} className="mt-1 shrink-0 text-[#a8c4a0]" />
                  <a href="tel:+524439446738" className="hover:text-[#a8c4a0] transition-colors">
                    +52 443 944 6738
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail size={16} className="mt-1 shrink-0 text-[#a8c4a0]" />
                  <a href="mailto:contacto@plenitudemocional.com" className="hover:text-[#a8c4a0] transition-colors">
                    contacto@plenitudemocional.com
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <div className="text-white/60 mb-4" style={{ fontSize: "0.75rem", letterSpacing: "0.2em" }}>
                SÍGUENOS
              </div>
              <p className="text-white/70 mb-5" style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
                Consejos de salud mental, orientación y bienestar emocional integral.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: Instagram, label: "Instagram", href: "#" },
                  { icon: Facebook, label: "Facebook", href: "#" },
                  { icon: Twitter, label: "X", href: "#" },
                ].map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#1C4432] transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        <div className="pt-8 border-t border-white/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Plenitud Emocional" className="h-8 brightness-0 invert opacity-90" />
            <div className="text-white/70" style={{ fontSize: "0.85rem" }}>
              Plenitud Emocional · Acompañamiento Psicológico y Orientación Legal
            </div>
          </div>
          <div className="text-white/50" style={{ fontSize: "0.8rem" }}>
            © {new Date().getFullYear()} Plenitud Emocional. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
