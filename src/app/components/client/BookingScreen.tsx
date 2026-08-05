// ============================================================================
// PANTALLA DE RESERVAR CITA (lado cliente)
// ============================================================================
// Recibe el "servicio" y "negocio" ya elegidos en la pantalla anterior
// (ServiceDetailScreen) como props; si llegan en null (por ejemplo si el
// usuario entro directo a esta pantalla sin pasar por el flujo normal),
// se muestra un mensaje en vez de tronar.
//
// El usuario elige una fecha (input tipo date) y un horario de una lista
// fija de horas disponibles (availableTimes). Al confirmar, se abre un
// modal de revision final, y solo al aceptar ahi es cuando se llama de
// verdad a reservarCita() (ver lib/api.ts), que hace POST /api/citas.
//
// El backend valida que ese horario no este ya ocupado para ese mismo
// servicio (ver CitaService.reservar en el backend); si ya esta tomado,
// aqui se muestra el error dentro del mismo modal, sin cerrarlo, para que
// el usuario pueda intentar con otra hora.
//
// Si la reserva se guarda bien, se llama a onConfirm() con un resumen de
// los datos, que ClientDashboard.tsx usa para mostrar la pantalla de
// exito (BookingSuccessScreen).
// ============================================================================
import { ArrowLeft, Check, CheckCircle2, CalendarCheck, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Footer } from "../Footer";
import { reservarCita, type DiaSemana, type Negocio, type Servicio } from "../../lib/api";
import { formatDateOnly, parseDateOnly, todayDateOnly } from "../../lib/date";

interface BookingData {
  service: string;
  business: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  address: string;
}

interface BookingScreenProps {
  servicio: Servicio | null;
  negocio: Negocio | null;
  onBack: () => void;
  onConfirm: (data: BookingData) => void;
}

const JS_DAY_TO_API: DiaSemana[] = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const toMinutes = (value: string) => { const [hours, minutes] = value.slice(0, 5).split(":").map(Number); return hours * 60 + minutes; };
const toTime = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

export function BookingScreen({ servicio, negocio, onBack, onConfirm }: BookingScreenProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notas,setNotas]=useState("");
  const availableTimes = useMemo(() => {
    if (!selectedDate || !servicio) return [];
    const day = JS_DAY_TO_API[parseDateOnly(selectedDate).getDay()];
    const configured = servicio.horarios || [];
    const schedule = configured.find((item) => item.diaSemana === day);
    if (configured.length && !schedule) return [];
    const start = toMinutes(schedule?.horaInicio || "09:00");
    const end = toMinutes(schedule?.horaFin || "19:00");
    const duration = Number(servicio.duracionMinutos) || 0;
    const result: string[] = [];
    for (let current = start; current + duration <= end; current += 30) result.push(toTime(current));
    return result;
  }, [selectedDate, servicio]);

  if (!servicio || !negocio) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 text-center p-6">
        <p className="text-muted-foreground">No hay ningun servicio seleccionado para reservar.</p>
        <button onClick={onBack} className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
          Volver
        </button>
      </div>
    );
  }

  const handleConfirm = () => {
    if (selectedDate && selectedTime) setShowConfirmModal(true);
  };

  const finalizarReserva = async () => {
    setEnviando(true);
    setError(null);
    try {
      await reservarCita({
        servicioId: servicio.id,
        fecha: selectedDate,
        hora: `${selectedTime}:00`,
        notas: notas.trim() || undefined,
      });

      toast.success("¡Cita agendada!", {
        description: `${servicio.nombre} · ${selectedTime}`,
      });

      onConfirm({
        service: servicio.nombre,
        business: negocio.nombre,
        date: formatDateOnly(selectedDate, { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
        time: selectedTime,
        duration: `${servicio.duracionMinutos} min`,
        price: Number(servicio.precio),
        address: negocio.direccion || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo confirmar la reserva");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[94dvh] overflow-y-auto bg-card rounded-2xl border border-border p-5 sm:p-8 max-w-md w-full shadow-2xl">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>

              <div>
                <h2 className="text-green-700">Confirmar Cita</h2>
                <p className="text-muted-foreground mt-1">Revisa los datos antes de confirmar</p>
              </div>

              {error && (
                <div className="w-full text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-2">
                  {error}
                </div>
              )}

              <div className="w-full bg-muted/50 rounded-xl p-4 space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CalendarCheck className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Servicio</p>
                    <p className="text-sm">{servicio.nombre}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CalendarCheck className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Fecha y hora</p>
                    <p className="text-sm">
                      {formatDateOnly(selectedDate, { weekday: "long", day: "numeric", month: "long" })} · {selectedTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Negocio</p>
                    <p className="text-sm">{negocio.nombre}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-primary">${Number(servicio.precio)} MXN</span>
                </div>
              </div>

              <div className="flex gap-3 w-full pt-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={enviando}
                  className="flex-1 px-4 py-3 rounded-lg border border-border hover:bg-muted transition-colors text-sm disabled:opacity-50"
                >
                  Volver
                </button>
                <button
                  onClick={finalizarReserva}
                  disabled={enviando}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm disabled:opacity-60"
                >
                  <Check className="h-4 w-4" />
                  {enviando ? "Confirmando..." : "Confirmar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="bg-card border-b border-border px-4 sm:px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1>Reservar Cita</h1>
            <p className="text-sm text-muted-foreground">{negocio.nombre}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
          <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
            <h3 className="mb-2">Servicio seleccionado</h3>
            <div className="flex items-center justify-between p-4 rounded-lg border-2 border-primary bg-primary/5">
              <div>
                <p className="font-semibold">{servicio.nombre}</p>
                <p className="text-sm text-muted-foreground mt-1">{servicio.duracionMinutos} min</p>
              </div>
              <p className="text-primary font-semibold">${Number(servicio.precio)}</p>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
            <h3 className="mb-4">Selecciona una Fecha</h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(""); setError(null); }}
              min={todayDateOnly()}
              className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
            <h3 className="mb-4">Notas para el negocio (opcional)</h3>
            <textarea value={notas} onChange={e=>setNotas(e.target.value)} maxLength={300} className="w-full min-h-24 p-3 border rounded-lg" placeholder="Indicaciones o comentarios"/>
          </div>

          <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
            <h3 className="mb-4">Selecciona un Horario</h3>
            {selectedDate && availableTimes.length === 0 ? <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">El servicio no abre en la fecha seleccionada. Elige otro día.</div> : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-3 rounded-lg border-2 transition-all ${
                    selectedTime === time
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>}
          </div>

          <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
            <h3 className="mb-4">Resumen de la Reserva</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-muted-foreground">Servicio</span>
                <span>{servicio.nombre}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-muted-foreground">Fecha</span>
                <span>
                  {selectedDate
                    ? formatDateOnly(selectedDate, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                    : <span className="text-muted-foreground text-sm italic">Sin seleccionar</span>}
                </span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-muted-foreground">Hora</span>
                <span>{selectedTime || <span className="text-muted-foreground text-sm italic">Sin seleccionar</span>}</span>
              </div>
              <div className="flex items-center justify-between text-lg">
                <span>Total</span>
                <span className="text-primary font-semibold">${Number(servicio.precio)} MXN</span>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedTime}
              className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Check className="h-5 w-5" />
              <span>Confirmar Reserva</span>
            </button>

            {(!selectedDate || !selectedTime) && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Selecciona una fecha y horario para continuar
              </p>
            )}
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
}
