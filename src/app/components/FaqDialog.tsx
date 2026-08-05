import { HelpCircle, X } from "lucide-react";

const questions = {
  cliente: [
    { q: "¿Cómo reservo una cita?", a: "Explora los servicios, elige una opción y pulsa Reservar ahora para seleccionar fecha y hora." },
    { q: "¿Puedo cancelar o reagendar?", a: "Sí, desde Mis citas mientras la reservación siga pendiente o confirmada." },
    { q: "¿Dónde consulto los datos del negocio?", a: "Pulsa Ver detalles para consultar su información, ubicación y disponibilidad." },
  ],
  negocio: [
    { q: "¿Cómo recibo reservaciones?", a: "Publica un servicio activo y configura sus días y horarios disponibles." },
    { q: "¿Dónde administro las citas?", a: "En Agenda puedes revisar, confirmar, reagendar, completar o cancelar cada cita." },
    { q: "¿Cómo cambio mis horarios?", a: "En Mis servicios, selecciona Editar y ajusta la disponibilidad semanal." },
  ],
};

export function FaqDialog({ audience, onClose }: { audience: "cliente" | "negocio"; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-6 backdrop-blur-sm" onClick={onClose}>
    <div className="w-full max-w-md max-h-[94dvh] overflow-y-auto space-y-5 rounded-2xl border bg-card p-5 sm:p-7 shadow-2xl" onClick={(event) => event.stopPropagation()}>
      <div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3"><div className="rounded-xl bg-primary/10 p-2"><HelpCircle className="h-6 w-6 text-primary" /></div><h2>Preguntas frecuentes</h2></div><button onClick={onClose} aria-label="Cerrar preguntas frecuentes" className="rounded-lg p-2 hover:bg-muted"><X className="h-5 w-5" /></button></div>
      <div className="space-y-3">{questions[audience].map((item) => <div key={item.q} className="space-y-1 rounded-xl bg-muted/50 p-4"><p className="text-sm font-semibold">{item.q}</p><p className="text-sm text-muted-foreground">{item.a}</p></div>)}</div>
      <button onClick={onClose} className="w-full rounded-lg bg-primary py-3 text-primary-foreground">Entendido</button>
    </div>
  </div>;
}
