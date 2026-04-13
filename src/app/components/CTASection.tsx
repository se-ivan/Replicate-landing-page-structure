import { Phone, MapPin } from "lucide-react";

export function CTASection() {
  const whatsappHref = "https://wa.me/524431399471";

  return (
    <section id="contacto" className="bg-[#1a2e1a] py-20 px-6 md:px-12 lg:px-20 sr" data-sr-delay="480">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl text-white leading-tight text-center mb-14">
          CONTÁCTANOS
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Legal */}
          <div className="border border-white/15 rounded-2xl p-8">
            <h3 className="font-['Playfair_Display'] text-2xl text-white mb-2">Despacho Espinoza Mosqueda</h3>
            <p className="font-['Inter'] text-sm text-white/50 mb-6">Área Legal — Protección de Derechos</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#8aaf7e]/20 flex items-center justify-center">
                <Phone className="w-4 h-4 text-[#8aaf7e]" />
              </div>
              <span className="font-['Inter'] text-white text-sm">443 170 4559</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#8aaf7e]/20 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-[#8aaf7e]" />
              </div>
              <span className="font-['Inter'] text-white/80 text-sm">Calle Corregidora 1156 Interior 2 Centro, Morelia, Michoacán</span>
            </div>
          </div>

          {/* Psicológico */}
          <div className="border border-white/15 rounded-2xl p-8">
            <h3 className="font-['Playfair_Display'] text-2xl text-white mb-2">Psicóloga Catalina Gallegos M.</h3>
            <p className="font-['Inter'] text-sm text-white/50 mb-6">Área Psicológica — Plenitud Emocional</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#8aaf7e]/20 flex items-center justify-center">
                <Phone className="w-4 h-4 text-[#8aaf7e]" />
              </div>
              <span className="font-['Inter'] text-white text-sm">443 139 9471</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#8aaf7e]/20 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-[#8aaf7e]" />
              </div>
              <span className="font-['Inter'] text-white/80 text-sm">Morelia, Michoacán</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="bg-[#8aaf7e] text-[#1a2e1a] rounded-full px-8 py-3 text-sm font-['Inter'] font-medium hover:bg-[#9dbf92] transition">
            Agenda una Entrevista
          </a>
        </div>
      </div>
    </section>
  );
}
