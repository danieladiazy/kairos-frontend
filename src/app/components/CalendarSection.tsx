import { ChevronLeft, ChevronRight } from "lucide-react";

export function CalendarSection() {
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const currentMonth = "Mayo 2026";

  return (
    <section className="w-full py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-2 mb-8">
            <h2>Disponibilidad de Agenda</h2>
            <p className="text-muted-foreground">
              Encuentra el horario perfecto para tu cita
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3>{currentMonth}</h3>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {days.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <button
                  key={day}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center
                    hover:bg-primary hover:text-primary-foreground transition-colors
                    ${day === 27 ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                  `}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
