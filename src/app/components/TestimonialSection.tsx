import { Star } from "lucide-react";

export function TestimonialSection() {
  return (
    <section className="bg-[#1a2e1a] text-white py-20 px-6 md:px-12 lg:px-20 sr" data-sr-delay="320">
      <div className="max-w-4xl mx-auto text-center">
        {/* Decorative images */}
        <div className="flex justify-center gap-4 mb-8">
          <img src="https://images.unsplash.com/photo-1758691030771-9dadc2a828d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwbWFuJTIwcmVhZGluZyUyMHBlYWNlZnVsJTIwcmV0aXJlbWVudHxlbnwxfHx8fDE3NzYwNTA1NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="Testimonio" className="w-16 h-16 rounded-full object-cover" />
          <img src="https://images.unsplash.com/photo-1758686254593-7c4cd55b2621?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjB3b21hbiUyMHNtaWxpbmclMjBwb3J0cmFpdCUyMGNvbmZpZGVudHxlbnwxfHx8fDE3NzYwNTA1NzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="Testimonio" className="w-20 h-20 rounded-xl object-cover -mt-2" />
          <img src="https://images.unsplash.com/photo-1768938248754-d2d7e7d83359?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwcGVyc29uJTIwd2Fsa2luZyUyMHBhcmslMjBzdW5zZXR8ZW58MXx8fHwxNzc2MDUwNTc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="Testimonio" className="w-16 h-16 rounded-full object-cover" />
        </div>

        <p className="font-['Inter'] text-base md:text-lg leading-relaxed opacity-90 max-w-2xl mx-auto">
          El acompañamiento que recibí fue <span className="text-[#8aaf7e] font-semibold">excepcional</span>. Me ayudaron a entender mis <span className="text-[#8aaf7e] font-semibold">derechos</span> y a enfrentar la <span className="text-[#8aaf7e] font-semibold">jubilación</span> con una nueva perspectiva. Hoy vivo esta etapa con <span className="text-[#8aaf7e] font-semibold">plenitud y tranquilidad</span>.
        </p>

        <div className="flex justify-center gap-1 mt-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#8aaf7e] text-[#8aaf7e]" />
          ))}
        </div>

        <p className="font-['Inter'] text-sm mt-3 opacity-70">María G. — Jubilada, Morelia</p>
      </div>
    </section>
  );
}
