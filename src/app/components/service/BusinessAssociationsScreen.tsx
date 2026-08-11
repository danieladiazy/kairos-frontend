import { Building2, Check, Clock3, Loader2, Mail, Phone, UserCheck, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { listarSolicitudesAsociacionEmpresa, responderSolicitudAsociacionEmpresa, type AsociacionEmpresa } from "../../lib/api";
import { ConfirmDialog } from "../ConfirmDialog";

type Decision = { solicitud: AsociacionEmpresa; estado: "APROBADA" | "RECHAZADA" } | null;

const labelEstado = { PENDIENTE: "Pendiente", APROBADA: "Aprobada", RECHAZADA: "Rechazada" } as const;
const colorEstado = {
  PENDIENTE: "bg-amber-100 text-amber-800",
  APROBADA: "bg-emerald-100 text-emerald-800",
  RECHAZADA: "bg-red-100 text-red-800",
} as const;

export function BusinessAssociationsScreen() {
  const [solicitudes, setSolicitudes] = useState<AsociacionEmpresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [decision, setDecision] = useState<Decision>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    listarSolicitudesAsociacionEmpresa()
      .then(setSolicitudes)
      .catch((reason) => setError(reason instanceof Error ? reason.message : "No se pudieron cargar las solicitudes"))
      .finally(() => setLoading(false));
  }, []);

  const ordenadas = useMemo(() => [...solicitudes].sort((a, b) => {
    if (a.estado === "PENDIENTE" && b.estado !== "PENDIENTE") return -1;
    if (a.estado !== "PENDIENTE" && b.estado === "PENDIENTE") return 1;
    return b.solicitadoEn.localeCompare(a.solicitadoEn);
  }), [solicitudes]);

  const confirmar = async () => {
    if (!decision) return;
    setBusy(true);
    try {
      const actualizada = await responderSolicitudAsociacionEmpresa(decision.solicitud.id, decision.estado);
      setSolicitudes((actuales) => actuales.map((item) => item.id === actualizada.id ? actualizada : item));
      toast.success(decision.estado === "APROBADA" ? "Asociación aprobada" : "Solicitud rechazada");
      setDecision(null);
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "No se pudo responder la solicitud");
    } finally {
      setBusy(false);
    }
  };

  return <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div><h1>Solicitudes empresariales</h1><p className="text-muted-foreground">Confirma qué clientes pertenecen a tu negocio para activarles el descuento del 10%.</p></div>
      <div className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-800"><Clock3 className="h-4 w-4" />{solicitudes.filter((item) => item.estado === "PENDIENTE").length} pendientes</div>
    </div>

    {loading && <div className="flex items-center justify-center gap-2 rounded-xl border bg-card py-16 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" />Cargando solicitudes...</div>}
    {error && <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-5 text-destructive">{error}</div>}
    {!loading && !error && ordenadas.length === 0 && <div className="rounded-xl border bg-card p-10 text-center"><UserCheck className="mx-auto h-10 w-10 text-muted-foreground" /><h2 className="mt-4">No hay solicitudes todavía</h2><p className="mt-1 text-sm text-muted-foreground">Cuando un cliente empresarial seleccione tu negocio durante el registro, aparecerá aquí.</p></div>}

    {!loading && !error && ordenadas.length > 0 && <div className="grid gap-4 md:grid-cols-2">{ordenadas.map((solicitud) => <article key={solicitud.id} className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="truncate text-lg">{solicitud.clienteNombre}</h2><p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground"><Building2 className="h-4 w-4" />Solicita asociarse con {solicitud.negocioNombre}</p></div><span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${colorEstado[solicitud.estado]}`}>{labelEstado[solicitud.estado]}</span></div>
      <div className="mt-4 space-y-2 rounded-lg bg-muted/40 p-3 text-sm"><p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" />{solicitud.clienteEmail}</p>{solicitud.clienteTelefono && <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />{solicitud.clienteTelefono}</p>}</div>
      {solicitud.estado === "PENDIENTE" && <div className="mt-4 grid grid-cols-2 gap-3"><button onClick={() => setDecision({ solicitud, estado: "RECHAZADA" })} className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-destructive/40 text-destructive hover:bg-destructive/5"><X className="h-4 w-4" />Rechazar</button><button onClick={() => setDecision({ solicitud, estado: "APROBADA" })} className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary text-white hover:bg-primary/90"><Check className="h-4 w-4" />Aprobar</button></div>}
    </article>)}</div>}

    <ConfirmDialog open={decision !== null} title={decision?.estado === "APROBADA" ? "¿Aprobar esta asociación?" : "¿Rechazar esta solicitud?"} description={decision?.estado === "APROBADA" ? "El cliente obtendrá inmediatamente el 10% de descuento empresarial." : "El cliente continuará usando la plataforma sin descuento empresarial."} confirmLabel={decision?.estado === "APROBADA" ? "Aprobar" : "Rechazar"} destructive={decision?.estado === "RECHAZADA"} busy={busy} onCancel={() => setDecision(null)} onConfirm={confirmar} />
  </div>;
}
