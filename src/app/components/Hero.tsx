import { Calendar, Search } from "lucide-react";

export function Hero() {
  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl">
            Agenda tus citas en el momento perfecto
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubre y reserva servicios de belleza, bienestar y salud en tu área.
            Gestiona todas tus citas desde un solo lugar.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Search className="h-5 w-5" />
              <span>Explorar Servicios</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border hover:bg-muted transition-colors">
              <Calendar className="h-5 w-5" />
              <span>Ver Disponibilidad</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
