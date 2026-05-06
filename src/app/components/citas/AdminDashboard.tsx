import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

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

const SERVICIO_LABELS: Record<string, { label: string; icon: string }> = {
  psicologia: { label: "Psicología", icon: "🧠" },
  legal: { label: "Legal", icon: "⚖️" },
  ambos: { label: "Integral", icon: "🤝" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

export function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Appointment | null>(null);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");
      if (res.ok) setAppointments(await res.json());
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const updateStatus = async (id: string, estado: string) => {
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });
    if (res.ok) {
      fetchAppointments();
      if (selected?.id === id) setSelected((p) => p ? { ...p, estado: estado as Appointment["estado"] } : null);
    }
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta cita?")) return;
    const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
    if (res.ok) { fetchAppointments(); setSelected(null); }
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
    } catch { window.location.href = "/"; }
  };

  const filtered = appointments.filter((a) => {
    if (filter !== "todos" && a.estado !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return `${a.nombre} ${a.apellido} ${a.telefono} ${a.email}`.toLowerCase().includes(q);
    }
    return true;
  });

  const stats = {
    total: appointments.length,
    pendientes: appointments.filter((a) => a.estado === "pendiente").length,
    hoy: appointments.filter((a) => a.fechaPreferida === new Date().toISOString().split("T")[0]).length,
    confirmadas: appointments.filter((a) => a.estado === "confirmada").length,
  };

  return (
    <div className="min-h-screen bg-[#f5f2ec]">
      {/* Top Bar */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#e5e0d8] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/"><img src="/logo.svg" alt="Logo" className="h-8" /></a>
            <div className="hidden sm:block h-6 w-px bg-[#e5e0d8]" />
            <h1 className="hidden sm:block text-lg font-semibold text-[#1a2e1a] font-['Inter']">Panel de Citas</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-['Inter'] text-[#5a6b5a] hover:bg-[#1a2e1a]/5 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Citas", value: stats.total, color: "from-[#1a2e1a] to-[#2d5a27]", icon: "📋" },
            { label: "Pendientes", value: stats.pendientes, color: "from-amber-500 to-amber-600", icon: "⏳" },
            { label: "Confirmadas", value: stats.confirmadas, color: "from-blue-500 to-blue-600", icon: "✅" },
            { label: "Hoy", value: stats.hoy, color: "from-emerald-500 to-emerald-600", icon: "📅" },
          ].map((stat) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-[#e5e0d8] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <span className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent font-['Inter']`}>{stat.value}</span>
              </div>
              <p className="text-xs text-[#5a6b5a] font-['Inter']">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a9a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre, teléfono o correo..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e5e0d8] bg-white font-['Inter'] text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27]" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {["todos", "pendiente", "confirmada", "completada", "cancelada"].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2.5 rounded-xl text-sm font-['Inter'] font-medium whitespace-nowrap transition-all ${filter === f ? "bg-[#1a2e1a] text-white shadow-lg" : "bg-white border border-[#e5e0d8] text-[#5a6b5a] hover:border-[#2d5a27]/30"}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table / List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-[#2d5a27]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">📭</span>
            <h3 className="text-lg font-semibold text-[#1a2e1a] font-['Inter']">No hay citas</h3>
            <p className="text-sm text-[#5a6b5a] font-['Inter'] mt-1">{search || filter !== "todos" ? "Intenta con otros filtros" : "Las citas agendadas aparecerán aquí"}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((a, i) => {
                const colors = ESTADO_COLORS[a.estado];
                const servicio = SERVICIO_LABELS[a.tipoServicio];
                return (
                  <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}
                    onClick={() => setSelected(a)}
                    className="bg-white rounded-2xl border border-[#e5e0d8] p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-[#2d5a27]/20 transition-all cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2d5a27] to-[#4a8c3f] flex items-center justify-center text-white font-bold font-['Inter'] text-sm flex-shrink-0">
                        {a.nombre[0]}{a.apellido[0]}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-[#1a2e1a] font-['Inter'] text-sm">{a.nombre} {a.apellido}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />{a.estado}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-[#5a6b5a] font-['Inter'] flex-wrap">
                          <span>{servicio.icon} {servicio.label}</span>
                          <span>📅 {formatDate(a.fechaPreferida)}</span>
                          <span>🕐 {a.horaPreferida}</span>
                          <span className="hidden sm:inline">📞 {a.telefono}</span>
                        </div>
                      </div>
                      {/* Quick Actions */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {a.estado === "pendiente" && (
                          <button onClick={(e) => { e.stopPropagation(); updateStatus(a.id, "confirmada"); }}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium font-['Inter'] hover:bg-blue-100 transition-colors">Confirmar</button>
                        )}
                        {a.estado === "confirmada" && (
                          <button onClick={(e) => { e.stopPropagation(); updateStatus(a.id, "completada"); }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium font-['Inter'] hover:bg-emerald-100 transition-colors">Completar</button>
                        )}
                        {a.estado !== "cancelada" && (
                          <button onClick={(e) => { e.stopPropagation(); updateStatus(a.id, "cancelada"); }}
                            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium font-['Inter'] hover:bg-red-100 transition-colors">Cancelar</button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-[#e5e0d8]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2d5a27] to-[#4a8c3f] flex items-center justify-center text-white font-bold font-['Inter']">
                      {selected.nombre[0]}{selected.apellido[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1a2e1a] font-['Inter']">{selected.nombre} {selected.apellido}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${ESTADO_COLORS[selected.estado].bg} ${ESTADO_COLORS[selected.estado].text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${ESTADO_COLORS[selected.estado].dot}`} />{selected.estado}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-[#f5f2ec] transition-colors">
                    <svg className="w-5 h-5 text-[#5a6b5a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: "Correo", value: selected.email, icon: "✉️" },
                  { label: "Teléfono", value: selected.telefono, icon: "📞" },
                  { label: "Fecha de Nacimiento", value: formatDate(selected.fechaNacimiento), icon: "🎂" },
                  { label: "Servicio", value: `${SERVICIO_LABELS[selected.tipoServicio].icon} ${SERVICIO_LABELS[selected.tipoServicio].label}`, icon: "" },
                  { label: "Fecha de Cita", value: formatDate(selected.fechaPreferida), icon: "📅" },
                  { label: "Hora", value: selected.horaPreferida, icon: "🕐" },
                  { label: "Registrado", value: formatDate(selected.creadoEn), icon: "📝" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-[#f0ede6]">
                    <span className="text-sm text-[#5a6b5a] font-['Inter']">{item.icon} {item.label}</span>
                    <span className="text-sm font-medium text-[#1a2e1a] font-['Inter']">{item.value}</span>
                  </div>
                ))}
                {selected.notas && (
                  <div className="pt-2">
                    <span className="text-sm text-[#5a6b5a] font-['Inter'] block mb-1">📋 Notas</span>
                    <p className="text-sm text-[#1a2e1a] font-['Inter'] bg-[#fafaf8] rounded-xl p-3 border border-[#e5e0d8]">{selected.notas}</p>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-[#e5e0d8] flex flex-wrap gap-2">
                {selected.estado === "pendiente" && <button onClick={() => updateStatus(selected.id, "confirmada")} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-['Inter'] font-medium hover:bg-blue-700 transition-colors">Confirmar</button>}
                {selected.estado === "confirmada" && <button onClick={() => updateStatus(selected.id, "completada")} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-['Inter'] font-medium hover:bg-emerald-700 transition-colors">Completar</button>}
                {selected.estado !== "cancelada" && <button onClick={() => updateStatus(selected.id, "cancelada")} className="px-4 py-2 rounded-xl bg-red-50 text-red-700 text-sm font-['Inter'] font-medium hover:bg-red-100 transition-colors">Cancelar Cita</button>}
                <button onClick={() => deleteAppointment(selected.id)} className="px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-['Inter'] font-medium hover:bg-red-50 transition-colors ml-auto">Eliminar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
