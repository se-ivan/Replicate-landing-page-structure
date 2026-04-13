const steps = [
  { num: "01", title: "Defensa integral", desc: "Apoyo legal con confianza si tus derechos no se respetan. Te acompañamos en cada paso del proceso." },
  { num: "02", title: "Protección patrimonial", desc: "Defensa del derecho a proteger tu dinero y bienes para que nadie te presione, quite tu dinero o te engañe." },
  { num: "03", title: "Derechos básicos", desc: "Asesoría para asegurar tu derecho a no ser discriminado, a pensiones, atención médica y vivienda segura." },
  { num: "04", title: "Acompañamiento emocional", desc: "Terapia para manejar sentimientos, ansiedad e incertidumbre ante el cambio de identidad laboral." },
];

export function StepsSection() {
  return (
    <section id="servicios" className="bg-[#1a2e1a] text-white py-20 px-6 md:px-12 lg:px-20 sr" data-sr-delay="200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl leading-tight">
            NUESTROS<br /><span className="italic">SERVICIOS</span> PARA TI
          </h2>
          <div className="flex gap-2 mt-4 md:mt-0">
            <a href="#quienes-somos" className="border border-white/30 rounded-full px-5 py-2 text-sm font-['Inter'] hover:bg-white/10 transition">
              Conócenos
            </a>
            <a href="#contacto" className="bg-[#8aaf7e] text-[#1a2e1a] rounded-full px-5 py-2 text-sm font-['Inter'] font-medium hover:bg-[#9dbf92] transition">
              Contacto
            </a>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.num} className="border border-white/15 rounded-2xl p-6">
              <span className="text-[#8aaf7e] font-['Inter'] text-sm font-medium">{s.num}</span>
              <h3 className="font-['Inter'] font-semibold mt-3 mb-2">{s.title}</h3>
              <p className="font-['Inter'] text-sm text-white/60 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
