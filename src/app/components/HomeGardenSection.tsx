export function HomeGardenSection() {
  return (
    <section className="bg-[#f5f2ec] py-20 px-6 md:px-12 lg:px-20 sr" data-sr-delay="240">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left text */}
        <div>
          <h2 className="font-['Playfair_Display'] text-5xl md:text-6xl text-[#1a2e1a] leading-tight">
            VIVIR LA<br />JUBILACIÓN
          </h2>
          <p className="font-['Inter'] text-sm text-[#1a2e1a]/60 mt-4 leading-relaxed max-w-md">
            Acompañamiento individual, grupal y desarrollo personal. Te ayudamos a adaptarte al cambio, redefinir tu propósito y disfrutar el retiro con plenitud.
          </p>
          <a href="#contacto" className="inline-block mt-6 bg-[#3d5a3a] text-white rounded-full px-6 py-3 text-sm font-['Inter'] font-medium hover:bg-[#4a6b46] transition">
            Agenda tu Cita
          </a>
        </div>

        {/* Right image cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl overflow-hidden relative h-64">
            <img src="https://images.unsplash.com/photo-1714976694664-4293ac04138e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwc3ljaG9sb2dpc3QlMjB0aGVyYXB5JTIwc2Vzc2lvbiUyMHdhcm18ZW58MXx8fHwxNzc2MDUwNTc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="Terapia individual" className="w-full h-full object-cover" />
            <div className="absolute bottom-3 left-3 text-white text-xs font-['Inter'] font-medium bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
              Individual
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden relative h-64">
            <img src="https://images.unsplash.com/photo-1632685236331-42a5a6913025?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjB3b21hbiUyMHlvZ2ElMjBtZWRpdGF0aW9uJTIwd2VsbG5lc3N8ZW58MXx8fHwxNzc2MDUwNTc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="Bienestar" className="w-full h-full object-cover" />
            <div className="absolute bottom-3 left-3 text-white text-xs font-['Inter'] font-medium bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
              Bienestar
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden relative h-64">
            <img src="https://images.unsplash.com/photo-1774537617358-3614ba7e8aa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjBjb3VwbGUlMjBoYXBweSUyMHJldGlyZW1lbnQlMjBnYXJkZW58ZW58MXx8fHwxNzc2MDUwNTc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="Grupo" className="w-full h-full object-cover" />
            <div className="absolute bottom-3 left-3 text-white text-xs font-['Inter'] font-medium bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
              Grupal
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
