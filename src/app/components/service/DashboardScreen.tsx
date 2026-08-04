import { Calendar, DollarSign, Loader2, Package, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { agendaDelNegocio, listarServiciosDeNegocio, obtenerMiNegocio, type Cita, type Servicio } from "../../lib/api";
import { parseAppointmentDateTime, todayDateOnly } from "../../lib/date";

export function DashboardScreen({ onOpenAgenda }: { onOpenAgenda: () => void }) {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([agendaDelNegocio(), obtenerMiNegocio().then((negocio) => listarServiciosDeNegocio(negocio.id))])
      .then(([appointments, services]) => { setCitas(appointments); setServicios(services); })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "No se pudo cargar el resumen"))
      .finally(() => setLoading(false));
  }, []);

  const today = todayDateOnly();
  const data = useMemo(() => {
    const active = citas.filter((cita) => cita.estado !== "CANCELADA");
    const next = active.filter((cita) => cita.estado !== "COMPLETADA" && parseAppointmentDateTime(cita.fecha,cita.hora).getTime() >= Date.now()).sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
    return {
      today: active.filter((cita) => cita.fecha === today).length,
      next,
      services: servicios.filter((servicio) => servicio.activo !== false).length,
      clients: new Set(active.map((cita) => cita.cliente?.id).filter(Boolean)).size,
      income: citas.filter((cita) => cita.estado === "COMPLETADA").reduce((sum, cita) => sum + Number(cita.servicio?.precio || 0), 0),
    };
  }, [citas, servicios, today]);

  if (loading) return <div className="p-8 flex gap-2"><Loader2 className="animate-spin" />Cargando resumen...</div>;

  const stats = [
    { icon: Calendar, label: "Citas hoy", value: data.today },
    { icon: Calendar, label: "Próximas", value: data.next.length },
    { icon: Package, label: "Servicios activos", value: data.services },
    { icon: Users, label: "Clientes únicos", value: data.clients },
    { icon: DollarSign, label: "Ingresos completados", value: `$${data.income.toFixed(2)}` },
  ];

  return <div className="p-8 max-w-7xl mx-auto space-y-8">
    <div><h1>Resumen del negocio</h1><p className="text-muted-foreground">Consulta la actividad reciente de tu negocio.</p></div>
    {error ? <p className="text-destructive">{error}</p> : <>
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">{stats.map((stat, index) => { const Icon = stat.icon; return <div key={index} className="bg-card border rounded-xl p-5"><Icon className="text-primary" /><p className="text-sm text-muted-foreground mt-3">{stat.label}</p><p className="text-2xl">{stat.value}</p></div>; })}</div>
      <section className="bg-card border rounded-xl p-6">
        <div className="flex justify-between mb-4"><h2>Próximas citas</h2><button onClick={onOpenAgenda} className="text-primary">Abrir agenda</button></div>
        {data.next.length ? <div className="space-y-3">{data.next.slice(0, 6).map((cita) => <button key={cita.id} onClick={onOpenAgenda} className="w-full text-left p-4 rounded-lg bg-muted/50 flex justify-between"><div><p>{cita.cliente?.nombre}</p><p className="text-sm text-muted-foreground">{cita.servicio?.nombre}</p></div><div className="text-right"><p>{cita.fecha}</p><p className="text-sm text-muted-foreground">{cita.hora.slice(0, 5)}</p></div></button>)}</div> : <p className="text-muted-foreground">No tienes citas próximas.</p>}
      </section>
    </>}
  </div>;
}
