import { Calendar, CalendarClock, Clock, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cancelarCita, misCitas, reagendarCita, type Cita, type Negocio, type Servicio } from "../../lib/api";
import { parseAppointmentDateTime } from "../../lib/date";
import { AppointmentDetailModal } from "../AppointmentDetailModal";
import { Footer } from "../Footer";

const LABEL: Record<string, string> = { PENDIENTE: "Pendiente", CONFIRMADA: "Confirmada", CANCELADA: "Cancelada", COMPLETADA: "Completada" };
const COLOR: Record<string, string> = { PENDIENTE: "bg-yellow-100 text-yellow-800", CONFIRMADA: "bg-green-100 text-green-800", CANCELADA: "bg-red-100 text-red-800", COMPLETADA: "bg-green-100 text-green-800" };

interface Props {
  onNavigate: (screen: string) => void;
  onNavigateToService: (id: number) => void;
  onBookAgain: (servicio: Servicio, negocio: Negocio) => void;
}

export function AppointmentsScreen({ onNavigate, onNavigateToService, onBookAgain }: Props) {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const load = () => { setLoading(true); setError(""); misCitas().then(setCitas).catch((reason) => setError(reason instanceof Error ? reason.message : "No se pudieron cargar las citas")).finally(() => setLoading(false)); };
  useEffect(load, []);
  const selected = citas.find((cita) => cita.id === selectedId) || null;
  const update = (cita: Cita) => setCitas((items) => items.map((item) => item.id === cita.id ? cita : item));
  const sorted = [...citas].sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
  const isPast = (cita: Cita) => parseAppointmentDateTime(cita.fecha, cita.hora).getTime() < Date.now();
  const upcoming = sorted.filter((cita) => (cita.estado === "PENDIENTE" || cita.estado === "CONFIRMADA") && !isPast(cita));
  const history = sorted.filter((cita) => !upcoming.some((item) => item.id === cita.id)).reverse();
  const cards = (items: Cita[]) => items.map((cita) => <button key={cita.id} onClick={() => setSelectedId(cita.id)} className="w-full overflow-hidden rounded-xl border bg-card text-left hover:shadow-md">
    <div className="flex min-h-28">
      {cita.servicio?.imagenUrl ? <img src={cita.servicio.imagenUrl} alt={cita.servicio.nombre} className="w-28 shrink-0 object-cover" /> : <div aria-label="Servicio sin imagen" className="w-28 shrink-0 bg-muted" />}
      <div className="min-w-0 flex-1 p-4"><div className="flex justify-between gap-3"><div className="min-w-0"><h3 className="truncate">{cita.servicio?.nombre}</h3><p className="truncate text-sm text-muted-foreground">{cita.servicio?.negocio?.nombre}</p></div><span className={`h-fit shrink-0 rounded-full px-3 py-1 text-xs font-medium ${COLOR[cita.estado]}`}>{LABEL[cita.estado]}</span></div><div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground"><span className="flex gap-2"><Calendar className="h-4 w-4" />{cita.fecha}</span><span className="flex gap-2"><Clock className="h-4 w-4" />{cita.hora.slice(0, 5)}</span></div></div>
    </div>
  </button>);

  return <div className="h-full flex flex-col bg-background overflow-hidden">
    <header className="bg-card border-b px-6 py-4 flex justify-between"><div><h1>Mis citas</h1><p className="text-sm text-muted-foreground">Consulta y administra tus reservaciones</p></div><button onClick={load} className="flex gap-2 items-center px-3 border rounded-lg"><RefreshCw className="h-4 w-4" />Actualizar</button></header>
    <main className="flex-1 overflow-y-auto"><div className="p-6 max-w-4xl mx-auto space-y-8">{loading ? <div className="flex justify-center gap-2"><Loader2 className="animate-spin" />Cargando citas...</div> : error ? <div className="text-center text-destructive">{error}</div> : <><section><h2 className="mb-4">Próximas citas</h2>{upcoming.length ? <div className="space-y-3">{cards(upcoming)}</div> : <div className="border rounded-xl p-10 text-center"><CalendarClock className="mx-auto mb-3" /><p>Sin citas próximas</p><button onClick={() => onNavigate("search")} className="mt-3 px-4 py-2 bg-primary text-white rounded-lg">Explorar servicios</button></div>}</section>{history.length > 0 && <section><h2 className="mb-4">Historial</h2><div className="space-y-3">{cards(history)}</div></section>}</>}<Footer /></div></main>
    {selected && <AppointmentDetailModal cita={selected} actor="cliente" onClose={() => setSelectedId(null)} onCancel={async () => { await cancelarCita(selected.id); update({ ...selected, estado: "CANCELADA" }); toast.success("Cita cancelada"); }} onReschedule={async (fecha, hora) => { const cita = await reagendarCita(selected.id, fecha, hora); update(cita); toast.success("Cita reagendada"); }} onBookAgain={selected.servicio?.negocio ? () => onBookAgain(selected.servicio!, selected.servicio!.negocio!) : undefined} onOpenBusiness={selected.servicio ? () => { const serviceId = selected.servicio!.id; setSelectedId(null); onNavigateToService(serviceId); } : undefined} />}
  </div>;
}
