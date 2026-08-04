import { CheckCircle2, Calendar, Clock, MapPin, Star, Home, ChevronRight, Download, Share2 } from "lucide-react";

interface BookingSuccessScreenProps {
  bookingData: {
    service: string;
    business: string;
    date: string;
    time: string;
    duration: string;
    price: number;
    address: string;
  };
  onGoHome: () => void;
  onViewAppointments: () => void;
}

export function BookingSuccessScreen({ bookingData, onGoHome, onViewAppointments }: BookingSuccessScreenProps) {
  const steps = [
    { label: "Elegiste el servicio", done: true },
    { label: "Seleccionaste fecha y hora", done: true },
    { label: "Cita confirmada", done: true },
  ];

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">

          {/* Hero de éxito */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Star className="h-4 w-4 text-white fill-white" />
              </div>
            </div>
            <div>
              <h1 className="text-green-700">¡Cita Confirmada!</h1>
              <p className="text-muted-foreground mt-1">
                Tu reserva ha sido agendada exitosamente
              </p>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-2">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs text-muted-foreground hidden sm:block">{step.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Tarjeta de la cita */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            {/* Header de la tarjeta */}
            <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/80 text-sm">Servicio confirmado</p>
                  <h2 className="text-white mt-1">{bookingData.service}</h2>
                  <p className="text-white/80 text-sm mt-1">{bookingData.business}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-xs">Total</p>
                  <p className="text-white text-xl">${bookingData.price} MXN</p>
                </div>
              </div>
            </div>

            {/* Detalles */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Fecha</p>
                    <p className="text-sm">{bookingData.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Hora</p>
                    <p className="text-sm">{bookingData.time} · {bookingData.duration}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Dirección</p>
                  <p className="text-sm">{bookingData.address}</p>
                </div>
              </div>
            </div>

            {/* Código de reserva */}
            <div className="mx-6 mb-6 p-4 rounded-xl bg-muted/50 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Código de reserva</p>
                <p className="font-mono text-primary">#KAI-{Math.random().toString(36).slice(2,8).toUpperCase()}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <Download className="h-4 w-4 text-muted-foreground" />
                </button>
                <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>

          {/* Recordatorio */}
          <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <div className="p-1.5 rounded-lg bg-primary/10 flex-shrink-0">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm">Recibirás un recordatorio</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Te enviaremos una notificación 24 horas y 30 minutos antes de tu cita
              </p>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-3">
            <button
              onClick={onGoHome}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border hover:bg-muted transition-colors"
            >
              <Home className="h-4 w-4" />
              Volver al inicio
            </button>
            <button
              onClick={onViewAppointments}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Calendar className="h-4 w-4" />
              Ver mis citas
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
