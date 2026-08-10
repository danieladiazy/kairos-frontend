import { Calendar, ChevronLeft, ChevronRight, Clock, Loader2, RefreshCw, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { agendaDelNegocio, cambiarEstadoCita, reagendarCita, type Cita, type EstadoCita } from "../../lib/api";
import { formatDateOnly, todayDateOnly } from "../../lib/date";
import { AppointmentDetailModal } from "../AppointmentDetailModal";

const LABEL: Record<EstadoCita, string> = { PENDIENTE: "Pendiente", CONFIRMADA: "Confirmada", CANCELADA: "Cancelada", COMPLETADA: "Completada" };
const COLOR: Record<EstadoCita, string> = { PENDIENTE: "bg-yellow-100 text-yellow-800", CONFIRMADA: "bg-green-100 text-green-800", CANCELADA: "bg-red-100 text-red-800", COMPLETADA: "bg-green-100 text-green-800" };
const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const pad = (value: number) => String(value).padStart(2, "0");

export function AgendaScreen() {
  const now = new Date();
  const [fecha, setFecha] = useState("");
  const [month, setMonth] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
  const [citas, setCitas] = useState<Cita[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const selected = citas.find((cita) => cita.id === selectedId);
  const update = (cita: Cita) => setCitas((items) => items.map((item) => item.id === cita.id ? cita : item));
  const load = () => { setLoading(true); setError(""); agendaDelNegocio().then(setCitas).catch((reason) => setError(reason instanceof Error ? reason.message : "No se pudo cargar la agenda")).finally(() => setLoading(false)); };
  useEffect(load, []);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
    const offset = (firstDay + 6) % 7;
    const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return Array.from({ length: offset + total }, (_, index) => index < offset ? null : index - offset + 1);
  }, [month]);
  const counts = useMemo(() => citas.filter((cita) => cita.estado === "PENDIENTE" || cita.estado === "CONFIRMADA").reduce<Record<string, number>>((result, cita) => ({ ...result, [cita.fecha]: (result[cita.fecha] || 0) + 1 }), {}), [citas]);
  const visibleCitas = fecha ? citas.filter((cita) => cita.fecha === fecha) : citas;
  const activeCitas = visibleCitas.filter((cita) => cita.estado === "PENDIENTE" || cita.estado === "CONFIRMADA").sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
  const historyCitas = visibleCitas.filter((cita) => cita.estado === "COMPLETADA" || cita.estado === "CANCELADA").sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora));
  const changeMonth = (offset: number) => { setMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1)); setFecha(""); };
  const cards = (items: Cita[]) => items.map((cita) => <button key={cita.id} onClick={() => setSelectedId(cita.id)} className="w-full overflow-hidden rounded-xl border bg-card text-left hover:shadow-sm">
    <div className="flex min-h-28">
      {cita.servicio?.imagenUrl ? <img src={cita.servicio.imagenUrl} alt={cita.servicio.nombre} className="w-20 sm:w-28 shrink-0 object-cover" /> : <div aria-label="Servicio sin imagen" className="w-20 sm:w-28 shrink-0 bg-muted" />}
      <div className="min-w-0 flex-1 p-3 sm:p-4"><div className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between sm:gap-3"><div className="min-w-0 max-w-full"><h3 className="truncate">{cita.servicio?.nombre}</h3><p className="flex gap-2 truncate text-sm text-muted-foreground"><User className="h-4 w-4 shrink-0" />{cita.cliente?.nombre}</p>{cita.cliente?.rol === "CLIENTEEMPRESA" && <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">Cliente empresarial · 10% menos</span>}</div><span className={`h-fit shrink-0 rounded-full px-3 py-1 text-xs font-medium ${COLOR[cita.estado]}`}>{LABEL[cita.estado]}</span></div><div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground"><span className="flex gap-2"><Calendar className="h-4 w-4" />{cita.fecha}</span><span className="flex gap-2"><Clock className="h-4 w-4" />{cita.hora.slice(0, 5)}</span></div></div>
    </div>
  </button>);

  return <div className="h-full flex flex-col bg-background">
    <header className="p-4 sm:p-6 border-b bg-card"><div className="flex items-start justify-between gap-3 sm:gap-4"><div><h1>Mi agenda</h1><p className="text-sm text-muted-foreground">Consulta tus citas y organiza cada día de atención.</p></div><button onClick={load} aria-label="Actualizar agenda" className="flex min-h-10 shrink-0 items-center gap-2 px-3 sm:px-4 py-2 border rounded-lg"><RefreshCw className="h-4 w-4" /><span className="hidden sm:inline">Actualizar</span></button></div></header>
    <main className="flex-1 overflow-auto p-4 sm:p-6"><div className="max-w-5xl mx-auto space-y-6">
      <section className="rounded-2xl border bg-card p-3 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-2 sm:gap-3"><button onClick={() => changeMonth(-1)} aria-label="Mes anterior" className="shrink-0 rounded-lg border p-2 hover:bg-muted"><ChevronLeft className="h-5 w-5" /></button><h2 className="text-center text-base sm:text-xl capitalize">{month.toLocaleDateString("es-MX", { month: "long", year: "numeric" })}</h2><button onClick={() => changeMonth(1)} aria-label="Mes siguiente" className="shrink-0 rounded-lg border p-2 hover:bg-muted"><ChevronRight className="h-5 w-5" /></button></div>
        <div className="grid grid-cols-7 gap-1 text-center">{WEEKDAYS.map((day) => <div key={day} className="py-2 text-[11px] sm:text-xs font-medium text-muted-foreground">{day}</div>)}{calendarDays.map((day, index) => day === null ? <div key={`empty-${index}`} /> : (() => { const key = `${month.getFullYear()}-${pad(month.getMonth() + 1)}-${pad(day)}`; const count = counts[key] || 0; const active = fecha === key; const today = key === todayDateOnly(); return <button key={key} onClick={() => setFecha(key)} className={`relative min-h-11 sm:min-h-14 rounded-lg border p-1 sm:p-2 text-xs sm:text-sm transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary/50 hover:bg-muted/60"} ${today && !active ? "ring-1 ring-primary" : ""}`}><span>{day}</span>{count > 0 && <span className={`absolute bottom-0.5 sm:bottom-1.5 left-1/2 -translate-x-1/2 rounded-full px-1 sm:px-1.5 text-[9px] sm:text-[10px] ${active ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>{count}</span>}</button>; })())}</div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm"><p className="text-muted-foreground">El número inferior indica cuántas citas activas hay ese día.</p>{fecha && <button onClick={() => setFecha("")} className="text-primary">Ver todas las citas</button>}</div>
      </section>

      {loading ? <div className="flex justify-center gap-2"><Loader2 className="animate-spin" />Cargando agenda...</div> : error ? <p className="text-center text-destructive">{error}</p> : visibleCitas.length === 0 ? <div className="border rounded-xl p-10 text-center text-muted-foreground">No hay citas para esta selección.</div> : <div className="space-y-8">
        <section className="space-y-4"><h2>{fecha ? `Citas activas del ${formatDateOnly(fecha, { day: "numeric", month: "long", year: "numeric" })}` : "Citas activas"}</h2>{activeCitas.length ? <div className="space-y-3">{cards(activeCitas)}</div> : <div className="rounded-xl border p-8 text-center text-muted-foreground">No hay citas activas para esta selección.</div>}</section>
        {historyCitas.length > 0 && <section className="space-y-4 border-t pt-7"><div><h2>Historial</h2><p className="text-sm text-muted-foreground">Citas completadas y canceladas</p></div><div className="space-y-3">{cards(historyCitas)}</div></section>}
      </div>}
    </div></main>
    {selected && <AppointmentDetailModal cita={selected} actor="negocio" onClose={() => setSelectedId(null)} onStatus={async (estado) => { const cita = await cambiarEstadoCita(selected.id, estado); update(cita); setSelectedId(null); toast.success(estado === "CONFIRMADA" ? "Cita confirmada" : "Cita actualizada"); }} onReschedule={async (date, time) => { const cita = await reagendarCita(selected.id, date, time); update(cita); toast.success("Cita reagendada"); }} />}
  </div>;
}
