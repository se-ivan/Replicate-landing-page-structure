import { Phone, MapPin, Mail, MessageCircle } from "lucide-react";

export function CTASection() {
  const whatsappHref = "https://wa.me/524439446738";

  return (
    <section id="contacto" className="bg-[#1a2e1a] py-20 px-6 md:px-12 lg:px-20 sr" data-sr-delay="480">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-['Inter'] text-xs text-[#8aaf7e] tracking-[0.25em] uppercase mb-3">
            Plenitud Emocional
          </p>
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl text-white leading-tight">
            CONTÁCTANOS
          </h2>
          <p className="font-['Inter'] text-sm md:text-base text-white/70 mt-4 max-w-2xl mx-auto leading-relaxed">
            Estamos listos para acompañarte con atención psicológica profesional y orientación legal confiable en Morelia, Michoacán.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Área Psicológica */}
          <div className="border border-white/15 rounded-2xl p-8 bg-white/[0.02] flex flex-col justify-between">
            <div>
              <h3 className="font-['Playfair_Display'] text-2xl text-white mb-2">Área Psicológica</h3>
              <p className="font-['Inter'] text-sm text-white/60 mb-6">
                Acompañamiento individual, grupal y bienestar en la madurez y jubilación.
              </p>
              <div className="space-y-4">
                <a
                  href="tel:+524439446738"
                  className="flex items-center gap-3 text-white/90 hover:text-white transition group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#8aaf7e]/20 flex items-center justify-center group-hover:bg-[#8aaf7e]/30 transition">
                    <Phone className="w-4 h-4 text-[#8aaf7e]" />
                  </div>
                  <span className="font-['Inter'] text-sm">+52 443 944 6738</span>
                </a>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#8aaf7e]/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#8aaf7e]" />
                  </div>
                  <span className="font-['Inter'] text-white/80 text-sm">
                    Calle Corregidora 1156 Interior 2 Centro, Morelia, Michoacán
                  </span>
                </div>
                <a
                  href="mailto:contacto@plenitudemocional.com"
                  className="flex items-center gap-3 text-white/90 hover:text-white transition group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#8aaf7e]/20 flex items-center justify-center group-hover:bg-[#8aaf7e]/30 transition">
                    <Mail className="w-4 h-4 text-[#8aaf7e]" />
                  </div>
                  <span className="font-['Inter'] text-white/80 text-sm">contacto@plenitudemocional.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Área Legal */}
          <div className="border border-white/15 rounded-2xl p-8 bg-white/[0.02] flex flex-col justify-between">
            <div>
              <h3 className="font-['Playfair_Display'] text-2xl text-white mb-2">Área Legal</h3>
              <p className="font-['Inter'] text-sm text-white/60 mb-6">
                Orientación jurídica, defensa de derechos pensionales y protección patrimonial.
              </p>
              <div className="space-y-4">
                <a
                  href="tel:+524439446738"
                  className="flex items-center gap-3 text-white/90 hover:text-white transition group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#8aaf7e]/20 flex items-center justify-center group-hover:bg-[#8aaf7e]/30 transition">
                    <Phone className="w-4 h-4 text-[#8aaf7e]" />
                  </div>
                  <span className="font-['Inter'] text-sm">+52 443 944 6738</span>
                </a>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#8aaf7e]/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#8aaf7e]" />
                  </div>
                  <span className="font-['Inter'] text-white/80 text-sm">
                    Calle Corregidora 1156 Interior 2 Centro, Morelia, Michoacán
                  </span>
                </div>
                <a
                  href="mailto:contacto@plenitudemocional.com"
                  className="flex items-center gap-3 text-white/90 hover:text-white transition group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#8aaf7e]/20 flex items-center justify-center group-hover:bg-[#8aaf7e]/30 transition">
                    <Mail className="w-4 h-4 text-[#8aaf7e]" />
                  </div>
                  <span className="font-['Inter'] text-white/80 text-sm">contacto@plenitudemocional.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#8aaf7e] text-[#1a2e1a] rounded-full px-8 py-3.5 text-sm font-['Inter'] font-semibold hover:bg-[#9dbf92] transition shadow-lg shadow-[#8aaf7e]/10"
          >
            <MessageCircle className="w-4 h-4" />
            Escribir por WhatsApp
          </a>
          <a
            href="/agendar"
            className="inline-flex items-center gap-2 border border-white/40 text-white rounded-full px-8 py-3.5 text-sm font-['Inter'] font-medium hover:bg-white/10 transition"
          >
            Agenda tu Cita Online
          </a>
        </div>
      </div>
    </section>
  );
}
