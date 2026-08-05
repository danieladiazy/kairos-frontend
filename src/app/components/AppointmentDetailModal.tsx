import { Calendar, ChevronRight, Clock, DollarSign, FileText, MapPin, User, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Cita, EstadoCita } from "../lib/api";
import { parseAppointmentDateTime, todayDateOnly } from "../lib/date";
import { ConfirmDialog } from "./ConfirmDialog";

const LABEL:Record<EstadoCita,string>={PENDIENTE:"Pendiente",CONFIRMADA:"Confirmada",CANCELADA:"Cancelada",COMPLETADA:"Completada"};
const COLOR:Record<EstadoCita,string>={PENDIENTE:"bg-yellow-100 text-yellow-800",CONFIRMADA:"bg-green-100 text-green-800",CANCELADA:"bg-red-100 text-red-800",COMPLETADA:"bg-green-100 text-green-800"};

interface Props {
  cita:Cita;
  actor:"cliente"|"negocio";
  onClose:()=>void;
  onCancel?:()=>Promise<void>;
  onStatus?:(estado:EstadoCita)=>Promise<void>;
  onReschedule:(fecha:string,hora:string)=>Promise<void>;
  onBookAgain?:()=>void;
  onOpenBusiness?:()=>void;
}

export function AppointmentDetailModal({cita,actor,onClose,onCancel,onStatus,onReschedule,onBookAgain,onOpenBusiness}:Props){
  const [editing,setEditing]=useState(false);
  const [fecha,setFecha]=useState(cita.fecha);
  const [hora,setHora]=useState(cita.hora.slice(0,5));
  const [busy,setBusy]=useState(false);
  const [confirmation,setConfirmation]=useState<null|{title:string;description:string;label:string;destructive:boolean;action:()=>Promise<void>}>(null);
  const run=async(action:()=>Promise<void>)=>{setBusy(true);try{await action();return true}catch(e){toast.error(e instanceof Error?e.message:"No se pudo actualizar la cita");return false}finally{setBusy(false)}};
  const confirmPending=async()=>{if(confirmation&&await run(confirmation.action))setConfirmation(null)};
  const active=cita.estado==="PENDIENTE"||cita.estado==="CONFIRMADA";
  const hasPassed=parseAppointmentDateTime(cita.fecha,cita.hora).getTime()<Date.now();
  const canManage=active&&!hasPassed;
  return <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4"><div className="relative bg-card border rounded-2xl p-4 sm:p-6 w-full max-w-lg max-h-[94dvh] sm:max-h-[90vh] overflow-y-auto space-y-5">
    <button onClick={onClose} aria-label="Cerrar" className="absolute right-4 top-4 z-10 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><X className="h-5 w-5"/></button>
    <span className={`inline-block px-3 py-1 rounded-full text-xs ${COLOR[cita.estado]}`}>{LABEL[cita.estado]}</span>
    <div className="pr-10"><p className="text-sm text-muted-foreground">Detalle de la cita</p><h2>{cita.servicio?.nombre||"Servicio"}</h2>{actor==="cliente"&&onOpenBusiness?<button onClick={onOpenBusiness} className="mt-1 inline-flex items-center gap-1 text-left text-primary hover:underline">{cita.servicio?.negocio?.nombre||"Ver negocio"}<ChevronRight className="h-4 w-4" /></button>:<p className="text-muted-foreground">{actor==="cliente"?cita.servicio?.negocio?.nombre:`Cliente: ${cita.cliente?.nombre||"Sin nombre"}`}</p>}</div>
    <div className="grid sm:grid-cols-2 gap-3 text-sm">
      <p className="flex gap-2"><Calendar className="h-4 w-4 text-primary"/>{cita.fecha}</p>
      <p className="flex gap-2"><Clock className="h-4 w-4 text-primary"/>{cita.hora.slice(0,5)} · {cita.servicio?.duracionMinutos||0} min</p>
      <p className="flex gap-2"><DollarSign className="h-4 w-4 text-primary"/>${Number(cita.servicio?.precio||0).toFixed(2)} MXN</p>
      <p className="flex gap-2"><User className="h-4 w-4 text-primary"/>{actor==="cliente"?cita.servicio?.negocio?.nombre:(cita.cliente?.nombre||"Cliente")}</p>
      <p className="flex gap-2 sm:col-span-2"><FileText className="h-4 w-4 text-primary"/>{cita.notas||"Sin notas"}</p>
      <p className="flex gap-2 sm:col-span-2"><MapPin className="h-4 w-4 text-primary"/>{cita.servicio?.negocio?.direccion||"Dirección no registrada"}</p>
    </div>
    {editing&&<div className="border rounded-xl p-4 space-y-3"><h3>Reagendar</h3><input type="date" min={todayDateOnly()} value={fecha} onChange={e=>setFecha(e.target.value)} className="w-full p-3 border rounded-lg"/><input type="time" value={hora} onChange={e=>setHora(e.target.value)} className="w-full p-3 border rounded-lg"/><div className="flex gap-2"><button onClick={()=>setEditing(false)} className="flex-1 py-2 border rounded-lg">Cerrar</button><button disabled={busy||!fecha||!hora} onClick={()=>run(async()=>{await onReschedule(fecha,hora);setEditing(false)})} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50">Guardar</button></div></div>}
    {!editing&&canManage&&<div className="space-y-2">{actor==="cliente"&&<div className="grid grid-cols-2 gap-2"><button disabled={busy} onClick={()=>setEditing(true)} className="min-h-11 py-2 border rounded-lg">Reagendar</button><button disabled={busy} onClick={()=>onCancel&&setConfirmation({title:"¿Cancelar esta cita?",description:"La reservación quedará cancelada y el horario volverá a estar disponible.",label:"Cancelar cita",destructive:true,action:onCancel})} className="min-h-11 py-2 bg-destructive text-white rounded-lg">Cancelar</button></div>}{actor==="negocio"&&<><div className="grid grid-cols-2 gap-2">{cita.estado==="PENDIENTE"&&<button disabled={busy} onClick={()=>onStatus&&run(()=>onStatus("CONFIRMADA"))} className="min-h-11 py-2 bg-primary text-white rounded-lg">Confirmar</button>}{cita.estado==="CONFIRMADA"&&<button disabled={busy} onClick={()=>onStatus&&setConfirmation({title:"¿Marcar la cita como completada?",description:"Esta acción cerrará la cita y ya no permitirá nuevos cambios.",label:"Completar cita",destructive:false,action:()=>onStatus("COMPLETADA")})} className="min-h-11 py-2 bg-primary text-white rounded-lg">Completar</button>}<button disabled={busy} onClick={()=>onStatus&&setConfirmation({title:cita.estado==="PENDIENTE"?"¿Rechazar esta cita?":"¿Cancelar esta cita?",description:"El cliente verá la cita como cancelada y el horario volverá a estar disponible.",label:cita.estado==="PENDIENTE"?"Rechazar cita":"Cancelar cita",destructive:true,action:()=>onStatus("CANCELADA")})} className="min-h-11 py-2 border rounded-lg">{cita.estado==="PENDIENTE"?"Rechazar":"Cancelar"}</button></div><button disabled={busy} onClick={()=>setEditing(true)} className="w-full min-h-11 py-2 border rounded-lg">Reagendar</button></>}</div>}
    {!editing&&actor==="cliente"&&hasPassed&&onBookAgain&&<button onClick={onBookAgain} className="w-full py-3 rounded-lg bg-primary text-primary-foreground flex items-center justify-center gap-2"><Calendar className="h-4 w-4"/>Volver a agendar</button>}
    <ConfirmDialog open={confirmation!==null} title={confirmation?.title||""} description={confirmation?.description||""} confirmLabel={confirmation?.label||"Confirmar"} destructive={confirmation?.destructive} busy={busy} onCancel={()=>setConfirmation(null)} onConfirm={confirmPending}/>
  </div></div>;
}
