import { ArrowLeft, Calendar, Clock, DollarSign, Loader2, MapPin, MessageSquare, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { obtenerServicio, type DiaSemana, type Negocio, type Servicio } from "../../lib/api";
import { Footer } from "../Footer";

interface Props {
  serviceId: number;
  onBack: () => void;
  onBooking: (servicio: Servicio, negocio: Negocio) => void;
  isLoggedIn: boolean;
  onNavigate: (screen: string) => void;
}

const DAY_LABELS: Record<DiaSemana, string> = {
  MONDAY: "Lunes", TUESDAY: "Martes", WEDNESDAY: "Miércoles", THURSDAY: "Jueves",
  FRIDAY: "Viernes", SATURDAY: "Sábado", SUNDAY: "Domingo",
};
const DAY_ORDER: DiaSemana[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const time = (value: string) => value.slice(0, 5);

export function ServiceDetailScreen({ serviceId, onBack, onBooking, isLoggedIn, onNavigate }: Props) {
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    obtenerServicio(serviceId)
      .then(setServicio)
      .catch((reason) => setError(reason instanceof Error ? reason.message : "No se pudo cargar el servicio"))
      .finally(() => setLoading(false));
  }, [serviceId]);

  if (loading) return <div className="h-full flex justify-center items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin" />Cargando servicio...</div>;
  if (error || !servicio || !servicio.negocio) return <div className="h-full flex flex-col justify-center items-center gap-4 p-6 text-center"><p className="text-destructive">{error || "No fue posible obtener la información completa del servicio."}</p><button onClick={onBack} className="px-4 py-2 border rounded-lg">Volver</button></div>;

  const negocio = servicio.negocio;
  const schedules = [...(servicio.horarios || [])].sort((a, b) => DAY_ORDER.indexOf(a.diaSemana) - DAY_ORDER.indexOf(b.diaSemana));
  const reservar = () => {
    if (!isLoggedIn) { onNavigate("login"); return; }
    if (servicio.activo !== false) onBooking(servicio, negocio);
  };

  return <div className="h-full flex flex-col bg-background overflow-hidden">
    <header className="bg-card border-b px-6 py-4 flex items-center gap-3"><button onClick={onBack} className="p-2 rounded-lg hover:bg-muted"><ArrowLeft /></button><div><h1>{servicio.nombre}</h1><p className="text-sm text-muted-foreground">Información del servicio</p></div></header>
    <main className="flex-1 overflow-y-auto"><div className="max-w-5xl mx-auto p-6 space-y-6">
      {servicio.imagenUrl ? <img src={servicio.imagenUrl} alt={servicio.nombre} className="w-full h-72 object-cover rounded-2xl border" /> : <div className="h-56 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">Servicio sin imagen</div>}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <section className="space-y-5">
          <div className="bg-card border rounded-xl p-6"><div className="flex gap-4 items-center">{negocio.imagenUrl ? <img src={negocio.imagenUrl} alt={negocio.nombre} className="w-16 h-16 object-cover rounded-xl" /> : <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center font-semibold">{negocio.nombre.slice(0, 1)}</div>}<div><p className="text-sm text-muted-foreground">Ofrecido por</p><h2>{negocio.nombre}</h2><p className="text-sm text-muted-foreground">{servicio.categoria || negocio.categoria}</p></div></div></div>
          <div className="bg-card border rounded-xl p-6"><h3>Descripción</h3><p className="mt-2 text-muted-foreground leading-relaxed">{servicio.descripcion || "Este servicio no tiene una descripción registrada."}</p></div>
          <div className="bg-card border rounded-xl p-6"><div className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /><h3>Horario de atención</h3></div><p className="text-sm text-muted-foreground mt-1">La disponibilidad se configura específicamente para este servicio.</p>{schedules.length ? <div className="mt-4 grid sm:grid-cols-2 gap-2">{schedules.map((schedule) => <div key={schedule.diaSemana} className="flex justify-between gap-4 rounded-lg bg-muted/50 px-4 py-3 text-sm"><span>{DAY_LABELS[schedule.diaSemana]}</span><strong>{time(schedule.horaInicio)} – {time(schedule.horaFin)}</strong></div>)}</div> : <p className="mt-4 text-sm text-muted-foreground">Consulta la disponibilidad al reservar.</p>}</div>
          <div className="bg-card border rounded-xl p-6"><div className="flex items-center justify-between gap-4"><div className="flex gap-3"><div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center"><Star className="h-5 w-5 text-amber-500" /></div><div><h3>Calificaciones y reseñas</h3><p className="text-sm text-muted-foreground">Este servicio todavía no tiene reseñas.</p></div></div><span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">Próximamente</span></div><button disabled className="mt-4 w-full py-2.5 border rounded-lg text-muted-foreground opacity-70 flex justify-center items-center gap-2"><MessageSquare className="h-4 w-4" />Las reseñas estarán disponibles próximamente</button></div>
        </section>
        <aside className="bg-card border rounded-xl p-6 h-fit space-y-4 lg:sticky lg:top-6"><span className={`inline-block px-3 py-1 rounded-full text-xs ${servicio.activo !== false ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{servicio.activo !== false ? "Disponible" : "Inactivo"}</span><p className="flex gap-2"><DollarSign className="h-5 w-5 text-primary" />${Number(servicio.precio).toFixed(2)} MXN</p><p className="flex gap-2"><Clock className="h-5 w-5 text-primary" />{servicio.duracionMinutos} minutos</p><p className="flex gap-2"><MapPin className="h-5 w-5 text-primary" />{negocio.direccion || "Dirección no registrada"}</p><button onClick={reservar} disabled={servicio.activo === false} className="w-full py-3 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 flex justify-center items-center gap-2"><Calendar className="h-5 w-5" />Reservar</button></aside>
      </div>
      <Footer />
    </div></main>
  </div>;
}
