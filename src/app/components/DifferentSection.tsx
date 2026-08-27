import { Scale, Heart, Users, Sparkles } from "lucide-react";

const features = [
  { icon: Scale, title: "Orientación Legal", desc: "Defensa y protección de derechos patrimoniales, pensiones y trámites para una vida con tranquilidad y certeza." },
  { icon: Heart, title: "Acompañamiento Psicológico", desc: "Cuidado de la salud emocional y terapia para hacer de la jubilación y la madurez una etapa de plenitud." },
  { icon: Users, title: "Equipo Multidisciplinario", desc: "Especialistas en psicología y derecho en Morelia trabajando coordinados por tu bienestar integral." },
  { icon: Sparkles, title: "Atención Integral", desc: "Brindamos respaldo profesional, humano y accesible en un solo lugar bajo la marca Plenitud Emocional." },
];

export function DifferentSection() {
  return (
    <section id="quienes-somos" className="bg-[#f5f2ec] py-20 px-6 md:px-12 lg:px-20 sr" data-sr-delay="120">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-stretch">
        {/* Left - Images */}
        <div className="flex gap-4 h-full items-stretch">
          <img src="https://images.unsplash.com/photo-1768839722927-df0ef3188f6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWdhbCUyMGRvY3VtZW50cyUyMGp1c3RpY2UlMjBzY2FsZXMlMjBsYXd8ZW58MXx8fHwxNzc2MDUwNTc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="Servicios legales" className="w-1/2 h-full rounded-2xl object-cover" />
          <img src="https://images.unsplash.com/photo-1714976694664-4293ac04138e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwc3ljaG9sb2dpc3QlMjB0aGVyYXB5JTIwc2Vzc2lvbiUyMHdhcm18ZW58MXx8fHwxNzc2MDUwNTc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="Servicios psicológicos" className="w-1/2 h-full rounded-2xl object-cover" />
        </div>

        {/* Right - Content */}
        <div>
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1a2e1a] leading-tight">
            QUIÉNES<br />SOMOS
          </h2>
          <p className="font-['Inter'] text-sm text-[#1a2e1a]/60 leading-relaxed mt-4 mb-8 max-w-lg">
            Somos un equipo de profesionales en Morelia dedicados a proteger los derechos de las personas adultas mayores y a brindar acompañamiento psicológico para la etapa de la jubilación.
          </p>
          <div className="mt-6 grid sm:grid-cols-2 gap-8">
            {features.map((f) => (
              <div key={f.title}>
                <div className="w-10 h-10 rounded-full bg-[#3d5a3a] flex items-center justify-center mb-3">
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-['Inter'] font-semibold text-[#1a2e1a] mb-1">{f.title}</h3>
                <p className="font-['Inter'] text-sm text-[#1a2e1a]/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
