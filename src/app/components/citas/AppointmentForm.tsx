import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";

interface FormData {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  telefono: string;
  email: string;
  fechaPreferida: string;
  horaPreferida: string;
  tipoServicio: "psicologia" | "legal" | "ambos";
  notas: string;
}

const HORARIOS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "16:00", "16:30", "17:00",
  "17:30", "18:00",
];

const SERVICIOS = [
  { value: "psicologia", label: "Psicología", icon: "🧠", desc: "Acompañamiento psicológico" },
  { value: "legal", label: "Asesoría Legal", icon: "⚖️", desc: "Orientación jurídica" },
  { value: "ambos", label: "Integral", icon: "🤝", desc: "Psicología + Legal" },
];

export function AppointmentForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      tipoServicio: "psicologia",
      notas: "",
    },
  });

  const selectedServicio = watch("tipoServicio");

  // Get tomorrow's date as minimum
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Error al agendar la cita.");
        return;
      }

      setSubmitted(true);
      reset();
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto text-center py-20 px-6"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#2d5a27] to-[#4a8c3f] flex items-center justify-center">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-semibold text-[#1a2e1a] mb-3 font-['Inter']">
          ¡Cita Agendada!
        </h2>
        <p className="text-[#5a6b5a] text-lg mb-8 font-['Inter']">
          Hemos recibido tu solicitud. Nos comunicaremos contigo pronto para confirmar tu cita.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a2e1a] text-white font-['Inter'] text-sm hover:bg-[#2d5a27] transition-colors"
        >
          Agendar otra cita
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2d5a27]/10 text-[#2d5a27] text-sm font-['Inter'] mb-4">
          <span className="w-2 h-2 rounded-full bg-[#4a8c3f] animate-pulse" />
          Agenda disponible
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-[#1a2e1a] font-['Inter'] mb-3">
          Agenda tu Cita
        </h1>
        <p className="text-[#5a6b5a] text-lg font-['Inter'] max-w-md mx-auto">
          Completa el formulario y nos pondremos en contacto contigo para confirmar.
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Service Type Selection */}
        <div>
          <label className="block text-sm font-medium text-[#1a2e1a] font-['Inter'] mb-3">
            Tipo de Servicio
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SERVICIOS.map((servicio) => (
              <button
                key={servicio.value}
                type="button"
                onClick={() => setValue("tipoServicio", servicio.value as FormData["tipoServicio"])}
                className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                  selectedServicio === servicio.value
                    ? "border-[#2d5a27] bg-[#2d5a27]/5 shadow-lg shadow-[#2d5a27]/10"
                    : "border-[#e5e0d8] bg-white hover:border-[#2d5a27]/30 hover:shadow-md"
                }`}
              >
                <span className="text-2xl mb-2 block">{servicio.icon}</span>
                <span className="block text-sm font-semibold text-[#1a2e1a] font-['Inter']">
                  {servicio.label}
                </span>
                <span className="block text-xs text-[#5a6b5a] font-['Inter'] mt-1">
                  {servicio.desc}
                </span>
                {selectedServicio === servicio.value && (
                  <motion.div
                    layoutId="service-check"
                    className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#2d5a27] flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </button>
            ))}
          </div>
          <input type="hidden" {...register("tipoServicio", { required: true })} />
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-2xl border border-[#e5e0d8] p-6 space-y-5 shadow-sm">
          <h3 className="text-lg font-semibold text-[#1a2e1a] font-['Inter'] flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#2d5a27]/10 text-[#2d5a27] flex items-center justify-center text-sm">1</span>
            Datos Personales
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-[#3a4a3a] font-['Inter'] mb-1.5">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                id="nombre"
                type="text"
                placeholder="Ej. María"
                {...register("nombre", { required: "El nombre es requerido" })}
                className={`w-full px-4 py-3 rounded-xl border bg-[#fafaf8] font-['Inter'] text-sm text-[#1a2e1a] placeholder:text-[#a0a89a] transition-all focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27] ${
                  errors.nombre ? "border-red-400" : "border-[#e5e0d8]"
                }`}
              />
              {errors.nombre && (
                <p className="text-red-500 text-xs mt-1 font-['Inter']">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-[#3a4a3a] font-['Inter'] mb-1.5">
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                id="apellido"
                type="text"
                placeholder="Ej. García López"
                {...register("apellido", { required: "El apellido es requerido" })}
                className={`w-full px-4 py-3 rounded-xl border bg-[#fafaf8] font-['Inter'] text-sm text-[#1a2e1a] placeholder:text-[#a0a89a] transition-all focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27] ${
                  errors.apellido ? "border-red-400" : "border-[#e5e0d8]"
                }`}
              />
              {errors.apellido && (
                <p className="text-red-500 text-xs mt-1 font-['Inter']">{errors.apellido.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-[#3a4a3a] font-['Inter'] mb-1.5">
              Fecha de Nacimiento <span className="text-red-500">*</span>
            </label>
            <input
              id="fechaNacimiento"
              type="date"
              {...register("fechaNacimiento", { required: "La fecha de nacimiento es requerida" })}
              className={`w-full px-4 py-3 rounded-xl border bg-[#fafaf8] font-['Inter'] text-sm text-[#1a2e1a] transition-all focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27] ${
                errors.fechaNacimiento ? "border-red-400" : "border-[#e5e0d8]"
              }`}
            />
            {errors.fechaNacimiento && (
              <p className="text-red-500 text-xs mt-1 font-['Inter']">{errors.fechaNacimiento.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-[#3a4a3a] font-['Inter'] mb-1.5">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                id="telefono"
                type="tel"
                placeholder="Ej. 443 944 6738"
                {...register("telefono", {
                  required: "El teléfono es requerido",
                  pattern: {
                    value: /^[\d\s\-+()]{10,}$/,
                    message: "Ingresa un teléfono válido (min. 10 dígitos)",
                  },
                })}
                className={`w-full px-4 py-3 rounded-xl border bg-[#fafaf8] font-['Inter'] text-sm text-[#1a2e1a] placeholder:text-[#a0a89a] transition-all focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27] ${
                  errors.telefono ? "border-red-400" : "border-[#e5e0d8]"
                }`}
              />
              {errors.telefono && (
                <p className="text-red-500 text-xs mt-1 font-['Inter']">{errors.telefono.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#3a4a3a] font-['Inter'] mb-1.5">
                Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="Ej. maria@correo.com"
                {...register("email", {
                  required: "El correo es requerido",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Ingresa un correo válido",
                  },
                })}
                className={`w-full px-4 py-3 rounded-xl border bg-[#fafaf8] font-['Inter'] text-sm text-[#1a2e1a] placeholder:text-[#a0a89a] transition-all focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27] ${
                  errors.email ? "border-red-400" : "border-[#e5e0d8]"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 font-['Inter']">{errors.email.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="bg-white rounded-2xl border border-[#e5e0d8] p-6 space-y-5 shadow-sm">
          <h3 className="text-lg font-semibold text-[#1a2e1a] font-['Inter'] flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#2d5a27]/10 text-[#2d5a27] flex items-center justify-center text-sm">2</span>
            Fecha y Hora Preferida
          </h3>

          <div>
            <label htmlFor="fechaPreferida" className="block text-sm font-medium text-[#3a4a3a] font-['Inter'] mb-1.5">
              Fecha <span className="text-red-500">*</span>
            </label>
            <input
              id="fechaPreferida"
              type="date"
              min={minDate}
              {...register("fechaPreferida", { required: "La fecha preferida es requerida" })}
              className={`w-full px-4 py-3 rounded-xl border bg-[#fafaf8] font-['Inter'] text-sm text-[#1a2e1a] transition-all focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27] ${
                errors.fechaPreferida ? "border-red-400" : "border-[#e5e0d8]"
              }`}
            />
            {errors.fechaPreferida && (
              <p className="text-red-500 text-xs mt-1 font-['Inter']">{errors.fechaPreferida.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3a4a3a] font-['Inter'] mb-3">
              Horario <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {HORARIOS.map((hora) => {
                const selected = watch("horaPreferida") === hora;
                return (
                  <button
                    key={hora}
                    type="button"
                    onClick={() => setValue("horaPreferida", hora, { shouldValidate: true })}
                    className={`py-2.5 px-1 rounded-xl text-sm font-['Inter'] font-medium transition-all duration-200 ${
                      selected
                        ? "bg-[#2d5a27] text-white shadow-lg shadow-[#2d5a27]/20"
                        : "bg-[#fafaf8] border border-[#e5e0d8] text-[#3a4a3a] hover:border-[#2d5a27]/40 hover:bg-[#2d5a27]/5"
                    }`}
                  >
                    {hora}
                  </button>
                );
              })}
            </div>
            <input
              type="hidden"
              {...register("horaPreferida", { required: "Selecciona un horario" })}
            />
            {errors.horaPreferida && (
              <p className="text-red-500 text-xs mt-2 font-['Inter']">{errors.horaPreferida.message}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl border border-[#e5e0d8] p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[#1a2e1a] font-['Inter'] flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-full bg-[#2d5a27]/10 text-[#2d5a27] flex items-center justify-center text-sm">3</span>
            Información Adicional
          </h3>
          <label htmlFor="notas" className="block text-sm font-medium text-[#3a4a3a] font-['Inter'] mb-1.5">
            Notas u observaciones (opcional)
          </label>
          <textarea
            id="notas"
            rows={3}
            placeholder="¿Hay algo que debamos saber antes de tu cita?"
            {...register("notas")}
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d8] bg-[#fafaf8] font-['Inter'] text-sm text-[#1a2e1a] placeholder:text-[#a0a89a] transition-all focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27] resize-none"
          />
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-['Inter'] flex items-start gap-3"
            >
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1a2e1a] to-[#2d5a27] text-white font-['Inter'] font-semibold text-base shadow-xl shadow-[#1a2e1a]/20 hover:shadow-2xl hover:shadow-[#1a2e1a]/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Agendando...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Agendar Cita
            </>
          )}
        </motion.button>

        <p className="text-center text-xs text-[#8a9a8a] font-['Inter']">
          Al agendar, aceptas ser contactado para confirmar tu cita.
        </p>
      </motion.form>
    </div>
  );
}
