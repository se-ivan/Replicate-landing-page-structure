import { Phone, MapPin, Mail, MessageCircle } from "lucide-react";

type FooterProps = {
  sectionPrefix?: string;
};

export function Footer({ sectionPrefix = "" }: FooterProps) {
  const sectionHref = (hash: string) => `${sectionPrefix}${hash}`;
  const whatsappHref = "https://wa.me/524439446738";

  return (
    <footer className="bg-[#141f14] text-white pt-16 pb-10 px-6 md:px-12 lg:px-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.svg"
                alt="Plenitud Emocional"
                className="h-10 w-auto filter brightness-0 invert"
              />
            </div>
            <p className="font-['Inter'] text-sm text-white/70 max-w-sm leading-relaxed">
              Acompañamiento psicológico y orientación jurídica integral para vivir cada etapa con tranquilidad, dignidad y plenitud.
            </p>
            <div className="pt-2">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-medium font-['Inter'] bg-[#8aaf7e] text-[#1a2e1a] px-4 py-2 rounded-full hover:bg-[#9dbf92] transition"
              >
                <MessageCircle size={14} />
                WhatsApp: +52 443 944 6738
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-3 space-y-3">
            <p className="font-['Inter'] text-xs font-semibold text-[#8aaf7e] tracking-[0.2em] uppercase">
              Navegación
            </p>
            <ul className="space-y-2.5 font-['Inter'] text-sm text-white/70">
              <li>
                <a href={sectionHref("#inicio")} className="hover:text-white transition">
                  Inicio
                </a>
              </li>
              <li>
                <a href={sectionHref("#quienes-somos")} className="hover:text-white transition">
                  Quiénes Somos
                </a>
              </li>
              <li>
                <a href={sectionHref("#servicios")} className="hover:text-white transition">
                  Servicios
                </a>
              </li>
              <li>
                <a href="/psicologia" className="hover:text-white transition">
                  Psicología
                </a>
              </li>
              <li>
                <a href="/abogados" className="hover:text-white transition">
                  Abogados
                </a>
              </li>
              <li>
                <a href="/articulos" className="hover:text-white transition">
                  Blog y Artículos
                </a>
              </li>
              <li>
                <a href="/agendar" className="hover:text-white transition text-[#8aaf7e]">
                  Agendar Cita
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="md:col-span-4 space-y-3">
            <p className="font-['Inter'] text-xs font-semibold text-[#8aaf7e] tracking-[0.2em] uppercase">
              Contacto y Ubicación
            </p>
            <ul className="space-y-3 font-['Inter'] text-sm text-white/75">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 text-[#8aaf7e] shrink-0" />
                <span>Calle Corregidora 1156 Int. 2 Centro, Morelia, Michoacán</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#8aaf7e] shrink-0" />
                <a href="tel:+524439446738" className="hover:text-white transition">
                  +52 443 944 6738
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#8aaf7e] shrink-0" />
                <a href="mailto:contacto@plenitudemocional.com" className="hover:text-white transition">
                  contacto@plenitudemocional.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-['Inter'] text-xs text-white/50">
          <p>
            &copy; {new Date().getFullYear()} Plenitud Emocional — Morelia, Michoacán. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a href={sectionHref("#inicio")} className="hover:text-white/80 transition">
              Inicio
            </a>
            <a href={sectionHref("#servicios")} className="hover:text-white/80 transition">
              Servicios
            </a>
            <a href={sectionHref("#contacto")} className="hover:text-white/80 transition">
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
