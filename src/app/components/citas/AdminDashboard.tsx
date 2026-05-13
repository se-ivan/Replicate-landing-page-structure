import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import { ArticleManager } from "./ArticleManager";

interface Appointment {
  id: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  telefono: string;
  email: string;
  fechaPreferida: string;
  horaPreferida: string;
  tipoServicio: "psicologia" | "legal" | "ambos";
  notas: string;
  estado: "pendiente" | "confirmada" | "completada" | "cancelada";
  creadoEn: string;
  actualizadoEn: string;
}

const ESTADO_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  pendiente: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  confirmada: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
  completada: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  cancelada: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-400" },
};

const SERVICIO_LABELS: Record<string, { label: string }> = {
  psicologia: { label: "Psicologia" },
  legal: { label: "Legal" },
  ambos: { label: "Integral" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDateKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function parseLocalDate(date: string) {
  return new Date(`${date}T00:00:00`);
}

function sortByTime(a: Appointment, b: Appointment) {
  return a.horaPreferida.localeCompare(b.horaPreferida);
}

export function AdminDashboard() {
  const [activeView, setActiveView] = useState<"appointments" | "articles">("appointments");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => getDateKey(new Date()));

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");
      if (res.ok) setAppointments(await res.json());
    } catch {
      // The dashboard keeps its empty state if the request fails.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id: string, estado: string) => {
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });

    if (res.ok) {
      await fetchAppointments();
      if (selected?.id === id) {
        setSelected((previous) => previous ? { ...previous, estado: estado as Appointment["estado"] } : null);
      }
    }
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm("Eliminar esta cita?")) return;
    const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchAppointments();
      setSelected(null);
    }
  };

  const handleLogout = async () => {
    try {
      const csrfRes = await fetch("/api/auth/csrf");
      const { csrfToken } = await csrfRes.json();
      await fetch("/api/auth/signout", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ csrfToken, callbackUrl: "/" }),
      });
      window.location.href = "/";
    } catch {
      window.location.href = "/";
    }
  };

  const filtered = appointments.filter((appointment) => {
    if (filter !== "todos" && appointment.estado !== filter) return false;
    if (!search.trim()) return true;

    const query = search.toLowerCase();
    return `${appointment.nombre} ${appointment.apellido} ${appointment.telefono} ${appointment.email}`
      .toLowerCase()
      .includes(query);
  });

  const stats = {
    total: appointments.length,
    pendientes: appointments.filter((appointment) => appointment.estado === "pendiente").length,
    hoy: appointments.filter((appointment) => appointment.fechaPreferida === getDateKey(new Date())).length,
    confirmadas: appointments.filter((appointment) => appointment.estado === "confirmada").length,
  };

  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(calendarMonth), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(calendarMonth), { weekStartsOn: 1 }),
  });

  const appointmentsByDate = filtered.reduce<Record<string, Appointment[]>>((acc, appointment) => {
    acc[appointment.fechaPreferida] ??= [];
    acc[appointment.fechaPreferida].push(appointment);
    acc[appointment.fechaPreferida].sort(sortByTime);
    return acc;
  }, {});

  const selectedDateAppointments = appointmentsByDate[selectedDate] ?? [];

  return (
    <div className="min-h-screen bg-[#f5f2ec]">
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#e5e0d8] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/"><img src="/logo.svg" alt="Logo" className="h-8" /></a>
            <div className="hidden sm:block h-6 w-px bg-[#e5e0d8]" />
            <h1 className="hidden sm:block text-lg font-semibold text-[#1a2e1a] font-['Inter']">Panel de Administracion</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-['Inter'] text-[#5a6b5a] hover:bg-[#1a2e1a]/5 transition-colors">
            Cerrar sesion
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 flex flex-wrap gap-2">
          {[
            { id: "appointments", label: "Citas" },
            { id: "articles", label: "Articulos" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as "appointments" | "articles")}
              className={`px-4 py-2.5 rounded-xl text-sm font-['Inter'] font-medium transition-all ${
                activeView === item.id
                  ? "bg-[#1a2e1a] text-white shadow-lg"
                  : "bg-white border border-[#e5e0d8] text-[#5a6b5a] hover:border-[#2d5a27]/30"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {activeView === "articles" ? (
          <ArticleManager />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total citas", value: stats.total, color: "from-[#1a2e1a] to-[#2d5a27]" },
                { label: "Pendientes", value: stats.pendientes, color: "from-amber-500 to-amber-600" },
                { label: "Confirmadas", value: stats.confirmadas, color: "from-blue-500 to-blue-600" },
                { label: "Hoy", value: stats.hoy, color: "from-emerald-500 to-emerald-600" },
              ].map((stat) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-[#e5e0d8] p-5 shadow-sm">
                  <span className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent font-['Inter']`}>{stat.value}</span>
                  <p className="mt-2 text-xs text-[#5a6b5a] font-['Inter']">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por nombre, telefono o correo..."
                  className="w-full px-4 py-3 rounded-xl border border-[#e5e0d8] bg-white font-['Inter'] text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27]"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {["todos", "pendiente", "confirmada", "completada", "cancelada"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-['Inter'] font-medium whitespace-nowrap transition-all ${
                      filter === status
                        ? "bg-[#1a2e1a] text-white shadow-lg"
                        : "bg-white border border-[#e5e0d8] text-[#5a6b5a] hover:border-[#2d5a27]/30"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <svg className="animate-spin h-8 w-8 text-[#2d5a27]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-lg font-semibold text-[#1a2e1a] font-['Inter']">No hay citas</h3>
                <p className="text-sm text-[#5a6b5a] font-['Inter'] mt-1">
                  {search || filter !== "todos" ? "Intenta con otros filtros" : "Las citas agendadas apareceran aqui"}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                <section className="bg-white rounded-2xl border border-[#e5e0d8] shadow-sm overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5e0d8] p-4 sm:p-5">
                    <div>
                      <h2 className="font-['Inter'] text-lg font-semibold text-[#1a2e1a] capitalize">
                        {format(calendarMonth, "MMMM yyyy", { locale: es })}
                      </h2>
                      <p className="font-['Inter'] text-sm text-[#5a6b5a]">{filtered.length} citas visibles</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setCalendarMonth((month) => subMonths(month, 1))} className="h-10 w-10 rounded-xl border border-[#e5e0d8] text-[#5a6b5a] hover:border-[#2d5a27]/30 hover:text-[#1a2e1a] transition-colors" aria-label="Mes anterior">‹</button>
                      <button
                        type="button"
                        onClick={() => {
                          const today = new Date();
                          setCalendarMonth(startOfMonth(today));
                          setSelectedDate(getDateKey(today));
                        }}
                        className="px-4 py-2 rounded-xl border border-[#e5e0d8] text-sm font-['Inter'] text-[#5a6b5a] hover:border-[#2d5a27]/30"
                      >
                        Hoy
                      </button>
                      <button type="button" onClick={() => setCalendarMonth((month) => addMonths(month, 1))} className="h-10 w-10 rounded-xl border border-[#e5e0d8] text-[#5a6b5a] hover:border-[#2d5a27]/30 hover:text-[#1a2e1a] transition-colors" aria-label="Mes siguiente">›</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 border-b border-[#e5e0d8] bg-[#fafaf8]">
                    {["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"].map((day) => (
                      <div key={day} className="px-2 py-3 text-center text-xs font-semibold text-[#5a6b5a] font-['Inter']">{day}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7">
                    {calendarDays.map((day) => {
                      const dateKey = getDateKey(day);
                      const dayAppointments = appointmentsByDate[dateKey] ?? [];
                      const isSelected = selectedDate === dateKey;
                      const isToday = dateKey === getDateKey(new Date());
                      const isCurrentMonth = isSameMonth(day, calendarMonth);

                      return (
                        <button
                          key={dateKey}
                          type="button"
                          onClick={() => setSelectedDate(dateKey)}
                          className={`min-h-[118px] border-r border-b border-[#e5e0d8] p-2 text-left transition-colors hover:bg-[#edf1e8]/70 ${
                            isSelected ? "bg-[#edf1e8]" : "bg-white"
                          } ${!isCurrentMonth ? "opacity-45" : ""}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold font-['Inter'] ${isToday ? "bg-[#1a2e1a] text-white" : "text-[#1a2e1a]"}`}>
                              {format(day, "d")}
                            </span>
                            {dayAppointments.length > 0 && (
                              <span className="rounded-full bg-[#1a2e1a]/10 px-2 py-0.5 text-[11px] font-semibold text-[#1a2e1a] font-['Inter']">{dayAppointments.length}</span>
                            )}
                          </div>
                          <div className="mt-2 space-y-1">
                            {dayAppointments.slice(0, 3).map((appointment) => {
                              const colors = ESTADO_COLORS[appointment.estado];
                              return (
                                <div key={appointment.id} className={`rounded-lg px-2 py-1 text-[11px] ${colors.bg} ${colors.text} font-['Inter'] truncate`}>
                                  {appointment.horaPreferida} {appointment.nombre}
                                </div>
                              );
                            })}
                            {dayAppointments.length > 3 && (
                              <div className="px-2 text-[11px] text-[#5a6b5a] font-['Inter']">+{dayAppointments.length - 3} mas</div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <aside className="bg-white rounded-2xl border border-[#e5e0d8] p-5 shadow-sm h-fit lg:sticky lg:top-24">
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-[1.2px] text-[#5a6b5a] font-['Inter']">Agenda del dia</p>
                    <h3 className="mt-1 text-xl font-semibold text-[#1a2e1a] font-['Inter']">
                      {format(parseLocalDate(selectedDate), "d 'de' MMMM", { locale: es })}
                    </h3>
                  </div>

                  {selectedDateAppointments.length === 0 ? (
                    <div className="rounded-2xl bg-[#fafaf8] border border-[#e5e0d8] p-5 text-center">
                      <p className="text-sm font-medium text-[#1a2e1a] font-['Inter']">Sin citas</p>
                      <p className="mt-1 text-xs text-[#5a6b5a] font-['Inter']">Selecciona otro dia del calendario.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedDateAppointments.map((appointment) => {
                        const colors = ESTADO_COLORS[appointment.estado];
                        const servicio = SERVICIO_LABELS[appointment.tipoServicio];
                        return (
                          <div key={appointment.id} onClick={() => setSelected(appointment)} className="rounded-2xl border border-[#e5e0d8] p-4 hover:border-[#2d5a27]/30 hover:bg-[#fafaf8] transition-colors cursor-pointer">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-[#1a2e1a] font-['Inter']">
                                  {appointment.horaPreferida} · {appointment.nombre} {appointment.apellido}
                                </p>
                                <p className="mt-1 text-xs text-[#5a6b5a] font-['Inter']">{servicio.label}</p>
                              </div>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />{appointment.estado}
                              </span>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {appointment.estado === "pendiente" && (
                                <button onClick={(event) => { event.stopPropagation(); updateStatus(appointment.id, "confirmada"); }} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium font-['Inter'] hover:bg-blue-100 transition-colors">Confirmar</button>
                              )}
                              {appointment.estado === "confirmada" && (
                                <button onClick={(event) => { event.stopPropagation(); updateStatus(appointment.id, "completada"); }} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium font-['Inter'] hover:bg-emerald-100 transition-colors">Completar</button>
                              )}
                              {appointment.estado !== "cancelada" && (
                                <button onClick={(event) => { event.stopPropagation(); updateStatus(appointment.id, "cancelada"); }} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium font-['Inter'] hover:bg-red-100 transition-colors">Cancelar</button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </aside>
              </div>
            )}
          </>
        )}
      </main>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(event) => event.stopPropagation()}>
              <div className="p-6 border-b border-[#e5e0d8]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#1a2e1a] font-['Inter']">{selected.nombre} {selected.apellido}</h3>
                    <span className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${ESTADO_COLORS[selected.estado].bg} ${ESTADO_COLORS[selected.estado].text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${ESTADO_COLORS[selected.estado].dot}`} />{selected.estado}
                    </span>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-[#f5f2ec] transition-colors">
                    <svg className="w-5 h-5 text-[#5a6b5a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: "Correo", value: selected.email },
                  { label: "Telefono", value: selected.telefono },
                  { label: "Fecha de nacimiento", value: formatDate(selected.fechaNacimiento) },
                  { label: "Servicio", value: SERVICIO_LABELS[selected.tipoServicio].label },
                  { label: "Fecha de cita", value: formatDate(selected.fechaPreferida) },
                  { label: "Hora", value: selected.horaPreferida },
                  { label: "Registrado", value: formatDate(selected.creadoEn) },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center gap-4 py-2 border-b border-[#f0ede6]">
                    <span className="text-sm text-[#5a6b5a] font-['Inter']">{item.label}</span>
                    <span className="text-sm font-medium text-[#1a2e1a] font-['Inter'] text-right">{item.value}</span>
                  </div>
                ))}
                {selected.notas && (
                  <div className="pt-2">
                    <span className="text-sm text-[#5a6b5a] font-['Inter'] block mb-1">Notas</span>
                    <p className="text-sm text-[#1a2e1a] font-['Inter'] bg-[#fafaf8] rounded-xl p-3 border border-[#e5e0d8]">{selected.notas}</p>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-[#e5e0d8] flex flex-wrap gap-2">
                {selected.estado === "pendiente" && <button onClick={() => updateStatus(selected.id, "confirmada")} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-['Inter'] font-medium hover:bg-blue-700 transition-colors">Confirmar</button>}
                {selected.estado === "confirmada" && <button onClick={() => updateStatus(selected.id, "completada")} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-['Inter'] font-medium hover:bg-emerald-700 transition-colors">Completar</button>}
                {selected.estado !== "cancelada" && <button onClick={() => updateStatus(selected.id, "cancelada")} className="px-4 py-2 rounded-xl bg-red-50 text-red-700 text-sm font-['Inter'] font-medium hover:bg-red-100 transition-colors">Cancelar cita</button>}
                <button onClick={() => deleteAppointment(selected.id)} className="px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-['Inter'] font-medium hover:bg-red-50 transition-colors ml-auto">Eliminar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
