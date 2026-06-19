export function HeroSection() {
  const whatsappHref = "https://wa.me/524431399471";

  return (
    <section id="inicio" className="relative w-full min-h-screen overflow-hidden">
      <img src="/images/hero/hero-bg.jpg" alt="Adultos mayores" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 flex flex-col items-center lg:items-start justify-center min-h-screen px-6 md:px-16 lg:px-24 text-center lg:text-left text-white max-w-7xl mx-auto" data-sr-delay="0">
        <h1 className="font-['Inter'] text-2xl md:text-3xl lg:text-4xl leading-tight max-w-5xl lg:max-w-xl">
          CONOCER NUESTROS DERECHOS NOS AYUDA A VIVIR CON <span className="italic">DIGNIDAD</span>
        </h1>
        <p className="mt-3 text-xs md:text-sm opacity-80 max-w-xl lg:max-w-sm font-['Inter']">
          Prepararte emocionalmente es tan importante como prepararte financieramente.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full sm:w-auto">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="bg-white text-black rounded-full px-5 py-2.5 text-xs md:text-sm font-['Inter'] font-medium hover:bg-white/90 transition text-center">
            Agenda una Entrevista
          </a>
          <a href="#servicios" className="border border-white/50 rounded-full px-5 py-2.5 text-xs md:text-sm font-['Inter'] hover:bg-white/10 transition text-center">
            Conoce tus Derechos
          </a>
        </div>

        {/* Scroll categories */}
        <div className="absolute bottom-8 left-6 md:left-16 lg:left-24 hidden lg:flex gap-6 text-xs font-['Inter'] opacity-70">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-white rounded-full" /> Legal</span>
          <span>Psicológico</span>
          <span>Jubilación</span>
        </div>
      </div>
    </section>
  );
}
