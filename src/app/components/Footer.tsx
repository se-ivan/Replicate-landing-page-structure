import logo from "../../imports/Logoplenitud_emocional.png";

type FooterProps = {
  sectionPrefix?: string;
};

export function Footer({ sectionPrefix = "" }: FooterProps) {
  const sectionHref = (hash: string) => `${sectionPrefix}${hash}`;

  return (
    <footer className="bg-[#141f14] text-white py-10 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src={logo.src} alt="Plenitud Emocional" className="h-8 w-auto" />
        </div>
        <p className="font-['Inter'] text-xs text-white/40">
          &copy; 2026 Plenitud Emocional — Morelia, Michoacán. Todos los derechos reservados.
        </p>
        <div className="flex gap-6 font-['Inter'] text-xs text-white/50">
          <a href={sectionHref("#inicio")} className="hover:text-white/80">Inicio</a>
          <a href={sectionHref("#servicios")} className="hover:text-white/80">Servicios</a>
          <a href={sectionHref("#contacto")} className="hover:text-white/80">Contacto</a>
        </div>
      </div>
    </footer>
  );
}
