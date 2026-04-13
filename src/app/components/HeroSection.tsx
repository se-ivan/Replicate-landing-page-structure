export function HeroSection() {
  const whatsappHref = "https://wa.me/524431399471";

  return (
    <section id="inicio" className="relative w-full min-h-screen overflow-hidden">
      <img src="/images/hero/hero-bg.jpg" alt="Adultos mayores" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center text-white">
        <h1 className="font-['Inter'] text-4xl md:text-6xl lg:text-7xl leading-tight max-w-5xl">
          CONOCER NUESTROS DERECHOS NOS AYUDA A VIVIR CON <span className="italic">DIGNIDAD</span>
        </h1>
        <p className="mt-4 text-sm md:text-base opacity-80 max-w-xl font-['Inter']">
          Prepararte emocionalmente es tan importante como prepararte financieramente.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="bg-white text-black rounded-full px-7 py-3 text-sm font-['Inter'] font-medium hover:bg-white/90 transition">
            Agenda una Entrevista
          </a>
          <a href="#servicios" className="border border-white/50 rounded-full px-7 py-3 text-sm font-['Inter'] hover:bg-white/10 transition">
            Conoce tus Derechos
          </a>
        </div>

        {/* Bottom card */}
        <div className="absolute bottom-8 right-8 hidden lg:flex gap-3">
          <div className="bg-white/15 backdrop-blur-md rounded-xl overflow-hidden w-48">
            <img src="/images/hero/hero-card.jpg" alt="Acompañamiento" className="w-full h-28 object-cover" />
            <div className="p-3 text-left text-xs font-['Inter']">Acompañamiento integral</div>
          </div>
        </div>

        {/* Stats badge */}
        <div className="absolute top-28 right-12 hidden lg:flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-2">
          <div className="flex -space-x-2">
            <div className="w-7 h-7 rounded-full bg-[#4a6741]" />
            <div className="w-7 h-7 rounded-full bg-[#6b8f5e]" />
            <div className="w-7 h-7 rounded-full bg-[#8aaf7e]" />
          </div>
          <div className="text-xs font-['Inter']">
            <span className="font-semibold">Morelia</span>
            <br />Michoacán, MX
          </div>
        </div>

        {/* Scroll categories */}
        <div className="absolute bottom-8 left-8 hidden lg:flex gap-6 text-xs font-['Inter'] opacity-70">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-white rounded-full" /> Legal</span>
          <span>Psicológico</span>
          <span>Jubilación</span>
        </div>
      </div>
    </section>
  );
}
